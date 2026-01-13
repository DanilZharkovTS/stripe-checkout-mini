import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import type { Request, Response } from 'express'
import { appMiddlewares } from './app/middlewares/paymentsMiddlewares.js'
import { paymentsController } from './app/controllers/paymentsController.js'
import bodyParser from 'body-parser'
import { paymentsRepo } from './app/repos/paymentsRepo.js'

configDotenv()

const app = express()
const PORT = process.env.PORT

app.post(
  '/webhooks/stripe/checkout',
  bodyParser.raw({ type: 'application/json' }),
  appMiddlewares.verifyWebhook,
  paymentsController.handleCheckoutSessionCompleted
)

app.use(cors({origin: 'http://localhost:3001'}))

app.use(express.json())

app.get('/products', async (req: Request, res: Response) => {
  const result = await paymentsRepo.getAllProducts()
  return res.status(200).json(result.rows)
})

app.get(
  '/products/:productId/checkout',
  appMiddlewares.setProductId,
  paymentsController.createCheckoutSession
)

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
