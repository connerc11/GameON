import React, { useState } from 'react';
import './css/FunFight.css';
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

  // Require login before playing
  if (!getToken()) {
    return (
      <div style={{ textAlign: 'center', marginTop: 60 }}>
        <h2>You must be signed in to play FunFight!</h2>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '12px 32px',
            fontSize: 20,
            background: '#42b983',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            marginTop: 20,
          }}
        >
          Sign In / Sign Up
        </button>
      </div>
    );
  }

  const nonRankedMode = sessionStorage.getItem('nonRankedMode') === 'true';
  const isSignedIn = !!getToken();

  const handleStartBattle = () => {
    if (!playerName.trim()) {
      setNameError('Please enter your name before starting the battle.');
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
    <div style={{ background: '#18181b', minHeight: '100vh', color: '#fff' }}>
      <div style={{ maxWidth: 500, margin: '40px auto', background: '#23232a', borderRadius: 16, boxShadow: '0 2px 16px #0008', color: '#fff', border: '1px solid #333', padding: 24 }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: 24 }}>Fun Fight</h1>
        {!battleStarted ? (
          <div>
            <p style={{ textAlign: 'center', marginBottom: 16 }}>Enter your player name and select your avatar to begin the battle!</p>
            <input
              type="text"
              placeholder="Your Name"
              value={playerName}
              onChange={e => { setPlayerName(e.target.value); if (nameError) setNameError(''); }}
              style={{ margin: '10px', padding: '8px', fontSize: '1rem', borderRadius: '5px', width: '100%' }}
            />
            {nameError && (
              <div style={{ color: '#e74c3c', fontWeight: 600, marginTop: 4 }}>{nameError}</div>
            )}
            <div style={{ margin: '18px 0 10px 0' }}>
              <div style={{ marginBottom: 8, fontWeight: 500, textAlign: 'center' }}>Choose your avatar:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
                {PLAYER_IMAGES.map((img, idx) => (
                  <img
                    key={img}
                    src={img}
                    alt={`Avatar ${idx + 1}`}
                    onClick={() => setSelectedAvatar(img)}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      border: selectedAvatar === img ? '3px solid #42b983' : '2px solid #ccc',
                      boxShadow: selectedAvatar === img ? '0 0 8px #42b983' : 'none',
                      cursor: 'pointer',
                      background: '#fff',
                      transition: 'border 0.2s, box-shadow 0.2s',
                    }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={handleStartBattle}
              style={{ marginTop: '20px', padding: '10px 30px', fontSize: '1.1rem', borderRadius: '8px', background: '#42b983', color: '#fff', border: 'none', cursor: 'pointer', width: '100%' }}
              disabled={!playerName.trim()}
            >
              Start Battle
            </button>
          </div>
        ) : (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: 16 }}>{playerName} vs {opponent}</h2>
            <div className="funfight-battle-area" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <div className="funfight-character" style={{ flex: 1, textAlign: 'center' }}>
                <img
                  src={playerImg}
                  alt="Player"
                  className={`funfight-img${playerAttackAnim ? ' attack' : ''}`}
                  style={{ width: '100%', maxWidth: 120, marginBottom: 8 }}
                />
                <HealthBar hp={playerHP} max={150} color="#42b983" />
                <div style={{ fontWeight: 'bold', marginTop: 4 }}>{playerName}</div>
                <div style={{ color: '#42b983', fontWeight: 600, fontSize: '1.05rem', marginTop: 2 }}>
                  {playerHP} HP left
                </div>
              </div>
              <div className="funfight-character" style={{ flex: 1, textAlign: 'center' }}>
                <img
                  src={opponentImg}
                  alt="Opponent"
                  className={`funfight-img opponent${opponentAttackAnim ? ' attack' : ''}`}
                  style={{ width: '100%', maxWidth: 120, marginBottom: 8 }}
                />
                <HealthBar hp={opponentHP} max={150} color="#e74c3c" />
                <div style={{ fontWeight: 'bold', marginTop: 4 }}>{opponent}</div>
                <div style={{ color: '#e74c3c', fontWeight: 600, fontSize: '1.05rem', marginTop: 2 }}>
                  {opponentHP} HP left
                </div>
              </div>
            </div>
            <div style={{ minHeight: '80px', marginBottom: '20px', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto', background: '#222', color: '#fff', borderRadius: 10, padding: 12, fontFamily: 'monospace', fontSize: '1.05rem', boxShadow: '0 2px 8px rgba(34,49,63,0.08)' }}>
              {battleLog.map((entry, idx) => (
                <div key={idx} style={{ marginBottom: 6 }}>{entry}</div>
              ))}
            </div>
            {winner ? (
              <>
                <h2 style={{ color: winner === playerName ? '#42b983' : '#e74c3c', textAlign: 'center' }}>{winner} wins!</h2>
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={handleRestart}
                    style={{ marginTop: '20px', padding: '10px 30px', fontSize: '1.1rem', borderRadius: '8px', background: '#42b983', color: '#fff', border: 'none', cursor: 'pointer' }}
                  >
                    Play Again
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
                  <button
                    onClick={playerAttack}
                    style={{ padding: '10px 24px', fontSize: '1.1rem', borderRadius: '8px', background: '#42b983', color: '#fff', border: 'none', cursor: 'pointer', flex: 1 }}
                    disabled={turn !== 'player'}
                  >
                    Attack
                  </button>
                  <button
                    onClick={playerDefend}
                    style={{ padding: '10px 24px', fontSize: '1.1rem', borderRadius: '8px', background: '#f1c40f', color: '#fff', border: 'none', cursor: 'pointer', flex: 1 }}
                    disabled={turn !== 'player' || defending}
                  >
                    Defend
                  </button>
                </div>
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <button
                    onClick={playerSpecialAttack}
                    style={{ padding: '10px 24px', fontSize: '1.1rem', borderRadius: '8px', background: specialUsed ? '#aaa' : '#e74c3c', color: '#fff', border: 'none', cursor: specialUsed ? 'not-allowed' : 'pointer', width: '100%' }}
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
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button
            onClick={() => window.location.href = '/'}
            style={{ padding: '10px 30px', fontSize: '1.1rem', borderRadius: '8px', background: '#42b983', color: '#fff', border: 'none', cursor: 'pointer', marginRight: 12 }}
          >
            Go to Homepage
          </button>
          <button
            onClick={() => window.location.href = '/funfight-leaderboard'}
            style={{ padding: '10px 30px', fontSize: '1.1rem', borderRadius: '8px', background: '#42b983', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            View Fun Fight Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}