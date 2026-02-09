const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const {
    getAllOrders,
    updateOrderStatus,
    assignDeliveryPartner
} = require("../controller/adminOrderController");

router.get("/orders", adminAuth, getAllOrders);

router.patch(
    "/orders/:id/status",
    adminAuth,
    updateOrderStatus
);

router.patch(
    "/orders/:id/assign-partner",
    adminAuth,
    assignDeliveryPartner
);

module.exports = router;
