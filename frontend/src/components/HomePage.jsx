import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

const rankedGames = [
  { name: 'SportsTrivia Game', path: '/trivia-game' },
  { name: 'TV Trivia', path: '/tvtrivia' },
  { name: 'Fun Fight', path: '/funfight' },
];
const nonRankedGames = [
  
  { name: 'Math Multipliers', path: '/math-multipliers' },
  { name: 'Quick Reaction', path: '/quick-reaction' },
  { name: 'Maze Escape', path: '/maze-escape' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  const isSignedIn = !!getToken();
  const nonRankedMode = sessionStorage.getItem('nonRankedMode') === 'true';

  const handleGameClick = (path, ranked) => {
    if (ranked && !isSignedIn) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  // Auto-logout if token expires while on this page
  useEffect(() => {
    const ts = localStorage.getItem('loginTimestamp');
    if (!ts) return;
    const now = Date.now();
    const age = now - parseInt(ts, 10);
    const msLeft = 3600000 - age;
    if (msLeft <= 0) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('loginTimestamp');
      navigate('/');
    } else {
      const timer = setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('loginTimestamp');
        navigate('/');
      }, msLeft);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className={
      `min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fff4] flex flex-col items-center py-10 px-2` +
      (nonRankedMode ? ' bg-yellow-50' : '')
    }>
      {nonRankedMode && (
        <div className="w-full max-w-2xl rounded-xl shadow-md bg-yellow-100 border border-yellow-200 text-yellow-900 px-6 py-4 mb-8 text-center text-lg font-semibold">
          <span>You are playing in <b>Guest Mode</b>. Leaderboards and score saving are disabled.<br />
          To play ranked games and see your scores, <span className="underline cursor-pointer text-green-600 hover:text-green-700 transition" onClick={() => { sessionStorage.removeItem('nonRankedMode'); navigate('/signup'); }}>create an account and sign up</span>.</span>
        </div>
      )}
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 drop-shadow mb-2">GameOn Games</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-4 mt-6">Ranked Games</h2>
      <ul className="flex flex-wrap justify-center gap-6 mb-8">
        {(isSignedIn && !nonRankedMode ? rankedGames : []).map((game) => (
          <li key={game.name}>
            <button
              onClick={() => handleGameClick(game.path, true)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-400 to-blue-400 text-white text-xl font-bold shadow-lg hover:scale-105 hover:from-green-500 hover:to-blue-500 transition-all duration-200"
            >
              {game.name}
            </button>
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-bold text-gray-700 mb-4 mt-6">Non-Ranked Games</h2>
      <ul className="flex flex-wrap justify-center gap-6">
        {nonRankedGames.map((game) => (
          <li key={game.name}>
            <button
              onClick={() => handleGameClick(game.path, false)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 text-xl font-bold shadow hover:scale-105 hover:from-gray-400 hover:to-gray-500 transition-all duration-200"
            >
              {game.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
