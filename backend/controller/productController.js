
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
