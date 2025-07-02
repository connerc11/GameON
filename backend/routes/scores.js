const express = require('express');
const jwt = require('jsonwebtoken');
const Score = require('../models/Score');
const router = express.Router();


function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Save a score and return updated leaderboard
router.post('/', authMiddleware, async (req, res) => {
  const { game, score } = req.body;
  if (!game || typeof score !== 'number') return res.status(400).json({ message: 'Invalid data' });
  try {
    const newScore = new Score({ username: req.user.username, game, score });
    await newScore.save();
    // Get updated leaderboard for this game
    const leaderboard = await Score.find({ game })
      .sort({ score: -1, date: 1 })
      .limit(10);
    res.status(201).json({ message: 'Score saved', leaderboard });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard for a game (protected)
router.get('/:game', authMiddleware, async (req, res) => {
  try {
    const scores = await Score.find({ game: req.params.game })
      .sort({ score: -1, date: 1 })
      .limit(10);
    res.json(scores);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get FunFight user stats: wins, losses, highest remaining health win
router.get('/funfight/userstats', authMiddleware, async (req, res) => {
  try {
    const username = req.user.username;
    // Wins: scores where user won (score > 0), Losses: scores where user lost (score === 0)
    const wins = await Score.countDocuments({ game: 'funfight', username, score: { $gt: 0 } });
    const losses = await Score.countDocuments({ game: 'funfight', username, score: 0 });
    // Highest remaining health win
    const highest = await Score.findOne({ game: 'funfight', username, score: { $gt: 0 } })
      .sort({ score: -1 })
      .select('score');
    res.json({
      wins,
      losses,
      highestHealth: highest ? highest.score : 0
    });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;