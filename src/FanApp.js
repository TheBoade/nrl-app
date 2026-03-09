import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import HomeScreen from './HomeScreen';
import { NRL_TEAMS } from './data';

export default function FanApp() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [events, setEvents] = useState([]);
  const [latest, setLatest] = useState(null);
  const [score, setScore] = useState(null);
  const [animatingId, setAnimatingId] = useState(null);

  useEffect(() => {
    if (!selectedGame) return;

    const loadData = async () => {
      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      if (eventData) setEvents(eventData);

      const { data: scoreData } = await supabase
        .from('scores')
        .select('*')
        .eq('game_id', selectedGame.id)
        .single();
      if (scoreData) setScore(scoreData);
    };

    loadData();

    const eventChannel = supabase
      .channel('events')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'events',
      }, (payload) => {
        setLatest(payload.new);
        setAnimatingId(payload.new.id);
        setEvents(prev => [payload.new, ...prev]);
        setTimeout(() => setLatest(null), 5000);
        setTimeout(() => setAnimatingId(null), 600);
      })
      .subscribe();

    const scoreChannel = supabase
      .channel('scores')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'scores',
      }, (payload) => {
        setScore(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(eventChannel);
      supabase.removeChannel(scoreChannel);
    };
  }, [selectedGame]);

  if (!selectedGame) {
    return <HomeScreen onSelectGame={setSelectedGame} />;
  }

  const homeTeam = NRL_TEAMS[selectedGame.home];
  const awayTeam = NRL_TEAMS[selectedGame.away];

  const getEventColor = (label) => {
    const colors = {
      'Try': '#22c55e',
      'Conversion': '#86efac',
      'Penalty Goal': '#f59e0b',
      'Line Break': '#a855f7',
      'Sin Bin': '#eab308',
      'Send Off': '#ef4444',
      '40/20': '#06b6d4',
      'Penalty': '#f97316',
      'Drop Goal': '#ec4899',
    };
    return colors[label] || '#555';
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080810",
      color: "white",
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      maxWidth: 430,
      margin: "0 auto",
    }}>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes newEvent {
          0% { opacity: 0; transform: translateY(-12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .event-new { animation: newEvent 0.4s ease forwards; }
      `}</style>

      {/* Live alert */}
      {latest && (
        <div style={{
          position: "fixed",
          top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "100%", maxWidth: 430,
          zIndex: 1000,
          animation: "slideDown 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
          <div style={{
            background: getEventColor(latest.label),
            padding: "20px 24px",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ fontSize: 40 }}>{latest.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, color: "rgba(0,0,0,0.7)", marginBottom: 2, textTransform: "uppercase" }}>
                {latest.team}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "black" }}>
                {latest.label}
              </div>
              {latest.player && (
                <div style={{ fontSize: 14, color: "rgba(0,0,0,0.7)", fontWeight: 600, marginTop: 2 }}>
                  {latest.player} — {latest.minute}'
                </div>
              )}
            </div>
            {latest.points > 0 && (
              <div style={{
                background: "rgba(0,0,0,0.2)",
                borderRadius: 12, padding: "8px 14px", textAlign: "center",
              }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "black" }}>+{latest.points}</div>
                <div style={{ fontSize: 9, color: "rgba(0,0,0,0.6)", letterSpacing: 2 }}>PTS</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        padding: "52px 20px 0",
        position: "sticky", top: 0,
        background: "#080810", zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => setSelectedGame(null)}
            style={{
              background: "none", border: "none",
              color: "#666", fontSize: 24,
              cursor: "pointer", padding: 0, lineHeight: 1,
            }}
          >‹</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 10px #22c55e" }} />
            <span style={{ fontSize: 11, letterSpacing: 4, color: "#444" }}>LIVE</span>
          </div>
        </div>

        {/* Scoreboard */}
        <div style={{
          padding: "20px 0 20px",
          borderBottom: "1px solid #111",
        }}>
          {/* Team colour strips */}
          <div style={{ display: "flex", height: 3, borderRadius: 2, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ flex: 1, background: homeTeam?.color || "#333" }} />
            <div style={{ flex: 1, background: awayTeam?.color || "#333" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#555", letterSpacing: 3, marginBottom: 8, textTransform: "uppercase" }}>
                {selectedGame.home}
              </div>
              <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, letterSpacing: -2 }}>
                {score ? score.home_score : selectedGame.home_score ?? 0}
              </div>
            </div>
            <div style={{ padding: "0 16px", textAlign: "center" }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#333", marginBottom: 4 }}>
                {score ? `H${score.half}` : ""}
              </div>
              <div style={{ fontSize: 18, color: "#222" }}>—</div>
              <div style={{ fontSize: 12, color: "#444", marginTop: 4, fontWeight: 700 }}>
                {score ? `${score.minute}'` : selectedGame.time}
              </div>
            </div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#555", letterSpacing: 3, marginBottom: 8, textTransform: "uppercase" }}>
                {selectedGame.away}
              </div>
              <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, letterSpacing: -2 }}>
                {score ? score.away_score : selectedGame.away_score ?? 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event feed */}
      <div style={{ padding: "20px 16px 100px" }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: "#2a2a2a", marginBottom: 16 }}>MATCH EVENTS</div>
        {events.length === 0 ? (
          <div style={{ textAlign: "center", color: "#1a1a1a", fontSize: 11, letterSpacing: 3, marginTop: 60 }}>
            NO EVENTS YET
          </div>
        ) : (
          events.map(ev => {
            const color = getEventColor(ev.label);
            const isNew = ev.id === animatingId;
            return (
              <div
                key={ev.id}
                className={isNew ? "event-new" : ""}
                style={{
                  marginBottom: 10,
                  background: "#0f0f18",
                  borderRadius: 14,
                  overflow: "hidden",
                  border: `1px solid ${isNew ? color : "#111"}`,
                  transition: "border-color 0.5s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", gap: 14 }}>
                  <div style={{ width: 3, height: 44, borderRadius: 2, background: color, flexShrink: 0 }} />
                  <div style={{ fontSize: 28, flexShrink: 0 }}>{ev.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{
                        fontSize: 15, fontWeight: 800,
                        color: ev.label === 'Try' ? '#22c55e' : 'white',
                      }}>{ev.label}</span>
                      {ev.points > 0 && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: color,
                          background: `${color}22`, borderRadius: 4,
                          padding: "2px 6px", letterSpacing: 1,
                        }}>+{ev.points}</span>
                      )}
                    </div>
                    {ev.player && (
                      <div style={{ fontSize: 12, color: "#666", fontWeight: 500 }}>{ev.player}</div>
                    )}
                    <div style={{ fontSize: 10, color: "#333", marginTop: 2, letterSpacing: 2, textTransform: "uppercase" }}>
                      {ev.team}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "#333" }}>{ev.minute}'</div>
                    <div style={{ fontSize: 9, color: "#222", letterSpacing: 1, marginTop: 2 }}>H{ev.half}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
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
          <button
            key={tab.label}
            style={{
              background: "none", border: "none",
              color: i === 0 ? "white" : "#333",
              cursor: "pointer", textAlign: "center",
              fontFamily: "inherit",
            }}
          >
            <div style={{ fontSize: 22 }}>{tab.icon}</div>
            <div style={{ fontSize: 10, letterSpacing: 2, marginTop: 4 }}>{tab.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}