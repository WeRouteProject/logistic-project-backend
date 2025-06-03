import express from 'express';
import  ExistingUser  from '../middlewares/ExistingUser.js';
import {
  addToCart,
  fetchCart,
  updateCart,
  deleteCartItem,
  emptyCart
} from '../controllers/cartItemController.js';

const router = express.Router();
router.post('/cart/add', ExistingUser, addToCart);
router.get('/cart', ExistingUser, fetchCart);
router.put('/cart/update', ExistingUser, updateCart);
router.delete('/cart/remove/:cartItemId', ExistingUser, deleteCartItem);
router.delete('/cart/clear', ExistingUser, emptyCart);

export default router;
