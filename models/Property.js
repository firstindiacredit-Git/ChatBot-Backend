// models/Property.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  websiteId: { type: String, required: true },
});

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;