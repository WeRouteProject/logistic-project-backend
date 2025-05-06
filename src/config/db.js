import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.PG_DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export default { sequelize, connectToDatabase };