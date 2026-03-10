import { NRL_TEAMS } from './data';

const STANDINGS = [
  { pos: 1,  team: "Panthers",   p: 1, w: 1, l: 0, d: 0, f: 24, a: 10, diff: 14 },
  { pos: 2,  team: "Storm",      p: 1, w: 1, l: 0, d: 0, f: 22, a: 14, diff: 8  },
  { pos: 3,  team: "Broncos",    p: 1, w: 1, l: 0, d: 0, f: 18, a: 12, diff: 6  },
  { pos: 4,  team: "Roosters",   p: 1, w: 1, l: 0, d: 0, f: 24, a: 6,  diff: 18 },
  { pos: 5,  team: "Knights",    p: 1, w: 1, l: 0, d: 0, f: 30, a: 12, diff: 18 },
  { pos: 6,  team: "Dolphins",   p: 1, w: 1, l: 0, d: 0, f: 20, a: 16, diff: 4  },
  { pos: 7,  team: "Sharks",     p: 1, w: 1, l: 0, d: 0, f: 28, a: 10, diff: 18 },
  { pos: 8,  team: "Bulldogs",   p: 1, w: 1, l: 0, d: 0, f: 16, a: 14, diff: 2  },
  { pos: 9,  team: "Eels",       p: 1, w: 0, l: 0, d: 1, f: 18, a: 18, diff: 0  },
  { pos: 10, team: "Raiders",    p: 1, w: 0, l: 0, d: 1, f: 18, a: 18, diff: 0  },
  { pos: 11, team: "Sea Eagles", p: 1, w: 0, l: 1, d: 0, f: 14, a: 22, diff: -8 },
  { pos: 12, team: "Rabbitohs",  p: 1, w: 0, l: 1, d: 0, f: 16, a: 20, diff: -4 },
  { pos: 13, team: "Dragons",    p: 1, w: 0, l: 1, d: 0, f: 14, a: 16, diff: -2 },
  { pos: 14, team: "Warriors",   p: 1, w: 0, l: 1, d: 0, f: 6,  a: 24, diff: -18},
  { pos: 15, team: "Cowboys",    p: 1, w: 0, l: 1, d: 0, f: 12, a: 30, diff: -18},
  { pos: 16, team: "Titans",     p: 1, w: 0, l: 1, d: 0, f: 10, a: 28, diff: -18},
  { pos: 17, team: "Tigers",     p: 0, w: 0, l: 0, d: 0, f: 0,  a: 0,  diff: 0  },
];

export default function StandingsScreen({ onBack }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#080810", color: "white",
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      maxWidth: 430, margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{
        background: "#13131f", position: "sticky", top: 0, zIndex: 100,
        borderBottom: "1px solid #2a2a3a",
      }}>
        <div style={{ height: 36 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px 16px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#666", fontSize: 24, cursor: "pointer", padding: 0 }}>‹</button>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.5 }}>Standings</div>
          <div style={{ fontSize: 10, color: "#444", letterSpacing: 2, marginTop: 2 }}>2026 SEASON</div>
        </div>
      </div>

      <div style={{ padding: "20px 20px 100px" }}>
        {/* Column headers */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "28px 1fr 28px 28px 28px 28px 36px 36px 40px",
          padding: "8px 12px", marginBottom: 4,
          fontSize: 9, color: "#444", letterSpacing: 2,
        }}>
          <div>#</div>
          <div>TEAM</div>
          <div style={{ textAlign: "center" }}>P</div>
          <div style={{ textAlign: "center" }}>W</div>
          <div style={{ textAlign: "center" }}>L</div>
          <div style={{ textAlign: "center" }}>D</div>
          <div style={{ textAlign: "center" }}>F</div>
          <div style={{ textAlign: "center" }}>A</div>
          <div style={{ textAlign: "center" }}>DIFF</div>
        </div>

        <div style={{ background: "#0f0f18", borderRadius: 16, border: "1px solid #111", overflow: "hidden" }}>
          {STANDINGS.map((row, i) => {
            const t = NRL_TEAMS[row.team];
            const isTop8 = row.pos <= 8;
            const isFinalsLine = row.pos === 8;
            return (
              <div key={row.team} style={{
                display: "grid",
                gridTemplateColumns: "28px 1fr 28px 28px 28px 28px 36px 36px 40px",
                padding: "12px 12px",
                borderBottom: isFinalsLine
                  ? "1px solid #22c55e44"
                  : i < STANDINGS.length - 1 ? "1px solid #0a0a12" : "none",
                alignItems: "center",
                background: isFinalsLine ? "#0d1a0d" : "transparent",
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: isTop8 ? "white" : "#444" }}>{row.pos}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 18, height: 12, borderRadius: 2, overflow: "hidden", display: "flex", flexDirection: "column", flexShrink: 0 }}>
                    {[t?.c1, t?.c2, t?.c3].map((c, j) => <div key={j} style={{ flex: 1, background: c || "#333" }} />)}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: isTop8 ? 700 : 400, color: isTop8 ? "white" : "#555" }}>{row.team}</span>
                </div>
                <div style={{ textAlign: "center", fontSize: 11, color: "#555" }}>{row.p}</div>
                <div style={{ textAlign: "center", fontSize: 11, fontWeight: row.w > 0 ? 700 : 400, color: row.w > 0 ? "white" : "#555" }}>{row.w}</div>
                <div style={{ textAlign: "center", fontSize: 11, color: "#555" }}>{row.l}</div>
                <div style={{ textAlign: "center", fontSize: 11, color: "#555" }}>{row.d}</div>
                <div style={{ textAlign: "center", fontSize: 11, color: "#555" }}>{row.f}</div>
                <div style={{ textAlign: "center", fontSize: 11, color: "#555" }}>{row.a}</div>
                <div style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: row.diff > 0 ? "#22c55e" : row.diff < 0 ? "#ef4444" : "#555" }}>
                  {row.diff > 0 ? `+${row.diff}` : row.diff}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <div style={{ width: 16, height: 2, background: "#22c55e66" }} />
          <span style={{ fontSize: 10, color: "#444", letterSpacing: 2 }}>FINALS POSITION</span>
        </div>
      </div>
    </div>
  );
}