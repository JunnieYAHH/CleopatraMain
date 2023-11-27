const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

// Register A User => /api/v1/register

exports.registerUser = catchAsyncError(async (req, res, next) => {

    const result = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: 'Cleopatra/avatars',
        width: 150,
        crop: 'scale',
    })

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    sendToken(user, 200, res)

})

// Login User => /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // Finding user in databasa
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res)
})

//Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    //Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false })

    //Create Reset Password URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your passsword reset token is:\n\n${resetUrl}\n\nIf not requested this email, then ignore.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'User Password Recovery',
            message
        })
        res.status(200).json({
            success: true,
            message: `Email sent:${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error.message, 500))
    }

})


//Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {

    //Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has expired', 400)
        )
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup new Password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)
})

//Get detail of current user => /api/v1/me
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

//Update Current User Password = /api/v1/password/update
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    //Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return next(new ErrorHandler('Old password is incorrect', 400))
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res)
})

//Update Current User Profile => /api/v1/me/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    //Update avatar: TODO

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    // res.status(200).json({
    //     success: true
    // })

    sendToken(user, 200, res)

})


// Logout User => /api/v1/Logout
exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged Out'
    })
})

// Admin routes

// Get all  users => /api/v1/admin/user
exports.allUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

// Get user details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
         return next(new ErrorHandler('User does not found with id:${req.params.id}'))
    }

    res.status(200).json({
        sucess: true,
        user: user
    })
})

//Update Current User Profile => /api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        };

        // Check if a file is provided
        if (req.files && req.files.length > 0) {
            const result = await cloudinary.v2.uploader.upload(req.files[0].data, {
                folder: 'users',
                width: 150, // adjust width as needed
                crop: 'scale',
            });
            newUserData.image = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }

        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});


// Delete user  => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const deletedUser = await User.deleteOne({ _id: req.params.id });

    if (deletedUser.deletedCount === 0) {
        return next(new ErrorHandler('User does not found with id: ${req.params.id}'))
    };

    res.status(200).json({
        success: true,
    });
});