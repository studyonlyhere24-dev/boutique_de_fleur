//backend/controllers/orderController.js

import Client from '../models/clientModel.js' 
import Order from '../models/orderModel.js' 
import Product from '../models/productModel.js' 
import { sendOrderConfirmationEmail } from '../services/emailService.js' 
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/customErrors.js'

// ============================= PARTIE CLIENT =============================
export const createOrder = async (req, res) => {
    const { items } = req.body 

    if (!items || items.length === 0) throw new BadRequestError("Le panier est vide") 

    let totalAmount = 0 
    const productsToUpdate = [] 
    const finalItems = [] 

    for (const item of items) {
        const product = await Product.findById(item.product) 
        
        if (!product) throw new NotFoundError("Produit introuvable") 
        if (product.stock < item.quantity) {
            throw new BadRequestError(`Stock insuffisant pour la fleur : ${product.name}. Il n'en reste que ${product.stock}.`) 
        }

        totalAmount += product.price * item.quantity 
        finalItems.push({ product: product._id, quantity: item.quantity, priceAtPurchase: product.price }) 
        productsToUpdate.push({ productDoc: product, quantityToDeduct: item.quantity }) 
    }

    const order = new Order({ client: req.userId, items: finalItems, totalAmount, status: 'pending' }) 
    const savedOrder = await order.save() 

    for (const p of productsToUpdate) {
        p.productDoc.stock -= p.quantityToDeduct 
        await p.productDoc.save() 
    }

    const client = await Client.findById(req.userId) 
    if (client) {
        const populatedOrder = await Order.findById(savedOrder._id).populate('items.product', 'name') 
        sendOrderConfirmationEmail(client.email, populatedOrder).catch(err => {
            console.error("Erreur lors de l'envoi de l'email de confirmation:", err) 
        }) 
    }

    res.status(StatusCodes.CREATED).json({ success: true, message: "Commande validée avec succès", order: savedOrder }) 
} 

export const getMyOrders = async (req, res) => {
    const orders = await Order.find({ client: req.userId })
        .populate('items.product', 'name imageUrl category')
        .sort({ createdAt: -1 })

    res.status(StatusCodes.OK).json({ success: true, orders }) 
} 

// ============================= PARTIE ADMINISTRATEUR =============================
export const getAllOrders = async (req, res) => {
    const orders = await Order.find({})
        .populate('client', 'name email address')
        .populate('items.product', 'name')
        .sort({ createdAt: -1 }) 

    res.status(StatusCodes.OK).json({ success: true, totalOrders: orders.length, orders }) 
} 

export const updateOrderStatus = async (req, res) => {
    const { status } = req.body 
    const validStatuses = ['pending', 'confirmed', 'shipped', 'cancelled'] 
    
    if (!validStatuses.includes(status)) throw new BadRequestError("Statut invalide") 

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }) 
    
    if (!order) throw new NotFoundError("Commande introuvable") 

    res.status(StatusCodes.OK).json({ 
        success: true, message: `La commande est maintenant marquée comme: ${status}`, order 
    }) 
}