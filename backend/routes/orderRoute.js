const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();
const { newOrder, getSingleOrder, myOrders } = require("../controller/orderController");


router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrders);



module.exports = router


