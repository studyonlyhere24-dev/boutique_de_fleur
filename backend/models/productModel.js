//backend/models/productModel.js

import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true, trim: true },
    description: { 
        type: String, 
        required: true },
    price: { 
        type: Number, 
        required: true, min: 0 },
    category: { 
        type: String, 
        required: true },
    imageUrl: { 
        type: String, 
        required: true },
    stock: { 
        type: Number, 
        required: true, default: 0, min: 0 }
  },
  { timestamps: true }
)

const Product = mongoose.model('Product', productSchema)
export default Product