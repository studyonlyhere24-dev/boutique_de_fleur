//backend/routes/clientRoutes.js
import express from 'express'
import { getClientProfile, updateClientProfile } from '../controllers/clientController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/profile', verifyToken, getClientProfile)

router.patch('/profile', verifyToken, updateClientProfile)

export default router