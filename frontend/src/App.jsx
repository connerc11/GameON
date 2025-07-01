import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import TriviaGame from './components/TriviaGame';
import TVTrivia from './components/TVTrivia';
import FunFight from './components/FunFight'; // Import FunFight

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trivia-game" element={<TriviaGame />} />
        <Route path="/tvtrivia" element={<TVTrivia />} />
        <Route path="/funfight" element={<FunFight />} /> {/* Add FunFight route */}
      </Routes>
    </Router>
  );
}
