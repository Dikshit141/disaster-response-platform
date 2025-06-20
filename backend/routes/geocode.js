// backend/routes/geocode.js
const express = require('express');
const router = express.Router();
const { extractLocation } = require('../utils/gemini');
const axios = require('axios');

module.exports = (supabase) => {
  router.post('/', async (req, res) => {
    const { description } = req.body;
    try {
      const place = await extractLocation(description);
      if (!place) return res.status(400).json({ error: 'Location extraction failed' });

      const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: place,
          format: 'json',
          limit: 1
        },
        headers: { 'User-Agent': 'DisasterApp/1.0' }
      });

      if (!data.length) return res.status(404).json({ error: 'Location not found' });
      const { lat, lon } = data[0];

      res.json({ location_name: place, lat: parseFloat(lat), lon: parseFloat(lon) });
    } catch (err) {
      console.error('Geocode error:', err.message);
      res.status(500).json({ error: 'Geocoding failed' });
    }
  });

  return router;
};
