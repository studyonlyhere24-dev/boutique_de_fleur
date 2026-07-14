//backend/controllers/authController.js

import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import { StatusCodes } from 'http-status-codes'
import Client from '../models/clientModel.js'
import Admin from '../models/adminModel.js'
import { generateTokenAndSetCookie } from '../utils/generateToken.js'
import { sendPasswordResetEmail, sendResetSuccessEmail } from '../services/emailService.js'

// =================== SIGNUP =======================
export const signup = async (req, res) => {
    const { email, password, name, address, phone } = req.body 

    try {
        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false, 
                message: "L'email et le mot de passe sont requis" 
            }) 
        }

        const isAdmin = email.endsWith('@admin.com') 
        const TargetModel = isAdmin ? Admin : Client 

        if (!isAdmin) {
            if (!name || !address) {
                return res.status(StatusCodes.BAD_REQUEST).json({ 
                    success: false, 
                    message: "Le nom et l'adresse sont obligatoires pour un client" 
                }) 
            }
        }

        const userAlreadyExists = await TargetModel.findOne({ email })  
        if (userAlreadyExists) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false, 
                message: "Cet utilisateur existe déjà" 
            }) 
        }

        const hashedPassword = await bcryptjs.hash(password, 10) 

        let newUser 

        if (isAdmin) {
            newUser = new Admin({
                email,
                password: hashedPassword
            }) 
        } else {
            newUser = new Client({
                email,
                password: hashedPassword,
                name,
                address,
                phone,
            }) 
        }

        await newUser.save() 

        generateTokenAndSetCookie(res, newUser._id)  

        const userResponse = { ...newUser._doc } 
        delete userResponse.password  

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: `${isAdmin ? 'Administrateur' : 'Client'} créé avec succès`,
            user: userResponse
        }) 

    } catch (error) {
        console.error("Erreur dans signup: ", error) 
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            success: false, 
            message: "Erreur serveur lors de l'inscription" 
        }) 
    }
} 

// =================== LOGIN =======================
export const login = async (req, res) => { 
    const { email, password } = req.body 

    try { 
        let user = null 
        let role = '' 

        if (email.endsWith('@admin.com')) {
            user = await Admin.findOne({ email }) 
            role = 'admin' 
        } else {
            user = await Client.findOne({ email }) 
            role = 'client' 
        }

        if (!user) { 
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false, 
                message: "Identifiants invalides" 
            }) 
        } 
        
        const isPasswordValid = await bcryptjs.compare(password, user.password) 
        if (!isPasswordValid) { 
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false, 
                message: "Identifiants invalides" 
            }) 
        } 
        
        generateTokenAndSetCookie(res, user._id) 

        if (role === 'client' && user.lastLogin) {
            user.lastLogin = new Date() 
            await user.save() 
        }

        res.status(StatusCodes.OK).json({ 
            success: true, 
            message: "Connexion réussie", 
            user: { 
                id: user._id,
                email: user.email,
                role: role
            } 
        }) 

    } catch (error) { 
        console.error("Erreur lors de la connexion : ", error) 
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            success: false, 
            message: "Erreur serveur" 
        }) 
    } 
}

// =================== LOGOUT =======================
export const logout = async (req, res) => { 
    res.clearCookie("token")
    res.status(StatusCodes.OK).json({ 
        success: true, 
        message: "Logged out successfully" 
    })
}

// =================== FORGOT PASSWORD =======================
export const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        const user = await Client.findOne({ email })

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false, 
                message: "User not found" 
            })
        }
        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000
        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiresAt
        await user.save()
        await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`)
        
        res.status(StatusCodes.OK).json({ 
            success: true, 
            message: "Password reset link sent to your email" 
        })
    } catch (error) {
        console.log("Error in forgotPassword ", error)
        res.status(StatusCodes.BAD_REQUEST).json({ 
            success: false, 
            message: error.message 
        })
    }
}

// =================== RESET PASSWORD =======================
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password } = req.body
        const user = await Client.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        })

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false, 
                message: "Invalid or expired reset token" 
            })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined
        await user.save()
        await sendResetSuccessEmail(user.email)
        
        res.status(StatusCodes.OK).json({ 
            success: true, 
            message: "Password reset successful" 
        })
    } catch (error) {
        console.log("Error in resetPassword ", error)
        res.status(StatusCodes.BAD_REQUEST).json({ 
            success: false, 
            message: error.message 
        })
    }
}

// =================== CHECK AUTH =======================
export const checkAuth = async (req, res) => {
    try {
        let user = await Admin.findById(req.userId).select("-password")
        let role = 'admin'
        
        if (!user) {
            user = await Client.findById(req.userId).select("-password")
            role = 'client'
        }

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false, 
                message: "Utilisateur non trouvé" 
            })
        }

        res.status(StatusCodes.OK).json({
            success: true,             
            role: role, // 👈 FIX : On renvoie "role" à la racine pour que App.jsx le lise directement !
            user: {
                id: user._id,
                email: user.email,
                role: role
            }  
        })
    } catch (error) {
        console.log("Error in checkAuth ", error)
        res.status(StatusCodes.BAD_REQUEST).json({ 
            success: false, 
            message: error.message 
        })
    }
}