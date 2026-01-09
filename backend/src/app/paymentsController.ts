import type { Request, Response, NextFunction } from 'express'
import { paymentsService } from './paymentsService'

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
}
