const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const { getInventoryLogs } = require("../controller/adminInventoryLogController");

router.get("/inventory-logs", adminAuth, getInventoryLogs);

module.exports = router;
