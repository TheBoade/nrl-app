import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { NRL_TEAMS } from './data';
import Auth from './Auth';

function TeamAvatar({ team, number, name, size = 52 }) {
  const t = NRL_TEAMS[team];
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2) : '??';
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
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
    </div>
  );
}

function Countdown({ game, session, onAuthRequest }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 34, seconds: 12 });
  const [messages, setMessages] = useState([
    { id: 1, user: "BlakeH", team: "Broncos", text: "Broncos by 10 tonight 🔥", time: "6:22pm", upvotes: 5, upvoted: false },
    { id: 2, user: "StormFan99", team: "Storm", text: "Storm too strong, easy win", time: "6:25pm", upvotes: 3, upvoted: false },
    { id: 3, user: "NRLwatcher", team: "Raiders", text: "Should be a great game!", time: "6:28pm", upvotes: 1, upvoted: false },
  ]);
  const [input, setInput] = useState('');
  const [chatSort, setChatSort] = useState('Top');

  const handleUpvote = (id) => {
    if (!session) { onAuthRequest(); return; }
    setMessages(prev => prev.map(m =>
      m.id === id ? { ...m, upvotes: m.upvoted ? m.upvotes - 1 : m.upvotes + 1, upvoted: !m.upvoted } : m
    ));
  };

  const handleSend = () => {
    if (!session || !input.trim()) return;
    const newMsg = {
      id: Date.now(),
      user: session.user.email.split('@')[0],
      team: "Broncos",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      upvotes: 0,
      upvoted: false,
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  const sortedMessages = [...messages].sort((a, b) =>
    chatSort === 'Top' ? b.upvotes - a.upvotes : b.id - a.id
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t.seconds > 0) return { ...t, seconds: t.seconds - 1 };
        if (t.minutes > 0) return { ...t, minutes: t.minutes - 1, seconds: 59 };
        if (t.hours > 0) return { hours: t.hours - 1, minutes: 59, seconds: 59 };
        return t;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = n => String(n).padStart(2, '0');

  return (
    <div style={{ padding: "24px 20px 120px" }}>
      {/* Countdown timer */}
      <div style={{
        background: "#0f0f18", borderRadius: 16,
        padding: "28px 20px", textAlign: "center",
        border: "1px solid #111", marginBottom: 20,
      }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: "#444", marginBottom: 20 }}>KICKOFF IN</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          {[
            { label: "HRS", value: pad(timeLeft.hours) },
            { label: "MIN", value: pad(timeLeft.minutes) },
            { label: "SEC", value: pad(timeLeft.seconds) },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                background: "#13131f", borderRadius: 10,
                padding: "12px 16px", minWidth: 64, border: "1px solid #1a1a1a",
              }}>
                <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, lineHeight: 1 }}>{item.value}</div>
              </div>
              <div style={{ fontSize: 9, color: "#444", letterSpacing: 3, marginTop: 6 }}>{item.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#444", letterSpacing: 2 }}>{game.venue}</div>
      </div>

      {/* Chat */}
      <div style={{ background: "#0f0f18", borderRadius: 16, border: "1px solid #111", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>Match Chat</div>
          <div style={{ display: "flex", gap: 4 }}>
            {['Top', 'New'].map(tab => (
              <button key={tab} onClick={() => setChatSort(tab)} style={{
                padding: "4px 10px", borderRadius: 20,
                background: chatSort === tab ? "white" : "transparent",
                border: `1px solid ${chatSort === tab ? "white" : "#222"}`,
                color: chatSort === tab ? "black" : "#444",
                fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}>{tab}</button>
            ))}
          </div>
        </div>

        {/* Messages — no fixed height, just natural scroll with page */}
        <div style={{ padding: "12px 16px" }}>
          {sortedMessages.map(msg => {
            const t = NRL_TEAMS[msg.team];
            return (
              <div key={msg.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    overflow: "hidden", display: "flex", flexDirection: "column", flexShrink: 0,
                  }}>
                    {[t?.c1, t?.c2, t?.c3].map((c, i) => <div key={i} style={{ flex: 1, background: c || "#333" }} />)}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{msg.user}</span>
                  <span style={{ fontSize: 10, color: "#333" }}>{msg.time}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 32 }}>
                  <div style={{ fontSize: 13, color: "#aaa" }}>{msg.text}</div>
                  <button onClick={() => handleUpvote(msg.id)} style={{
                    background: "none", border: "none",
                    display: "flex", alignItems: "center", gap: 4,
                    cursor: "pointer", padding: "2px 4px", flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 13 }}>👍</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: msg.upvoted ? "white" : "#444" }}>{msg.upvotes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #111", display: "flex", gap: 10, alignItems: "center" }}>
          <div
            onClick={() => !session && onAuthRequest()}
            style={{ flex: 1, background: "#13131f", borderRadius: 20, border: "1px solid #1a1a1a", padding: "10px 16px" }}
          >
            <input
              value={input}
              onChange={e => session && setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={session ? "Say something..." : "Sign in to chat..."}
              style={{
                background: "none", border: "none",
                color: session ? "white" : "#444",
                fontSize: 13, width: "100%", outline: "none",
                fontFamily: "inherit", cursor: session ? "text" : "pointer",
              }}
            />
          </div>
          <button onClick={handleSend} style={{
            background: session && input.trim() ? "white" : "#13131f",
            border: "1px solid #1a1a1a", borderRadius: "50%",
            width: 36, height: 36,
            color: session && input.trim() ? "black" : "#333",
            cursor: session ? "pointer" : "not-allowed", fontSize: 14,
          }}>→</button>
        </div>
      </div>
    </div>
  );
}

function Matchup({ game }) {
  const ht = NRL_TEAMS[game.home];
  const at = NRL_TEAMS[game.away];

  const h2h = [
    { date: "Rd 14, 2025", home: game.home, away: game.away, home_score: 24, away_score: 18 },
    { date: "Rd 6, 2025", home: game.away, away: game.home, home_score: 16, away_score: 22 },
    { date: "Rd 18, 2024", home: game.home, away: game.away, home_score: 30, away_score: 10 },
  ];

  const stats = {
    [game.home]: { avgFor: 24.4, avgAgainst: 18.2, wins: 2 },
    [game.away]: { avgFor: 21.8, avgAgainst: 22.6, wins: 1 },
  };

  return (
    <div style={{ padding: "24px 20px 120px" }}>
      <div style={{ background: "#0f0f18", borderRadius: 16, padding: "20px", border: "1px solid #111", marginBottom: 16 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: "#444", marginBottom: 16 }}>TEAM STATS</div>
        {[
          { label: "Avg Points Scored", home: stats[game.home].avgFor, away: stats[game.away].avgFor, higher: "good" },
          { label: "Avg Points Conceded", home: stats[game.home].avgAgainst, away: stats[game.away].avgAgainst, higher: "bad" },
          { label: "H2H Wins (last 3)", home: stats[game.home].wins, away: stats[game.away].wins, higher: "good" },
        ].map((stat, i) => {
          const homeWins = stat.higher === "good" ? stat.home >= stat.away : stat.home <= stat.away;
          return (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "#444", letterSpacing: 2, textAlign: "center", marginBottom: 8 }}>{stat.label}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, textAlign: "right" }}>
                  <span style={{ fontSize: 20, fontWeight: homeWins ? 900 : 400, color: homeWins ? "white" : "#555" }}>{stat.home}</span>
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  {[ht?.c1, ht?.c2, ht?.c3].map((c, i) => <div key={i} style={{ width: 4, height: 20, background: c }} />)}
                  <div style={{ width: 8 }} />
                  {[at?.c1, at?.c2, at?.c3].map((c, i) => <div key={i} style={{ width: 4, height: 20, background: c }} />)}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 20, fontWeight: !homeWins ? 900 : 400, color: !homeWins ? "white" : "#555" }}>{stat.away}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: "#0f0f18", borderRadius: 16, padding: "20px", border: "1px solid #111" }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: "#444", marginBottom: 16 }}>LAST 3 MEETINGS</div>
        {h2h.map((match, i) => {
          const homeWon = match.home_score > match.away_score;
          const mht = NRL_TEAMS[match.home];
          const mat = NRL_TEAMS[match.away];
          return (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < h2h.length - 1 ? "1px solid #111" : "none" }}>
              <div style={{ fontSize: 10, color: "#444", letterSpacing: 2, marginBottom: 8 }}>{match.date}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: !homeWon ? 0.4 : 1 }}>
                  <div style={{ width: 16, height: 10, borderRadius: 2, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    {[mht?.c1, mht?.c2, mht?.c3].map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: homeWon ? 800 : 400, color: homeWon ? "white" : "#555" }}>{match.home}</span>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: homeWon ? 900 : 400, color: homeWon ? "white" : "#555" }}>{match.home_score}</span>
                  <span style={{ fontSize: 11, color: "#333" }}>—</span>
                  <span style={{ fontSize: 16, fontWeight: !homeWon ? 900 : 400, color: !homeWon ? "white" : "#555" }}>{match.away_score}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: homeWon ? 0.4 : 1 }}>
                  <span style={{ fontSize: 12, fontWeight: !homeWon ? 800 : 400, color: !homeWon ? "white" : "#555" }}>{match.away}</span>
                  <div style={{ width: 16, height: 10, borderRadius: 2, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    {[mat?.c1, mat?.c2, mat?.c3].map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Players({ game }) {
  const homePlayers = [
    { number: 1, name: "Reece Walsh", position: "FB", tries: 0, runMetres: 0, tackles: 0 },
    { number: 2, name: "Selwyn Cobbo", position: "W", tries: 0, runMetres: 0, tackles: 0 },
    { number: 3, name: "Kotoni Staggs", position: "C", tries: 0, runMetres: 0, tackles: 0 },
    { number: 4, name: "Herbie Farnworth", position: "C", tries: 0, runMetres: 0, tackles: 0 },
    { number: 5, name: "Ezra Mam", position: "W", tries: 0, runMetres: 0, tackles: 0 },
    { number: 6, name: "Jock Madden", position: "5/8", tries: 0, runMetres: 0, tackles: 0 },
    { number: 7, name: "Adam Reynolds", position: "HB", tries: 0, runMetres: 0, tackles: 0 },
    { number: 8, name: "Payne Haas", position: "P", tries: 0, runMetres: 0, tackles: 0 },
    { number: 9, name: "Billy Walters", position: "HK", tries: 0, runMetres: 0, tackles: 0 },
    { number: 10, name: "Pat Carrigan", position: "P", tries: 0, runMetres: 0, tackles: 0 },
    { number: 11, name: "Jordan Riki", position: "2RF", tries: 0, runMetres: 0, tackles: 0 },
    { number: 12, name: "Kurt Capewell", position: "2RF", tries: 0, runMetres: 0, tackles: 0 },
    { number: 13, name: "Tevita Pangai Jr", position: "L", tries: 0, runMetres: 0, tackles: 0 },
  ];

  const awayPlayers = [
    { number: 1, name: "Ryan Papenhuyzen", position: "FB", tries: 0, runMetres: 0, tackles: 0 },
    { number: 2, name: "Xavier Coates", position: "W", tries: 0, runMetres: 0, tackles: 0 },
    { number: 3, name: "Reimis Smith", position: "C", tries: 0, runMetres: 0, tackles: 0 },
    { number: 4, name: "Tyran Wishart", position: "C", tries: 0, runMetres: 0, tackles: 0 },
    { number: 5, name: "Nick Meaney", position: "W", tries: 0, runMetres: 0, tackles: 0 },
    { number: 6, name: "Cam Munster", position: "5/8", tries: 0, runMetres: 0, tackles: 0 },
    { number: 7, name: "Jahrome Hughes", position: "HB", tries: 0, runMetres: 0, tackles: 0 },
    { number: 8, name: "Christian Welch", position: "P", tries: 0, runMetres: 0, tackles: 0 },
    { number: 9, name: "Harry Grant", position: "HK", tries: 0, runMetres: 0, tackles: 0 },
    { number: 10, name: "Nelson Asofa-Solomona", position: "P", tries: 0, runMetres: 0, tackles: 0 },
    { number: 11, name: "Eli Katoa", position: "2RF", tries: 0, runMetres: 0, tackles: 0 },
    { number: 12, name: "Shawn Blore", position: "2RF", tries: 0, runMetres: 0, tackles: 0 },
    { number: 13, name: "Trent Loiero", position: "L", tries: 0, runMetres: 0, tackles: 0 },
  ];

  const [activeTeam, setActiveTeam] = useState('home');
  const players = activeTeam === 'home' ? homePlayers : awayPlayers;
  const team = activeTeam === 'home' ? game.home : game.away;

  return (
    <div style={{ padding: "20px 20px 120px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {['home', 'away'].map(side => {
          const sideTeam = side === 'home' ? game.home : game.away;
          const st = NRL_TEAMS[sideTeam];
          return (
            <button key={side} onClick={() => setActiveTeam(side)} style={{
              flex: 1, padding: "10px 16px", borderRadius: 10,
              background: activeTeam === side ? "#13131f" : "transparent",
              border: `1px solid ${activeTeam === side ? "#2a2a3a" : "#111"}`,
              color: activeTeam === side ? "white" : "#444",
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <div style={{ width: 16, height: 10, borderRadius: 2, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {[st?.c1, st?.c2, st?.c3].map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{sideTeam}</span>
            </button>
          );
        })}
      </div>

      <div style={{ background: "#0f0f18", borderRadius: 16, border: "1px solid #111", overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "40px 1fr 40px 60px 60px",
          padding: "10px 16px", borderBottom: "1px solid #111",
          fontSize: 9, color: "#444", letterSpacing: 2,
        }}>
          <div>#</div><div>PLAYER</div>
          <div style={{ textAlign: "center" }}>T</div>
          <div style={{ textAlign: "center" }}>METRES</div>
          <div style={{ textAlign: "center" }}>TACKLES</div>
        </div>
        {players.map((player, i) => (
          <div key={player.number} style={{
            display: "grid", gridTemplateColumns: "40px 1fr 40px 60px 60px",
            padding: "12px 16px",
            borderBottom: i < players.length - 1 ? "1px solid #0a0a12" : "none",
            alignItems: "center",
          }}>
            <div><TeamAvatar team={team} number={player.number} name={player.name} size={32} /></div>
            <div style={{ paddingLeft: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{player.name}</div>
              <div style={{ fontSize: 10, color: "#444", marginTop: 2, letterSpacing: 1 }}>{player.position}</div>
            </div>
            <div style={{ textAlign: "center", fontSize: 13, fontWeight: player.tries > 0 ? 900 : 400, color: player.tries > 0 ? "#22c55e" : "#333" }}>{player.tries}</div>
            <div style={{ textAlign: "center", fontSize: 13, color: player.runMetres > 0 ? "white" : "#333" }}>{player.runMetres}</div>
            <div style={{ textAlign: "center", fontSize: 13, color: player.tackles > 0 ? "white" : "#333" }}>{player.tackles}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GameScreen({ game, onBack, session }) {
  const [activeTab, setActiveTab] = useState('live');
  const [events, setEvents] = useState([]);
  const [latest, setLatest] = useState(null);
  const [score, setScore] = useState(null);
  const [animatingId, setAnimatingId] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  const isUpcoming = game.status === 'upcoming';
  const ht = NRL_TEAMS[game.home];
  const at = NRL_TEAMS[game.away];

  useEffect(() => {
    const loadData = async () => {
      const { data: eventData } = await supabase.from('events').select('*').order('created_at', { ascending: false });
      if (eventData) setEvents(eventData);
      const { data: scoreData } = await supabase.from('scores').select('*').eq('game_id', game.id).single();
      if (scoreData) setScore(scoreData);
    };
    loadData();

    const eventChannel = supabase.channel('events')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'events' }, (payload) => {
        setLatest(payload.new);
        setAnimatingId(payload.new.id);
        setEvents(prev => [payload.new, ...prev]);
        setTimeout(() => setLatest(null), 5000);
        setTimeout(() => setAnimatingId(null), 600);
      }).subscribe();

    const scoreChannel = supabase.channel('scores')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, (payload) => {
        setScore(payload.new);
      }).subscribe();

    return () => {
      supabase.removeChannel(eventChannel);
      supabase.removeChannel(scoreChannel);
    };
  }, [game]);

  const getEventColor = (label) => {
    const colors = {
      'Try': '#22c55e', 'Conversion': '#86efac', 'Penalty Goal': '#f59e0b',
      'Line Break': '#a855f7', 'Sin Bin': '#eab308', 'Send Off': '#ef4444',
      '40/20': '#06b6d4', 'Penalty': '#f97316', 'Drop Goal': '#ec4899',
    };
    return colors[label] || '#555';
  };

  const tabs = [
    { id: 'live', label: isUpcoming ? 'Info' : 'Live' },
    { id: 'matchup', label: 'Matchup' },
    { id: 'players', label: 'Players' },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#080810", color: "white",
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      maxWidth: 430, margin: "0 auto",
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

      {latest && (
        <div style={{
          position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 430, zIndex: 1000,
          animation: "slideDown 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
          <div style={{
            background: getEventColor(latest.label),
            padding: "20px 24px", display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ fontSize: 40 }}>{latest.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, color: "rgba(0,0,0,0.7)", marginBottom: 2, textTransform: "uppercase" }}>{latest.team}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "black" }}>{latest.label}</div>
              {latest.player && <div style={{ fontSize: 14, color: "rgba(0,0,0,0.7)", fontWeight: 600, marginTop: 2 }}>{latest.player} — {latest.minute}'</div>}
            </div>
            {latest.points > 0 && (
              <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: "8px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "black" }}>+{latest.points}</div>
                <div style={{ fontSize: 9, color: "rgba(0,0,0,0.6)", letterSpacing: 2 }}>PTS</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ background: "#13131f", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid #2a2a3a" }}>
        <div style={{ height: 36 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px 12px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#666", fontSize: 24, cursor: "pointer", padding: 0 }}>‹</button>
          {game.status === 'live' && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 10px #22c55e" }} />
              <span style={{ fontSize: 11, letterSpacing: 4, color: "#22c55e" }}>LIVE</span>
            </div>
          )}
          {game.status === 'upcoming' && <span style={{ fontSize: 11, letterSpacing: 4, color: "#444" }}>UPCOMING</span>}
          {game.status === 'full_time' && <span style={{ fontSize: 11, letterSpacing: 4, color: "#444" }}>FULL TIME</span>}
        </div>

        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ display: "flex", height: 4, borderRadius: 2, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {[ht?.c1, ht?.c2, ht?.c3].map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {[at?.c1, at?.c2, at?.c3].map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#555", letterSpacing: 3, marginBottom: 6, textTransform: "uppercase" }}>{game.home}</div>
              <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: -2 }}>{score ? score.home_score : game.home_score ?? 0}</div>
            </div>
            <div style={{ padding: "0 16px", textAlign: "center" }}>
              {score && <div style={{ fontSize: 10, letterSpacing: 3, color: "#333", marginBottom: 4 }}>H{score.half}</div>}
              <div style={{ fontSize: 18, color: "#222" }}>—</div>
              <div style={{ fontSize: 12, color: "#444", marginTop: 4, fontWeight: 700 }}>{score ? `${score.minute}'` : game.time}</div>
            </div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#555", letterSpacing: 3, marginBottom: 6, textTransform: "uppercase" }}>{game.away}</div>
              <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: -2 }}>{score ? score.away_score : game.away_score ?? 0}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", borderTop: "1px solid #111" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: "12px 0", background: "none", border: "none",
              color: activeTab === tab.id ? "white" : "#444",
              fontSize: 12, fontWeight: activeTab === tab.id ? 800 : 400,
              cursor: "pointer", fontFamily: "inherit", letterSpacing: 1,
              borderBottom: activeTab === tab.id ? "2px solid white" : "2px solid transparent",
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      {activeTab === 'live' && (
        isUpcoming
          ? <Countdown game={game} session={session} onAuthRequest={() => setShowAuth(true)} />
          : (
            <div style={{ padding: "20px 16px 120px" }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#2a2a2a", marginBottom: 16 }}>MATCH EVENTS</div>
              {events.length === 0 ? (
                <div style={{ textAlign: "center", color: "#1a1a1a", fontSize: 11, letterSpacing: 3, marginTop: 60 }}>NO EVENTS YET</div>
              ) : (
                events.map((ev, i) => {
                  const color = getEventColor(ev.label);
                  const isNew = ev.id === animatingId;
                  return (
                    <div key={ev.id} className={isNew ? "event-new" : ""} style={{
                      marginBottom: 10, background: "#0f0f18", borderRadius: 14,
                      overflow: "hidden", border: `1px solid ${isNew ? color : "#111"}`,
                      transition: "border-color 0.5s ease",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", gap: 14 }}>
                        <div style={{ width: 3, height: 44, borderRadius: 2, background: color, flexShrink: 0 }} />
                        <div style={{ fontSize: 28, flexShrink: 0 }}>{ev.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                            <span style={{ fontSize: 15, fontWeight: 800, color: ev.label === 'Try' ? '#22c55e' : 'white' }}>{ev.label}</span>
                            {ev.points > 0 && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: color, background: `${color}22`, borderRadius: 4, padding: "2px 6px", letterSpacing: 1 }}>+{ev.points}</span>
                            )}
                          </div>
                          {ev.player && <div style={{ fontSize: 12, color: "#666", fontWeight: 500 }}>{ev.player}</div>}
                          <div style={{ fontSize: 10, color: "#333", marginTop: 2, letterSpacing: 2, textTransform: "uppercase" }}>{ev.team}</div>
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
          )
      )}
      {activeTab === 'matchup' && <Matchup game={game} />}
      {activeTab === 'players' && <Players game={game} />}

      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, background: "#080810",
        borderTop: "1px solid #111", padding: "12px 0 28px",
        display: "flex", justifyContent: "space-around",
      }}>
        {[{ icon: "🏉", label: "Games" }, { icon: "📊", label: "Stats" }, { icon: "🃏", label: "Cards" }].map((tab, i) => (
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

      {showAuth && <Auth onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}
    </div>
  );
}