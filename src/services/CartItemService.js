import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";

export const addOrUpdateCartItem = async (userId, productId, quantity) => {

    if (!productId) {
        throw new Error("Product Id is required");
    }

    if (quantity <= 0) {
        throw new Error("Quantity cannot be zero/negative");
    }

    const product = Product.findByPk(productId);
    if (!product) {
        throw new Error("Product not found");
    }

    const existingItem = await CartItem.findOne({ where: { userId, productId } });
    if (existingItem) {
        existingItem.quantity += quantity;
        await existingItem.save();
        return existingItem;
    }
    return await CartItem.create({ userId, productId, quantity });
};

export const getCartItems = async () => {
    return await CartItem.findAll({
        include: [{ model: Product, attributes: ['productName', 'price'] }]
    });
};

export const updateCartItemQuantity = async (userId, productId, quantity) => {
    if (!productId || quantity <= 0) {
        throw new Error("Valid product ID and quantity are required");
    }

    const item = await CartItem.findOne({ where: { userId, productId } });

    if (!item) {
        throw new Error("Cart item not found");
    }

    item.quantity = quantity;
    await item.save();
    return item;
};

export const removeCartItem = async (userId, productId) => {
    const deleted = await CartItem.destroy({ where: { userId, productId } });

    if (deleted === 0) {
        throw new Error("Cart item not found");
    }

    return { message: "Item removed from cart" };
};

export const clearCart = async (userId) => {
    await CartItem.destroy({ where: { userId } });
    return { message: "Cart cleared successfully" };
};