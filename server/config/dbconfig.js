const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongodb connected ${mongoose.connection.host}`.bgCyan.white)

    } catch (error) {
        console.log(`error in connection ${error}`.bgCyan.red)
    }
};

module.exports = connectDB;

