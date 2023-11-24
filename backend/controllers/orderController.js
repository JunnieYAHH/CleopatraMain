const Order = require('../models/order');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');

//Create new order => /api/v1/order/new
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    })

    res.status(200).json({
        success: true,
        order
    })

})

//Get Single Order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return next(new ErrorHandler('Order not found in this id', 404));
    }

    res.status(200).json({
        success: true,
        order
    })
})


//Get login user order => /api/v1/order/me
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const order = await Order.find({ user: req.user.id })

    res.status(200).json({
        success: true,
        order
    })
})

//Get all orders - ADMIN => /api/v1/admin/orders
exports.allOrders = catchAsyncError(async (req, res, next) => {
    const order = await Order.find()

    let totalAmount = 0;
    order.forEach(order => {
        totalAmount += order.totalPrice
    })

    
    res.status(200).json({
        success: true,
        totalAmount,
        order
    })
})

//Update / Process Order - ADMIN => /api/v1/admin/order/:id
exports.processOrders = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    // const product = await Product.findById(id);


    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('The order has already been delivered', 400))
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })


    order.orderStatus = req.body.status,
        order.deliveredAt = Date.now()

    await order.save();

    res.status(200).json({
        success: true
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    // product.stock -= quantity;
    product.stock = product.stock - quantity;
    console.log(product.stock);
    await product.save({ validateBeforeSave: false })
}

//Delete Order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id)

    if (!order) {
        return next(new ErrorHandler('Order not found in this id', 404));
    }

    res.status(200).json({
        success: true,
        order
    })
})