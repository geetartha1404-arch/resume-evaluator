"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

type Tab = "signin" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [user, loading, router]);

  const handleUpsertUser = async (
    id: string,
    email: string,
    name: string | null,
    avatar: string | null,
    provider: string
  ) => {
    const res = await fetch("/api/upsert-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email, full_name: name, avatar_url: avatar, provider }),
    });
    const data = await res.json();
    return data; // { isNew, profile }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (tab === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (data.user) {
          const result = await handleUpsertUser(
            data.user.id, email, fullName || null, null, "email"
          );
          if (result.isNew) {
            await fetch("/api/send-welcome", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, name: fullName }),
            });
          }
          setSuccess("Account created! Check your email to confirm, then sign in.");
          setTab("signin");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        if (data.user) {
          await handleUpsertUser(
            data.user.id, data.user.email!, data.user.user_metadata?.full_name || null, null, "email"
          );
          router.replace("/");
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  };

  if (loading) return null;

  return (
    <div className="auth-root">
      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <div className="auth-blueprint-grid" />
        <div className="auth-mesh" />

        {/* Logo */}
        <div className="auth-logo-wrap">
          <img src="/reevalve_nobg.png" alt="reevalve" className="auth-logo" />
        </div>

        {/* Floating cards */}
        <div className="auth-cards">
          <div className="auth-card auth-card--1">
            <span className="auth-card__dot" />
            <span className="auth-card__label">RESUME GAP ANALYSIS</span>
            <span className="auth-card__value">94% accuracy</span>
          </div>
          <div className="auth-card auth-card--2">
            <span className="auth-card__dot auth-card__dot--green" />
            <span className="auth-card__label">ROLES MAPPED</span>
            <span className="auth-card__value">PM · Strategy · Ops</span>
          </div>
          <div className="auth-card auth-card--3">
            <span className="auth-card__dot auth-card__dot--amber" />
            <span className="auth-card__label">SYSTEM STATUS</span>
            <span className="auth-card__value">OPERATIONAL</span>
          </div>
        </div>

        {/* Headline */}
        <div className="auth-hero-text">
          <p className="auth-sys-tag">SYS.AUTH // ACCESS TERMINAL</p>
          <h1 className="auth-headline">
            You have the talent.<br />
            <span className="auth-headline--accent">We have the coordinates.</span>
          </h1>
          <p className="auth-subline">
            Map your career gaps. Build your proof-of-capability path.
          </p>
        </div>

        {/* Radar ring decoration */}
        <div className="auth-radar">
          <div className="auth-radar__ring auth-radar__ring--1" />
          <div className="auth-radar__ring auth-radar__ring--2" />
          <div className="auth-radar__ring auth-radar__ring--3" />
          <div className="auth-radar__sweep" />
          <div className="auth-radar__dot" />
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="auth-form-card">
          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === "signin" ? "auth-tab--active" : ""}`}
              onClick={() => { setTab("signin"); setError(null); setSuccess(null); }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${tab === "signup" ? "auth-tab--active" : ""}`}
              onClick={() => { setTab("signup"); setError(null); setSuccess(null); }}
            >
              Create Account
            </button>
            <div className={`auth-tab-indicator ${tab === "signup" ? "auth-tab-indicator--right" : ""}`} />
          </div>

          <div className="auth-form-body">
            <p className="auth-form-eyebrow">
              {tab === "signin" ? "Welcome back, operative." : "Initialize your account."}
            </p>

            {/* Google */}
            <button type="button" onClick={handleGoogle} className="auth-google-btn">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="auth-divider">
              <span className="auth-divider__line" />
              <span className="auth-divider__text">or</span>
              <span className="auth-divider__line" />
            </div>

            {/* Alerts */}
            {error && <div className="auth-alert auth-alert--error">{error}</div>}
            {success && <div className="auth-alert auth-alert--success">{success}</div>}

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="auth-fields">
              {tab === "signup" && (
                <div className="auth-field">
                  <label className="auth-label">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Alex Chen"
                    className="auth-input"
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="auth-field">
                <label className="auth-label">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="auth-input"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input"
                  required
                  minLength={6}
                  autoComplete={tab === "signup" ? "new-password" : "current-password"}
                />
              </div>

              <button type="submit" disabled={submitting} className="auth-submit-btn">
                {submitting ? (
                  <span className="auth-spinner" />
                ) : tab === "signin" ? (
                  "Access System →"
                ) : (
                  "Initialize Account →"
                )}
              </button>
            </form>

            <p className="auth-switch">
              {tab === "signin" ? "No account yet? " : "Already have one? "}
              <button
                type="button"
                onClick={() => { setTab(tab === "signin" ? "signup" : "signin"); setError(null); }}
                className="auth-switch__link"
              >
                {tab === "signin" ? "Create account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        <p className="auth-footer-note">
          © {new Date().getFullYear()} reevalve Inc. — SYS.LOC: AUTH_TERMINAL
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;0,6..96,900;1,6..96,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .auth-root {
          display: flex;
          min-height: 100vh;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #F8FAFC;
        }

        /* ── LEFT PANEL ── */
        .auth-left {
          position: relative;
          width: 52%;
          background: #060F2E;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 48px;
        }

        .auth-blueprint-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(15,98,254,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15,98,254,0.12) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .auth-mesh {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 80% 20%, rgba(15,98,254,0.22) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 10% 80%, rgba(3,74,217,0.18) 0%, transparent 60%);
          pointer-events: none;
        }

        /* Logo */
        .auth-logo-wrap {
          position: absolute;
          top: 40px;
          left: 48px;
          z-index: 10;
        }
        .auth-logo {
          height: 56px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
          transform: scale(2.6);
          transform-origin: left center;
        }

        /* Floating cards */
        .auth-cards {
          position: absolute;
          top: 120px;
          right: 48px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 10;
        }
        .auth-card {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(15,98,254,0.25);
          backdrop-filter: blur(12px);
          border-radius: 10px;
          padding: 10px 16px;
          animation: auth-float 6s ease-in-out infinite;
        }
        .auth-card--1 { animation-delay: 0s; }
        .auth-card--2 { animation-delay: 2s; }
        .auth-card--3 { animation-delay: 4s; }
        @keyframes auth-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .auth-card__dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #0F62FE;
          flex-shrink: 0;
          box-shadow: 0 0 6px #0F62FE;
          animation: pulse 2s ease-in-out infinite;
        }
        .auth-card__dot--green { background: #10B981; box-shadow: 0 0 6px #10B981; }
        .auth-card__dot--amber { background: #F97316; box-shadow: 0 0 6px #F97316; }
        .auth-card__label {
          font-family: monospace;
          font-size: 9px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .auth-card__value {
          font-family: monospace;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          margin-left: auto;
          white-space: nowrap;
        }

        /* Hero text */
        .auth-hero-text {
          position: relative;
          z-index: 10;
          margin-bottom: 40px;
        }
        .auth-sys-tag {
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 2px;
          color: rgba(15,98,254,0.8);
          text-transform: uppercase;
          margin: 0 0 16px;
        }
        .auth-headline {
          font-family: 'Bodoni Moda', serif;
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 900;
          color: #fff;
          line-height: 1.15;
          margin: 0 0 16px;
          letter-spacing: -0.5px;
        }
        .auth-headline--accent { color: #0F62FE; }
        .auth-subline {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          margin: 0;
          line-height: 1.6;
        }

        /* Radar */
        .auth-radar {
          position: absolute;
          bottom: -120px;
          left: -120px;
          width: 380px;
          height: 380px;
          z-index: 1;
        }
        .auth-radar__ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(15,98,254,0.15);
          transform: scale(0.4);
        }
        .auth-radar__ring--2 { transform: scale(0.65); border-color: rgba(15,98,254,0.1); }
        .auth-radar__ring--3 { transform: scale(1); border-color: rgba(15,98,254,0.07); }
        .auth-radar__sweep {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent 0deg, rgba(15,98,254,0.15) 60deg, transparent 60deg);
          animation: auth-sweep 8s linear infinite;
        }
        @keyframes auth-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .auth-radar__dot {
          position: absolute;
          top: 50%; left: 50%;
          width: 6px; height: 6px;
          background: #0F62FE;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 12px #0F62FE;
        }

        /* ── RIGHT PANEL ── */
        .auth-right {
          width: 48%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
          background: #F8FAFC;
          background-image: radial-gradient(rgba(15,98,254,0.05) 1.5px, transparent 1.5px);
          background-size: 20px 20px;
          position: relative;
        }

        .auth-form-card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          box-shadow: 0 8px 40px rgba(15,98,254,0.07), 0 2px 8px rgba(0,0,0,0.04);
          overflow: hidden;
        }

        /* Tabs */
        .auth-tabs {
          position: relative;
          display: flex;
          border-bottom: 1px solid #E2E8F0;
          background: #F8FAFC;
        }
        .auth-tab {
          flex: 1;
          padding: 16px;
          font-size: 13px;
          font-weight: 700;
          color: #94A3B8;
          background: transparent;
          border: none;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: color 0.2s;
          position: relative;
          z-index: 1;
        }
        .auth-tab--active { color: #0F62FE; }
        .auth-tab-indicator {
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 50%;
          height: 2px;
          background: #0F62FE;
          border-radius: 2px 2px 0 0;
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .auth-tab-indicator--right { transform: translateX(100%); }

        /* Form body */
        .auth-form-body { padding: 28px; }

        .auth-form-eyebrow {
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 1.5px;
          color: #94A3B8;
          text-transform: uppercase;
          margin: 0 0 20px;
        }

        /* Google btn */
        .auth-google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 11px 16px;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          background: #fff;
          font-size: 13px;
          font-weight: 600;
          color: #1E293B;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
        }
        .auth-google-btn:hover {
          border-color: #CBD5E1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transform: translateY(-1px);
        }
        .auth-google-btn:active { transform: scale(0.98); }

        /* Divider */
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
        }
        .auth-divider__line {
          flex: 1;
          height: 1px;
          background: #E2E8F0;
        }
        .auth-divider__text {
          font-size: 11px;
          color: #CBD5E1;
          font-family: monospace;
          letter-spacing: 1px;
        }

        /* Alerts */
        .auth-alert {
          font-size: 12px;
          padding: 10px 14px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-weight: 500;
        }
        .auth-alert--error { background: #FEF2F2; color: #EF4444; border: 1px solid #FEE2E2; }
        .auth-alert--success { background: #ECFDF5; color: #10B981; border: 1px solid #D1FAE5; }

        /* Fields */
        .auth-fields { display: flex; flex-direction: column; gap: 14px; }
        .auth-field { display: flex; flex-direction: column; gap: 6px; }
        .auth-label {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          letter-spacing: 0.3px;
        }
        .auth-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          font-size: 13px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1E293B;
          background: #F8FAFC;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .auth-input:focus {
          border-color: #0F62FE;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(15,98,254,0.08);
        }
        .auth-input::placeholder { color: #CBD5E1; }

        /* Submit */
        .auth-submit-btn {
          width: 100%;
          margin-top: 4px;
          padding: 13px;
          background: #0F62FE;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(15,98,254,0.3);
          letter-spacing: 0.3px;
        }
        .auth-submit-btn:hover:not(:disabled) {
          background: #034ad9;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(15,98,254,0.35);
        }
        .auth-submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .auth-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        /* Spinner */
        .auth-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: auth-spin 0.7s linear infinite;
        }
        @keyframes auth-spin { to { transform: rotate(360deg); } }

        /* Switch */
        .auth-switch {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #94A3B8;
        }
        .auth-switch__link {
          background: none;
          border: none;
          color: #0F62FE;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .auth-footer-note {
          margin-top: 32px;
          font-family: monospace;
          font-size: 9px;
          color: #CBD5E1;
          letter-spacing: 1.5px;
          text-align: center;
        }

        @media (max-width: 900px) {
          .auth-left {
            display: none;
          }
          .auth-right {
            width: 100%;
            padding: 32px 16px;
          }
        }
      `}</style>
    </div>
  );
}
