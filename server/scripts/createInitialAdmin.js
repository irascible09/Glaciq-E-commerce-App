const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");
const Admin = require("../model/Admin");
const path = require("path");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Connected".green);

        // const adminCount = await Admin.countDocuments();
        // if (adminCount > 0) {
        //     console.log("Admins already exist. No need to seed.".yellow);
        //     process.exit();
        // }

        console.log("Creating initial admin...".cyan);

        const admin = await Admin.create({
            name: "Super Admin",
            email: "admin@glaciq.com",
            phone: "1234567890",
            password: "password123", // password will be hashed by the model if logic exists, OR stored raw if my controller logic was raw. 
            // Wait, let's check Admin.js again. 
            // Admin.js has pre-save hook to hash password.
            // So passing raw password here is correct.
        });

        console.log("Admin created successfully!".green);
        console.log(`Email: ${admin.email}`);
        console.log(`Password: password123`);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`.red);
        process.exit(1);
    }
};

seedAdmin();
