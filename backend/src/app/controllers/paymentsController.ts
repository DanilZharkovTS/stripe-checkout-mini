import type { Request, Response, NextFunction } from 'express'
import { paymentsService } from '../services/paymentsService.js'

export const paymentsController = {
  createCheckoutSession: async (req: Request, res: Response) => {
    try {
      const result = await paymentsService.createCheckoutSession(
        req.body.productId
      )
      res.status(200).json(result)
    } catch (err) {
      console.log(err)
      return res.status(500)
    }
  },
  handleCheckoutSessionCompleted: async (req: Request, res: Response) => {
    try {
      await paymentsService.handleCheckoutSessionCompleted(
        req.stripeCheckoutSession!
      )
      res.sendStatus(200)
    } catch (err) {
      console.log(err)
      return res.status(400).json('Bad request')
    }
  },
}
