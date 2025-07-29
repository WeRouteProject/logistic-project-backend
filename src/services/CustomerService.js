import Customer from '../models/Customer.js';

export const createCustomer = async (customerData) => {
    const { customerName, email, address, contactNumber, wallet, remainingCredit, discount } = customerData;

    if (!customerName) {
        throw new Error('Customer name is required');
    }
    if (customerName.length < 3 || customerName.length > 20) {
        throw new Error('Customer name must be between 3 and 20 characters');
    }
    if (!/^[a-zA-Z0-9 _-]+$/.test(customerName)) {
        throw new Error('Customer name can only contain letters, numbers, underscores, or hyphens');
    }

    if (email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }
        if (email.length > 255) {
            throw new Error('Email must be less than 255 characters');
        }
    }

    if (!address) {
        throw new Error('Address is required');
    }

    if (!contactNumber) {
        throw new Error('Contact number is required');
    }
    if (!/^\+?[1-9]\d{9,14}$/.test(contactNumber)) {
        throw new Error('Invalid contact number format (e.g., +919876543210 or 9876543210)');
    }

    let normalizedContactNumber = contactNumber;
    if (contactNumber && !contactNumber.startsWith('+')) {
        normalizedContactNumber = `+91${contactNumber}`; // Default to India (+91)
    }

    const customer = await Customer.create({
        customerName,
        email,
        address,
        contactNumber: normalizedContactNumber,
        wallet,
        remainingCredit,
        discount
    });

    return customer;
};

export const getAllCustomers = async () => {
    return await Customer.findAll();
};

export const getCustomerById = async (customerId) => {
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
        throw new Error('Customer not found');
    }
    return customer;
};

export const updateCustomer = async (customerId, updateData) => {
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
        throw new Error('Customer not found');
    }

    let normalizedContactNumber = updateData.contactNumber;
    if (normalizedContactNumber && !normalizedContactNumber.startsWith('+')) {
        normalizedContactNumber = `+91${normalizedContactNumber}`;
    }

    await customer.update({
        customerName: updateData.customerName ?? customer.customerName,
        email: updateData.email ?? customer.email,
        address: updateData.address ?? customer.address,
        contactNumber: normalizedContactNumber ?? customer.contactNumber,
        wallet: updateData.wallet ?? customer.wallet,
        remainingCredit: updateData.remainingCredit ?? customer.remainingCredit,
        discount: updateData.discount ?? customer.discount
    });

    return customer;
};

export const deleteCustomer = async (customerId) => {
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
        throw new Error('Customer not found');
    }

    await customer.destroy();
    return { message: 'Customer deleted successfully' };
};