// backend/routes/resources.js
const express = require('express');
const router = express.Router();

module.exports = (io, supabase) => {
  router.get('/', (req, res) => {
    res.send('Resources route placeholder working!');
  });

  return router;
};
