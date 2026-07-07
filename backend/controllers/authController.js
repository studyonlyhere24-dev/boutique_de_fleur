//backend/controllers/authController.js

import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import Client from '../models/clientModel.js'
import Admin from '../models/adminModel.js'
import { generateTokenAndSetCookie } from '../utils/generateToken.js'
import { sendVerificationEmail,sendPasswordResetEmail,sendWelcomeEmail ,sendResetSuccessEmail} from '../services/emailService.js'

// =================== LOGIN =======================
export const login = async (req, res) => { 
    const { email, password } = req.body;

    try { 
        let user = null;
        let role = '';

        if (email.endsWith('@admin.com')) {
            user = await Admin.findOne({ email });
            role = 'admin';
        } else {
            user = await Client.findOne({ email });
            role = 'client';
        }

        if (!user) { 
            return res.status(400).json({ success: false, message: "Identifiants invalides" });
        } 
        
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) { 
            return res.status(400).json({ success: false, message: "Identifiants invalides" });
        } 
        
        generateTokenAndSetCookie(res, user._id);

        if (role === 'client' && user.lastLogin) {
            user.lastLogin = new Date();
            await user.save();
        }

        res.status(200).json({ 
            success: true, 
            message: "Connexion réussie", 
            user: { 
                id: user._id,
                email: user.email,
                role: role
            } 
        });

    } catch (error) { 
        console.error("Erreur lors de la connexion : ", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    } 
}

// =================== LOGOUT =======================
export const logout = async (req, res) => { 

    res.clearCookie("token")
    res.status(200).json({ success: true, message: "Logged out successfully" })
}

// =================== FORGOT PASSWORD =======================
export const forgotPassword = async(req,res)=>{
    const { email } = req.body
	try {
		const user = await User.findOne({ email })

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" })
		}
		const resetToken = crypto.randomBytes(20).toString("hex")
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000
		user.resetPasswordToken = resetToken
		user.resetPasswordExpiresAt = resetTokenExpiresAt
		await user.save()
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)
		res.status(200).json({ success: true, message: "Password reset link sent to your email" })
	} catch (error) {
		console.log("Error in forgotPassword ", error)
		res.status(400).json({ success: false, message: error.message })
	}
}

// =================== RESET PASSWORD =======================
export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params
		const { password } = req.body
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		})

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" })
		}

		const hashedPassword = await bcryptjs.hash(password, 10)
		user.password = hashedPassword
		user.resetPasswordToken = undefined
		user.resetPasswordExpiresAt = undefined
		await user.save()
		await sendResetSuccessEmail(user.email)
		res.status(200).json({ success: true, message: "Password reset successful" })
	} catch (error) {
		console.log("Error in resetPassword ", error)
		res.status(400).json({ success: false, message: error.message })
	}
}

// =================== CHECK AUTH =======================
export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password")
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" })
		}

		res.status(200).json({ success: true, user })
	} catch (error) {
		console.log("Error in checkAuth ", error)
		res.status(400).json({ success: false, message: error.message })
	}
}