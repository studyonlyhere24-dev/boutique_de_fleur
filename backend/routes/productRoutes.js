//backend/routes/productRoutes.js

import express from 'express'
import { getAllProducts, getProductById, createProduct, createCustomProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.get('/all', getAllProducts)

router.get('/:id', getProductById)

router.post('/create', verifyToken, isAdmin, upload.single('imageUrl'), createProduct)

router.post('/custom', verifyToken, isAdmin, createCustomProduct)

router.patch('/:id', verifyToken, isAdmin, upload.single('imageUrl'), updateProduct)

router.delete('/:id', verifyToken, isAdmin, deleteProduct)

export default router
