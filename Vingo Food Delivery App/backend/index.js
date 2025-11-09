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

dotenv.config();

const app = express();
const server = http.createServer(app);

// ALL POSSIBLE FRONTEND DOMAINS (Render + Vercel + Local)
const allowedOrigins = [
  "https://vingo-food-track.onrender.com",     // Your current Render frontend
  "https://vingo-sandy.vercel.app",            // Your Vercel frontend
  "https://food-delivery-booking.onrender.com", // If you ever open backend directly
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL?.trim(),            // From .env (optional)
].filter(Boolean); // removes empty strings

// SOCKET.IO CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

// EXPRESS CORS (same origins)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin); // Debug log
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

// Health check
app.get("/", (req, res) => {
  res.send("Vingo Food Delivery Backend is LIVE! CORS fixed!");
});

// Socket handler
socketHandler(io);

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  await connectDb();
  console.log(`Server running on port ${PORT}`);
  console.log("Allowed origins:", allowedOrigins.join(" | "));
});
