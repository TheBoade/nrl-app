import { useState } from 'react';
import { supabase } from './supabase';

export default function Auth({ onClose, onSuccess }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else { onSuccess(); onClose(); }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else { onSuccess(); onClose(); }
    }
    setLoading(false);
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        zIndex: 200, backdropFilter: "blur(4px)",
      }} />
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, zIndex: 201,
        background: "#13131f", borderRadius: "24px 24px 0 0",
        border: "1px solid #2a2a3a", borderBottom: "none",
        padding: "32px 24px 48px",
        animation: "slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        <style>{`
          @keyframes slideUp {
            from { transform: translateX(-50%) translateY(100%); }
            to { transform: translateX(-50%) translateY(0); }
          }
        `}</style>
        <div style={{ width: 40, height: 4, background: "#2a2a3a", borderRadius: 2, margin: "0 auto 28px" }} />
        <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom: 6 }}>
          {mode === 'signin' ? 'Welcome back' : 'Create account'}
        </div>
        <div style={{ fontSize: 13, color: "#444", marginBottom: 28 }}>
          {mode === 'signin' ? 'Sign in to chat and earn rewards' : 'Join Pulse to chat and earn rewards'}
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#444", marginBottom: 8 }}>EMAIL</div>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            style={{
              width: "100%", background: "#080810", border: "1px solid #2a2a3a",
              borderRadius: 12, padding: "14px 16px", color: "white",
              fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#444", marginBottom: 8 }}>PASSWORD</div>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              width: "100%", background: "#080810", border: "1px solid #2a2a3a",
              borderRadius: 12, padding: "14px 16px", color: "white",
              fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
        {error && (
          <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 16, padding: "10px 14px", background: "#ef444422", borderRadius: 8 }}>
            {error}
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", padding: "16px", borderRadius: 14,
            background: "white", border: "none", color: "black",
            fontSize: 15, fontWeight: 900, cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit", opacity: loading ? 0.6 : 1, marginBottom: 16,
          }}
        >
          {loading ? "..." : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
        <div style={{ textAlign: "center", fontSize: 13, color: "#444" }}>
          {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
            style={{ color: "white", fontWeight: 700, cursor: "pointer" }}
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </>
  );
}