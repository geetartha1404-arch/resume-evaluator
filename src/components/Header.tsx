"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Header() {
  const coordsRef = useRef<HTMLSpanElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, profile, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? "??";

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-tactical bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center overflow-visible">
          <Link href="/" className="flex items-center">
            <img
              src="/reevalve.gif"
              alt="reevalve"
              className="h-9 w-auto object-contain mix-blend-multiply transition-transform"
            />
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-4">
          <span
            ref={coordsRef}
            className="hidden lg:inline-block font-mono text-[10px] text-slate-400 bg-slate-100/80 px-2 py-1 rounded border border-slate-200 w-[145px] shrink-0 text-center whitespace-nowrap"
          >
            SYS.LOC: X:0000 Y:0000
          </span>

          {/* Desktop Right Side Auth / Profile Dropdown */}
          <div className="hidden md:flex items-center gap-3 relative" ref={dropdownRef}>
            {!loading && (
              user ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    title={profile?.full_name || user.email || "Profile"}
                    className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white text-[11px] font-bold shrink-0 focus:outline-none ring-2 ring-brand/20 hover:ring-brand/40 active:scale-95 transition-all"
                  >
                    {initials}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {profile?.full_name || user.email}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400 truncate font-semibold">
                          Authenticated Profile
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"
                        >
                          <svg className="h-3.5 w-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Profile
                        </Link>
                        <Link
                          href="/#diagnostic"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"
                        >
                          <svg className="h-3.5 w-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          My Resume
                        </Link>
                        <Link
                          href="/#templates"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"
                        >
                          <svg className="h-3.5 w-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email Creation
                        </Link>
                        <Link
                          href="/pricing"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"
                        >
                          <svg className="h-3.5 w-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Pricing
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"
                        >
                          <svg className="h-3.5 w-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Settings
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 mt-1.5 pt-1.5">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            signOut();
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="h-3.5 w-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 animate-fade-in">
                  <Link
                    href="/auth"
                    className="text-xs font-semibold text-slate-600 hover:text-brand transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth"
                    title="Sign In"
                    className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 focus:outline-none ring-2 ring-slate-200 hover:bg-slate-200 active:scale-95 transition-all"
                  >
                    <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="flex md:hidden items-center gap-2">
            {!loading && (
              user ? (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white text-[11px] font-bold shrink-0 focus:outline-none ring-2 ring-brand/20 hover:ring-brand/40 active:scale-95 transition-all"
                >
                  {initials}
                </button>
              ) : (
                <div className="flex items-center gap-2 animate-fade-in">
                  <Link
                    href="/auth"
                    className="text-xs font-semibold text-slate-600 hover:text-brand transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth"
                    className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 focus:outline-none ring-2 ring-slate-200 hover:bg-slate-200 active:scale-95 transition-all"
                  >
                    <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-t border-border-tactical bg-white/95 backdrop-blur-md transition-all duration-200">
          <div className="space-y-1 px-4 py-3 pb-6">
            <Link
              href="/profile"
              onClick={closeMenu}
              className="block rounded-md px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"
            >
              My Profile
            </Link>
            <Link
              href="/#diagnostic"
              onClick={closeMenu}
              className="block rounded-md px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"
            >
              My Resume
            </Link>
            <Link
              href="/#templates"
              onClick={closeMenu}
              className="block rounded-md px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"
            >
              Email Creation
            </Link>
            <Link
              href="/pricing"
              onClick={closeMenu}
              className="block rounded-md px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/settings"
              onClick={closeMenu}
              className="block rounded-md px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors"
            >
              Settings
            </Link>

            <div className="border-t border-slate-100 my-4 pt-4 px-3">
              <button
                onClick={() => {
                  signOut();
                  closeMenu();
                }}
                className="flex w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

