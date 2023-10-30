const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncError');;

//Create New Product  => /api/v1/product/create
exports.createProduct = catchAsyncErrors (async (req, res) => {
    const product = await Product.create(req.body);

    res.status(200).json({
        success: true,
        product
    })
})

//Create New Product  => /api/v1/product/
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        count: products.length,
        products
    })
})

//Get Single Product  => /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        product
    })
})



//Update Product => /api/v1/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
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
})

//Delete Product =>  /api/v1/admin/product/id

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product =  await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }    
    res.status(200).json({
        success: true,
        message: 'Product is Deleted.'
    })

})