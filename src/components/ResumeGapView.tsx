"use client";

import React, { useState } from "react";
import { ResumeGap } from "../data/mockPersonas";

interface ResumeGapViewProps {
  resumeHTML: string;
  gaps: ResumeGap[];
  activeGap: ResumeGap | null;
  onSelectGap: (gap: ResumeGap | null) => void;
}

export default function ResumeGapView({
  resumeHTML,
  gaps,
  activeGap,
  onSelectGap,
}: ResumeGapViewProps) {
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const gapHighlight = target.closest(".resume-gap-highlight");
    
    if (gapHighlight) {
      const gapId = gapHighlight.getAttribute("data-gap-id");
      const gap = gaps.find((g) => g.id === gapId);
      
      if (gap) {
        // Calculate position relative to container
        const rect = gapHighlight.getBoundingClientRect();
        const containerRect = e.currentTarget.getBoundingClientRect();
        
        setTooltipPos({
          top: rect.bottom - containerRect.top + e.currentTarget.scrollTop + 8,
          left: Math.min(
            rect.left - containerRect.left + rect.width / 2,
            containerRect.width - 150
          ),
        });
        
        onSelectGap(gap);
        return;
      }
    }
    
    // Clicked elsewhere, close active gap
    onSelectGap(null);
    setTooltipPos(null);
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "ATS":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Skill Gap":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "Storytelling":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="relative flex flex-col h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Parsed Resume Canvas
        </h4>
        <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-amber-700 border border-amber-100">
          <span className="h-1 w-1 rounded-full bg-amber-500 animate-ping" />
          {gaps.length} Gaps Flagged
        </span>
      </div>

      {/* Resume paper simulator */}
      <div
        className="relative flex-1 overflow-y-auto max-h-[420px] rounded-lg border border-slate-100 bg-[#FCFDFE] p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] text-slate-800 cursor-default select-none font-sans"
        onClick={handleContainerClick}
        dangerouslySetInnerHTML={{ __html: resumeHTML }}
      />

      {/* Click instructions */}
      <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
        <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold border border-slate-200">
          i
        </span>
        Click highlighted orange text lines to view analysis details.
      </div>

      {/* Floating Gap Details Tooltip */}
      {activeGap && tooltipPos && (
        <div
          style={{
            top: `${tooltipPos.top}px`,
            left: `${tooltipPos.left}px`,
            transform: "translateX(-50%)",
          }}
          className="absolute z-10 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl text-left animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-900">{activeGap.title}</span>
            <span className={`rounded border px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase ${getTypeBadgeColor(activeGap.type)}`}>
              {activeGap.type}
            </span>
          </div>

          {/* Description */}
          <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
            {activeGap.description}
          </p>

          {/* Remedy */}
          <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-2.5">
            <span className="text-[9px] font-mono font-bold text-emerald-800 uppercase block mb-1">
              REMEDY SUGGESTION:
            </span>
            <p className="text-[10px] text-slate-800 italic font-mono leading-normal leading-relaxed">
              &quot;{activeGap.remedy}&quot;
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={() => onSelectGap(null)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
