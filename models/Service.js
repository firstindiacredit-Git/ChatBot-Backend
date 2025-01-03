// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  websiteId: { type: String, required: true }, // ID of the website this service is associated with
  // Add other fields as necessary
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;