const Product = require('../models/products');


//Create New Product  => /api/v1/product/create
exports.createProduct = async (req, res) => {
    const product = await Product.create(req.body);

    res.status(200).json({
        success: true,
        product
    })
};

//Create New Product  => /api/v1/product/
exports.getProducts = async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        count: products.length,
        products
    })
}