import { DataTypes } from "sequelize";
import db from '../config/db.js';
import CartItem from '../models/CartItem.js';
import User from '../models/User.js';
import { DELIVERY_STATUS } from "../constants/deliveryStatus.js";

const { sequelize } = db;

const DeliveryAssignment = sequelize.define('DeliveryAssignment', {

    assignmentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        field: 'assignmentid'
    },

    cartItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'cartitemid',
        validate: {
            min: 1
        }
    },

    deliveryBoyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    customerName: {
        type: DataTypes.STRING,
        field: 'customername'
    },

    deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'deliveryaddress'
    },

    deliveryDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'deliverydate'
    },

    status: {
        type: DataTypes.ENUM(
            DELIVERY_STATUS.ASSIGNED,
            DELIVERY_STATUS.SHIPPED,
            DELIVERY_STATUS.PARTIAL_DELIVERY,
            DELIVERY_STATUS.DELIVERED,
            DELIVERY_STATUS.CANCELLED
        ),
        defaultValue: DELIVERY_STATUS.PENDING
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productQuantity: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},
    {
        tableName: 'DeliveryAssignment',
        'freezeTableName': true,
        timestamps: false
    });

// DeliveryAssignment.hasMany(DeliveryAssignment, {foreignKey: 'deliveryBoyId'});
DeliveryAssignment.belongsTo(User, { foreignKey: 'deliveryBoyId' });
DeliveryAssignment.belongsTo(CartItem, { foreignKey: 'cartItemId' });

export default DeliveryAssignment;
