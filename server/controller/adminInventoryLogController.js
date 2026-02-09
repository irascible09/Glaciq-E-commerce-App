const InventoryLog = require("../model/InventoryLog");

exports.getInventoryLogs = async (req, res) => {
    const logs = await InventoryLog.find()
        .populate("product", "name size")
        .populate("admin", "name email")
        .sort({ createdAt: -1 })
        .limit(200);

    res.json(logs);
};
