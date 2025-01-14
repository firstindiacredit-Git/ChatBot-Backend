// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: { type: String, required: true, unique: true },
//   services: { type: [String], required: false },
//   websiteId: { type: String, required: true },
//   location: {
//     latitude: { type: Number },
//     longitude: { type: Number },
//   },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("User", userSchema);



// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: { type: String, required: true, unique: true },
//   services: { type: [String], required: false },
//   websiteId: { type: String, required: true },
//   location: {
//     ip: { type: String },
//     network: { type: String },
//     version: { type: String },
//     city: { type: String },
//     region: { type: String },
//     region_code: { type: String },
//     country: { type: String },
//     country_name: { type: String },
//     country_code: { type: String },
//     country_code_iso3: { type: String },
//     country_capital: { type: String },
//     country_tld: { type: String },
//     continent_code: { type: String },
//     in_eu: { type: Boolean },
//     postal: { type: String },
//     latitude: { type: Number },
//     longitude: { type: Number },
//     timezone: { type: String },
//     utc_offset: { type: String },
//     country_calling_code: { type: String },
//     currency: { type: String },
//     currency_name: { type: String },
//     languages: { type: String },
//     country_area: { type: Number },
//     country_population: { type: Number },
//     asn: { type: String },
//     org: { type: String },
//     os: { type: String },
//     browser: { type: String },
//   },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  services: { type: [String], required: false },
  websiteId: { type: String, required: true },
  location: {
    status: { type: String },
    country: { type: String },
    countryCode: { type: String },
    region: { type: String },
    regionName: { type: String },
    city: { type: String },
    zip: { type: String },
    lat: { type: Number },
    lon: { type: Number },
    timezone: { type: String },
    isp: { type: String },
    org: { type: String },
    as: { type: String },
    query: { type: String }, // IP address
    os: { type: String },
    browser: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
