const mongoose = require('mongoose');

exports.connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connection to MongoDB established successfully');
    } catch (error) {
        console.error('MongoDB connection Error: ', error);
        process.exit(1);
    }
};