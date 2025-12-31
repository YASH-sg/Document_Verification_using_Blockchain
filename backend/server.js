const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); 
// IMPORT ROUTES
const uploadRoute = require("./routes/upload");
const authRoute = require("./routes/auth"); // <--- You were missing this!

const app = express();

app.use(cors());
app.use(express.json());


// USE ROUTES
app.use("/api", uploadRoute);
app.use("/api/auth", authRoute); // <--- You were missing this too!

// DATABASE CONNECTION
// Note: It is unsafe to share this link publicly because it has your password. 
// For now it is fine, but later use a .env file.
const dbURI = "mongodb+srv://YashGawandeDb:YashGawande@docverificationusingbc.3dkpd1k.mongodb.net/docverify?retryWrites=true&w=majority&appName=DocVerificationUsingBC";

mongoose.connect(dbURI)
  .then(() => {
    console.log("✅ Connected to MongoDB Cloud (Atlas)");
  })
  .catch((err) => {
    console.error("❌ Connection Error:", err.message);
  });

// START SERVER
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});