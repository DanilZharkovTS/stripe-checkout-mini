import type { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'

export const appMiddlewares = {
  setProductId: (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId
    const numId = parseInt(String(productId), 10)

    if (isNaN(numId) || numId < 1) {
      return res.status(400).json('Bad request (product id)')
    }

    req.body = { productId: numId }
    next()
  },
  verifyWebhook: (req: Request, res: Response, next: NextFunction) => {
    console.log(1)

    const sign = req.headers['stripe-signature']

    if (!sign) return res.status(400).json({ message: 'Signature is missing' })
    console.log(2)

    let event: Stripe.Event

    try {
      event = Stripe.webhooks.constructEvent(
        req.body,
        sign,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
      console.log(3)

      req.stripeCheckoutSession = event.data.object as Stripe.Checkout.Session

      next()
    } catch (err) {
      return res.status(400).json({ message: 'Webhook error' })
    }
  },
  
}
