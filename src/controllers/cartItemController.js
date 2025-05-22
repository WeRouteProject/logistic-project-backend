import {
    addOrUpdateCartItem,
    getCartItems,
    updateCartItemQuantity,
    removeCartItem,
    clearCart
} from '../services/CartItemService.js';

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        const result = await addOrUpdateCartItem(userId, productId, quantity);
        res.status(200).json({ message: "Item added/updated in cart", item: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const fetchCart = async (req, res) => {
    try {
        const result = await getCartItems();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        const result = await updateCartItemQuantity(userId, productId, quantity);
        res.status(200).json({ message: "Cart item updated", item: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartItemId } = req.params;
        const result = await removeCartItem(userId, cartItemId);
        console.log(result, "result");
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const emptyCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await clearCart(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
