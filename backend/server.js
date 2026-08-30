import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { initSocket } from "./socket.js";
import { connectRedis } from "./config/redis.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// Create HTTP server
const httpServer = createServer(app);

initSocket(httpServer);

// Create Socket.IO server


// middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();
connectRedis();


// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);


// Socket.IO connection


app.get("/", (req, res) => {
    res.send("API WORKING");
});

// Start server
httpServer.listen(port, () => {
    console.log(`server started on http://localhost:${port}`);
});