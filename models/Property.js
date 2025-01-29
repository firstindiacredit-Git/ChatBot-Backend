// models/Property.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  websiteId: { type: String, required: true },
  logo: { type: String, required: true },
  color: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
});

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;