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

//Get Single Product  => /api/v1/product/:id
exports.getSingleProduct = async (req,res,next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }

    res.status(200).json({
        success: true,
        product
    })
}