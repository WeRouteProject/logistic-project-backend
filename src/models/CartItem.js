import db from '../config/db.js';
import User from './User.js';
import Product from './Product.js';
import { DataTypes } from 'sequelize';

const { sequelize } = db;

const CartItem = sequelize.define('CartItem', {

    cartItemId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'cartitemid'
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'userid'
    },

    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    }
},
{
    tableName: 'CartItem',
    'freezeTableName': true,
    timestamps: false 
});

CartItem.belongsTo(User, {foreignKey: 'userId'});
CartItem.belongsTo(Product, {foreignKey: 'productId'});

export default CartItem;