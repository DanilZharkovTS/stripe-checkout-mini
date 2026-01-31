import Stripe from 'stripe'
import { getStripe } from '../../config/stripe/stripe.js'
import { paymentsRepo } from '../repos/paymentsRepo.js'
import {
  order,
  plan,
  SubscriptionSessionDTO,
} from '../types/paymentsInterfaces.js'
import { subscriptionPrices } from '../../config/stripe/stripePrices.js'

export const paymentsService = {
  createCheckoutSession: async (productId: number) => {
    const stripe = getStripe()

    const productResult = await paymentsRepo.findProductByID(productId)
    const dbProduct = productResult.rows[0]

    if (!dbProduct) {
      throw new Error(`Product with id ${productId} not found`)
    }

    const customer = await stripe.customers.create()

    const orderResult = await paymentsRepo.addOrder(
      'order',
      {
        product_id: productId,
      },
      customer.id
    )
    const dbOrder = orderResult.rows[0]

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      metadata: {
        orderId: dbOrder.id.toString(),
        productId: dbProduct.id.toString(),
      },
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: dbProduct.currency,
            unit_amount: Number(dbProduct.price),
            product_data: {
              name: dbProduct.name,
              description: dbProduct.description,
            },
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.FRONTEND_URL}/checkout/success`,
      cancel_url: `${process.env.FRONTEND_URL}/products`,
    })

    paymentsRepo.updateOrderSessionId(session.id, dbOrder.id)

    return { checkoutUrl: session.url }
  },
  createCheckoutSubscriptionSession: async (data: SubscriptionSessionDTO) => {
    const stripe = getStripe()
    const plan = subscriptionPrices[data.plan]
    if (!plan) {
      throw new Error(`Plan "${data.plan}" not found`)
    }

    const period = plan[data.period]
    if (!period) {
      throw new Error(
        `Period "${data.period}" not found for plan "${data.plan}"`
      )
    }

    if (!plan || !period) {
      throw new Error('No plan or period found')
    }

    const customer = await stripe.customers.create()

    const orderResult = await paymentsRepo.addOrder(
      'subscription',
      {
        subscription_plan: data.plan,
        subscription_period: data.period,
      },
      customer.id
    )
    const dbOrder = orderResult.rows[0]

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{ price: period.priceId, quantity: 1 }],
      metadata: {
        orderId: String(dbOrder.id),
      },
      subscription_data: {
        metadata: { orderId: String(dbOrder.id) },
      },
      success_url:
        'https://st.perplexity.ai/estatic/0b226c450798410ac541646c86ec31afd840e5beab817a5d84fa821e7db61981ec84c3b4a3f072a7a2e1899c9fb06c6e6d50742ef4cc9be45bd161a949eee4e1276d8a0086f9d65cd459731d8793da248383e7765f1d3ca2586e10c41eedf169',
    })

    await paymentsRepo.updateOrderSessionId(session.id, dbOrder.id)

    return { url: session.url }
  },
  handleWebhook: async (event: Stripe.Event) => {
    switch (event.type) {
      case 'checkout.session.completed':
        await paymentsService.checkoutSessionCompleted(event.data.object)
        break
      case 'checkout.session.async_payment_failed':
        await paymentsService.checkoutSessionFailed(event.data.object)
        break

      case 'invoice.payment_succeeded':
        await paymentsService.invoiceCompleted(event.data.object)
        break
      case 'invoice.payment_failed':
        await paymentsService.invoiceFailed(event.data.object)
        break
    }
  },
  checkoutSessionCompleted: async (session: Stripe.Checkout.Session) => {
    const orderId = Number(session.metadata?.orderId)
    const subId = session.subscription
    console.log(subId)

    if (orderId) {
      await paymentsRepo.updateOrderStatus('paid', orderId)
    }
    if (subId) {
      await paymentsRepo.updateOrderPayload(subId, orderId)
    }
  },
  checkoutSessionFailed: async (session: Stripe.Checkout.Session) => {
    const orderId = Number(session.metadata?.orderId)
    await paymentsRepo.updateOrderStatus('failed', orderId)
  },
  invoiceCompleted: async (invoice: Stripe.Invoice) => {
    const stripe = getStripe()

    const subId =
      invoice.lines.data[0].parent?.subscription_item_details?.subscription
    console.log(subId)
    if (!subId) return

    const customerId = invoice.customer
    if (!customerId) return

    const orderResult = await paymentsRepo.findOrderBySub(subId)
    const dbOrder = orderResult.rows[0]
    console.log(dbOrder)

    const payload = dbOrder.payload

    const subResult = await paymentsRepo.findSubBySub(subId)
    const dbSub = await subResult.rows[0]

    if (!dbSub) {
      console.log('SUB CREATING')
      await paymentsRepo.addSubscription(
        payload.subscription_plan,
        payload.subscription_period,
        subId,
        customerId,
        invoice.period_end
      )
      console.log(`SUB CREATED`)
      return
    }

    await paymentsRepo.updateSubEndPeriod(invoice.period_end, dbSub.id)
    console.log('SUB WAS UPDATED')

    return
  },
  invoiceFailed: async (invoice: Stripe.Invoice) => {
    const orderId = Number(invoice.metadata?.orderId)
    await paymentsRepo.updateOrderStatus('failed', orderId)
  },
}
