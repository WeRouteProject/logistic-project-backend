import Product from '../models/Product.js';

export const createProduct = async (data) => {
    return await Product.create(data);
}

export const getAllProducts = async () => {
    return await Product.findAll();
}

export const getProductById = async (id) => {
    return await Product.findByPk(id);
}

export const updateProduct = async (id, data) => {
    const product = await Product.findByPk(id);

    if(!product){
        throw new Error('Product with the provided id for update, does not exist');
    }

    await product.update(data);
    return product;
}

export const deleteProduct = async (id) => {
    const product = await Product.findByPk(id);

    if(!product){
        throw new Error('Product with the provided id for delete, does not exist');
    }

    await product.destroy(id);
    return product;
}
