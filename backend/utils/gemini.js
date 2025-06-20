// backend/utils/gemini.js
const axios = require('axios');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function extractLocation(description) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${GEMINI_API_KEY}`
  };

  const body = {
    contents: [{
      parts: [{
        text: `Extract the location name from the following disaster description: "${description}". Only return the place name.`
      }]
    }]
  };

  try {
    const response = await axios.post(url, body, { headers });

    const location = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return location || null;
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return null;
  }
}

module.exports = {
  extractLocation
};
