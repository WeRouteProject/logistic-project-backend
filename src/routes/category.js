import express from 'express';
import upload from '../middlewares/multer.js';

import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from '../controllers/CategoryController.js';

const router = express.Router();

router.post('/category', upload.single('image'), createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.put('/:id', upload.single('image'), updateCategory);
router.delete('/:id', deleteCategory);

export default router;