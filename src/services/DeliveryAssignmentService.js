import DeliveryAssignment from "../models/DeliveryAssignment.js";
import { DELIVERY_STATUS } from "../constants/deliveryStatus.js";
import USER_ROLE from "../constants/userRole.js";
import { Op, fn, col, where } from "sequelize";
import User from "../models/User.js";
import db from '../config/db.js';
const { sequelize } = db;

export const createDeliveryAssignment = async (assignmentData) => {
    return await sequelize.transaction(async (t) => {
        return await DeliveryAssignment.create(assignmentData, { transaction: t });
    });
};

export const getAssignementsForDelivery = async (deliveryBoyId) => {
    return await DeliveryAssignment.findAll({
        where: { deliveryBoyId },
    })
};

export const getAssignementsStatus = async (assignmentId, newStatus, deliveryNote = null) => {
    const assignment = await DeliveryAssignment.findByPk(assignmentId);
    if (!assignment)
        throw new Error('Assignment not found');

    assignment.status = newStatus;
    if ((newStatus === DELIVERY_STATUS.PARTIAL_DELIVERY || newStatus === DELIVERY_STATUS.CANCELLED)  && deliveryNote) {
        assignment.deliveryNote = deliveryNote;
    }
    return await assignment.save();
}

export const getAllAssignments = async () => {
    return await DeliveryAssignment.findAll();
}

export const getDeliveryAssignmentStats = async (deliveryBoyId = null) => {
    const whereClause = deliveryBoyId ? { deliveryBoyId } : {};

    const [assigned, delivered, pending, total] = await Promise.all([
        DeliveryAssignment.count({
            where: {
                ...whereClause,
                status: DELIVERY_STATUS.ASSIGNED
            }
        }),
        DeliveryAssignment.count({
            where: {
                ...whereClause,
                status: DELIVERY_STATUS.DELIVERED
            }
        }),
        DeliveryAssignment.count({
            where: {
                ...whereClause,
                status: DELIVERY_STATUS.PENDING
            }
        }),
        DeliveryAssignment.count({
            where: {
                ...whereClause
            }
        })
    ]);
    console.log({ assigned, delivered, pending, total });

    return {
        totalOrders: total,
        assignedOrders: assigned,
        deliveredOrders: delivered,
        pendingOrders: pending
    };
};

export const getAssignedDeliveryHistory = async (user) => {
    const whereClause = user.role === USER_ROLE.DELIVERY
        ? { deliveryBoyId: user.id }
        : {};

    const assignments = await DeliveryAssignment.findAll({
        where: whereClause,
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ],
        order: [['deliveryDate', 'DESC']]
    });

    return assignments.map(item => {
        const deliveryBoy = item.User?.username || '';

        /** @type {{ productName: string; quantity: number; }[]} */
        const cartItems = item.cartItems || [];

        const products = cartItems.map(ci => `${ci.productName} ${ci.quantity}`).join(', ');
        const quantities = cartItems.map(ci => ci.quantity).join(',');

        return {
            assignmentId: item.assignmentId,
            deliveryBoyName: deliveryBoy,
            customer: item.customerName,
            address: item.deliveryAddress,
            deliveryDate: item.deliveryDate,
            status: item.status,
            products,
            quantities,
            deliveryNote: item.deliveryNote
        };
    });
};

export const getDeliveryHistoryByDate = async (date) => {
    const allowedStatuses = [
        DELIVERY_STATUS.DELIVERED,
        DELIVERY_STATUS.CANCELLED,
        DELIVERY_STATUS.PARTIAL_DELIVERY
    ];

    const deliveries = await DeliveryAssignment.findAll({
        where: {
            status: {
                [Op.in]: allowedStatuses
            },
            [Op.and]: where(
                fn('DATE', col('deliverydate')),
                '=',
                date
            )
        },
        order: [['deliverydate', 'DESC']],
    });

    return deliveries;
};