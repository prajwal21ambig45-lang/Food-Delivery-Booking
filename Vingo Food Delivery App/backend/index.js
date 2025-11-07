import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js";
import shopRouter from "./routes/shop.routes.js";
import orderRouter from "./routes/order.routes.js";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Allow both local and deployed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL || "https://your-frontend.onrender.com",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

// ✅ Add this simple route so Render doesn’t show “Cannot GET /”
app.get("/", (req, res) => {
  res.send("🍔 Vingo Food Delivery Backend is running successfully!");
});

// Socket.io setup
socketHandler(io);

// Database + Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  await connectDb();
  console.log(`✅ Server started at port ${PORT}`);
});
