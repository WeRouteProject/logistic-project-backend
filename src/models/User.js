import { DataTypes } from 'sequelize';
import db from '../config/db.js'
import USER_ROLES from '../constants/userRole.js';

const { sequelize } = db;

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'userid'
  },
  username: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    unique: true,
    validate: {isEmail: true},
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM(USER_ROLES.ADMIN, USER_ROLES.DELIVERY),
    defaultValue: USER_ROLES.DELIVERY,
  },
},
{
  tableName: 'User',
  'freezeTableName': true,
  timestamps: false
}
);

export default  User;
