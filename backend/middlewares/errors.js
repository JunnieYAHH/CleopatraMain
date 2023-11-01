const ErrorHandler = require('../utils/errorHandler');


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    // err.message = err.message || 'Internal Server Error';

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = { ...err }
        
        error.message = err.message;

        //Wrong mongoose Object ID ERROR
        if (err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }
        
        //Handling Mongoose Data Validation Error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message)
            error = new ErrorHandler(message, 400)
        }

        //Handling the Mongoose duplicate key error
        if(err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message, 400)
        }

        //Handling the JWT error
        if (err.name === 'JsonWebTokenError') {
            const message = 'JSON web token is invalid. Try again'
            error = new ErrorHandler(message, 400)
        }

        //Handling Expire JWT error
        if (err.name === 'TokenExpiredError') {
            const message = 'JSON web token is expired. Try again'
            error = new ErrorHandler(message, 400)
        }

        res.status(err.statusCode).json({
            success: false,
            error: error.message || 'Internal Server Error'
        })
    }
}