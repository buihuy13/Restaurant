require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/database");

const app = express();
const PORT = process.env.PORT || 8082;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "order-service",
    timestamp: new Date().toISOString(),
  });
});

// Routes
// Error handler
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Initialize connections and start server
const startServer = async () => {
  try {
    await connectDB();
    // Start server
    app.listen(PORT, () => {
      console.log(`Order Service running on port ${PORT}`);
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();
