const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User"); // Your User schema
const uploadRoutes = require("./routes/upload.js"); // Your /upload route
const followRoutes = require('./routes/follow');
const blogRoutes = require('./routes/blog.js'); // Import blog routes

const closetRoutes = require('./routes/closet');






dotenv.config();

console.log("Cloudinary cloud name:", process.env.CLOUDINARY_CLOUD_NAME);

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', followRoutes);
// Register API routes
app.use("/api", uploadRoutes); // e.g., POST /api/upload
app.use('/api/blogs', blogRoutes);
app.use('/api/closet', closetRoutes);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start backend server on port 5000
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

//
// AUTH ROUTES
//

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const user = new User({ username, email, password });
    await user.save();
    res.json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ error: "Signup error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });
    res.json({ token, user }); // Include user so you can grab _id on frontend
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
});
