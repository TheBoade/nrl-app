import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { NRL_TEAMS } from './data';

const STAT_TABS = [
  { id: 'points', label: 'Points' },
  { id: 'tries', label: 'Tries' },
  { id: 'goals', label: 'Goals' },
  { id: 'lineBreaks', label: 'Line Breaks' },
  { id: 'sinBins', label: 'Sin Bins' },
];

function TeamAvatar({ team, number, name, size = 44 }) {
  const t = NRL_TEAMS[team];
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2) : '??';
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      overflow: "hidden", position: "relative",
      border: "2px solid #1a1a1a", flexShrink: 0,
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
        <div style={{ fontSize: size * 0.17, color: "rgba(255,255,255,0.7)", fontWeight: 700, lineHeight: 1 }}>{number}</div>
        <div style={{ fontSize: size * 0.25, color: "white", fontWeight: 900, lineHeight: 1 }}>{initials}</div>
      </div>
    </div>
  );
}

export default function StatsScreen({ onBack }) {
  const [activeTab, setActiveTab] = useState('points');
  const [playerStats, setPlayerStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const { data: events } = await supabase.from('events').select('*');
      if (!events) { setLoading(false); return; }

      const stats = {};
      events.forEach(ev => {
        if (!ev.player) return;
        if (!stats[ev.player]) {
          stats[ev.player] = {
            name: ev.player,
            team: ev.team,
            tries: 0, goals: 0, points: 0, lineBreaks: 0, sinBins: 0,
          };
        }
        if (ev.label === 'Try') stats[ev.player].tries += 1;
        if (['Conversion', 'Penalty Goal', 'Drop Goal'].includes(ev.label)) stats[ev.player].goals += 1;
        if (ev.label === 'Line Break') stats[ev.player].lineBreaks += 1;
        if (ev.label === 'Sin Bin') stats[ev.player].sinBins += 1;
        if (ev.points) stats[ev.player].points += Number(ev.points);
      });

      setPlayerStats(stats);
      setLoading(false);
    };

    loadStats();

    const channel = supabase.channel('stats-events')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'events' }, () => {
        loadStats();
      }).subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const getSortedPlayers = () => {
    return Object.values(playerStats)
      .filter(p => p[activeTab] > 0)
      .sort((a, b) => b[activeTab] - a[activeTab]);
  };

  const getStatLabel = () => {
    const labels = {
      points: 'PTS', tries: 'T', goals: 'G', lineBreaks: 'LB', sinBins: 'SB',
    };
    return labels[activeTab] || activeTab;
  };

  const getStatColor = () => {
    const colors = {
      points: '#22c55e', tries: '#22c55e', goals: '#86efac',
      lineBreaks: '#a855f7', sinBins: '#eab308',
    };
    return colors[activeTab] || 'white';
  };

  const sorted = getSortedPlayers();

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
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px 12px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#666", fontSize: 24, cursor: "pointer", padding: 0 }}>‹</button>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.5 }}>Stats</div>
          <div style={{ fontSize: 10, color: "#444", letterSpacing: 2, marginTop: 2 }}>2026 SEASON</div>
        </div>

        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none", padding: "0 20px 12px", gap: 8 }}>
          {STAT_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "8px 14px", borderRadius: 20, flexShrink: 0,
              background: activeTab === tab.id ? "white" : "transparent",
              border: `1px solid ${activeTab === tab.id ? "white" : "#222"}`,
              color: activeTab === tab.id ? "black" : "#444",
              fontSize: 12, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 100px" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#333", fontSize: 11, letterSpacing: 3, marginTop: 60 }}>LOADING...</div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: "center", color: "#222", fontSize: 11, letterSpacing: 3, marginTop: 60 }}>NO DATA YET</div>
        ) : (
          <div style={{ background: "#0f0f18", borderRadius: 16, border: "1px solid #111", overflow: "hidden" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "32px 44px 1fr 48px",
              padding: "10px 16px", borderBottom: "1px solid #111",
              fontSize: 9, color: "#444", letterSpacing: 2,
            }}>
              <div>#</div>
              <div />
              <div>PLAYER</div>
              <div style={{ textAlign: "center" }}>{getStatLabel()}</div>
            </div>

            {sorted.map((player, i) => (
              <div key={player.name} style={{
                display: "grid", gridTemplateColumns: "32px 44px 1fr 48px",
                padding: "12px 16px",
                borderBottom: i < sorted.length - 1 ? "1px solid #0a0a12" : "none",
                alignItems: "center",
              }}>
                <div style={{
                  fontSize: i < 3 ? 14 : 11, fontWeight: 900,
                  color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#333",
                }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                </div>

                <TeamAvatar team={player.team} number={i + 1} name={player.name} size={36} />

                <div style={{ paddingLeft: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{player.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                    <div style={{ width: 14, height: 8, borderRadius: 2, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                      {[NRL_TEAMS[player.team]?.c1, NRL_TEAMS[player.team]?.c2, NRL_TEAMS[player.team]?.c3].map((c, j) => (
                        <div key={j} style={{ flex: 1, background: c || "#333" }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 10, color: "#555" }}>{player.team}</span>
                  </div>
                </div>

                <div style={{ textAlign: "center", fontSize: 20, fontWeight: 900, color: getStatColor() }}>
                  {player[activeTab]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}