const mongoose = require("mongoose");
const usermodel = require("../model/usermodel");
const { hashpassword } = require("../helper/authHelper");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URL;

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const email = "admin@glaciq.com";
        const password = "admin";

        const existing = await usermodel.findOne({ email });
        if (existing) {
            console.log("Admin user already exists in usermodel");
            existing.role = 'ADMIN'; // Ensure role is ADMIN
            await existing.save();
            console.log("Updated role to ADMIN");
        } else {
            const hashedPassword = await hashpassword(password);
            await usermodel.create({
                name: "Admin User",
                email,
                phone: "1234567890",
                password: hashedPassword,
                role: "ADMIN",
                address: "Admin HQ"
            });
            console.log("✅ Admin user created in usermodel");
        }

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
