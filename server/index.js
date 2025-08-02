const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const { connectDatabase } = require("./config/database.js")
const { clerkMiddleware } = require("@clerk/express");
// load environment variables
dotenv.config({ path: "./config/config.env"});

// import routes
const feedsRoutes = require("./routes/feedsRoutes.js");
const userRoutes = require("./routes/userRoute.js");

// connect database.
connectDatabase();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

// Clerk middleware with options
const clerkMiddlewareOptions = {
    authorizedParties: [process.env.CLIENT_URL || "http://localhost:5173"],
    signInUrl: `${process.env.CLIENT_URL || "http://localhost:5173"}/sign-in`,
    signUpUrl: `${process.env.CLIENT_URL || "http://localhost:5173"}/sign-up`,
    publishableKey: process.env.CLERK_PUBLIC_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
    debug: true
}
app.use(clerkMiddleware(clerkMiddlewareOptions));

 // Health check route
app.get('/api/health', async(req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is live."
    })
});

app.use("/api/feeds", feedsRoutes);
app.use("/api/user", userRoutes);

const port = process.env.PORT || 6969;
app.listen(port, () => console.log(`Backend server is running at port ${port}`));