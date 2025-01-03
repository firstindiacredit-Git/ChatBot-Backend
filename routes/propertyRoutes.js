// routes/propertyRoutes.js
const express = require('express');
const Property = require('../models/Property'); // Assuming you have a Property model
const Service = require('../models/Service'); // Assuming you have a Service model
const router = express.Router();

// Create a new property with services
router.post('/properties', async (req, res) => {
  const { name, websiteId } = req.body;

  try {
    // Create the property
    const property = new Property({ name, websiteId });
    await property.save();

    // // Create services associated with the property
    // const servicePromises = services.map(serviceName => {
    //   const service = new Service({ name: serviceName, websiteId });
    //   return service.save();
    // });

    // await Promise.all(servicePromises);

    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/properties', async (req, res) => {
    try {
      const properties = await Property.find(); // Fetch all properties from the database
      res.status(200).json(properties); // Return the list of properties
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

module.exports = router;