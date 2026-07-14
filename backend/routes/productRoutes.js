//backend/routes/productRoutes.js

import express from 'express'
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.get('/', getAllProducts)

router.get('/:id', getProductById)

router.post('/', verifyToken, isAdmin, upload.single('imageUrl'), createProduct)

router.patch('/:id', verifyToken, isAdmin, upload.single('imageUrl'), updateProduct)

router.delete('/:id', verifyToken, isAdmin, deleteProduct)

export default router
