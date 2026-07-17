//backend/models/userModel.js

import mongoose from 'mongoose'

const clientSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        trim: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true, 
        lowercase: true 
    },
    password: {
        type:String,
        required:true
    },
    lastLogin: {
        type:Date,
        default: Date.now()
    },
    address: { 
        type: String, 
        required: true },
    phone: { 
        type: String, 
        trim: true 
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt:Date
},
    { timestamps: true }
)

const Client = mongoose.model('Client', clientSchema)
export default Client