import express from 'express'
import { configDotenv } from 'dotenv'
import type { Request, Response } from 'express'
import { appMiddlewares } from './app/middlewares/appMiddlewares.ts'
import { paymentsController } from './app/paymentsController.ts'

configDotenv({ path: '../.env' })

const app = express()
const PORT = process.env.PORT

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
