import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import { appMiddlewares } from './app/middlewares/paymentsMiddlewares.js'
import { paymentsController } from './app/controllers/paymentsController.js'
import bodyParser from 'body-parser'
import paymnetsRoutes from './app/routes/paymentsRoutes.js'

configDotenv()

const app = express()
const PORT = process.env.PORT

app.post(
  '/webhooks/stripe/checkout',
  bodyParser.raw({ type: 'application/json' }),
  appMiddlewares.verifyWebhook,
  paymentsController.handleCheckoutSessionCompleted
)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      if (origin === process.env.FRONTEND_URL) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

app.use(express.json())

app.use(paymnetsRoutes)

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
