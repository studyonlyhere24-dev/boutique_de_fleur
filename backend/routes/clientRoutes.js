//backend/routes/clientRoutes.js
import express from 'express'
import { getClientProfile, updateClientProfile } from '../controllers/clientController.js'
import { isClient, verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/profile', verifyToken, isClient, getClientProfile)

router.patch('/profile', verifyToken, isClient, updateClientProfile)

export default router