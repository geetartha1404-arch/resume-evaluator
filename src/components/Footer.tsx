"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Logo block */}
        <div className="flex items-center overflow-visible">
          <Link href="/">
            <img
              src="/reevalve_footer.jpg"
              alt="reevalve"
              className="h-8 w-auto object-contain transition-opacity hover:opacity-90"
            />
          </Link>
        </div>

        {/* Links & Status */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4 sm:gap-6 text-slate-500 text-[11px] font-semibold">
            <Link href="/terms" className="hover:text-brand transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-slate-350 select-none">/</span>
            <Link href="/privacy" className="hover:text-brand transition-colors">
              Privacy Policy
            </Link>
          </div>
          <div className="hidden lg:block font-mono text-[9px] text-slate-400 mt-1">
            SYS.STATUS: ONLINE // RADAR_GRID_LOADED: 100% // LOC: 40.7128° N, 74.0060° W (Stern)
          </div>
        </div>

        {/* Copyright */}
        <div className="text-slate-400 text-[10px] font-semibold text-center md:text-right">
          &copy; {new Date().getFullYear()} reevalve Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
