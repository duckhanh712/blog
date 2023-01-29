import express from 'express'
import promiseRouter from 'express-promise-router'
import nnnRouter from 'nnn-router'
import cors from 'cors'
import statuses from 'statuses'
import cookie from 'cookie-parser'
import morgan from 'morgan'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
// dbb
const mongoSettings = {
  autoIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.set("strictQuery", false);
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

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
  express.urlencoded({ extended: true, limit: '50mb' }),
  express.json({ limit: '10mb' }),
  express.text(),
  cookie()
)

app.use(
  nnnRouter({ routeDir: '/routes', baseRouter: promiseRouter() }),
  (error, req, res, next) => {
    console.error(error)
    return res.sendStatus(500)
  }
)


app.use('/users', async (req, res) => {
  const users = await Users.save({
    name: 'aaaaaa',
    email: "aaa223@gmail.com"
  })
console.log(users);
    return res.send(users)
})

app.use(
  nnnRouter({ routeDir: 'routes', baseRouter: promiseRouter() }),
  (error, req, res, next) => {
    console.error(error)
    return res.sendStatus(500)
  }
)

const port = process.env.PORT || 6666
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
