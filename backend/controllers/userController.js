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