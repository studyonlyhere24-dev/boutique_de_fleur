//backend/models/adminModel.js

import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        format: {
            type: String,
            match: [/.+@.+\..+/, 'Please fill a valid email address']
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
})

const Admin = mongoose.model('Admin', adminSchema)
export default Admin