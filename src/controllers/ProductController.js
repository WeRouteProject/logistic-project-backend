import * as productService from '../services/ProductService.js';

export const createProduct = async (req, res) => {
    try {
        const { productName, description, price, categoryId } = req.body;

        if (!productName || !price || !categoryId) {
            return res.status(400).json({ message: 'Product name, price, and category are required' });
        }

        const newProduct = await productService.createProduct({ productName, description, price, categoryId });
        res.status(201).json(
            {
                message: 'Product created successfully',
                data: newProduct
            }
        );
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts(req.params.id);
        res.status(200).json(products);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json(product);
    }

    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { productName, description, price, categoryId } = req.body;

        if (!productName || !price || !categoryId) {
            return res.status(400).json({ message: 'Product name, price, and category are required' });
        }
        const updatedProduct = await productService.updateProduct(req.params.id, {
            productName, description, price, categoryId
        })
        res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};