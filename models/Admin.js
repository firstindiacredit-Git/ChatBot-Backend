const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, // Add email field
  password: { type: String, required: true },
  profileImage: { type: String, required: true },
});

module.exports = mongoose.model('Admin', adminSchema);
