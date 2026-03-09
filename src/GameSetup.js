import { useState } from 'react';
const TEAMS = [
  { name: "Broncos", color: "#F5A623" },
  { name: "Raiders", color: "#6ABF69" },
  { name: "Bulldogs", color: "#003087" },
  { name: "Sharks", color: "#00AEEF" },
  { name: "Titans", color: "#009FDF" },
  { name: "Sea Eagles", color: "#6D2077" },
  { name: "Storm", color: "#9B59B6" },
  { name: "Knights", color: "#E40000" },
  { name: "Cowboys", color: "#FFD100" },
  { name: "Eels", color: "#FFD100" },
  { name: "Panthers", color: "#E40000" },
  { name: "Rabbitohs", color: "#006940" },
  { name: "Dragons", color: "#E40000" },
  { name: "Roosters", color: "#003087" },
  { name: "Warriors", color: "#808080" },
  { name: "Tigers", color: "#F5A623" },
  { name: "Dolphins", color: "#E40000" },
];

export default function GameSetup({ onStart }) {
  const [home, setHome] = useState(null);
  const [away, setAway] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "white", fontFamily: "monospace", padding: 40 }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: 6, color: "#444", marginBottom: 12 }}>NRL LIVE OPERATOR</div>
          <div style={{ fontSize: 36, fontWeight: 900 }}>GAME SETUP</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#444", marginBottom: 16 }}>HOME TEAM</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TEAMS.map(team => (
                <button
                  key={team.name}
                  onClick={() => setHome(team)}
                  style={{
                    padding: "12px 16px", borderRadius: 8, textAlign: "left",
                    background: home?.name === team.name ? `${team.color}22` : "#111",
                    border: `1px solid ${home?.name === team.name ? team.color : "#1e1e1e"}`,
                    color: home?.name === team.name ? "white" : "#666",
                    cursor: "pointer", fontSize: 13, fontFamily: "monospace",
                  }}
                >{team.name}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#444", marginBottom: 16 }}>AWAY TEAM</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TEAMS.map(team => (
                <button
                  key={team.name}
                  onClick={() => setAway(team)}
                  style={{
                    padding: "12px 16px", borderRadius: 8, textAlign: "left",
                    background: away?.name === team.name ? `${team.color}22` : "#111",
                    border: `1px solid ${away?.name === team.name ? team.color : "#1e1e1e"}`,
                    color: away?.name === team.name ? "white" : "#666",
                    cursor: "pointer", fontSize: 13, fontFamily: "monospace",
                  }}
                >{team.name}</button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => home && away && onStart({ home, away })}
          disabled={!home || !away}
          style={{
            width: "100%", padding: 18, borderRadius: 8,
            background: home && away ? "white" : "#111",
            color: home && away ? "black" : "#333",
            border: "none", fontSize: 12, fontWeight: 700,
            letterSpacing: 4, cursor: home && away ? "pointer" : "not-allowed",
            fontFamily: "monospace",
          }}
        >
          {home && away ? `START — ${home.name.toUpperCase()} VS ${away.name.toUpperCase()}` : "SELECT BOTH TEAMS"}
        </button>
      </div>
    </div>
  );
}