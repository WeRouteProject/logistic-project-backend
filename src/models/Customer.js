import db from '../config/db.js';
import { DataTypes } from "sequelize";

const { sequelize } = db;
const Customer = sequelize.define('Customer', {
    customerId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [3, 20],
                msg: 'Customer name must be between 3 and 20 characters',
            },
            is: {
                args: /^[a-zA-Z0-9 _-]+$/i,
                msg: 'Username can only contain letters, numbers, underscores, or hyphens',
            },
        }
    },

    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: {
            msg: 'Email already exists',
        },
        validate: {
            len: {
                args: [1, 255],
                msg: 'Email must be less than 255 characters',
            },
        },
    },

    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    wallet: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
        validate: {
            isFloat: { msg: 'Wallet balance must be a valid number' },
            min: [0, 'Wallet balance cannot be negative' ],
        },
    },

    remainingCredit: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
        validate: {
            isFloat: { msg: 'Remaining credit must be a valid number' },
            min: [0, 'Remaining credit cannot be negative' ],
        },
    },

    discount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
        validate: {
            isFloat: { msg: 'Discount must be a valid number' },
            min: [0, 'Discount cannot be negative' ],
        },
    },

    contactNumber: {
        type: DataTypes.STRING, 
        allowNull: false,
        unique: { msg: 'Contact number already exists' }, 
        validate: {
            notNull: { msg: 'Contact number is required' },
            notEmpty: { msg: 'Contact number cannot be empty' },
            len: { args: [10, 15], msg: 'Contact number must be between 10 and 15 digits' },
            is: {
                args: /^\+?[1-9]\d{9,14}$/,
                msg: 'Invalid contact number format (e.g., +919876543210 or 9876543210)',
            },
        },
    },
},
    {
        tableName: 'Customer',
        freezeTableName: true,
        timestamps: false,
    })

export default Customer;