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


// get all orders => /api/v1/admin/orders  //this route is only accessible by the admin
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
}
)

// update order status => /api/v1/admin/order/:id  //this route is only accessible by the admin //this route is used to update the order status of the order that is placed by the user 
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler('No Order found with this ID', 404))
    }

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('You have already delivered this order', 400))
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })
    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {

        order.deliveredAt = Date.now()
    }

    await order.save({ validateBeforeSave: false })
    res.status(200).json({
        success: true,
    })
}
)
// this function is used to update the stock of the product after the order is placed  
async function updateStock(id, quantity) {
    const product = await Product.findById(id)
    product.Stock = product.Stock - quantity
    await product.save({ validateBeforeSave: false })
}



// delete order => /api/v1/admin/order/:id  //this route is only accessible by the admin    
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        return next(new ErrorHandler('No Order found with this ID', 404))
    }
    await order.deleteOne()
    res.status(200).json({
        success: true,
    })
}
)


