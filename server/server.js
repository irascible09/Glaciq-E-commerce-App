// importing packages 

const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const morgan = require('morgan')
const colors = require('colors')
const bcrypt = require('bcrypt')
const cors = require('cors')

const cron = require('node-cron')
const runSubscriptionOrders = require('./cron/subscriptionCron')

// Runs every day at 5 AM
cron.schedule('0 5 * * *', () => {
    runSubscriptionOrders()
})

// configure dotenv - 
dotenv.config();

// conbect to mongodb
const connectDB = require('./config/dbconfig')
connectDB()

// initialize express app
const app = express();

// middlewares - 
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(require('helmet')());

const limiter = require('express-rate-limit')({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);


// port -
const port = process.env.PORT || 8080;

// routes - 
app.use('/api/v1/auth/', require("./route/userRoutes")); // contains routes for login and register api 

// ADMIN AUTH ROUTES (Mount this first!)
const adminAuthRoutes = require("./route/adminAuthRoutes");
app.use("/api/v1/admin", adminAuthRoutes);

// ADMIN API ROUTES
app.use('/api/v1/admin', require('./route/adminRoutes')) // admin api

// app.use('/api/v1/posts/', require("./route/postRoutes")); // contains routes for post apis
app.use('/api/v1/business', require("./route/businessRoutes"));
app.use('/api/v1/address', require("./route/addressRoutes"));
app.use('/api/v1/order', require("./route/orderRoutes"));


const paymentRoutes = require('./route/paymentRoutes')
app.use('/api/v1/payment', paymentRoutes)


app.use('/api/v1/subscription', require('./route/subscriptionRoutes'))

//admin product routes
const adminProductRoutes = require("./route/adminProductRoutes");
app.use("/api/v1/admin", adminProductRoutes);
// app.use(require("./middleware/errorHandler"));

app.use("/api/v1/admin", require("./route/adminInventoryLogRoutes"));
app.use("/api/v1/admin/settings", require("./route/adminSettingsRoutes"));

const adminOrderRoutes = require("./route/adminOrderRoutes");
app.use("/api/v1/admin", adminOrderRoutes);
app.use("/api/v1/admin", require("./route/adminDeliveryRoutes"));

// listen - 
app.listen(port, '0.0.0.0', () => {
    console.log(`server running at port ${port} on 0.0.0.0`.bgGreen.black)
});
