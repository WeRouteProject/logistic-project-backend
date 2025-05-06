import  DeliveryAssignment  from "../models/DeliveryAssignment.js";
import { DELIVERY_STATUS } from "../constants/deliveryStatus.js";
import USER_ROLE from "../constants/userRole.js";
import CartItem from "../models/CartItem.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

export const assignMultipleCartItems = async (assignments) => {

    return await DeliveryAssignment.bulkCreate(assignments);
};

export const getAssignementsForDelivery = async (deliveryBoyId) => {
    return await DeliveryAssignment.findAll({
        where: { deliveryBoyId },
        include: [{model: CartItem}]   
    })
};

export const getAssignementsStatus = async (assignmentId, newStatus) => {
    const assignment = await DeliveryAssignment.findByPk(assignmentId);
    if(!assignment)
        throw new Error('Assignment not found');

    assignment.status = newStatus;
    return await assignment.save();
}

export const getAllAssignments = async () => {
    return await DeliveryAssignment.findAll({
        include: [{model: CartItem}]
    });
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
            },
            {
                model: CartItem,
                include: [
                    {
                        model: Product,
                        attributes: ['productname']
                    }
                ]
            }
        ],
        // order: [['createdAt', 'DESC']]
    });

    console.log(assignments);

    return assignments.map(item => {
        const productName = item.dataValues.productName || item.CartItem?.Product?.productname;
        const quantity = item.dataValues.productQuantity || item.cartItem?.quantity;
        const deliveryBoy = item.User.username;

        return {
            assignmentId: item.id,
            deliveryBoyName: `${deliveryBoy}`,
            customer: item.customerName,
            address: item.deliveryAddress,
            deliveryDate: item.deliveryDate,
            deliveryBoy: item.deliveryBoy?.username,
            status: item.status,
            product: `${productName}`,
            quantities: `${quantity}`
        };
    });
};




