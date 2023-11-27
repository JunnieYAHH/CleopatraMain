const Category = require('../models/category');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')


//Create Category => /api/v1/category/create
exports.createCategory = catchAsyncErrors(async (req, res) => {
    const { name, description, images, parentCategory } = req.body;

    try {
        const imagesData = await Promise.all(images.map(async (imageDataUri) => {
            const result = await cloudinary.v2.uploader.upload(imageDataUri, {
                folder: 'categories',
                width: 150,
                crop: "scale",
            });

            return {
                public_id: result.public_id,
                url: result.secure_url
            };
        }));

        const categoryData = {
            name,
            description,
            images: imagesData,  // Now, images is an array
            parentCategory,
        };

        const category = await Category.create(categoryData);

        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error creating category'
        });
    }
});

//Get all Products (Admin) => /api/v1/admin/products
exports.getAdminCategory = catchAsyncErrors(async (req, res, next) => {

    const category = await Category.find();

    setTimeout(() => {
        res.status(200).json({
            success: true,
            category
        });
    });
});

exports.getSingleCategory = catchAsyncErrors(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new ErrorHandler('Category not found', 404));
    }


    res.status(200).json({
        success: true,
        category
    })
})

exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
    try {
        let category = await Category.findById(req.params.id);
        // console.log(category)
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        let images = req.body.images || [];

        for (let i = 0; i < category.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(category.images[i].public_id);
        }

        let imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'categories',
                width: 150,
                crop: "scale",
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }

        category.name = req.body.name;
        category.description = req.body.description;

        if (imagesLinks.length > 0) {
            category.images = imagesLinks;
        }

        category = await Category.findByIdAndUpdate(req.params.id, category, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        return res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});
