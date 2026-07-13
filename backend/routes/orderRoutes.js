//backend/routes/orderRoutes.js

import express from 'express'
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js'
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/createorder', verifyToken, createOrder) 

router.get('/getmyorders', verifyToken, getMyOrders) 

router.get('/getallorders', verifyToken, getAllOrders) 

router.put('/orders/:id/status', verifyToken, isAdmin, updateOrderStatus) 

export default router