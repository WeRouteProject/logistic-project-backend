import * as categoryService from '../services/CategoryService.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

export const createCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;

        if (!categoryName || categoryName.trim() === '') {
            res.status(400).json({ message: 'Name is required' });
        }

        let imageUrl = '';
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer, 'categories');
        }

        const category = await categoryService.createCategory({ categoryName, imageUrl });
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;

        if (!categoryName || categoryName.trim() === '') {
            return res.status(400).json({ message: 'Category name is required' });
        }

        let imageUrl = '';
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer, 'categories');
        }

        const updateData = { categoryName };
        if (imageUrl) {
            updateData.imageUrl = imageUrl;
        }

        const category = await categoryService.updateCategory(req.params.id, updateData);
        res.status(200).json({
            message: 'Category updated successfully',
            data: category
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoriesById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        res.status(200).json({message: 'Category deleted successfully'});
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }

}
