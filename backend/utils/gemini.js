// backend/utils/gemini.js
const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function extractLocation(description) {
  const prompt = `Extract the location from this disaster report: "${description}". Return just the place name.`;

  try {
    const res = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }]
    });
    return res.data.candidates[0].content.parts[0].text.trim();
  } catch (err) {
    console.error('Gemini extractLocation error:', err.response?.data || err.message);
    return null;
  }
}

async function verifyImage(imageUrl) {
  const prompt = `Analyze the image at this URL for signs of manipulation or to confirm if it's contextually a disaster image: ${imageUrl}`;

  try {
    const res = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }]
    });
    return res.data.candidates[0].content.parts[0].text.trim();
  } catch (err) {
    console.error('Gemini verifyImage error:', err.response?.data || err.message);
    return 'Verification failed';
  }
}

module.exports = {
  extractLocation,
  verifyImage
};
