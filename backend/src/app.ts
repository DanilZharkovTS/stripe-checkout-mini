import express from 'express'
import { configDotenv } from 'dotenv'
import type { Request, Response } from 'express'
import { appMiddlewares } from './app/middlewares/paymentsMiddlewares.ts'
import { paymentsController } from './app/controllers/paymentsController.ts'
import bodyParser from 'body-parser'

configDotenv({ path: '../.env' })

const app = express()
const PORT = process.env.PORT

app.post(
  '/webhooks/stripe/checkout',
  bodyParser.raw({ type: 'application/json' }),
  appMiddlewares.verifyWebhook,
  paymentsController.handleCheckoutSessionCompleted
)

app.use(express.json())

app.get('/', (req: Request, res: Response) =>
  res.status(200).json('Hello World!')
)

app.get(
  '/:productId/checkout',
  appMiddlewares.setProductId,
  paymentsController.createCheckoutSession
)

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
