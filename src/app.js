import express from 'express';
import cors from 'cors'; 
const app = express();
import db  from '../src/config/db.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/category.js';
import productRoutes from './routes/product.js';
import cartItemRoutes from './routes/cartItem.js';
import deliveryAssignmentRoutes from './routes/deliveryAssignment.js';

const { sequelize, connectToDatabase } = db;

app.use(cors());
app.use(express.json());

connectToDatabase();

sequelize.sync()
  .then(() => {
    console.log('Database sync successful');
  })
  .catch((err) => {
    console.error('Error syncing the database:', err);
  });

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/', cartItemRoutes);
app.use('/api/delivery', deliveryAssignmentRoutes);

app.get('/', (req, res) => {
    res.send('API is working');
  });

export default app;