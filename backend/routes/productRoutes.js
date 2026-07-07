//backend/routes/productRoutes.js

import express from 'express'
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
import { isAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.post('/', isAdmin, createProduct)
router.patch('/:id', isAdmin, updateProduct)
router.delete('/:id', isAdmin, deleteProduct)

export default router
