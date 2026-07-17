//backend/models/orderModel.js

import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  isCustom: { 
    type: Boolean, 
    default: false 
  },
  name: { 
    type: String, 
    required: true
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  priceAtPurchase: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  customDetails: { 
    type: mongoose.Schema.Types.Mixed
  }
}) 

const orderSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    items: [orderItemSchema],
    totalAmount: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'shipped', 'cancelled'], 
      default: 'pending' 
    },
    deliveryDetails: {
      customerName: {
        type: String, 
        required: true },
      phone: {
        type: String,
        required: true },
      email: {
        type: String,
        required: true },
      address: {
        type: String,
        required: true },
      notes: {
        type:String, 
        default: '' }
    }
  },
  { timestamps: true }
) 

const Order = mongoose.model('Order', orderSchema)
export default Order