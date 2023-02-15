import express from 'express'
import promiseRouter from 'express-promise-router'
import nnnRouter from 'nnn-router'
import cors from 'cors'
import statuses from 'statuses'
import cookie from 'cookie-parser'
import mongoose from 'mongoose'
import rateLimit from 'express-rate-limit'

// db
const mongoSettings = {
  autoIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI, mongoSettings)
mongoose.Promise = global.Promise
mongoose.connection.once('open', () => {
  console.log('Connected to mongoDB!')
})

express.response.sendStatus = function (statusCode) {
  const body = { message: statuses(statusCode) || String(statusCode) }
  this.statusCode = statusCode
  this.type('json')
  this.send(body)
}

const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

app.use(
  cors({
    origin: true,
    credentials: true
  }),
  express.urlencoded({ extended: true, limit: '50mb' }),
  express.json({ limit: '10mb' }),
  express.text(),
  cookie(),
  limiter
)

app.use(
  nnnRouter({ routeDir: '/routes', baseRouter: promiseRouter() }),
  (error, req, res, next) => {
    console.error(error)
    return res.sendStatus(500)
  }
)

import cron from './tasks/viblo/cron.js'
cron()

const port = process.env.PORT || 6666
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
