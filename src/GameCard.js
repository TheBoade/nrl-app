import { NRL_TEAMS } from './data';

export default function GameCard({ game, onClick, viewers }) {
  const homeTeam = NRL_TEAMS[game.home];
  const awayTeam = NRL_TEAMS[game.away];
  const isLive = game.status === 'live';
  const isFullTime = game.status === 'full_time';

  return (
    <div
      onClick={onClick}
      style={{
        background: "#0f0f18",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 12,
        border: `1px solid ${isLive ? "#22c55e33" : "#111"}`,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {/* Team colour bar */}
      <div style={{ display: "flex", height: 4 }}>
        <div style={{ flex: 1, background: homeTeam?.color || "#333" }} />
        <div style={{ flex: 1, background: awayTeam?.color || "#333" }} />
      </div>

      <div style={{ padding: "16px 20px" }}>
        {/* Status row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {isLive && (
              <>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#22c55e", boxShadow: "0 0 8px #22c55e"
                }} />
                <span style={{ fontSize: 10, color: "#22c55e", letterSpacing: 3, fontWeight: 700 }}>LIVE</span>
              </>
            )}
            {isFullTime && (
              <span style={{ fontSize: 10, color: "#555", letterSpacing: 3 }}>FULL TIME</span>
            )}
            {!isLive && !isFullTime && (
              <span style={{ fontSize: 10, color: "#444", letterSpacing: 2 }}>{game.time}</span>
            )}
          </div>
          {isLive && viewers && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10, color: "#444" }}>👁</span>
              <span style={{ fontSize: 10, color: "#444", letterSpacing: 1 }}>{viewers.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Teams and scores */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: homeTeam?.color || "#333",
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{game.home}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: awayTeam?.color || "#333",
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{game.away}</span>
            </div>
          </div>

          {(isLive || isFullTime) && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2, letterSpacing: -1, color: "white" }}>
                {game.home_score}
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2, letterSpacing: -1, color: "white" }}>
                {game.away_score}
              </div>
            </div>
          )}

          {!isLive && !isFullTime && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#333", letterSpacing: 2 }}>VS</div>
            </div>
          )}
        </div>

        {/* Venue */}
        <div style={{ marginTop: 12, fontSize: 10, color: "#333", letterSpacing: 1 }}>
          {game.venue}
        </div>
      </div>
    </div>
  );
}