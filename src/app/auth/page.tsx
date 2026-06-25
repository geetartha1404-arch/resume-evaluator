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
    <div className="flex min-h-screen font-sans bg-[#F8FAFC] w-full">
      {/* ── LEFT PANEL ── */}
      <div className="relative w-[52%] bg-[#060F2E] overflow-hidden hidden lg:flex flex-col justify-end p-12">
        <div className="auth-blueprint-grid" />
        <div className="auth-mesh" />

        {/* Logo */}
        <div className="absolute top-10 left-12 z-10">
          <img src="/reevalve_nobg.png" alt="reevalve" className="auth-logo" />
        </div>

        {/* Floating cards */}
        <div className="absolute top-[120px] right-12 flex flex-col gap-[10px] z-10">
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
        <div className="relative z-10 mb-10">
          <p className="font-mono text-[10px] tracking-[2px] text-[#0F62FE]/80 uppercase m-0 mb-4">SYS.AUTH // ACCESS TERMINAL</p>
          <h1 className="font-display text-4xl lg:text-5xl font-black text-white leading-[1.15] m-0 mb-4 tracking-[-0.5px]">
            You have the talent.<br />
            <span className="text-[#0F62FE]">We have the coordinates.</span>
          </h1>
          <p className="text-sm text-white/45 m-0 leading-relaxed">
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
      <div className="w-full lg:w-[48%] flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-[#F8FAFC] dot-pattern relative min-h-screen">
        <div className="w-full max-w-[420px] bg-white border border-[#E2E8F0] rounded-[20px] shadow-[0_8px_40px_rgba(15,98,254,0.07),0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden z-10">
          {/* Tabs */}
          <div className="relative flex border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <button
              className={`flex-1 py-4 text-[13px] font-bold tracking-[0.3px] transition-colors duration-200 relative z-10 bg-transparent border-0 cursor-pointer ${
                tab === "signin" ? "text-[#0F62FE]" : "text-[#94A3B8]"
              }`}
              onClick={() => { setTab("signin"); setError(null); setSuccess(null); }}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-4 text-[13px] font-bold tracking-[0.3px] transition-colors duration-200 relative z-10 bg-transparent border-0 cursor-pointer ${
                tab === "signup" ? "text-[#0F62FE]" : "text-[#94A3B8]"
              }`}
              onClick={() => { setTab("signup"); setError(null); setSuccess(null); }}
            >
              Create Account
            </button>
            <div
              className={`absolute bottom-[-1px] left-0 w-1/2 h-[2px] bg-[#0F62FE] rounded-t-[2px] transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                tab === "signup" ? "translate-x-full" : "translate-x-0"
              }`}
            />
          </div>

          <div className="p-6 sm:p-8">
            <p className="font-mono text-[10px] tracking-[1.5px] text-[#94A3B8] uppercase m-0 mb-5">
              {tab === "signin" ? "Welcome back, operative." : "Initialize your account."}
            </p>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-[10px] py-[11px] px-4 border-[1.5px] border-solid border-[#E2E8F0] rounded-[10px] bg-white text-[13px] font-semibold text-[#1E293B] cursor-pointer transition-all duration-200 active:scale-[0.98] hover:border-[#CBD5E1] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-[1px]"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 my-5">
              <span className="flex-1 h-[1px] bg-[#E2E8F0]" />
              <span className="text-[11px] text-[#CBD5E1] font-mono tracking-[1px]">or</span>
              <span className="flex-1 h-[1px] bg-[#E2E8F0]" />
            </div>

            {/* Alerts */}
            {error && (
              <div className="text-[12px] p-[10px_14px] rounded-lg mb-4 font-medium bg-[#FEF2F2] text-[#EF4444] border border-[#FEE2E2]">
                {error}
              </div>
            )}
            {success && (
              <div className="text-[12px] p-[10px_14px] rounded-lg mb-4 font-medium bg-[#ECFDF5] text-[#10B981] border border-[#D1FAE5]">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="flex flex-col gap-[14px]">
              {tab === "signup" && (
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[11px] font-bold text-[#475569] tracking-[0.3px]">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Alex Chen"
                    className="w-full p-[10px_14px] border-[1.5px] border-solid border-[#E2E8F0] rounded-[10px] text-[13px] font-sans text-[#1E293B] bg-[#F8FAFC] outline-none transition-all duration-200 box-border focus:border-[#0F62FE] focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,98,254,0.08)] placeholder:text-[#CBD5E1]"
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="flex flex-col gap-[6px]">
                <label className="text-[11px] font-bold text-[#475569] tracking-[0.3px]">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full p-[10px_14px] border-[1.5px] border-solid border-[#E2E8F0] rounded-[10px] text-[13px] font-sans text-[#1E293B] bg-[#F8FAFC] outline-none transition-all duration-200 box-border focus:border-[#0F62FE] focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,98,254,0.08)] placeholder:text-[#CBD5E1]"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[11px] font-bold text-[#475569] tracking-[0.3px]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-[10px_14px] border-[1.5px] border-solid border-[#E2E8F0] rounded-[10px] text-[13px] font-sans text-[#1E293B] bg-[#F8FAFC] outline-none transition-all duration-200 box-border focus:border-[#0F62FE] focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,98,254,0.08)] placeholder:text-[#CBD5E1]"
                  required
                  minLength={6}
                  autoComplete={tab === "signup" ? "new-password" : "current-password"}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-1 py-[13px] bg-[#0F62FE] text-white border-0 rounded-[10px] text-[13px] font-bold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_4px_14px_rgba(15,98,254,0.3)] tracking-[0.3px] active:scale-[0.98] hover:bg-[#034ad9] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(15,98,254,0.35)] disabled:opacity-65 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="w-4 h-4 border-2 border-solid border-white/30 border-t-white rounded-full animate-spin" />
                ) : tab === "signin" ? (
                  "Access System →"
                ) : (
                  "Initialize Account →"
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-[12px] text-[#94A3B8]">
              {tab === "signin" ? "No account yet? " : "Already have one? "}
              <button
                type="button"
                onClick={() => { setTab(tab === "signin" ? "signup" : "signin"); setError(null); }}
                className="bg-none border-0 text-[#0F62FE] font-bold text-[12px] cursor-pointer p-0 underline decoration-[2px] underline-offset-2"
              >
                {tab === "signin" ? "Create account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-8 font-mono text-[9px] text-[#CBD5E1] tracking-[1.5px] text-center">
          © {new Date().getFullYear()} reevalve Inc. — SYS.LOC: AUTH_TERMINAL
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;0,6..96,900;1,6..96,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        /* Logo scale and filter */
        .auth-logo {
          height: 56px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
          transform: scale(2.6);
          transform-origin: left center;
        }

        /* Floating cards & animations */
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

        /* Radar animations */
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
      `}</style>
    </div>
  );
}
