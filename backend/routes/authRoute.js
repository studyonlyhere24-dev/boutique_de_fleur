//backend/routes/authRoute.js

import express from 'express'
import { checkAuth, login, logout, forgotPassword, resetPassword } from '../controllers/authController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/login', login)

router.post('/logout', logout)

router.post('/forgot-password', forgotPassword)

router.post("/reset-password/:token",resetPassword)

router.get("/check-auth",verifyToken,checkAuth)

export default router;