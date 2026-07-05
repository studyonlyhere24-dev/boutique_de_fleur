//backend/controllers/authController.js

import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import Client from '../models/clientModel.js'
import { generateTokenAndSetCookie } from '../utils/generateToken.js'
import { sendVerificationEmail,sendPasswordResetEmail,sendWelcomeEmail ,sendResetSuccessEmail} from '../services/emailService.js'

export const signup = async(req,res)=>{
    const {email, password, name} = req.body;
    try {
        if(!email || !password || !name){
            throw new Error("All fields are required")
        }
        const userAlreadyExists = await User.findOne({email})
        if(userAlreadyExists){
            return res.status(400).json({success : false, message: "User already exists"})
        }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random()*900000).toString();
    const user = new User({
        email,
        password: hashedPassword,
        name,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 *60 * 1000
    })

    await user.save();
    generateTokenAndSetCookie(res,user._id)

    res.status(201).json({
        success:true,
        message:'User created successfully',
        user:{
          ...user._doc,  
          password :undefined
        }
    })
    } catch (error) {
        return res.status(400).json({success : false, message: error.message})
    }
}

export const login = async (req, res) => { 

    const { email, password } = req.body 
    try { 
        const user = await User.findOne({ email })
        if (!user) { 
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        } 
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) { 
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        } 
        generateTokenAndSetCookie(res, user._id)

        user.lastLogin = new Date()
        await user.save()
        res.status(200).json({ 
            success: true, 
            message: "Logged in successfully", 
            user: { 
                ...user._doc, 
                password: undefined, 

            }, 

        })
    } catch (error) { 

        console.log("Error in login ", error)
        res.status(400).json({ success: false, message: error.message })
    } 
}

export const logout = async (req, res) => { 

    res.clearCookie("token")
    res.status(200).json({ success: true, message: "Logged out successfully" })
}

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

// backend/controllers/authController.js

// LOGIN : Connexion de l'administrateur de la boutique
/* export const login = async (req, res) => { 
    const { email, password } = req.body 
    try { 
        const user = await User.findOne({ email })
        
        if (!user) { 
            return res.status(400).json({ success: false, message: "Identifiants invalides" })
        } 
        
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) { 
            return res.status(400).json({ success: false, message: "Identifiants invalides" })
        } 
        
        // Génère le JWT et le place dans un cookie HTTP-only (sécurisé)
        generateTokenAndSetCookie(res, user._id)

        // Optionnel: Mettre à jour la date de dernière connexion (si tu as ce champ dans ton modèle User)
        // user.lastLogin = new Date()
        // await user.save()

        res.status(200).json({ 
            success: true, 
            message: "Connexion réussie", 
            user: { 
                _id: user._id,
                email: user.email,
                role: user.role
                // On évite d'envoyer tout le document (_doc) pour plus de sécurité et de clarté
            } 
        })
    } catch (error) { 
        console.error("Erreur dans login: ", error)
        // Il est préférable de ne pas renvoyer error.message au client en production
        res.status(500).json({ success: false, message: "Erreur serveur lors de la connexion" })
    } 
}

// LOGOUT : Déconnexion de l'administrateur
export const logout = async (req, res) => { 
    res.clearCookie("token")
    res.status(200).json({ success: true, message: "Déconnexion réussie" })
}

// CHECK_AUTH : Vérifie si le cookie/token est toujours valide au rechargement (pour le Front React)
export const checkAuth = async (req, res) => {
    try {
        // req.userId doit être injecté par un middleware (ex: protectRoute) qui vérifie le cookie au préalable
        const user = await User.findById(req.userId).select("-password")
        
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" })
        }

        res.status(200).json({ success: true, user })
    } catch (error) {
        console.error("Erreur dans checkAuth: ", error)
        res.status(500).json({ success: false, message: "Erreur serveur lors de la vérification" })
    }
} */