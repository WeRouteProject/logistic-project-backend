import express from 'express';
import upload from '../middlewares/multer.js';

import {
    createProduct,
    getAllProducts,
    getProductById,
    getProductByCatId,
    updateProduct,
    deleteProduct
} from '../controllers/ProductController.js';

const router = express.Router();

// router.post('/product',upload.single('image'), createProduct);
router.post('/', upload.single('image'), createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:categoryId', getProductByCatId);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

export default router;