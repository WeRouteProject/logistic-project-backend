import express from 'express';

import {
    createProduct,
    getAllProducts,
    getProductById,
    getProductByCatId,
    updateProduct,
    deleteProduct
} from '../controllers/ProductController.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:categoryId', getProductByCatId);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;