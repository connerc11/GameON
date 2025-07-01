const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

let triviaCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

app.get('/api/trivia', async (req, res) => {
  const now = Date.now();
  if (triviaCache && now - cacheTimestamp < CACHE_DURATION) {
    return res.json(triviaCache);
  }
  try {
    const response = await axios.get('https://opentdb.com/api.php?amount=10&category=21&difficulty=medium&type=multiple');
    if (!response.data || !Array.isArray(response.data.results)) {
      return res.status(500).json({ error: 'Invalid data from trivia API', data: response.data });
    }
    triviaCache = response.data;
    cacheTimestamp = now;
    res.json(response.data);
  } catch (error) {
    console.error('Backend error:', error.message, error.response?.data);
    res.status(500).json({ error: 'Failed to fetch trivia questions', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
