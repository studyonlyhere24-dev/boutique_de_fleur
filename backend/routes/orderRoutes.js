//backend/routes/orderRoutes.js

import express from 'express'
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js'
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/create', verifyToken, createOrder) 

router.get('/mine', verifyToken, getMyOrders) 

router.get('/all', verifyToken, isAdmin, getAllOrders) 

router.put('/:id/status', verifyToken, isAdmin, updateOrderStatus) 

export default router