export const validateCategory = (req, res, next) => {
    const { categoryName } = req.body;

    if(!categoryName?.trim()){
        return res.status(400).json({message: 'Category name is required.'});
    }
    next();
}