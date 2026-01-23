import Stripe from 'stripe'
import { getStripe } from '../../config/stripe/stripe.js'
import { paymentsRepo } from '../repos/paymentsRepo.js'
import { plan, SubscriptionSessionDTO } from '../types/paymentsInterfaces.js'
import { subscriptionPrices } from '../../config/stripe/stripePrices.js'

export const paymentsService = {
  createCheckoutSession: async (productId: number) => {
    const stripe = getStripe()

    const productResult = await paymentsRepo.findProductByID(productId)
    const dbProduct = productResult.rows[0]

    if (!dbProduct) {
      throw new Error(`Product with id ${productId} not found`)
    }

    const orderResult = await paymentsRepo.addOrder({ product_id: productId })
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
  handleCheckoutSessionCompleted: async (session: Stripe.Checkout.Session) => {
    const orderResult = await paymentsRepo.findOrderById(
      Number(session.metadata?.orderId)
    )
    const dbOrder = orderResult.rows[0]
    if (!dbOrder) throw new Error(`Order not found`)

    switch (session.payment_status) {
      case 'paid':
      case 'no_payment_required':
        await paymentsRepo.updateOrderStatus('paid', dbOrder.id)
        break
      case 'unpaid':
        await paymentsRepo.updateOrderStatus('failed', dbOrder.id)
        break
      default:
        console.log(`Unhandled payment_status: ${session.payment_status}`)
    }
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

    const orderResult = await paymentsRepo.addOrder({
      subscription_plan: data.plan,
      subscription_period: data.period,
    })
    const dbOrder = orderResult.rows[0]

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: period.priceId, quantity: 1 }],
      metadata: { orderId: dbOrder.id },
      success_url: 'https://st.perplexity.ai/estatic/0b226c450798410ac541646c86ec31afd840e5beab817a5d84fa821e7db61981ec84c3b4a3f072a7a2e1899c9fb06c6e6d50742ef4cc9be45bd161a949eee4e1276d8a0086f9d65cd459731d8793da248383e7765f1d3ca2586e10c41eedf169'
    })

    await paymentsRepo.updateOrderSessionId(session.id, dbOrder.id)

    return { url: session.url }
  },
}
