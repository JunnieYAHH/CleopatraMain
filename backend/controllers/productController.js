const Product = require('../models/product');
const Order = require('../models/order');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')

//Create New Product  => /api/v1/product/create
exports.createProduct = catchAsyncErrors(async (req, res) => {
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        let imageDataUri = images[i]
        // console.log(imageDataUri)
        try {
            const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
                folder: 'products',
                width: 150,
                crop: "scale",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })

        } catch (error) {
            console.log(error)
        }

    }

    req.body.images = imagesLinks
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    console.log(product)

    res.status(200).json({
        success: true,
        product
    })
})

//Get all Products  => /api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
    //Toastify Sample
    // return next(new ErrorHandler('My Error', 400)); // This will stop the execution

    const resPerPage = 4;
    const productCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()

    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage)
    products = await apiFeatures.query.clone();

    setTimeout(() => {
        res.status(200).json({
            success: true,
            productCount,
            resPerPage,
            filteredProductsCount,
            products
        });
    });
});

//Get all Products (Admin) => /api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {

    const products = await Product.find();

    setTimeout(() => {
        res.status(200).json({
            success: true,
            products
        });
    });
});


exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    console.log(req.body)
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }
    let images = []

    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }
    if (images !== undefined) {
        // Deleting images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }
    }
    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })

    }
    req.body.images = imagesLinks
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindandModify: false
    })
    // console.log(product)
    return res.status(200).json({
        success: true,
        product
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

//Get Admin Single Product  => /api/v1/admin/product/:id
exports.getAdminSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }


    res.status(200).json({
        success: true,
        product
    })
})

//Delete Product =>  /api/v1/admin/product/id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    res.status(200).json({
        success: true,
        message: 'Product is Deleted.'
    })

})

// Create a new review => /api/v1/create/review
exports.createReviewProduct = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId, images } = req.body;
    // console.log(images);

    const parsedReviewImages = typeof images === 'string' ? [images] : images;

    const uploadedReviewImages = [];

    for (let i = 0; i < parsedReviewImages.length; i++) {
        const imageDataUri = parsedReviewImages[i];

        try {
            const result = await cloudinary.v2.uploader.upload(imageDataUri, {
                folder: 'reviews',
                width: 150,
                crop: 'scale',
            });

            uploadedReviewImages.push({
                reviewPublic_id: result.public_id,
                reviewUrl: result.secure_url,
            });
        } catch (error) {
            console.log(error);
        }
    }

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
        reviewImages: uploadedReviewImages,
    };

    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }

    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;

    product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    if (!product) {
        return res.status(400).json({
            success: false,
            message: 'Review not posted',
        });
    }

    return res.status(200).json({
        success: true,
    });
})

//Get Product Reviews => /api/v1/reviews/:id
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

exports.updateReviewProduct = catchAsyncErrors(async (req, res, next) => {
    // console.log(req.body)
    try {
        const product = await Product.findById(req.params.prod);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (req.body.images && req.body.images.length > 0) {
            for (let i = 0; i < product.reviews.length; i++) {
                const reviewImages = product.reviews[i].reviewImages;

                for (let j = 0; j < reviewImages.length; j++) {
                    const result = await cloudinary.v2.uploader.destroy(reviewImages[j].reviewPublic_id);
                }
            }
        }

        const imagesLinks = [];
        for (let i = 0; i < req.body.images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(req.body.images[i], {
                folder: 'reviews',
                width: 150,
            });
            imagesLinks.push({
                reviewPublic_id: result.public_id,
                reviewUrl: result.secure_url
            });
        }

        const updatedReview = {
            user: req.body.user,
            name: req.body.name,
            rating: req.body.rating,
            comment: req.body.comment,
            reviewImages: imagesLinks
        };

        // console.log(updatedReview)

        const reviewIndex = product.reviews.findIndex(review => review._id.toString() === req.params.reviewedId);

        console.log(reviewIndex)


        // Update the review in the product
        product.reviews[reviewIndex] = updatedReview;

        // Save the product with updated review
        await product.save();

        return res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            product
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
})

//Delete Product Review => /api/v1/reviews/:id
exports.deleteProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

exports.productSales = catchAsyncErrors( async (req, res, next) => {
    const totalSales = await Order.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$itemsPrice" }

            },

        },
    ])
    // console.log(totalSales)
    // const sales = await Order.aggregate([
    //     {
    //         $group: {
    //             _id: { product: "$orderItems.name" },
    //             total: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
    //         },
    //     },
    // ])
    const sales = await Order.aggregate([
        { $project: { _id: 0, "orderItems": 1, totalPrice: 1 } },
        { $unwind: "$orderItems" },
        {
            $group: {
                _id: { product: "$orderItems.name" },
                total: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
            },
        },
    ])
    // console.log("sales", sales)

    if (!totalSales) {
        return res.status(404).json({
            message: 'error sales'
        })

    }
    if (!sales) {
        return res.status(404).json({
            message: 'error sales'
        })

    }

    let totalPercentage = {}
    totalPercentage = sales.map(item => {
        percent = Number(((item.total / totalSales[0].total) * 100).toFixed(2))
        total = {
            name: item._id.product,
            percent
        }
        return total
    })

    res.status(200).json({
        success: true,
        totalPercentage,
        sales,
        totalSales
    })

})