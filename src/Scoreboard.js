import { useState } from 'react';

function Scoreboard() {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  return (
    <div style={{
      background: "#111",
      border: "1px solid #222",
      borderRadius: 12,
      padding: "32px 48px",
      textAlign: "center",
      fontFamily: "monospace",
    }}>
      <div style={{ color: "#444", fontSize: 11, letterSpacing: 4, marginBottom: 24 }}>
        ROUND 1 — ANZ STADIUM
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
        <div>
          <div style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Broncos</div>
          <div style={{ color: "#F5A623", fontSize: 64, fontWeight: 900, lineHeight: 1 }}>{homeScore}</div>
          <button
            onClick={() => setHomeScore(homeScore + 4)}
            style={{
              marginTop: 16, padding: "8px 16px",
              background: "#F5A623", color: "black",
              border: "none", borderRadius: 6,
              cursor: "pointer", fontFamily: "monospace",
              fontWeight: 700, fontSize: 12,
            }}>
            + Try
          </button>
        </div>

        <div style={{ color: "#333", fontSize: 32 }}>—</div>

        <div>
          <div style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Storm</div>
          <div style={{ color: "#9B59B6", fontSize: 64, fontWeight: 900, lineHeight: 1 }}>{awayScore}</div>
          <button
            onClick={() => setAwayScore(awayScore + 4)}
            style={{
              marginTop: 16, padding: "8px 16px",
              background: "#9B59B6", color: "white",
              border: "none", borderRadius: 6,
              cursor: "pointer", fontFamily: "monospace",
              fontWeight: 700, fontSize: 12,
            }}>
            + Try
          </button>
        </div>
      </div>

      <div style={{ color: "#444", fontSize: 13, marginTop: 24 }}>
        1st Half
      </div>
    </div>
  );
}

export default Scoreboard;