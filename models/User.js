const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  services: { type: [String], required: false },
  websiteId: { type: String, required: true },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
