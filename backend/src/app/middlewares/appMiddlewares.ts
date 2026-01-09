import type { Request, Response, NextFunction } from 'express'

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
}
