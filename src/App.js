import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import FanApp from './FanApp';
import AdminDashboard from './AdminDashboard';

const ADMIN_PASSWORD = 'nrl2026';

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminInput, setAdminInput] = useState('');

  const params = new URLSearchParams(window.location.search);
  const isFan = params.has('fan');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loadingSession) {
    return (
      <div style={{
        minHeight: "100vh", background: "#080810",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}>
        <div style={{ fontSize: 32, fontWeight: 900, fontStyle: "italic", color: "white", letterSpacing: -1 }}>Pulse</div>
      </div>
    );
  }

  if (isFan) return <FanApp session={session} />;

  if (!adminUnlocked) {
    return (
      <div style={{
        minHeight: "100vh", background: "#080810",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 900, fontStyle: "italic", color: "white", letterSpacing: -1, marginBottom: 32 }}>Pulse</div>
          <input
            type="password"
            placeholder="Operator password"
            value={adminInput}
            onChange={e => setAdminInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && adminInput === ADMIN_PASSWORD && setAdminUnlocked(true)}
            style={{
              background: "#13131f", border: "1px solid #2a2a3a",
              borderRadius: 12, padding: "14px 20px", color: "white",
              fontSize: 14, fontFamily: "inherit", outline: "none",
              marginBottom: 12, display: "block", width: 260, boxSizing: "border-box",
            }}
          />
          <button
            onClick={() => adminInput === ADMIN_PASSWORD && setAdminUnlocked(true)}
            style={{
              width: 260, padding: "14px", borderRadius: 12,
              background: "white", border: "none", color: "black",
              fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
            }}
          >Enter</button>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}