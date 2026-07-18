//backend/server.js

import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import clientRoutes from './routes/clientRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js'
import { NotFoundError } from './errors/customErrors.js'
import { authLimiter, globalLimiter } from './middlewares/rateLimiterMiddleware.js'

dotenv.config()

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(express.json())

app.use(cookieParser())

connectDB()

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/admin', globalLimiter, adminRoutes)
app.use('/api/clients',globalLimiter, clientRoutes)
app.use('/api/orders', globalLimiter, orderRoutes)
app.use('/api/products', globalLimiter, productRoutes)
/* 
app.use('*', (req, res) => {
    throw new NotFoundError(`La route ${req.originalUrl} n'existe pas sur ce serveur`)
}) */

app.use(errorHandlerMiddleware)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})