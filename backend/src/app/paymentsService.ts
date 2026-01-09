import { getStripe } from '../config/stripe.ts'
import { paymentsRepo } from './paymentsRepo.ts'

export const paymentsService = {
  createCheckoutSession: async (productId: number) => {
    const stripe = getStripe()

    const productResult = await paymentsRepo.findProductByID(productId)
    const dbProduct = productResult.rows[0]

    if (!dbProduct) {
      throw new Error(`Product with id ${productId} not found`)
    }

    const orderResult = await paymentsRepo.addOrder(dbProduct.id)
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

      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    })

     paymentsRepo.updateOrderSessionId(session.id, dbOrder.id)

    return { checkoutUrl: session.url }
  },
}
