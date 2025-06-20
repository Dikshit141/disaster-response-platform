// backend/routes/verify.js
const express = require('express');
const router = express.Router();
const { verifyImage } = require('../utils/gemini');

module.exports = (supabase) => {
  router.post('/:id', async (req, res) => {
    const { id } = req.params;
    const { image_url } = req.body;

    if (!image_url) return res.status(400).json({ error: 'Image URL required' });

    const verification = await verifyImage(image_url);
    res.json({ verification });
  });

  return router;
};
