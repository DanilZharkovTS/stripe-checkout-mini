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

    const sign = req.headers['stripe-signature']

    if (!sign) return res.status(400).json({ message: 'Signature is missing' })

    let event: Stripe.Event

    try {
      event = Stripe.webhooks.constructEvent(
        req.body,
        sign,
        process.env.STRIPE_WEBHOOK_SECRET!
      )

      req.stripeEvent = event as Stripe.Event

      next()
    } catch (err) {
      return res.status(400).json({ message: 'Webhook error' })
    }
  },
  validateSubscriptionInput: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.plan || !req.body.period) {
      return res.status(400).json({message: 'Plan and period need to be a string'})
    }
    next()
  },
}
