const Product = require('../models/products');


//Create New Product  => /api/v1/product/creata
exports.createProduct = async (req, res) => {
    const product = await Product.create(req.body);

    res.status(200).json({
        success: true,
        product
    })
};


exports.getProducts = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'This route will show all products in database.'
    })
}