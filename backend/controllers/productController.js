//backend/controllers/productController.js

import Product from '../models/productModel.js'
import { StatusCodes } from 'http-status-codes'
import { NotFoundError, BadRequestError } from '../errors/customErrors.js'
import { formatImage } from '../middlewares/uploadMiddleware.js'
import cloudinary from '../config/cloudinary.js'

// ============================= GET ALL PRODUCTS =======================
export const getAllProducts = async (req, res) => {
    const products = await Product.find({})
    res.status(StatusCodes.OK).json({ success: true, products })
}

// ============================= GET PRODUCT BY ID =======================
export const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        throw new NotFoundError("Fleur introuvable")
    }
    res.status(StatusCodes.OK).json({ success: true, product })
}

// ============================= CREATE PRODUCT =======================
export const createProduct = async (req, res) => {
    const productData = { ...req.body }
    if (req.file) {
        const file64 = formatImage(req.file)
        const uploadResult = await cloudinary.uploader.upload(file64, {
            folder: 'produits', 
        })
        productData.imageUrl = uploadResult.secure_url 
    }
    const product = await Product.create(productData)
    res.status(StatusCodes.CREATED).json({ success: true, message: "Produit ajouté au catalogue", product })
}

// ============================= UPDATE PRODUCT =======================
export const updateProduct = async (req, res) => {
    const updateData = { ...req.body }
    if (req.file) {
        const file64 = formatImage(req.file)
        const uploadResult = await cloudinary.uploader.upload(file64, {
            folder: 'produits',
        })
        updateData.imageUrl = uploadResult.secure_url
    }
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        updateData, 
        { new: true, runValidators: true }
    )

    if (!product) {
        throw new NotFoundError("Produit introuvable pour la mise à jour")
    }
    res.status(StatusCodes.OK).json({ success: true, message: "Produit mis à jour", product })
}

// ============================= DELETE PRODUCT =======================
export const deleteProduct = async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
        throw new NotFoundError("Produit introuvable")
    }
    res.status(StatusCodes.OK).json({ success: true, message: "Produit définitivement supprimé" })
}