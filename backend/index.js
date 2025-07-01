const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

// Improved cache: cache by API URL (query params)
let triviaCache = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Helper to get cache key from URL
function getCacheKey(url) {
  return url;
}

app.get('/api/trivia', async (req, res) => {
  // You can add query params support here if needed
  const apiUrl = 'https://opentdb.com/api.php?amount=10&category=21&difficulty=medium&type=multiple';
  const cacheKey = getCacheKey(apiUrl);
  const now = Date.now();
  if (
    triviaCache[cacheKey] &&
    now - triviaCache[cacheKey].timestamp < CACHE_DURATION
  ) {
    return res.json(triviaCache[cacheKey].data);
  }
  try {
    const response = await axios.get(apiUrl);
    if (!response.data || !Array.isArray(response.data.results)) {
      return res.status(500).json({ error: 'Invalid data from trivia API', data: response.data });
    }
    triviaCache[cacheKey] = { data: response.data, timestamp: now };
    res.json(response.data);
  } catch (error) {
    console.error('Backend error:', error.message, error.response?.data);
    res.status(500).json({ error: 'Failed to fetch trivia questions', details: error.message });
  }
});

app.get('/api/tvtrivia', async (req, res) => {
  const apiUrl = 'https://opentdb.com/api.php?amount=10&category=14&difficulty=medium';
  const cacheKey = getCacheKey(apiUrl);
  const now = Date.now();
  if (
    triviaCache[cacheKey] &&
    now - triviaCache[cacheKey].timestamp < CACHE_DURATION
  ) {
    return res.json(triviaCache[cacheKey].data);
  }
  try {
    const response = await axios.get(apiUrl);
    if (!response.data || !Array.isArray(response.data.results)) {
      return res.status(500).json({ error: 'Invalid data from TV trivia API', data: response.data });
    }
    triviaCache[cacheKey] = { data: response.data, timestamp: now };
    res.json(response.data);
  } catch (error) {
    console.error('Backend error (tvtrivia):', error.message, error.response?.data);
    res.status(500).json({ error: 'Failed to fetch TV trivia questions', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
