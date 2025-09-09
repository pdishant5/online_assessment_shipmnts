import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: "Too many requests, please try again later!"
});

// Security middlewares..
app.use(helmet());
app.use(hpp());
app.use("/api", limiter);

// Body-parser middlewares..
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Global error handler..
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Internal Server Error!",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
});

// CORS configuration..
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "device-remember-token",
        "Access-Control-Allow-Origin",
        "Origin",
        "Accept"
    ],
}));

// Importing routes..

// API routes..

// 404 Not Found handler..
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Page not found!"
    });
});

// Error handler..
app.use(errorHandler);

export { app };