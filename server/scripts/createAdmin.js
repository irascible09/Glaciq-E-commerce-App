const mongoose = require("mongoose");
const Admin = require("../model/Admin");
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URL;

(async () => {
    await mongoose.connect(MONGO_URI);

    await Admin.create({
        name: "admin",
        email: "admin",
        password: "adminpass",
    });

    console.log("✅ Admin created");
    process.exit();
})();
