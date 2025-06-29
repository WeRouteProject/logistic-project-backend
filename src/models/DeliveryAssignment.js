import { Sequelize, DataTypes } from "sequelize";
import db from '../config/db.js';
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

    cartItems: {
        type: DataTypes.JSONB,
        allowNull: false,
    },

    deliveryBoyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    deliveryBoyName: {
        type: DataTypes.STRING,
        allowNull: false
    },


    customerName: {
        type: DataTypes.STRING,
        field: 'customername'
    },

    customerNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerEmail: {
        type: DataTypes.STRING,
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

    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },

    discountedPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },

    deliveryNote: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        validate: {
            len: {
                args: [0, 255],
                msg: 'Note can be up to 255 characters only',
            },
        },
    },


    orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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
    }
},
    {
        tableName: 'DeliveryAssignment',
        'freezeTableName': true,
        timestamps: false
    });

DeliveryAssignment.belongsTo(User, { foreignKey: 'deliveryBoyId' });

export default DeliveryAssignment;
