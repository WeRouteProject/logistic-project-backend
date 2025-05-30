import Category from '../models/Category.js';

export const createCategory = async (data) => {
    return await Category.create(data);
};

export const getAllCategories = async () => {
    return await Category.findAll({
        attributes: ['categoryId', 'categoryName', 'imageUrl']
    });
}

export const getCategoriesById = async (id) => {
    return await Category.findByPk(id, {
        attributes: ['categoryId', 'categoryName', 'imageUrl']
    });
}

export const updateCategory = async (id, data) => {
    const category = await Category.findByPk(id);

    if (!category)
        throw new Error('Category not found');

    await category.update(data);
    return category
}
export const deleteCategory = async (id) => {
    const category = await Category.findByPk(id);

    if (!category)
        throw new Error('Category not found');

    await category.destroy(id);
}
