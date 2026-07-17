//backend/services/emailService.js

import dotenv from "dotenv"
import { transporter } from "../config/transporter.js"
dotenv.config()
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, ORDER_CONFIRMATION_TEMPLATE } from '../templates/emailTemplate.js'

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const response = await transporter.sendMail({
      from: `"Maison Fleurale" <${process.env.EMAIL_USER}>`,
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
      from: `"Maison Fleurale" <${process.env.EMAIL_USER}>`,
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

export const sendOrderConfirmationEmail = async (email, order) => {
  try {
    const orderId = order._id.toString().slice(-6).toUpperCase() 

    const htmlContent = ORDER_CONFIRMATION_TEMPLATE(order, orderId) 

    const response = await transporter.sendMail({
      from: `"Maison Fleurale" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Confirmation de votre commande n°${orderId}`,
      html: htmlContent,
    }) 

    console.log("Order confirmation email sent successfully", response.messageId) 
  } catch (error) {
    console.error(`Error sending order confirmation email`, error) 
    throw new Error(`Error sending order confirmation email: ${error}`) 
  }
} 
