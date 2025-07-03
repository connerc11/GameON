import React, { useState, useEffect } from 'react';
import './css/FunFight.css';
import './landing-basketball.css'; // Corrected import path
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

const OPPONENT_NAMES = [
  'The Crusher', 'Shadow Ninja', 'Thunderbolt', 'Iron Fist', 'Blaze', 'Venom', 'The Phantom', 'Wildcat',
  'Storm Bringer', 'Nightmare', 'Frostbite', 'Viper', 'The Titan', 'Rogue', 'The Warden',
];
const PLAYER_IMAGES = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=player',
  'https://api.dicebear.com/7.x/bottts/svg?seed=player',
  'https://api.dicebear.com/7.x/micah/svg?seed=player',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=player',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=player',
  'https://api.dicebear.com/7.x/miniavs/svg?seed=player',
  'https://api.dicebear.com/7.x/croodles/svg?seed=player',
  'https://api.dicebear.com/7.x/big-ears/svg?seed=player',
  'https://api.dicebear.com/7.x/big-smile/svg?seed=player',
  'https://api.dicebear.com/7.x/shapes/svg?seed=player',
];
const OPPONENT_IMAGES = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=opponent',
  'https://api.dicebear.com/7.x/bottts/svg?seed=opponent',
  'https://api.dicebear.com/7.x/micah/svg?seed=opponent',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=opponent',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=opponent',
  'https://api.dicebear.com/7.x/miniavs/svg?seed=opponent',
  'https://api.dicebear.com/7.x/croodles/svg?seed=opponent',
  'https://api.dicebear.com/7.x/big-ears/svg?seed=opponent',
  'https://api.dicebear.com/7.x/big-smile/svg?seed=opponent',
  'https://api.dicebear.com/7.x/shapes/svg?seed=opponent',
];
function getRandomOpponent() {
  return OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)];
}
function getRandomImg(imgArr) {
  return imgArr[Math.floor(Math.random() * imgArr.length)];
}
function getBattleLogMessage(type, { player, opponent, value, buffed, defending }) {
  const attackMsgs = [
    `${player} unleashes a fierce strike on ${opponent}, dealing ${value} damage${buffed ? ' with extra power!' : '!'}`,
    `${player} attacks! ${opponent} takes ${value} damage${buffed ? ' (it hurts more!)' : '!'}`,
    `${player} lands a blow for ${value} damage${buffed ? ' (critical hit!)' : '!'}`,
    `${player} swings at ${opponent}, causing ${value} damage${buffed ? ' (super effective!)' : '!'}`,
  ];
  const defendMsgs = [
    `${player} braces for impact! Next attack will be stronger.`,
    `${player} raises their guard, preparing a counterattack!`,
    `${player} defends, reducing incoming damage and powering up!`,
  ];
  const oppAttackMsgs = [
    `${opponent} retaliates, hitting ${player} for ${value} damage${defending ? ' (but it was reduced!)' : '!'}`,
    `${opponent} launches an attack! ${player} suffers ${value} damage${defending ? ' (defended)' : '!'}`,
    `${opponent} strikes back, inflicting ${value} damage${defending ? ' (defense absorbed some)' : '!'}`,
  ];
  if (type === 'playerAttack') return attackMsgs[Math.floor(Math.random() * attackMsgs.length)];
  if (type === 'playerDefend') return defendMsgs[Math.floor(Math.random() * defendMsgs.length)];
  if (type === 'opponentAttack') return oppAttackMsgs[Math.floor(Math.random() * oppAttackMsgs.length)];
  return '';
}

export default function FunFight() {
  const [playerName, setPlayerName] = useState('');
  const [opponent, setOpponent] = useState('');
  const [playerImg, setPlayerImg] = useState(PLAYER_IMAGES[0]);
  const [opponentImg, setOpponentImg] = useState(OPPONENT_IMAGES[0]);
  const [battleStarted, setBattleStarted] = useState(false);
  const [playerHP, setPlayerHP] = useState(150);
  const [opponentHP, setOpponentHP] = useState(150);
  const [battleLog, setBattleLog] = useState([]);
  const [turn, setTurn] = useState('player');
  const [winner, setWinner] = useState(null);
  const [playerAttackAnim, setPlayerAttackAnim] = useState(false);
  const [opponentAttackAnim, setOpponentAttackAnim] = useState(false);
  const [defending, setDefending] = useState(false);
  const [buffedAttack, setBuffedAttack] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(PLAYER_IMAGES[0]);
  const [specialUsed, setSpecialUsed] = useState(false);
  const [nameError, setNameError] = useState('');
  const navigate = useNavigate();

  const nonRankedMode = sessionStorage.getItem('nonRankedMode') === 'true';
  const isSignedIn = !!getToken();

  // Submit score when game ends
  async function submitScore(game, score, token) {
    try {
      const res = await fetch('http://localhost:5000/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ game, score })
      });
      const data = await res.json();
      if (res.ok) {
        console.log('Score submitted successfully:', data);
      } else {
        console.error('Error submitting score:', data.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Error submitting score:', err);
    }
  }

  // Submit score when battle ends
  useEffect(() => {
    if (winner && isSignedIn && !nonRankedMode && getToken()) {
      // Calculate score: if player wins, score = remaining health; if player loses, score = 0
      const finalScore = winner === playerName ? playerHP : 0;
      submitScore('funfight', finalScore, getToken());
    }
  }, [winner, playerName, playerHP, isSignedIn, nonRankedMode]);

  // Require login before playing
  if (!getToken()) {
    return (
      <div className="funfight-full-bg">
        <div className="funfight-card">
          <h2 style={{ textAlign: 'center', marginBottom: 24 }}>You must be signed in to play FunFight!</h2>
          <button
            onClick={() => navigate('/login')}
            className="funfight-btn funfight-btn-green"
            style={{ marginTop: 20 }}
          >
            Sign In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  const handleStartBattle = () => {
    if (!playerName.trim()) {
      setNameError('Please enter your name to play');
      return;
    }
    setNameError('');
    setOpponent(getRandomOpponent());
    setPlayerImg(selectedAvatar);
    setOpponentImg(getRandomImg(OPPONENT_IMAGES));
    setPlayerHP(150);
    setOpponentHP(150);
    setBattleLog([]);
    setTurn('player');
    setWinner(null);
    setBattleStarted(true);
    setSpecialUsed(false);
  };

  const playerAttack = () => {
    if (winner) return;
    setPlayerAttackAnim(true);
    setTimeout(() => setPlayerAttackAnim(false), 400);
    let damage = Math.floor(Math.random() * 21) + 10; // 10-30
    if (buffedAttack) {
      damage = Math.round(damage * 1.15); // 15% stronger
    }
    const newOpponentHP = Math.max(opponentHP - damage, 0);
    setOpponentHP(newOpponentHP);
    setBattleLog(log => [
      ...log,
      getBattleLogMessage('playerAttack', { player: playerName, opponent, value: damage, buffed: buffedAttack })
    ]);
    if (newOpponentHP <= 0) {
      setWinner(playerName);
    } else {
      setTimeout(opponentAttack, 800);
    }
    setTurn('opponent');
    setDefending(false);
    setBuffedAttack(false); // Buff is used up after attack
  };

  const playerDefend = () => {
    setDefending(true);
    setBuffedAttack(true); // Next attack will be buffed
    setBattleLog(log => [
      ...log,
      getBattleLogMessage('playerDefend', { player: playerName })
    ]);
    setTurn('opponent');
    setTimeout(opponentAttack, 800);
  };

  const playerSpecialAttack = () => {
    if (winner || specialUsed || turn !== 'player') return;
    setPlayerAttackAnim(true);
    setTimeout(() => setPlayerAttackAnim(false), 400);
    let damage = Math.floor((Math.random() * 21) + 10); // 10-30
    damage = Math.round(damage * 1.5); // 50% more damage
    let logMsg = '';
    // If opponent is defending, special fails and player loses 50% HP
    if (defending) {
      const lostHP = Math.round(playerHP * 0.5);
      setPlayerHP(hp => Math.max(hp - lostHP, 0));
      logMsg = `❌ Special attack failed! ${opponent} defended and ${playerName} lost ${lostHP} HP!`;
      if (playerHP - lostHP <= 0) setWinner(opponent);
    } else {
      const newOpponentHP = Math.max(opponentHP - damage, 0);
      setOpponentHP(newOpponentHP);
      logMsg = `💥 ${playerName} uses a Special Attack! ${opponent} takes ${damage} massive damage!`;
      if (newOpponentHP <= 0) setWinner(playerName);
    }
    setBattleLog(log => [...log, logMsg]);
    setSpecialUsed(true);
    setTurn('opponent');
    setDefending(false);
    setBuffedAttack(false);
    if (!winner) setTimeout(opponentAttack, 800);
  };

  const opponentAttack = () => {
    if (winner) return;
    setOpponentAttackAnim(true);
    setTimeout(() => setOpponentAttackAnim(false), 400);
    let damage = Math.floor(Math.random() * 21) + 10; // 10-30
    let specialDeflect = false;
    if (defending) {
      // 25% chance to deflect: opponent does no damage and takes 10-20 damage
      if (Math.random() < 0.25) {
        specialDeflect = true;
        damage = 0;
        const deflectDmg = Math.floor(Math.random() * 11) + 10; // 10-20
        setOpponentHP(hp => Math.max(hp - deflectDmg, 0));
        setBattleLog(log => [
          ...log,
          `⚡ ${playerName} perfectly counters! ${opponent} takes ${deflectDmg} damage instead!`
        ]);
        if (opponentHP - deflectDmg <= 0) {
          setWinner(playerName);
        }
      } else {
        damage = Math.floor(damage / 2); // 50% weaker
      }
    }
    if (!specialDeflect) {
      const newPlayerHP = Math.max(playerHP - damage, 0);
      setPlayerHP(newPlayerHP);
      setBattleLog(log => [
        ...log,
        getBattleLogMessage('opponentAttack', { player: playerName, opponent, value: damage, defending })
      ]);
      if (newPlayerHP <= 0) {
        setWinner(opponent);
      }
    }
    setTurn('player');
    setDefending(false);
  };

  const handleRestart = () => {
    setPlayerName('');
    setOpponent('');
    setBattleStarted(false);
    setPlayerHP(150);
    setOpponentHP(150);
    setBattleLog([]);
    setTurn('player');
    setWinner(null);
    setSpecialUsed(false);
  };

  // Health bar component
  function HealthBar({ hp, max = 150, color }) {
    const percent = Math.max(0, Math.min(100, (hp / max) * 100));
    return (
      <div style={{ width: 120, height: 18, background: '#eee', borderRadius: 10, margin: '6px auto 4px auto', border: '1px solid #ccc', overflow: 'hidden', position: 'relative' }}>
        <div style={{ width: `${percent}%`, height: '100%', background: color, borderRadius: 10, transition: 'width 0.3s', position: 'absolute', left: 0, top: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, color: percent < 30 ? '#fff' : '#222', fontWeight: 'bold', textAlign: 'center', lineHeight: '18px', fontSize: '0.95rem' }}>
          {Math.round((hp / max) * 100)}%
        </div>
      </div>
    );
  }

  return (
    <div className="funfight-full-bg">
      <div className="funfight-basketball-anim-container">
        <div className="basketball-anim" />
      </div>
      <div className="funfight-card">
        <h1 className="funfight-title">Fun Fight</h1>
        {!battleStarted ? (
          <div>
            <p className="funfight-desc">Enter your player name and select your avatar to begin the battle!</p>
            <input
              type="text"
              placeholder="Your Name"
              value={playerName}
              onChange={e => { setPlayerName(e.target.value); if (nameError) setNameError(''); }}
              className="funfight-input"
            />
            {nameError && (
              <div className="funfight-error">{nameError}</div>
            )}
            <div className="funfight-avatar-select">
              <div className="funfight-avatar-label">Choose your avatar:</div>
              <div className="funfight-avatar-list">
                {PLAYER_IMAGES.map((img, idx) => (
                  <img
                    key={img}
                    src={img}
                    alt={`Avatar ${idx + 1}`}
                    onClick={() => setSelectedAvatar(img)}
                    className={`funfight-avatar-img${selectedAvatar === img ? ' selected' : ''}`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={handleStartBattle}
              className="funfight-btn funfight-btn-yellow"
              style={{ marginTop: 20, width: '100%' }}
            >
              Start Battle
            </button>
          </div>
        ) : (
          <div>
            <h2 className="funfight-vs">{playerName} <span className="funfight-vs-sep">vs</span> {opponent}</h2>
            <div className="funfight-battle-area">
              <div className="funfight-character">
                <img
                  src={playerImg}
                  alt="Player"
                  className={`funfight-img${playerAttackAnim ? ' attack' : ''}`}
                />
                <HealthBar hp={playerHP} max={150} color="#FFD600" />
                <div className="funfight-char-name">{playerName}</div>
                <div className="funfight-char-hp funfight-char-hp-player">{playerHP} HP left</div>
              </div>
              <div className="funfight-character">
                <img
                  src={opponentImg}
                  alt="Opponent"
                  className={`funfight-img opponent${opponentAttackAnim ? ' attack' : ''}`}
                />
                <HealthBar hp={opponentHP} max={150} color="#FF5252" />
                <div className="funfight-char-name">{opponent}</div>
                <div className="funfight-char-hp funfight-char-hp-opponent">{opponentHP} HP left</div>
              </div>
            </div>
            <div className="funfight-battle-log">
              {battleLog.map((entry, idx) => (
                <div key={idx} className="funfight-log-entry">{entry}</div>
              ))}
            </div>
            {winner ? (
              <>
                <h2 className={`funfight-winner funfight-winner-${winner === playerName ? 'player' : 'opponent'}`}>{winner} wins!</h2>
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={handleRestart}
                    className="funfight-btn funfight-btn-yellow"
                    style={{ marginTop: 20 }}
                  >
                    Play Again
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="funfight-action-row">
                  <button
                    onClick={playerAttack}
                    className="funfight-btn funfight-btn-green"
                    disabled={turn !== 'player'}
                  >
                    Attack
                  </button>
                  <button
                    onClick={playerDefend}
                    className="funfight-btn funfight-btn-yellow"
                    disabled={turn !== 'player' || defending}
                  >
                    Defend
                  </button>
                </div>
                <div className="funfight-special-row">
                  <button
                    onClick={playerSpecialAttack}
                    className={`funfight-btn funfight-btn-red${specialUsed ? ' disabled' : ''}`}
                    disabled={turn !== 'player' || specialUsed}
                    title={specialUsed ? 'Special Attack can only be used once per battle' : 'Deal 50% more damage!'}
                  >
                    Special Attack
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        <div className="funfight-nav-row">
          <button
            onClick={() => window.location.href = '/'}
            className="funfight-btn funfight-btn-green"
          >
            Go to Homepage
          </button>
          <button
            onClick={() => window.location.href = '/funfight-leaderboard'}
            className="funfight-btn funfight-btn-green"
          >
            View Fun Fight Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}