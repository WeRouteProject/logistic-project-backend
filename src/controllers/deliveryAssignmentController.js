import {
    assignMultipleCartItems,
    getAssignementsForDelivery,
    getAssignementsStatus,
    getAllAssignments,
    getDeliveryAssignmentStats,
    getAssignedDeliveryHistory
} from '../services/DeliveryAssignmentService.js';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';

export const assignCartItems = async (req, res) => {
    try {
        const { cartItems,
            deliveryBoyId,
            customerName,
            deliveryAddress,
            deliveryDate,
            status } = req.body;

        if(!Array.isArray(cartItems) || cartItems.length === 0){
            return res.status(400).json({ error: 'At least one item should be there in cart to assign' });
        }

        const assignments = [];

        for (const item of cartItems) {
            const cartItem = await CartItem.findByPk(item.cartItemId, {
                include: [{ model: Product }]
            });

            if (!cartItem || !cartItem.Product) {
                return res.status(400).json({ error: `Invalid cartItem or product for ID: ${item.cartItemId}` });
            }

            assignments.push({
                cartItemId: item.cartItemId,
                deliveryBoyId,
                customerName,
                deliveryAddress,
                deliveryDate,
                status,
                productName: cartItem.Product.productName,
                productQuantity: cartItem.quantity.toString()
            });
        }

        const result = await assignMultipleCartItems(assignments);

        res.status(200).json({
            message: 'Successfully Assigned Cart Items For Delivery',
            data: result
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
        const result = await getAllAssignments();
        res.status(200).json(result);
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
