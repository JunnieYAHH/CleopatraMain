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
exports.getSingleOrrder = catchAsyncError(async (req, res, next) => {
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

//Get all orders => /api/v1/admin/orders
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