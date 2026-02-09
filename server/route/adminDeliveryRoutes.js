const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
    addDeliveryPartner,
    getAllPartners,
    updatePartnerStatus,
    getSettings,
    updateSettings
} = require("../controller/adminDeliveryController");

// Partners
router.post("/partners", adminAuth, addDeliveryPartner);
router.get("/partners", adminAuth, getAllPartners);
router.patch("/partners/:id", adminAuth, updatePartnerStatus);

// Global Settings (Delivery Charge)
router.get("/settings", adminAuth, getSettings);
router.put("/settings", adminAuth, updateSettings);

module.exports = router;
