"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Logo block */}
        <div className="flex items-center overflow-visible">
          <img
            src="/reevalve_footer.jpg"
            alt="reevalve"
            className="h-20 w-auto object-contain scale-[2.2] origin-left"
          />
        </div>

        {/* Readout */}
        <div className="hidden lg:block font-mono text-[9px] text-slate-400">
          SYS.STATUS: ONLINE // RADAR_GRID_LOADED: 100% // LOC: 40.7128° N, 74.0060° W (Stern)
        </div>

        {/* Copyright */}
        <div className="text-slate-400 text-[10px] font-semibold">
          &copy; {new Date().getFullYear()} reevalve Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
