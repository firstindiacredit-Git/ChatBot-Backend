// routes/propertyRoutes.js
const express = require('express');
const Property = require('../models/Property');
const Service = require('../models/Service');
const upload = require('../middlewares/upload');
const router = express.Router();

// Get properties for specific admin
router.get('/properties', async (req, res) => {
    try {
        const { adminId } = req.query;
        const query = adminId ? { adminId } : {};
        const properties = await Property.find(query);
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get property by websiteId
router.get('/properties/website/:websiteId', async (req, res) => {
    try {
        const property = await Property.findOne({ websiteId: req.params.websiteId });
        
        if (!property) {
            return res.status(404).json({ 
                message: 'Property not found',
                websiteId: req.params.websiteId 
            });
        }
        
        res.json(property);
    } catch (err) {
        console.error('Error finding property:', err);
        res.status(500).json({ 
            message: err.message,
            websiteId: req.params.websiteId
        });
    }
});

// Create a new property
router.post('/properties', upload.single('logo'), async (req, res) => {
    const { name, websiteId, color, adminId } = req.body;
    const logo = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        // Check if websiteId already exists for this admin
        const existingProperty = await Property.findOne({ websiteId, adminId });
        if (existingProperty) {
            return res.status(400).json({ message: 'Website ID already exists for this admin' });
        }

        // Create the property
        const property = new Property({ 
            name, 
            websiteId, 
            logo, 
            color,
            adminId
        });
        await property.save();

        res.status(201).json(property);
    } catch (err) {
        console.error('Error creating property:', err);
        res.status(500).json({ message: err.message });
    }
});

// Update a property
router.put('/properties/:id', upload.single('logo'), async (req, res) => {
    try {
        const { name, websiteId, color } = req.body;
        const updates = { name, websiteId, color };
        
        if (req.file) {
            updates.logo = `/uploads/${req.file.filename}`;
        }

        const property = await Property.findOneAndUpdate(
            { _id: req.params.id, adminId: req.body.adminId },
            updates,
            { new: true }
        );

        if (!property) {
            return res.status(404).json({ message: 'Property not found or unauthorized' });
        }

        res.json(property);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a property
router.delete('/properties/:id', async (req, res) => {
    try {
        const property = await Property.findOneAndDelete({ 
            _id: req.params.id,
            adminId: req.query.adminId
        });

        if (!property) {
            return res.status(404).json({ message: 'Property not found or unauthorized' });
        }

        res.json({ message: 'Property deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;