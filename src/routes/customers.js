import express from 'express';
import {
    createCustomerHandler,
    getAllCustomersHandler,
    getCustomerByIdHandler,
    updateCustomerHandler,
    deleteCustomerHandler,
} from '../controllers/CustomerController.js';

const router = express.Router();

router.post('/', createCustomerHandler);         // POST /api/customers
router.get('/', getAllCustomersHandler);         // GET /api/customers
router.get('/:id', getCustomerByIdHandler);      // GET /api/customers/:id
router.put('/:id', updateCustomerHandler);       // PUT /api/customers/:id
router.delete('/:id', deleteCustomerHandler);    // DELETE /api/customers/:id

export default router;