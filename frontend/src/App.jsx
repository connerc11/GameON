import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import TriviaGame from './components/TriviaGame';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trivia-game" element={<TriviaGame />} />
      </Routes>
    </Router>
  );
}
