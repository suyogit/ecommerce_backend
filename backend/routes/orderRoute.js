const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();
const { newOrder } = require("../controller/orderController");


router.route("/order/new").post(isAuthenticatedUser, newOrder);


module.exports = router


