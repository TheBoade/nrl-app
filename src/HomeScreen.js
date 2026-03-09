import { useState } from 'react';
import { ROUNDS, NRL_TEAMS } from './data';

function TeamAvatar({ team, number, name }) {
  const t = NRL_TEAMS[team];
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2) : '??';
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        overflow: "hidden", position: "relative",
        border: "2px solid #1a1a1a",
      }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {[t?.c1, t?.c2, t?.c3].map((c, i) => (
            <div key={i} style={{ flex: 1, background: c || "#333" }} />
          ))}
        </div>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.35)",
        }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontWeight: 700, lineHeight: 1 }}>{number}</div>
          <div style={{ fontSize: 13, color: "white", fontWeight: 900, lineHeight: 1, letterSpacing: -0.5 }}>{initials}</div>
        </div>
      </div>
      <div style={{ fontSize: 9, color: "#444", textAlign: "center", maxWidth: 52, lineHeight: 1.3 }}>
        {name?.split(' ').pop()}
      </div>
    </div>
  );
}

function GameCard({ game, onClick }) {
  const isLive = game.status === 'live';
  const isFullTime = game.status === 'full_time';
  const ht = NRL_TEAMS[game.home];
  const at = NRL_TEAMS[game.away];
  const homeWon = isFullTime && game.home_score > game.away_score;
  const awayWon = isFullTime && game.away_score > game.home_score;

  return (
    <div
      onClick={onClick}
      style={{
        background: "#0f0f18",
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid ${isLive ? "#22c55e44" : "#111"}`,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", height: 5 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", opacity: awayWon ? 0.4 : 1 }}>
          {[ht?.c1, ht?.c2, ht?.c3].map((c, i) => <div key={i} style={{ flex: 1, background: c || "#333" }} />)}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", opacity: homeWon ? 0.4 : 1 }}>
          {[at?.c1, at?.c2, at?.c3].map((c, i) => <div key={i} style={{ flex: 1, background: c || "#333" }} />)}
        </div>
      </div>

      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
          {isLive && (
            <>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
              <span style={{ fontSize: 9, color: "#22c55e", letterSpacing: 2, fontWeight: 700 }}>LIVE</span>
            </>
          )}
          {isFullTime && <span style={{ fontSize: 9, color: "#444", letterSpacing: 2 }}>FT</span>}
          {!isLive && !isFullTime && <span style={{ fontSize: 9, color: "#444", letterSpacing: 1 }}>{game.time}</span>}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, opacity: awayWon ? 0.4 : 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 22, height: 14, borderRadius: 3, overflow: "hidden", display: "flex", flexDirection: "column", flexShrink: 0 }}>
              {[ht?.c1, ht?.c2, ht?.c3].map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
            </div>
            <span style={{ fontSize: 11, fontWeight: homeWon ? 900 : 600, color: homeWon ? "white" : "#aaa" }}>{game.home}</span>
          </div>
          {(isLive || isFullTime) && (
            <span style={{ fontSize: 17, fontWeight: homeWon ? 900 : 600, color: homeWon ? "white" : "#666" }}>{game.home_score}</span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: homeWon ? 0.4 : 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 22, height: 14, borderRadius: 3, overflow: "hidden", display: "flex", flexDirection: "column", flexShrink: 0 }}>
              {[at?.c1, at?.c2, at?.c3].map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
            </div>
            <span style={{ fontSize: 11, fontWeight: awayWon ? 900 : 600, color: awayWon ? "white" : "#aaa" }}>{game.away}</span>
          </div>
          {(isLive || isFullTime) && (
            <span style={{ fontSize: 17, fontWeight: awayWon ? 900 : 600, color: awayWon ? "white" : "#666" }}>{game.away_score}</span>
          )}
        </div>

        {!isLive && !isFullTime && (
          <div style={{ fontSize: 8, color: "#2a2a2a", marginTop: 8 }}>{game.venue}</div>
        )}
      </div>
    </div>
  );
}

function GameGrid({ games, onSelectGame }) {
  const sorted = [...games].sort((a, b) => {
    const order = { live: 0, upcoming: 1, full_time: 2 };
    return (order[a.status] ?? 1) - (order[b.status] ?? 1);
  });
  const columns = [];
  for (let i = 0; i < sorted.length; i += 3) {
    columns.push(sorted.slice(i, i + 3));
  }
  return (
    <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingRight: 20, paddingBottom: 4, scrollbarWidth: "none" }}>
      {columns.map((col, ci) => (
        <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0, width: 170 }}>
          {col.map(game => (
            <GameCard key={game.id} game={game} onClick={() => onSelectGame(game)} />
          ))}
        </div>
      ))}
    </div>
  );
}

const TOP_PLAYERS = [
  { name: "Reece Walsh", team: "Broncos", number: 1, score: 42 },
  { name: "Nathan Cleary", team: "Panthers", number: 7, score: 38 },
  { name: "Latrell Mitchell", team: "Rabbitohs", number: 1, score: 35 },
  { name: "Kalyn Ponga", team: "Knights", number: 1, score: 33 },
  { name: "James Tedesco", team: "Roosters", number: 1, score: 31 },
  { name: "Cam Munster", team: "Storm", number: 6, score: 29 },
  { name: "Tom Trbojevic", team: "Sea Eagles", number: 1, score: 27 },
  { name: "Payne Haas", team: "Broncos", number: 8, score: 25 },
  { name: "Isaah Yeo", team: "Panthers", number: 13, score: 24 },
  { name: "Harry Grant", team: "Storm", number: 9, score: 22 },
];

const TOP_PLAYS = [
  { label: "Line Break", player: "Reece Walsh", team: "Broncos", number: 1, minute: 23, points: 6 },
  { label: "Try", player: "Nathan Cleary", team: "Panthers", number: 7, minute: 34, points: 4 },
  { label: "40/20", player: "Tom Trbojevic", team: "Sea Eagles", number: 1, minute: 51, points: 5 },
  { label: "Try", player: "Latrell Mitchell", team: "Rabbitohs", number: 1, minute: 67, points: 4 },
  { label: "Line Break", player: "Kalyn Ponga", team: "Knights", number: 1, minute: 12, points: 6 },
];

export default function HomeScreen({ onSelectGame }) {
  const [currentRound, setCurrentRound] = useState(0);
  const round = ROUNDS[currentRound];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080810",
      color: "white",
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      maxWidth: 430,
      margin: "0 auto",
      overflowX: "hidden",
    }}>

      {/* Header */}
      <div style={{
        background: "#13131f",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid #2a2a3a",
      }}>
        {/* Status bar fill */}
        <div style={{ height: 36 }} />

        {/* Pulse + icons */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 12px" }}>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, color: "white", fontStyle: "italic" }}>
            Pulse
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {["💬", "🔔", "👤"].map((icon, i) => (
              <button key={i} style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "#161622", border: "1px solid #222",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: 15,
              }}>{icon}</button>
            ))}
          </div>
        </div>

        {/* Sport tabs */}
        <div style={{ display: "flex", gap: 8, padding: "0 20px 16px" }}>
          {[
            { label: "NRL", active: true },
            { label: "AFL", active: false, soon: true },
          ].map(sport => (
            <button key={sport.label} style={{
              padding: "8px 20px", borderRadius: 20,
              background: sport.active ? "white" : "transparent",
              border: `1px solid ${sport.active ? "white" : "#222"}`,
              color: sport.active ? "black" : "#333",
              fontSize: 13, fontWeight: 700,
              cursor: sport.active ? "pointer" : "default",
              fontFamily: "inherit", position: "relative",
            }}>
              {sport.label}
              {sport.soon && (
                <span style={{
                  position: "absolute", top: -6, right: -4,
                  fontSize: 8, background: "#222", color: "#555",
                  padding: "1px 4px", borderRadius: 4, letterSpacing: 1,
                }}>SOON</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Round selector */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px", borderBottom: "1px solid #111",
      }}>
        <button
          onClick={() => setCurrentRound(r => Math.max(0, r - 1))}
          disabled={currentRound === 0}
          style={{ background: "none", border: "none", color: currentRound === 0 ? "#222" : "#666", fontSize: 22, cursor: currentRound === 0 ? "not-allowed" : "pointer" }}
        >‹</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>Round {round.round}</div>
          <div style={{ fontSize: 10, color: "#444", letterSpacing: 2, marginTop: 2 }}>NRL PREMIERSHIP 2026</div>
        </div>
        <button
          onClick={() => setCurrentRound(r => Math.min(ROUNDS.length - 1, r + 1))}
          disabled={currentRound === ROUNDS.length - 1}
          style={{ background: "none", border: "none", color: currentRound === ROUNDS.length - 1 ? "#222" : "#666", fontSize: 22, cursor: currentRound === ROUNDS.length - 1 ? "not-allowed" : "pointer" }}
        >›</button>
      </div>

      {/* Standings button */}
      <div style={{ padding: "12px 20px 0" }}>
        <button style={{
          background: "transparent", border: "1px solid #1a1a1a",
          borderRadius: 8, padding: "8px 16px",
          color: "#555", fontSize: 11, letterSpacing: 3,
          cursor: "pointer", fontFamily: "inherit",
        }}>📊 STANDINGS</button>
      </div>

      {/* Games grid */}
      <div style={{ padding: "12px 0 0 20px" }}>
        <GameGrid games={round.games} onSelectGame={onSelectGame} />
      </div>

      {/* Top Players */}
      <div style={{ padding: "28px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.5 }}>Top Players</div>
          <div style={{ fontSize: 10, color: "#444", letterSpacing: 2 }}>ROUND {round.round}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {TOP_PLAYERS.map((player, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <TeamAvatar team={player.team} number={player.number} name={player.name} />
              <div style={{ fontSize: 10, color: "#555", marginTop: 4, fontWeight: 700 }}>{player.score}pts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Plays */}
      <div style={{ padding: "28px 20px 100px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.5 }}>Top Plays</div>
          <div style={{ fontSize: 10, color: "#444", letterSpacing: 2 }}>THIS WEEK</div>
        </div>
        {TOP_PLAYS.map((play, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "12px 16px", background: "#0f0f18",
            borderRadius: 12, marginBottom: 8, border: "1px solid #111",
          }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: "#333", minWidth: 16 }}>#{i + 1}</div>
            <TeamAvatar team={play.team} number={play.number} name={play.player} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>{play.label}</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{play.player} — {play.team}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#22c55e" }}>+{play.points}</div>
              <div style={{ fontSize: 9, color: "#333", letterSpacing: 1 }}>{play.minute}'</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "#080810",
        borderTop: "1px solid #111",
        padding: "12px 0 28px",
        display: "flex", justifyContent: "space-around",
      }}>
        {[
          { icon: "🏉", label: "Games" },
          { icon: "📊", label: "Stats" },
          { icon: "🃏", label: "Cards" },
        ].map((tab, i) => (
          <button key={tab.label} style={{
            background: "none", border: "none",
            color: i === 0 ? "white" : "#333",
            cursor: "pointer", textAlign: "center", fontFamily: "inherit",
          }}>
            <div style={{ fontSize: 22 }}>{tab.icon}</div>
            <div style={{ fontSize: 10, letterSpacing: 2, marginTop: 4 }}>{tab.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}