const Order = require('../models/order');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const sendEmailAdmin = require('../utils/sendEmailAdmin');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
//const PDFDocument = require('pdfkit');



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

    const message = `
<html>
<head>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    h2 {
      color: #333333;
    }
    p {
      color: #555555;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>User Transaction Notification</h2>
    <p>Dear Admin,</p>
    <p>A new user transaction has been completed. Here are the details:</p>
    <ul>
      <li><strong>User Email:</strong> ${req.user.email} </li>
      <li><strong>Transaction ID:</strong> ${order._id} </li>
      <li><strong>Order Total:</strong> ${order.totalPrice} </li>
    </ul>
    <p>Please review this transaction and ensure that all processes are completed successfully.</p>
    <p>Thank you for your attention.</p>
    <p>Best regards,<br>Your E-commerce Team</p>
  </div>
</body>
</html>`;

    await sendEmailAdmin({
        email: `admin@cleopatra.com`,
        subject: 'User Order Transaction',
        message
    });

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

    if (order.orderStatus === 'Delivered') {
        return res.status(404).json({ message: `You have already delivered this order` })

    }

    if (order.orderStatus === 'Delivered'){
        sendEmailToCustomer(order)
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status
    order.deliveredAt = Date.now()
    await order.save()

    res.status(200).json({
        success: true,
    })
})

// Send Email customer
async function sendEmailToCustomer(order) {

    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: {
            user: '47a96f3576ec6e',
            pass: 'c3b43750d9bbaf',
        },
    });

    const pdfContent = await generateOrderPDF(order);

    const mailOptions = {
        from: 'maximumeffort2002@gmail.com',
        to: 'christian.paningbatan@tup.edu.ph',
        subject: 'Your Order has been Delivered',
        text: `Your order with ID ${order._id} has been delivered. Please prepare for the exact amount of ₱${order.totalPrice.toFixed(2)}. Enjoy!`,
        attachments: [
            {
                filename: 'receipt.pdf',
                content: pdfContent,
                encoding: 'base64',
            },
        ],
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email to customer:', error);
        } else {
            console.log('Email sent to customer:', info.response);
        }
    });
}

//generateOrder
async function generateOrderPDF(order) {
    return new Promise(async (resolve, reject) => {
        const doc = new PDFDocument();

        doc.fontSize(18).text('JSON Brews Order Receipt', { align: 'center' });
        doc.fontSize(12).text('1633, Taguig City, Metro Manila, Philippines', { align: 'center' });
        doc.moveDown();

        doc.fontSize(15).text('------------------------------------------------------------------', { align: 'center' });
        doc.fontSize(15).text('CASH RECEIPT', { align: 'center' });
        doc.fontSize(15).text('------------------------------------------------------------------', { align: 'center' });


        doc.fontSize(14).text('Ordered Products:', { align: 'center' });
        order.orderItems.forEach(item => {
            const productText = ` ${item.name} (₱${item.price.toFixed(2)} each) x ${item.quantity}`;
            doc.text(productText, { align: 'center' });
        });
        doc.moveDown();

        doc.fontSize(12).text(`Order ID:`, { align: 'left' });
        doc.text(`${order._id}`, { align: 'right' });

        doc.text(`Order Date:`, { align: 'left' });
        doc.text(`${order.createdAt}`, { align: 'right' });

        doc.text(`Delivery Date:`, { align: 'left' });
        doc.text(`${new Date(order.deliveredAt).toLocaleDateString()}`, { align: 'right' });

        doc.text(`Order Total:`, { align: 'left' });
        doc.text(`₱${order.totalPrice.toFixed(2)}`, { align: 'right' });

        doc.moveDown();

        doc.fontSize(15).text('----------------------------------------------------', { align: 'center' });
        doc.fontSize(14).text('Customer Information:', { align: 'center' });
        try {
            const user = await User.findById(order.user);
            if (user) {
                doc.fontSize(12).text(`Name:`, { align: 'left' });
                doc.text(`${user.name}`, { align: 'right' });

                doc.text(`Email:`, { align: 'left' });
                doc.text(`${user.email}`, { align: 'right' });
            } else {
                doc.text('Customer information not available');
            }
        } catch (error) {
            doc.text('Error fetching customer information');
        }

        const addressText = `Address: ${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.postalCode}, ${order.shippingInfo.country}`;
        doc.text(addressText, { align: 'center' });
        doc.fontSize(15).text('----------------------------------------------------', { align: 'center' });
        doc.moveDown();

        doc.fontSize(16).text('Thank you for choosing JSON Brews! Always at your service.', { align: 'center' });


        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer.toString('base64'));
        });

        doc.end();
    });
}

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

exports.monthlySales = catchAsyncError(async (req, res, next) => {
    const salesPerMonth = await Order.aggregate([

        {
            $group: {
                // _id: {month: { $month: "$paidAt" } },
                _id: {
                    year: { $year: "$paidAt" },
                    month: { $month: "$paidAt" }
                },
                total: { $sum: "$totalPrice" },
            },
        },

        {
            $addFields: {
                month: {
                    $let: {
                        vars: {
                            monthsInString: [, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', ' Sept', 'Oct', 'Nov', 'Dec']
                        },
                        in: {
                            $arrayElemAt: ['$$monthsInString', "$_id.month"]
                        }
                    }
                }
            }
        },
        { $sort: { "_id.month": 1 } },
        {
            $project: {
                _id: 0,
                month: 1,
                total: 1,
            }
        }

    ])
    if (!salesPerMonth) {
        return res.status(404).json({
            message: 'error sales per month',
        })
    }
    // return console.log(customerSales)
    res.status(200).json({
        success: true,
        salesPerMonth
    })
})

exports.getOrderSales = catchAsyncError(async (req, res, next) => {
    try {
        const salesPerMonth = await Order.aggregate([
            {
                $match: {
                    paidAt: { $ne: null } // Assuming you want to filter out orders without a paidAt date
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$paidAt" },
                        month: { $month: "$paidAt" }
                    },
                    total: { $sum: "$totalPrice" },
                },
            },
            {
                $addFields: {
                    month: {
                        $let: {
                            vars: {
                                monthsInString: [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
                            },
                            in: {
                                $arrayElemAt: ['$$monthsInString', "$_id.month"]
                            }
                        }
                    }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
                $project: {
                    _id: 0,
                    month: 1,
                    total: 1,
                }
            }
        ]);

        if (!salesPerMonth) {
            return res.status(404).json({
                message: 'Error fetching sales per month',
            });
        }

        res.status(200).json({
            success: true,
            salesPerMonth
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

//New chart

// exports.productOrderSales = catchAsyncErrors(async (req, res, next) => {
 
// });