import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
}));

const Menu = mongoose.model("Menu", new mongoose.Schema({
  day: String,
  breakfast: String,
  lunch: String,
  dinner: String
}));

const Trip = mongoose.model("Trip", new mongoose.Schema({
  user: String,
  destination: String,
  time: String,
  createdAt: { type: Date, default: Date.now }
}));

// Health
app.get("/health", (_, res) => res.json({ status: "ok" }));

// Auth
app.post("/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  res.json({ id: user._id });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, name: user.name });
});

// Mess Menu
app.post("/menu", async (req, res) => {
  const menu = await Menu.create(req.body);
  res.json(menu);
});

app.get("/menu/today", async (_, res) => {
  const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const menu = await Menu.findOne({ day });
  res.json(menu || {});
});

// AI Mail Summarizer
app.post("/ai/summarize", async (req, res) => {
  const r = await axios.post(process.env.AI_URL, { text: req.body.text });
  res.json(r.data);
});

// Cab Pool (Real-time)
io.on("connection", (socket) => {
  socket.on("newTrip", async (data) => {
    const trip = await Trip.create(data);
    io.emit("matchTrip", trip);
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log("Backend running")
);
