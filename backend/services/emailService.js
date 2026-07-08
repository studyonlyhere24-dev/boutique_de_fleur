//backend/services/emailService.js

import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from '../templates/emailTemplate.js'

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const response = await transporter.sendMail({
      from: `"Tesnim" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    })

    console.log("Password reset email sent successfully", response.messageId)
  } catch (error) {
    console.error(`Error sending password reset email`, error)
    throw new Error(`Error sending password reset email: ${error}`)
  }
}

export const sendResetSuccessEmail = async (email) => {
  try {
    const response = await transporter.sendMail({
      from: `"Tesnim" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    })

    console.log("Password reset success email sent successfully", response.messageId)
  } catch (error) {
    console.error(`Error sending password reset success email`, error)
    throw new Error(`Error sending password reset success email: ${error}`)
  }
}
