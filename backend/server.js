//backend/server.js

import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import clientRoutes from './routes/clientRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js'
import { NotFoundError } from './errors/index.js'

dotenv.config()

const app = express()

app.use(express.json())

app.use(cookieParser())

connectDB()

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/products', productRoutes)

app.use('*', (req, res) => {
    throw new NotFoundError(`La route ${req.originalUrl} n'existe pas sur ce serveur`)
})

app.use(errorHandlerMiddleware)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})