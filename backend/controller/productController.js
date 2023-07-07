
const Product = require('../models/productModels')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Create new product => /api/v1/product/new   -- Admin only
exports.createProduct = catchAsyncErrors(
    async (req, res, next) => {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            product
        })
    }
)


// Get all products => /api/v1/products  -- Public

exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const products = await Product.find();




    res.status(200).json({
        success: true,
        products

    })
}
)

//get single product  details=> /api/v1/product/:id   -- Public
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))

    }
    res.status(200).json({
        success: true,
        product
    })
}

)



// update product => /api/v1/product/:id   -- Admin only 

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {


    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))

    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false

    })  // new: true means that the updated product will be returned

    res.status(200).json({
        success: true,
        product
    })
}
)
//delete product => /api/v1/product/:id   -- Admin only
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))

    }

    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: "Product is deleted"
    })


}
)