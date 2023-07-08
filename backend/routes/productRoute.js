const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controller/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();



router.route("/products").get(getAllProducts);
router.route("/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router
    .route("/product/:id")
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
    .get(getProductDetails)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);


module.exports = router