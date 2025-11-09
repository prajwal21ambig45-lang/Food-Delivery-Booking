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

// ALL FRONTEND URLs — INCLUDING YOUR CURRENT RENDER ONE
const allowedOrigins = [
  "https://vingo-food-track.onrender.com",     // ← THIS IS YOUR CURRENT FRONTEND
  "https://vingo-sandy.vercel.app",            // Vercel
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL?.trim(),
].filter(Boolean);

// SOCKET.IO CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

// EXPRESS CORS — NOW WITH CALLBACK (WORKS 100%)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("CORS BLOCKED ORIGIN:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("VINGO BACKEND LIVE — CORS FIXED FOR vingo-food-track.onrender.com");
});

socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  await connectDb();
  console.log(`Server running on https://food-delivery-booking.onrender.com:${PORT}`);
  console.log("Allowed origins:", allowedOrigins);
});
