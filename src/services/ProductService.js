import Product from '../models/Product.js';

export const createProduct = async (data) => {
    return await Product.create(data);
}

export const getAllProducts = async () => {
    return await Product.findAll({
        attributes: ['productId', 'productName', 'description', 'imageUrl', 'price', 'categoryId']
    });
};


export const getProductById = async (id) => {
    return await Product.findByPk(id);
}

export const getProductByCategoryId = async (categoryId) => {
    if (!categoryId) {
        throw new Error("Category ID is required");
    }

    return await Product.findAll ({
        where: {
            categoryId: categoryId
        },
        attributes: ['productId', 'productName', 'description', 'imageUrl', 'price', 'categoryId']
    })
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
