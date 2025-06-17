const express = require("express");
const { verifyToken } = require("./Utils/Jwt");
const cors = require("cors");
const connectDB = require("./config/db");
const morgan = require("morgan");
const app = express();
const Error = require("./middleware/ErrorHandler");
const path = require("path");

//Routers
const ProductRoutes = require("./Routes/ProductsRoutes");
const CategoryRoutes = require("./Routes/CategoryRoutes");
const AdminAuthRoutes = require("./Routes/AdminAuthRoutes");
const OrderRoutes = require("./Routes/OrderRoutes");
const SettingsRoutes = require("./Routes/SettingsRoutes");
const { connectToRedis } = require("./config/RedisDb");

// start server
const startServer = async () => {
  // connect to db
  await connectDB();
  // connect to redis
  await connectToRedis();

  // middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(morgan("dev"));
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  // Routes

  app.use("/api", ProductRoutes);
  app.use("/api", CategoryRoutes);
  app.use("/api", OrderRoutes);
  // app.use("/api", SettingsRoutes);
  app.use("/api/AdminAuth", AdminAuthRoutes);
  app.use("/api", SettingsRoutes);
  // Protected Route
  // Error Handler
  app.use(Error);
};

// start server
startServer();
// export app
module.exports = app;
