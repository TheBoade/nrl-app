import { ROSTERS } from './rosters';

import { useState } from 'react';
import { supabase } from './supabase';

const EVENT_TYPES = [
  { id: "try", label: "Try", icon: "🏉", points: 4 },
  { id: "conversion", label: "Conversion", icon: "✅", points: 2 },
  { id: "penalty_goal", label: "Penalty Goal", icon: "🎯", points: 2 },
  { id: "line_break", label: "Line Break", icon: "💥", points: 0 },
  { id: "sin_bin", label: "Sin Bin", icon: "🟨", points: 0 },
  { id: "forty_twenty", label: "40/20", icon: "📐", points: 0 },
  { id: "penalty", label: "Penalty", icon: "⚠️", points: 0 },
];

export default function AdminDashboard({ game }) {
  const TEAMS = {
    home: { ...game.home, players: ROSTERS[game.home.name] || [] },
    away: { ...game.away, players: ROSTERS[game.away.name] || [] },
  };
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [minute, setMinute] = useState(1);
  const [half, setHalf] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [feed, setFeed] = useState([]);
const [gameId] = useState('game_001');

  const logEvent = async () => {
    if (!selectedEvent || !selectedTeam) return;

    const event = EVENT_TYPES.find(e => e.id === selectedEvent);

    const newHomeScore = selectedTeam === 'home' ? homeScore + event.points : homeScore;
    const newAwayScore = selectedTeam === 'away' ? awayScore + event.points : awayScore;

    setHomeScore(newHomeScore);
    setAwayScore(newAwayScore);

    // save score to supabase
    await supabase
      .from('scores')
      .upsert({
        game_id: gameId,
        home_team: TEAMS.home.name,
        away_team: TEAMS.away.name,
        home_score: newHomeScore,
        away_score: newAwayScore,
        half,
        minute,
      });

    const newEvent = {
      label: event.label,
      icon: event.icon,
      team: TEAMS[selectedTeam].name,
      player: selectedPlayer,
      minute,
      half,
      points: event.points,
    };

    const { error } = await supabase
      .from('events')
      .insert([newEvent]);

    if (error) {
      console.log('Error saving event:', error);
    }

    setFeed(prev => [{ id: Date.now(), ...newEvent }, ...prev]);
    setSelectedEvent(null);
    setSelectedTeam(null);
    setSelectedPlayer(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "white", fontFamily: "monospace", padding: 24 }}>

      {/* Scoreboard */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, background: "#111", borderRadius: 12, padding: "20px 32px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>HOME</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{TEAMS.home.name}</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: TEAMS.home.color }}>{homeScore}</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#444", letterSpacing: 3, marginBottom: 8 }}>HALF {half}</div>
          <div style={{ fontSize: 28, color: "#333" }}>—</div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={() => setMinute(m => Math.max(1, m - 1))} style={{ background: "#1a1a1a", border: "1px solid #222", color: "white", width: 28, height: 28, borderRadius: 4, cursor: "pointer" }}>−</button>
            <div style={{ fontSize: 20, fontWeight: 700, minWidth: 40, textAlign: "center" }}>{minute}'</div>
            <button onClick={() => setMinute(m => m + 1)} style={{ background: "#1a1a1a", border: "1px solid #222", color: "white", width: 28, height: 28, borderRadius: 4, cursor: "pointer" }}>+</button>
          </div>
          <button
            onClick={() => { setHalf(h => h === 1 ? 2 : 1); setMinute(1); }}
            style={{ marginTop: 10, background: "#1a1a1a", border: "1px solid #333", color: "#666", padding: "4px 12px", borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: "monospace" }}
          >Switch Half</button>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>AWAY</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{TEAMS.away.name}</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: TEAMS.away.color }}>{awayScore}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>

        {/* Event Logger */}
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#444", marginBottom: 12 }}>01 — EVENT TYPE</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {EVENT_TYPES.map(evt => (
                <button
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt.id)}
                  style={{
                    background: selectedEvent === evt.id ? "#1a1a2e" : "#111",
                    border: `1px solid ${selectedEvent === evt.id ? "#4444ff" : "#1e1e1e"}`,
                    borderRadius: 8, padding: "14px 8px",
                    cursor: "pointer", color: "white", textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{evt.icon}</div>
                  <div style={{ fontSize: 10, color: selectedEvent === evt.id ? "white" : "#666" }}>{evt.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#444", marginBottom: 12 }}>02 — TEAM</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {["home", "away"].map(side => (
                <button
                  key={side}
                  onClick={() => { setSelectedTeam(side); setSelectedPlayer(null); }}
                  style={{
                    padding: 16, borderRadius: 8,
                    background: selectedTeam === side ? `${TEAMS[side].color}22` : "#111",
                    border: `1px solid ${selectedTeam === side ? TEAMS[side].color : "#1e1e1e"}`,
                    color: "white", cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{TEAMS[side].name}</div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>{side.toUpperCase()}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedTeam && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#444", marginBottom: 12 }}>03 — PLAYER</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {TEAMS[selectedTeam].players.map(player => (
                  <button
                    key={player}
                    onClick={() => setSelectedPlayer(player)}
                    style={{
                      padding: "11px 14px", borderRadius: 6,
                      background: selectedPlayer === player ? "#1a1a2e" : "#111",
                      border: `1px solid ${selectedPlayer === player ? "#4444ff" : "#1e1e1e"}`,
                      color: selectedPlayer === player ? "white" : "#555",
                      cursor: "pointer", textAlign: "left",
                      fontSize: 12, fontFamily: "monospace",
                    }}
                  >{player}</button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={logEvent}
            disabled={!selectedEvent || !selectedTeam}
            style={{
              width: "100%", padding: 18, borderRadius: 8,
              background: selectedEvent && selectedTeam ? "white" : "#111",
              color: selectedEvent && selectedTeam ? "black" : "#333",
              border: "none", fontSize: 12, fontWeight: 700,
              letterSpacing: 4, cursor: selectedEvent && selectedTeam ? "pointer" : "not-allowed",
              fontFamily: "monospace",
            }}
          >
            {selectedEvent && selectedTeam
              ? `LOG ${EVENT_TYPES.find(e => e.id === selectedEvent)?.icon} ${EVENT_TYPES.find(e => e.id === selectedEvent)?.label.toUpperCase()}`
              : "SELECT EVENT + TEAM"}
          </button>
        </div>

        {/* Live Feed */}
        <div style={{ background: "#111", borderRadius: 12, padding: 16, maxHeight: 500, overflowY: "auto" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#444", marginBottom: 16 }}>LIVE FEED</div>
          {feed.length === 0 ? (
            <div style={{ color: "#2a2a2a", fontSize: 11, letterSpacing: 3, textAlign: "center", marginTop: 40 }}>NO EVENTS YET</div>
          ) : (
            feed.map(ev => (
              <div key={ev.id} style={{
                marginBottom: 10, padding: "12px 14px",
                background: "#0a0a0f", borderRadius: 8,
                borderLeft: `3px solid ${ev.color || "#333"}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ marginRight: 8 }}>{ev.icon}</span>
                    <span style={{ fontSize: 12 }}>{ev.label}</span>
                    <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>{ev.player} — {ev.team}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{ev.minute}'</div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}