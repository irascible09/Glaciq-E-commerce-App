const DeliveryPartner = require("../model/DeliveryPartner");
const Settings = require("../model/Settings");

/* -------- DELIVERY PARTNER CRUD -------- */

// Add new delivery partner
const addDeliveryPartner = async (req, res) => {
    try {
        const { name, phone } = req.body;

        const existing = await DeliveryPartner.findOne({ phone });
        if (existing) {
            return res.status(400).json({ message: "Partner with this phone already exists" });
        }

        const partner = await DeliveryPartner.create({ name, phone });
        res.status(201).json({ message: "Delivery partner added", partner });
    } catch (error) {
        console.error("Add Partner Error:", error);
        res.status(500).json({ message: "Failed to add partner" });
    }
};

// Get all partners
const getAllPartners = async (req, res) => {
    try {
        const partners = await DeliveryPartner.find({}).sort({ createdAt: -1 });
        res.status(200).json(partners);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch partners" });
    }
};

// Update partner status
const updatePartnerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const partner = await DeliveryPartner.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!partner) return res.status(404).json({ message: "Partner not found" });

        res.status(200).json({ message: "Status updated", partner });
    } catch (error) {
        res.status(500).json({ message: "Failed to update status" });
    }
};

/* -------- SETTINGS (DELIVERY CHARGE) -------- */

// Get current settings
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne({ key: 'global_config' });

        if (!settings) {
            settings = await Settings.create({ key: 'global_config' });
        }

        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch settings" });
    }
};

// Update settings
const updateSettings = async (req, res) => {
    try {
        const { deliveryCharge, minFreeDeliveryAmount } = req.body;

        const settings = await Settings.findOneAndUpdate(
            { key: 'global_config' },
            { deliveryCharge, minFreeDeliveryAmount },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: "Settings updated", settings });
    } catch (error) {
        res.status(500).json({ message: "Failed to update settings" });
    }
};

module.exports = {
    addDeliveryPartner,
    getAllPartners,
    updatePartnerStatus,
    getSettings,
    updateSettings
};
