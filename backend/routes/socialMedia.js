// backend/routes/socialMedia.js
const express = require('express');
const router = express.Router();
const { getCache, setCache } = require('../utils/cache');

const MOCK_POSTS = [
  { post: '#floodrelief Need food in NYC', user: 'citizen1' },
  { post: 'Earthquake in Delhi, need help', user: 'citizen2' },
  { post: 'SOS: Stuck in Houston flood', user: 'citizen3' }
];

module.exports = (io, supabase) => {
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const cacheKey = `social_${id}`;

    const cached = await getCache(supabase, cacheKey);
    if (cached) return res.json(cached);

    const filtered = MOCK_POSTS.filter(p => p.post.toLowerCase().includes('flood') || p.post.toLowerCase().includes('sos'));

    await setCache(supabase, cacheKey, filtered);
    io.emit('social_media_updated', { id, count: filtered.length });

    res.json(filtered);
  });

  return router;
};
