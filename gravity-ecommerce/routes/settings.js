const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { adminOnly } = require('../middleware/auth');

// Get all settings (for frontend dynamic content)
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find();
    
    // Transform array to key/value object
    const config = {};
    settings.forEach(s => {
      config[s.key] = s.value;
    });

    res.json(config);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching settings' });
  }
});

// Update setting
router.post('/', adminOnly, async (req, res) => {
  try {
    const { key, value } = req.body;
    let setting = await Setting.findOneAndUpdate(
      { key },
      { value, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: 'Server error saving setting' });
  }
});

module.exports = router;
