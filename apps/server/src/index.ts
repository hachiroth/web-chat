import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'

dotenv.config({ quiet: true })

const app = express()
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SECRET || 'No secret',
  resave: false,
  saveUninitialized: false,
}))

const PORT = process.env.PORT || '8080'
const isDev = process.env.NODE_ENV === 'development'

app.get('/', (_, res) => {
  res.send('Hi, Express!')
})

app.listen(PORT, () => {
  if (isDev) {
    console.debug(`Server run on port ${PORT}`)
  }
})
