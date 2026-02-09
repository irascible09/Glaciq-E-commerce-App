const Settings = require('../model/Settings');

// Get Settings (Lazy init)
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne({ key: 'global_config' });
        if (!settings) {
            settings = await Settings.create({ key: 'global_config' });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch settings" });
    }
};

// Update Settings
exports.updateSettings = async (req, res) => {
    try {
        const { deliveryCharge, minFreeDeliveryAmount, bulkDiscounts } = req.body;

        const settings = await Settings.findOneAndUpdate(
            { key: 'global_config' },
            {
                deliveryCharge,
                minFreeDeliveryAmount,
                bulkDiscounts
            },
            { new: true, upsert: true }
        );

        res.json({ message: "Settings updated", settings });
    } catch (error) {
        res.status(500).json({ message: "Failed to update settings" });
    }
};
