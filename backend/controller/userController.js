const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel')
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');


//Register a user=>/api/v1/register


exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'this is a sample id',
            url: 'profilepicUrl'
        }
    })
    sendToken(user, 201, res)
}
)

//Login user=>/api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    //check if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400))
    }
    //finding user in database
    const user = await User.findOne({ email }).select('+password')//+password is used to select password from database because we have set select:false in userModel.js
    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }
    //check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }
    sendToken(user, 200, res)
}
)


//Logout user=>/api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
}
)



//forgot password=>/api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }
    //get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false })
    //create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`
    try {
        await sendEmail({
            email: user.email,
            subject: `Eccomerce_site Password Recovery`,
            message
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })
    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error.message, 500))
    }
}
)

//reset password=>/api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    //creating hash url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }
    //setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save()
    sendToken(user, 200, res)
}
)

//get currently logged in user details=>/api/v1/me
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id)//req.user.id is coming from protect middleware in auth.js


    res.status(200).json({
        success: true,
        user
    })
}
)

//update password=>/api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')//+ password is used to select password from database because we have set select:false in userModel.js 
    //check previous user password
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Old password is incorrect', 400))
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    //setup new password
    user.password = req.body.newPassword; //user.password is coming from userModel.js
    await user.save()
    sendToken(user, 200, res)
}
)

//update user profile=>/api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }
    //update avatar:todo --using cloudinary (later)

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true
    })
}
)

//get all users=>/api/v1/admin/users   (it is done by admin to get all users)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find()
    res.status(200).json({
        success: true,
        users
    })
}
)
//get user details=>/api/v1/admin/user/:id (it is done by admin to get details of a particular user)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`))
    }
    res.status(200).json({
        success: true,
        user
    })

}
)

// update user roles=>/api/v1/admin/user/:id  done by admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true
    })
}
)

//delete user=>/api/v1/admin/user/:id done by admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`))
    }
    //remove avatar from cloudinary:todo
    await user.deleteOne()
    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    })
}
)




