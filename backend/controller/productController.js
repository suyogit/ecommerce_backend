
const Product = require('../models/productModels')


// Create new product => /api/v1/product/new   -- Admin only
exports.createProduct = async (req, res, next) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
}


// Get all products => /api/v1/products  -- Public

exports.getAllProducts = async (req, res) => {
    const products = await Product.find();




    res.status(200).json({
        success: true,
        products

    })
}


// update product => /api/v1/product/:id   -- Admin only 

exports.updateProduct = async (req, res, next) => {


    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
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

//delete product => /api/v1/product/:id   -- Admin only
exports.deleteProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }
    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: "Product is deleted"
    })


}
