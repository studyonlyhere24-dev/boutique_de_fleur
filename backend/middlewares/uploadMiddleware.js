// backend/middlewares/uploadMiddleware.js

import multer from 'multer'

const storage = multer.memoryStorage()

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
})

export const formatImage = (file) => {
    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
    return dataUri
}