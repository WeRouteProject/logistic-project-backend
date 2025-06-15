import * as productService from '../services/ProductService.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

export const createProduct = async (req, res) => {
    try {
        const { productName, description, price, categoryId, status } = req.body;

        if (!productName || !price || !categoryId) {
            return res.status(400).json({ message: 'Product name, price, and category are required' });
        }

        const parsedStatus = status === 'false' || status === false ? false : true;

         let imageUrl = '';
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer, 'products');
        }

        const newProduct = await productService.createProduct({ productName, description, price, categoryId, imageUrl, status: parsedStatus });
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
        const products = await productService.getAllProducts();
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

export const getProductByCatId = async (req, res) => {
    try {
        
        const categoryId = req.params.categoryId;

        if (!categoryId) {
            return res.status(400).json({ message: 'Category ID is required' });
        }

        const product = await productService.getProductByCategoryId(categoryId);
        if (!product) return res.status(404).json({ message: 'Product not found in this category' });

        res.status(200).json(product);
    }

    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateProduct = async (req, res) => {
  try {
    const { productName, description, price, categoryId, status } = req.body;

    const parsedStatus = status === 'false' || status === false ? false : true;

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'products', req.file.originalname);
    }

    const updateData = {};

    // Only add fields if they are provided (non-empty)
    if (productName) updateData.productName = productName;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (categoryId) updateData.categoryId = categoryId;
    if(status !== undefined) updateData.status = parsedStatus;
    if (imageUrl) updateData.imageUrl = imageUrl;

    const updatedProduct = await productService.updateProduct(req.params.id, updateData);

    res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
  } catch (err) {
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