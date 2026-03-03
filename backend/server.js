const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const propertyRoutes = require("./routes/propertyRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const swaggerDocs = require("./swagger"); // make sure the path is correct

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// Routes
app.use("/api/properties", propertyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// Swagger
swaggerDocs(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});