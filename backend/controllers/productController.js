//backend/controllers/productController.js

import Product from '../models/productModel.js'

// ============================= GET ALL PRODUCTS =======================
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        res.status(200).json({ success: true, products })
    } catch (error) {
        console.error("Erreur dans getProducts: ", error)
        res.status(500).json({ success: false, message: "Erreur lors de la récupération des produits" })
    }
}

// ============================= GET PRODUCT BY ID =======================
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        
        if (!product) {
            return res.status(404).json({ success: false, message: "Fleur introuvable" })
        }
        
        res.status(200).json({ success: true, product })
    } catch (error) {
        console.error("Erreur dans getProductById: ", error)
        res.status(500).json({ success: false, message: "Erreur serveur (ID invalide ?)" })
    }
}

// ============================= CREATE PRODUCT =======================
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json({ success: true, message: "Produit ajouté au catalogue", product })
    } catch (error) {
        console.error("Erreur dans createProduct: ", error)
        res.status(400).json({ success: false, message: error.message })
    }
}

// ============================= UPDATE PRODUCT =======================
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        )

        if (!product) {
            return res.status(404).json({ success: false, message: "Produit introuvable pour la mise à jour" })
        }

        res.status(200).json({ success: true, message: "Produit mis à jour", product })
    } catch (error) {
        console.error("Erreur dans updateProduct: ", error)
        res.status(400).json({ success: false, message: error.message })
    }
}

// ============================= DELETE PRODUCT =======================
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)

        if (!product) {
            return res.status(404).json({ success: false, message: "Produit introuvable" })
        }

        res.status(200).json({ success: true, message: "Produit définitivement supprimé" })
    } catch (error) {
        console.error("Erreur dans deleteProduct: ", error)
        res.status(500).json({ success: false, message: "Erreur lors de la suppression" })
    }
}