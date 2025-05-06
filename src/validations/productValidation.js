export const validateProduct = (req, res, next) => {
    const { productName, price, categoryId } = req.body;
    if (!productName.trim()) {
        return res.status(400).json({ message: 'Product name is required' });
    }

    if (price == null || isNaN(price) || price < 0) {
        return res.status(400).json({ message: 'Please enter valid price: price cannot be zero/negative' });
    }

    if (!categoryId || isNaN(categoryId)) {
        return res.status(400).json({ message: 'Please categoryId is required' });
    }
    next();
};