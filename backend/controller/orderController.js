const Order = require('../models/orderModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures')
const Product = require('../models/productModels')

// create a new order => /api/v1/order/new

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;
    const order = await Order.create({//destructuring is done to get the values from the req.body. re.body is the data that is sent from the frontend
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id //this is the logged in user
    })
    res.status(200).json({
        success: true,
        order
    })
}
)

// get  single order => /api/v1/order/:id   //:id is the id of the order that we want to get from the database    //this route is only accessible by the admin
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')//populate is used to get the user details from the user collection. the second parameter is used to specify the fields that we want to get from the user collection
    if (!order) {
        return next(new ErrorHandler('No Order found with this ID', 404))
    }
    res.status(200).json({
        success: true,
        order
    })
}
)

// get logged in user orders => /api/v1/orders/me

exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id })
    res.status(200).json({
        success: true,
        orders
    })
}
)

