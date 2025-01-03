// routes/serviceRoutes.js
const express = require('express');
const Service = require('../models/Service');
const router = express.Router();

// Create a new service
router.post('/services', async (req, res) => {
  const { name, websiteId } = req.body;
  const service = new Service({ name, websiteId });
  await service.save();
  res.status(201).json(service);
});

// Get services by website ID
router.get('/services/:websiteId', async (req, res) => {
  const { websiteId } = req.params;
  const services = await Service.find({ websiteId });
  res.json(services);
});

router.get('/services', async (req, res) => {
  const services = await Service.find();
  res.status(200).json(services);
});
module.exports = router;