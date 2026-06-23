"use client";

import React, { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Header() {
  const coordsRef = useRef<HTMLSpanElement>(null);
  const { user, profile, signOut, loading } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (coordsRef.current) {
        const xStr = String(e.clientX).padStart(4, "0");
        const yStr = String(e.clientY).padStart(4, "0");
        coordsRef.current.textContent = `SYS.LOC: X:${xStr} Y:${yStr}`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <header className="sticky top-0 z-50 border-b border-border-tactical bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center overflow-visible">
          <img
            src="/reevalve.gif"
            alt="reevalve"
            className="h-16 w-auto object-contain scale-[1.5] origin-left mix-blend-multiply"
          />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-brand transition-colors">System Features</a>
          <a href="#diagnostic" className="text-sm font-semibold text-slate-600 hover:text-brand transition-colors">Diagnostic Demo</a>
          <a href="#game" className="text-sm font-semibold text-slate-600 hover:text-brand transition-colors">Daily Simulator</a>
          <a href="#templates" className="text-sm font-semibold text-slate-600 hover:text-brand transition-colors">Outreach Builder</a>
          <a href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-brand transition-colors">Pricing</a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span
            ref={coordsRef}
            className="hidden lg:inline-block font-mono text-[10px] text-slate-400 bg-slate-100/80 px-2 py-1 rounded border border-slate-200 w-[145px] shrink-0 text-center whitespace-nowrap"
          >
            SYS.LOC: X:0000 Y:0000
          </span>

          {!loading && (
            user ? (
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  title={profile?.full_name || user.email}
                  className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white text-[11px] font-bold shrink-0 cursor-default ring-2 ring-brand/20"
                >
                  {initials}
                </div>
                <button
                  onClick={signOut}
                  className="text-xs font-semibold text-slate-500 hover:text-brand transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth"
                  className="text-xs font-semibold text-slate-600 hover:text-brand transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="#diagnostic"
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-brand px-4 text-xs font-bold text-white shadow-md hover:bg-brand-hover transition-all active:scale-[0.98]"
                >
                  Analyze Resume
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}
