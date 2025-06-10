import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Category from "./Category.js";

const { sequelize } = db;

const Product = sequelize.define('Product', {

    productId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    productName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'Product name must be unique.'
        },
        validate: {
            notEmpty: {
                msg: 'Product name is required.'
            }
        },
        field: 'productname'
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'description'
    },

    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },

    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: { msg: 'Price must be a valid number.' },
            min: { args: [0], msg: 'Price must be greater than or equal to 0.' }
        },
        field: 'price'
    },

    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Category',
            key: 'categoryid',
        },
        onDelete: 'CASCADE',
    },

    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'status'
    }
},

    {
        tableName: 'Products',
        'freezeTableName': true,
        timestamps: false
    });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId', onDelete: 'CASCADE', });

export default Product;