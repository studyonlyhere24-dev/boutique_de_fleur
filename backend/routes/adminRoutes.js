//backend/routes/adminRoutes.js

import express from 'express'
import { getAllClients, getDashboardStats } from '../controllers/adminController.js'
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/clients', verifyToken, isAdmin, getAllClients)

router.get('/stats', verifyToken, isAdmin, getDashboardStats)

export default router