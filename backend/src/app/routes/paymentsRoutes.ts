import type { Request, Response } from 'express'
import { Router } from 'express'
import { paymentsRepo } from '../repos/paymentsRepo.js'
import { appMiddlewares } from '../middlewares/paymentsMiddlewares.js'
import { paymentsController } from '../controllers/paymentsController.js'

const router = Router()

router.get('/products', async (req: Request, res: Response) => {
  const result = await paymentsRepo.getAllProducts()
  return res.status(200).json(result.rows)
})

router.get(
  '/products/:productId/checkout',
  appMiddlewares.setProductId,
  paymentsController.createCheckoutSession
)

router.post(
  '/products/subscriptions',
  paymentsController.createCheckoutSubscriptionSession
)

export default router
