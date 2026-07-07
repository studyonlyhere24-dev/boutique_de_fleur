//backend/middlewares/authMiddleware.js

import jwt from "jsonwebtoken"
import Admin from "../models/adminModel.js"

export const verifyToken = (req, res, next) => {
	const token = req.cookies.token
	if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" })
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" })

		req.userId = decoded.userId
		next()
	} catch (error) {
		console.log("Error in verifyToken ", error)
		return res.status(500).json({ success: false, message: "Server error" })
	}
}

export const isAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.userId)
        
        if (!admin) {
            return res.status(403).json({ success: false, message: "Accès refusé - Droits administrateur requis" })
        }
        
        next()
    } catch (error) {
        console.log("Error in isAdmin ", error);
        return res.status(500).json({ success: false, message: "Server error" })
    }
}