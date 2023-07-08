const catchAsyncErrors = require('./catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return next(new ErrorHandler('Login first to access this resource.', 401))
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodedData.id)
    next()
})

//Handling user roles
exports.authorizeRoles = (...roles) => { //...roles means we can pass multiple roles
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {//req.user.role is coming from isAuthenticatedUser middleware
            return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403))
        }
        next()
    }
}


