
const Product = require('../models/productModels')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures')

// Create new product => /api/v1/product/new   -- Admin only
exports.createProduct = catchAsyncErrors(
    async (req, res, next) => {
        req.body.user = req.user.id;
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            product
        })
    }
)


// Get all products => /api/v1/products  -- Public

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter().pagination(resultPerPage);


    const products = await apiFeature.query;




    res.status(200).json({
        success: true,
        products,
        productsCount

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
        product,

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

//create new review or update the review => /api/v1/review   -- Admin only
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )
    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach(review => {
        avg += review.rating;
    })
    product.ratings = avg / product.reviews.length;


    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true
    })
})

// get all reviews of a product => /api/v1/reviews   -- Public
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);// query is given in url

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }


    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
}
)
// delete review of a product => /api/v1/reviews   -- Admin only
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString()); // filter out the review that is to be deleted
    const numOfReviews = reviews.length;
    let avg = 0;
    reviews.forEach(review => {
        avg += review.rating;
    }
    )
    const ratings = avg / reviews.length;
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true
    })
}
)


