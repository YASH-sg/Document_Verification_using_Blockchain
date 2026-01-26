const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["issuer", "verifier"], default: "verifier" },
  
  // --- New Fields ---
  fullName: { type: String, required: true },
  
  // Fields specific to Issuers
  organizationName: { type: String },
  registrationId: { type: String },
  website: { type: String },
  
  // Fields specific to Verifiers
  companyName: { type: String }
});

module.exports = mongoose.model("User", UserSchema);