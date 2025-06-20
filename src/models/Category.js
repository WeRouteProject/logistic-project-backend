import db from '../config/db.js';
import { DataTypes } from 'sequelize';

const { sequelize } = db;

const Category = sequelize.define('Category', {

    categoryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'categoryid'
    },

    categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'categoryname',
        unique: {
            msg: 'Category name is unique.'
        },
        validate: {
            notEmpty: {
                msg: 'Category name is required.'
            }
        }
    },

    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },

    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'status'
    }

},
    {
        tableName: 'Categories',
        'freezeTableName': true,
        timestamps: false
    }
);

export default Category;