const User = require("../models/user");

const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncError");

// Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const authorizationHeader = req.header('Authorization');
    // console.log(authorizationHeader)

    if (!authorizationHeader) {
        return next(new ErrorHandler('Login first to access this resource', 401));
    }

    const token = authorizationHeader.split(' ')[1];
    // console.log('Token:',token)

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded Token:', decoded);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
        return next(new ErrorHandler('User not found', 404));
    }

    next();
});

// Handling users roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`,
                    403))
        }
        next()
    }
}