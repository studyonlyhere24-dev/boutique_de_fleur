//backend/middlewares/authMiddleware.js

import jwt from "jsonwebtoken"
import Admin from "../models/adminModel.js"
import { UnauthenticatedError, UnauthorizedError } from "../errors/customErrors.js"

export const verifyToken = (req, res, next) => {
	const token = req.cookies.token
	
	if (!token) throw new UnauthenticatedError("Unauthorized - no token provided")
	
    const decoded = jwt.verify(token, process.env.JWT_SECRET) 

    if (!decoded) throw new UnauthenticatedError("Unauthorized - invalid token") 

    req.userId = decoded.userId 
    next()
}

export const isAdmin = async (req, res, next) => {
    const admin = await Admin.findById(req.userId)
    
    if (!admin) {
        throw new UnauthorizedError("Accès refusé - Droits administrateur requis") 
    }

    next()
}