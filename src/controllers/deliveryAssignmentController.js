import {
    createDeliveryAssignment,
    getAssignementsForDelivery,
    getAssignementsStatus,
    getAllAssignments,
    getDeliveryAssignmentStats,
    getAssignedDeliveryHistory,
    getDeliveryHistoryByDate
} from '../services/DeliveryAssignmentService.js';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import User from '../models/User.js';
import { DELIVERY_STATUS } from '../constants/deliveryStatus.js';
import DeliveryAssignment from '../models/DeliveryAssignment.js';

export const assignCartItems = async (req, res) => {
    try {
        const {
            cartItems,
            deliveryBoyId,
            customerId,
            customerName,
            customerNumber,
            customerEmail,
            deliveryAddress,
            deliveryDate,
            status,
            discountedPrice,
            deliveryNote,
        } = req.body;

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

        const customer = await Customer.findByPk(customerId);
        if (!customer) throw new Error('Customer not found');

        if (customer.remainingCredit < discountedPrice) {
            return res.status(400).json({
                error: 'Insufficient remaining credit to assign this delivery'
            });
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
            discountedPrice,
            status: status || DELIVERY_STATUS.ASSIGNED,
            deliveryNote: (status === DELIVERY_STATUS.PARTIAL_DELIVERY || status === DELIVERY_STATUS.CANCELLED) ? deliveryNote : null
        };

        const newRemainingCredit = customer.remainingCredit - discountedPrice;
        await customer.update({ remainingCredit: newRemainingCredit });


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
        const { status, deliveryNote } = req.body;

        const updatedStatus = await getAssignementsStatus(assignmentId, status, deliveryNote);
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

export const getUpdatedStatus = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const assignment = await DeliveryAssignment.findByPk(assignmentId, {
            attributes: ['assignmentId', 'status', 'deliveryNote', 'deliveryDate', 'orderDate']
        });

        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        res.status(200).json({
            message: 'Delivery status fetched successfully',
            data: assignment
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const fetchDeliveryHistoryByDate = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Date is required in YYYY-MM-DD format.' });
        }

        const deliveries = await getDeliveryHistoryByDate(date);
        console.log('Fetching deliveries for date:', date);
        res.status(200).json(deliveries);
    } catch (err) {
        console.error('Error fetching delivery history:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};
