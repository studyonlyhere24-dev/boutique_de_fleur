//backend/routes/productRoutes.js

import express from 'express'
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
import { isAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', getAllProducts)

router.get('/:id', getProductById)

router.post('/', verifyToken, isAdmin, createProduct)

router.patch('/:id', verifyToken, isAdmin, updateProduct)

router.delete('/:id', verifyToken, isAdmin, deleteProduct)

export default router
