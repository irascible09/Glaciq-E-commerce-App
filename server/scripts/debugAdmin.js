const mongoose = require("mongoose");
const Admin = require("../model/Admin");
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URL;

(async () => {
    await mongoose.connect(MONGO_URI);

    // Find the admin
    const admin = await Admin.findOne({ email: "admin1mail" }).select("+password");

    if (!admin) {
        console.log("❌ Admin not found!");
        process.exit();
    }

    console.log("Admin found:", admin.email);
    console.log("Password stored:", admin.password);
    console.log("Password is hashed (starts with $2):", admin.password?.startsWith("$2"));

    // Test password match
    const testPassword = "Admin1password";
    const isMatch = await admin.matchPassword(testPassword);
    console.log(`Password "${testPassword}" matches:`, isMatch);

    process.exit();
})();
