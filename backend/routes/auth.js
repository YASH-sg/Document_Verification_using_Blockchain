const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// SECRET KEY for signing tokens
const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
router.post("/register", async (req, res) => {
  // 1. Destructure ALL possible fields from the request body
  const { 
    email, 
    password, 
    role, 
    fullName, 
    organizationName, 
    registrationId, 
    website, 
    companyName 
  } = req.body;

  try {
    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new user with ALL fields
    // Note: Mongoose will automatically ignore fields that are undefined/null if they aren't required
    const newUser = new User({ 
      email, 
      password: hashedPassword, 
      role,
      fullName,
      organizationName,
      registrationId,
      website,
      companyName
    });
    
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error); // Added logging for debugging
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // 3. Generate Token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    // 4. Send Response
    // We now include fullName and specific ID fields so the frontend can use them
    res.json({ 
      token, 
      role: user.role, 
      fullName: user.fullName, // <--- Sending this to frontend for "Welcome, [Name]"
      organizationName: user.organizationName || "",
      companyName: user.companyName || "",
      message: "Login successful" 
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;