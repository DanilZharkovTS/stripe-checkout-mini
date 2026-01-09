import express from 'express'
import { configDotenv } from 'dotenv'
import type { Request, Response } from 'express'

configDotenv({ path: '../.env' })

const app = express()
const PORT = process.env.PORT

app.use(express.json())

app.get('/', (req: Request, res: Response) =>
  res.status(200).json('Hello World!')
)
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
