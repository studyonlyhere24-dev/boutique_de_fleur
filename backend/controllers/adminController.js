//backend/controllers/adminController.js

import Client from '../models/clientModel.js' 
import Order from '../models/orderModel.js' 
import Product from '../models/productModel.js'
import { StatusCodes } from 'http-status-codes'

// ============================= GESTION DES CLIENTS =======================
export const getAllClients = async (req, res) => {
    const clients = await Client.find({}).select("-password").sort({ createdAt: -1 }) 
    res.status(StatusCodes.OK).json({ success: true, count: clients.length, clients }) 
} 

// ============================= STATISTIQUES (DASHBOARD) =======================
export const getDashboardStats = async (req, res) => {
    const totalClients = await Client.countDocuments() 
    const totalOrders = await Order.countDocuments() 
    const totalProducts = await Product.countDocuments() 
    
    const validOrders = await Order.find({ status: { $ne: 'cancelled' } }) 
    const totalRevenue = validOrders.reduce((acc, order) => acc + order.totalAmount, 0) 

    const outOfStockProducts = await Product.countDocuments({ stock: 0 })  

    res.status(StatusCodes.OK).json({
        success: true,
        stats: { totalClients, totalOrders, totalProducts, totalRevenue, outOfStockProducts }
    }) 
}