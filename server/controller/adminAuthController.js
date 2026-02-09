const jwt = require("jsonwebtoken");
const Admin = require("../model/Admin");

const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// POST /api/admin/login
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, passwordProvided: !!password });

        // Find admin in Admin collection
        const admin = await Admin.findOne({ email }).select("+password"); // Need to explicitly select password if select: false in model

        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await admin.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: generateToken(admin._id),
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error during login" });
    }
};
