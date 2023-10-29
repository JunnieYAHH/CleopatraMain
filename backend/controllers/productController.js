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
<<<<<<< HEAD
exports.getSingleProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
=======
exports.getSingleProduct = async (req,res,next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
>>>>>>> ba2e36c5d6bfefa099b57e65c14f601f4d942dce
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }

    res.status(200).json({
        success: true,
        product
    })
<<<<<<< HEAD
}

//Update Product => /api/v1/product/:id
exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })

=======
>>>>>>> ba2e36c5d6bfefa099b57e65c14f601f4d942dce
}