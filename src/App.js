import { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import FanApp from './FanApp';
import GameSetup from './GameSetup';

const OPERATOR_PASSWORD = 'nrl2026';

function App() {
  const isFan = window.location.search.includes('fan');
  const [game, setGame] = useState(null);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (isFan) return <FanApp />;

  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a0f",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "monospace",
      }}>
        <div style={{ width: 320, textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: 6, color: "#444", marginBottom: 12 }}>NRL LIVE OPERATOR</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "white", marginBottom: 40 }}>🏉</div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false); }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (password === OPERATOR_PASSWORD) {
                  setAuthed(true);
                } else {
                  setError(true);
                }
              }
            }}
            style={{
              width: "100%", padding: "14px 16px",
              background: "#111", border: `1px solid ${error ? "#ef4444" : "#222"}`,
              borderRadius: 8, color: "white", fontSize: 14,
              fontFamily: "monospace", marginBottom: 12,
              outline: "none", textAlign: "center",
            }}
          />
          {error && (
            <div style={{ color: "#ef4444", fontSize: 11, letterSpacing: 2, marginBottom: 12 }}>
              INCORRECT PASSWORD
            </div>
          )}
          <button
            onClick={() => {
              if (password === OPERATOR_PASSWORD) {
                setAuthed(true);
              } else {
                setError(true);
              }
            }}
            style={{
              width: "100%", padding: 14, borderRadius: 8,
              background: "white", color: "black",
              border: "none", fontSize: 12, fontWeight: 700,
              letterSpacing: 4, cursor: "pointer", fontFamily: "monospace",
            }}
          >
            ENTER
          </button>
        </div>
      </div>
    );
  }

  if (!game) return <GameSetup onStart={setGame} />;
  return <AdminDashboard game={game} />;
}

export default App;