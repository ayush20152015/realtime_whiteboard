const express = require("express");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
require("dotenv").config();

const connectToDB = require("./config/db");
const Canvas = require("./models/canvasModel");
const userRoutes = require("./routes/userRoutes");
const canvasRoutes = require("./routes/canvasRoutes");

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000,http://localhost:5173").split(",").map((origin) => origin.trim()).filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/canvas", canvasRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", service: "realtime-whiteboard-api" });
});

connectToDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let canvasData = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinCanvas", async ({ canvasId }) => {
    console.log("Joining canvas:", canvasId);

    try {
      const authHeader = socket.handshake.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        setTimeout(() => {
          socket.emit("unauthorized", { message: "Access Denied: No Token" });
        }, 100);
        return;
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;

      const canvas = await Canvas.findById(canvasId);
      if (!canvas || (String(canvas.owner) !== String(userId) && !canvas.shared.includes(userId))) {
        setTimeout(() => {
          socket.emit("unauthorized", { message: "You are not authorized to join this canvas." });
        }, 100);
        return;
      }

      socket.join(canvasId);
      console.log(`User ${socket.id} joined canvas ${canvasId}`);

      socket.emit("loadCanvas", canvasData[canvasId] || canvas.elements);
    } catch (error) {
      console.error(error);
      socket.emit("error", { message: "An error occurred while joining the canvas." });
    }
  });

  socket.on("drawingUpdate", async ({ canvasId, elements }) => {
    try {
      canvasData[canvasId] = elements;
      socket.to(canvasId).emit("receiveDrawingUpdate", elements);

      const canvas = await Canvas.findById(canvasId);
      if (canvas) {
        await Canvas.findByIdAndUpdate(canvasId, { elements }, { new: true, useFindAndModify: false });
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

if (require.main === module) {
  const port = process.env.PORT || 5000;
  server.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = { app, server, io };