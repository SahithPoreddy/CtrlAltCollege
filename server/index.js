const express = require("express");
const dotenv = require("dotenv");
const app = express();
const { connectDatabase } = require("./config/database.js")

// load environment variables
dotenv.config({ path: "./config/config.env"});

// connect database.
connectDatabase();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is live."
    })
});

const port = process.env.PORT || 6969;
app.listen(port, () => console.log(`Backend server is running at port ${port}`));