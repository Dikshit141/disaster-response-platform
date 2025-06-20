// backend/routes/updates.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const { getCache, setCache } = require('../utils/cache');

module.exports = (io, supabase) => {
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const cacheKey = `updates_${id}`;

    const cached = await getCache(supabase, cacheKey);
    if (cached) return res.json(cached);

    try {
      const { data: html } = await axios.get('https://www.redcross.org/about-us/news-and-events.html');
      const $ = cheerio.load(html);

      const updates = [];
      $('.news-card__title').each((i, el) => {
        const title = $(el).text().trim();
        if (title.toLowerCase().includes('flood') || title.toLowerCase().includes('disaster')) {
          updates.push({ title });
        }
      });

      await setCache(supabase, cacheKey, updates);
      io.emit('updates_available', { id, count: updates.length });
      res.json(updates);
    } catch (err) {
      console.error('Update scrape error:', err.message);
      res.status(500).json({ error: 'Failed to fetch updates' });
    }
  });

  return router;
};
