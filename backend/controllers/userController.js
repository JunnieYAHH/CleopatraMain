const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');

// Register A User => /api/v1/register

exports.registerUser = catchAsyncError(async (req, res, next) => {

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'Cleopatra/Puyos_l1gy1i',
            url: 'https://res.cloudinary.com/ds7jufrxl/image/upload/v1698723927/Cleopatra/Puyos_l1gy1i.jpg'
        }
    })

    const token = user.getJwtToken();

    res.status(201).json({
        status: 'success',
        token
    })

})

// Login User => /a[i/v1/login
exports.loginUser = catchAsyncError( async(req, res, next) => {
    const {email, password} = req.body;

    // Checks if email and password is entered by user
    if(!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // Finding user in databasa
    const user = await User.findOne({ email }).select('+password')

    if(!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    const token = user.getJwtToken();

    res.status(200).json({
        success: true,
        token
    })
})