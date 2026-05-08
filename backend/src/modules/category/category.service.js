import Category from './category.model.js';

export const getAllCategories = async () => {
    return await Category.find({ isActive: true }).sort('name');
};

export const createCategory = async (data) => {
    return await Category.create(data);
};
