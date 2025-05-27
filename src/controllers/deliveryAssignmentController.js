import {
    createDeliveryAssignment,
    getAssignementsForDelivery,
    getAssignementsStatus,
    getAllAssignments,
    getDeliveryAssignmentStats,
    getAssignedDeliveryHistory
} from '../services/DeliveryAssignmentService.js';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { DELIVERY_STATUS } from '../constants/deliveryStatus.js';

export const assignCartItems = async (req, res) => {
    try {
        const {
            cartItems,
            deliveryBoyId,
            customerName,
            customerNumber,
            customerEmail,
            deliveryAddress,
            deliveryDate,
            status } = req.body;

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ error: 'At least one item should be there in cart to assign' });
        }

        const cartItemIds = cartItems.map(item => item.cartItemId);
        const uniqueCartItemIds = [...new Set(cartItemIds)];
        if (cartItemIds.length !== uniqueCartItemIds.length) {
            return res.status(400).json({ error: 'Duplicate cartItemIds are not allowed' });
        }

        const deliveryBoy = await User.findByPk(deliveryBoyId);

        if (!deliveryBoy) {
            throw new Error('Delivery boy not found');
        }

        const cartItemDetails = await Promise.all(
            cartItems.map(async (item) => {
                const cartItem = await CartItem.findByPk(item.cartItemId, {
                    include: [{ model: Product }]
                });

                if (!cartItem || !cartItem.Product) {
                    throw new Error(`Invalid cart item or product for cartItemId: ${item.cartItemId}`);
                }

                return {
                    cartItemId: cartItem.cartItemId,
                    productId: cartItem.Product.id,
                    productName: cartItem.Product.productName,
                    quantity: cartItem.quantity,
                    price: cartItem.Product.price,
                    totalPrice: cartItem.quantity * cartItem.Product.price
                };
            })
        );

        const totalPrice = cartItemDetails.reduce(
            (acc, item) => acc + item.totalPrice,
            0
        );

        const assignmentsToCreate = {
            cartItems: cartItemDetails,
            deliveryBoyId,
            deliveryBoyName: deliveryBoy.username,
            customerName,
            customerNumber,
            customerEmail,
            deliveryAddress,
            deliveryDate,
            price: totalPrice,
            status: status || DELIVERY_STATUS.ASSIGNED,
        };

        const assignments = await createDeliveryAssignment(assignmentsToCreate);

        res.status(200).json({
            message: 'Successfully Assigned Cart Items For Delivery',
            data: assignments
        });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getAllMyAssignments = async (req, res) => {
    try {
        const userId = req.user.id;
        const assignments = await getAssignementsForDelivery(userId)
        res.status(200).json(assignments);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { status } = req.body;

        const updatedStatus = await getAssignementsStatus(assignmentId, status);
        res.status(200).json({
            message: 'Delivery Status Updated: ',
            data: updatedStatus
        })
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const fetchAllAssignements = async (req, res) => {
    try {
        const assignments = await getAllAssignments();
        res.status(200).json(assignments);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getDeliveryStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const isDelivery = req.user.role === 'delivery';

        const stats = await getDeliveryAssignmentStats(isDelivery ? userId : null);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getDeliveryHistory = async (req, res) => {

    try {
        const user = req.user;

        const history = await getAssignedDeliveryHistory(user);
        res.status(200).json({
            message: 'Delivery history fetched successfully.',
            data: history
        })
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
