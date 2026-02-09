const express = require("express");
const router = express.Router();

const adminAuth = require("../middleware/adminAuth");
const validateStockInput = require("../middleware/validateStockInput");

const {
    getInventory,
    addStock,
    reduceStock,
    updateProductDiscount,
    toggleProductStatus,
    updateProductPrice,
    createProduct,
    toggleBestSeller
} = require("../controller/adminController");

// View inventory
router.get(
    "/products",
    adminAuth,
    getInventory
);

// Add stock (bottles)
router.patch(
    "/products/:id/add-stock",
    adminAuth,
    validateStockInput,
    addStock
);

// Reduce stock (manual correction)
router.patch(
    "/products/:id/reduce-stock",
    adminAuth,
    validateStockInput,
    reduceStock
);

// Update Discount
router.patch(
    "/products/:id/discount",
    adminAuth,
    updateProductDiscount
);

// Update Price
router.patch(
    "/products/:id/price",
    adminAuth,
    updateProductPrice
);

// Toggle Status
router.patch(
    "/products/:id/status",
    adminAuth,
    toggleProductStatus
);

// Toggle Best Seller
router.patch(
    "/products/:id/best-seller",
    adminAuth,
    toggleBestSeller
);

// Create Product
router.post(
    "/products",
    adminAuth,
    createProduct
);

module.exports = router;
