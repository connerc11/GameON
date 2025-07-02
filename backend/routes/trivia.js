const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// SportsTrivia Game - fetch 10 questions from OpenTDB with simple in-memory cache
let sportsTriviaCache = { questions: [], timestamp: 0 };
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

router.get('/trivia', async (req, res) => {
  try {
    const now = Date.now();
    if (sportsTriviaCache.questions.length === 10 && now - sportsTriviaCache.timestamp < CACHE_DURATION) {
      // console.log('Serving Sports trivia from cache');
      return res.json({ results: sportsTriviaCache.questions });
    }
    const response = await fetch('https://opentdb.com/api.php?amount=10&category=21&difficulty=medium&type=multiple');
    const data = await response.json();
    sportsTriviaCache = { questions: data.results, timestamp: Date.now() };
    res.json({ results: data.results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trivia questions' });
  }
});

// TV Trivia - fetch 10 questions from OpenTDB (category 14) with simple in-memory cache
let tvTriviaCache = { questions: [], timestamp: 0 };

router.get('/tvtrivia', async (req, res) => {
  try {
    const now = Date.now();
    if (tvTriviaCache.questions.length === 10 && now - tvTriviaCache.timestamp < CACHE_DURATION) {
      // console.log('Serving TV trivia from cache');
      return res.json({ results: tvTriviaCache.questions });
    }
    let questions = [];
    let attempts = 0;
    // Try up to 3 times to get 10 questions
    while (questions.length < 10 && attempts < 3) {
      const response = await fetch('https://opentdb.com/api.php?amount=10&category=14&difficulty=medium&type=multiple');
      const data = await response.json();
      // console.log(`Attempt ${attempts + 1}: got ${data.results.length} questions`);
      if (data.results && data.results.length > questions.length) {
        questions = data.results;
      }
      attempts++;
    }
    tvTriviaCache = { questions, timestamp: Date.now() };
    // console.log('Final questions length:', questions.length);
    res.json({ results: questions });
  } catch (err) {
    // console.error('Error fetching TV trivia:', err);
    res.status(500).json({ error: 'Failed to fetch TV trivia questions' });
  }
});

module.exports = router;
