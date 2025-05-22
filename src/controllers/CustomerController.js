// src/controllers/CustomerController.js
import {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
} from '../services/CustomerService.js';

export const createCustomerHandler = async (req, res) => {
    try {
        const { customerName, email, address, contactNumber } = req.body;

        if (!customerName) {
            return res.status(400).json({ error: 'Customer name is required' });
        }
        if (customerName.length < 3 || customerName.length > 20) {
            return res.status(400).json({ error: 'Customer name must be between 3 and 20 characters' });
        }
        if (!/^[a-zA-Z0-9 _-]+$/.test(customerName)) {
            return res.status(400).json({ error: 'Customer name can only contain letters, numbers, underscores, or hyphens' });
        }

        if (email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            if (email.length > 255) {
                return res.status(400).json({ error: 'Email must be less than 255 characters' });
            }
        }

        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }

        if (!contactNumber) {
            return res.status(400).json({ error: 'Contact number is required' });
        }
        if (!/^\+?[1-9]\d{9,14}$/.test(contactNumber)) {
            return res.status(400).json({ error: 'Invalid contact number format (e.g., +919876543210 or 9876543210)' });
        }

        const customer = await createCustomer({
            customerName,
            email,
            address,
            contactNumber,
        });

        res.status(201).json({
            message: 'Customer created successfully',
            data: {
                customerId: customer.customerId,
                customerName: customer.customerName,
                email: customer.email,
                address: customer.address,
                contactNumber: customer.contactNumber,
            },
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getAllCustomersHandler = async (req, res) => {
    try {
        const customers = await getAllCustomers();
        res.status(200).json({
            message: 'Customers fetched successfully',
            data: customers,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getCustomerByIdHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await getCustomerById(id);
        res.status(200).json({
            message: 'Customer fetched successfully',
            data: customer,
        });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

export const updateCustomerHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { customerName, email, address, contactNumber } = req.body;

        if (customerName) {
            if (customerName.length < 3 || customerName.length > 20) {
                return res.status(400).json({ error: 'Customer name must be between 3 and 20 characters' });
            }
            if (!/^[a-zA-Z0-9 _-]+$/.test(customerName)) {
                return res.status(400).json({ error: 'Customer name can only contain letters, numbers, underscores, or hyphens' });
            }
        }

        if (typeof email !== 'undefined' && email !== null) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            if (email.length > 255) {
                return res.status(400).json({ error: 'Email must be less than 255 characters' });
            }
        }

        if (contactNumber) {
            if (!/^\+?[1-9]\d{9,14}$/.test(contactNumber)) {
                return res.status(400).json({ error: 'Invalid contact number format (e.g., +919876543210 or 9876543210)' });
            }
        }

        const updatedCustomer = await updateCustomer(id, {
            customerName,
            email,
            address,
            contactNumber,
        });

        res.status(200).json({
            message: 'Customer updated successfully',
            data: {
                customerId: updatedCustomer.customerId,
                customerName: updatedCustomer.customerName,
                email: updatedCustomer.email,
                address: updatedCustomer.address,
                contactNumber: updatedCustomer.contactNumber,
            },
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteCustomerHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteCustomer(id);
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};