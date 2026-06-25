"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Persona, mockPersonas } from "../data/mockPersonas";
import { useAuth } from "@/context/AuthContext";
import { useResume } from "@/context/ResumeContext";

interface HeroProps {
  onSelectPersona: (persona: Persona) => void;
  selectedPersona: Persona | null;
}

function FileIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Hero({ onSelectPersona, selectedPersona }: HeroProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { uploadedResume, setUploadedResume, clearResume } = useResume();

  const [isDragging, setIsDragging] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [uploadToast, setUploadToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---------- demo persona loading (for mock cards only) ----------
  const simulateLoading = (persona: Persona) => {
    const steps = [
      "Connecting to analysis engine...",
      "Reading document structures...",
      "Extracting career achievements & bullet context...",
      "Benchmarking against target role guidelines...",
      "Mapping skills gap coordinates...",
    ];
    let currentStep = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setLoadingStep(steps[currentStep]);
      } else {
        clearInterval(interval);
        setLoadingStep(null);
        onSelectPersona(persona);
        document.getElementById("diagnostic")?.scrollIntoView({ behavior: "smooth" });
      }
    }, 600);
  };

  // ---------- real upload ----------
  const uploadFile = async (file: File) => {
    if (!user) { router.push("/auth"); return; }

    const processingSteps = [
      "Uploading resume...",
      "Extracting text from document...",
      "Running AI gap analysis...",
      "Scoring ATS alignment...",
      "Building roadmap recommendations...",
    ];
    let stepIdx = 0;
    setLoadingStep(processingSteps[0]);
    const stepInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < processingSteps.length) {
        setLoadingStep(processingSteps[stepIdx]);
      }
    }, 1800);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-resume", { method: "POST", body: formData });
      const data = await res.json();
      clearInterval(stepInterval);
      setLoadingStep(null);

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUploadedResume({
        id: data.resumeId,
        fileName: data.fileName,
        fileType: data.fileType,
        fileSize: data.fileSize,
        storagePath: data.storagePath,
        status: data.status,
        evaluation: data.evaluation,
        error: data.error,
      });

      setUploadToast({ type: "success", msg: `✓ ${file.name} analysed successfully` });
      setTimeout(() => setUploadToast(null), 4000);

      // Scroll to dashboard
      setTimeout(() => {
        document.getElementById("diagnostic")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err: unknown) {
      clearInterval(stepInterval);
      setLoadingStep(null);
      setUploadToast({ type: "error", msg: err instanceof Error ? err.message : "Upload failed" });
      setTimeout(() => setUploadToast(null), 5000);
    }
  };

  const handleRemoveResume = () => {
    clearResume();
    // Reset file input so same file can be re-uploaded if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  // ---------- render ----------
  const hasResume = !!uploadedResume;
  const scoreVal = uploadedResume?.evaluation?.ats_score ?? uploadedResume?.evaluation?.overall_score;

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white pt-16 pb-20 blueprint-grid">
      {/* Toast */}
      {uploadToast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${
          uploadToast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        }`}>
          {uploadToast.msg}
        </div>
      )}

      <div className="absolute inset-0 blueprint-grid-fine pointer-events-none opacity-50" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-brand/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-light px-3 py-1 text-xs font-mono font-semibold text-brand mb-6 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
          SYSTEM OPERATIONAL: VERSION 4.0 ACTIVE
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-none mb-6">
          You have the talent. <br />
          <span className="text-brand">We have the coordinates.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 mb-12">
          reevalve evaluates your resume gaps, maps your alignment to product, project, and strategy roles, and builds your daily proof-of-capability path.
        </p>

        {/* Upload Zone / Loading / Uploaded State */}
        <div className="max-w-2xl mx-auto mb-12">
          {loadingStep ? (
            /* ── Processing overlay ── */
            <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-brand bg-white p-12 shadow-lg min-h-[220px]">
              <div className="absolute left-0 right-0 h-0.5 bg-brand animate-scanning shadow-[0_0_8px_#0F62FE]" />
              <svg className="animate-spin h-8 w-8 text-brand mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm font-mono text-slate-700 tracking-wider animate-pulse">{loadingStep}</p>
            </div>
          ) : hasResume ? (
            /* ── Uploaded resume card ── */
            <div className="rounded-2xl border-2 border-emerald-400 bg-white shadow-lg overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center justify-between bg-emerald-50 border-b border-emerald-100 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
                    Resume Analysed
                  </span>
                </div>
                <button
                  onClick={handleRemoveResume}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors group"
                >
                  <svg className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Remove
                </button>
              </div>

              {/* File info row */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-light border border-brand/10">
                  <FileIcon />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-bold text-slate-800 truncate">{uploadedResume.fileName}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {formatBytes(uploadedResume.fileSize)} &middot; {uploadedResume.fileType.split("/").pop()?.toUpperCase()}
                  </p>
                </div>
                {scoreVal !== undefined && (
                  <div className="flex flex-col items-center shrink-0">
                    <span className="text-2xl font-display font-black text-brand leading-none">{scoreVal}</span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">ATS Score</span>
                  </div>
                )}
              </div>

              {/* Summary */}
              {uploadedResume.evaluation?.summary && (
                <div className="border-t border-slate-100 px-5 py-3 text-left">
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    {uploadedResume.evaluation.summary}
                  </p>
                </div>
              )}

              {/* Error banner */}
              {uploadedResume.status === "error" && uploadedResume.error && (
                <div className="border-t border-red-100 bg-red-50 px-5 py-3 text-left">
                  <p className="text-[11px] text-red-600 font-semibold">{uploadedResume.error}</p>
                </div>
              )}

              {/* CTA */}
              <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  Scroll down to see full analysis ↓
                </span>
                <button
                  onClick={() => document.getElementById("diagnostic")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-[10px] font-bold text-brand hover:underline"
                >
                  View Analysis →
                </button>
              </div>
            </div>
          ) : (
            /* ── Drop zone ── */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all duration-300 ${
                isDragging
                  ? "border-brand bg-brand-light/30"
                  : "border-slate-300 bg-slate-50/50 hover:border-brand hover:bg-white hover:shadow-md"
              }`}
            >
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 group-hover:border-brand group-hover:text-brand group-hover:scale-110 transition-all duration-300">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5h10.5a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0017.25 4.5H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Drag and drop your resume here, or <span className="text-brand hover:underline">browse files</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, or DOC (Max 5MB)</p>
            </div>
          )}
        </div>

        {/* Demo personas — only show when no real resume uploaded */}
        {!hasResume && (
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">
              OR TEST WITH A DEMO CANDIDATE PROFILE:
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {mockPersonas.map((persona) => {
                const isSelected = selectedPersona?.id === persona.id;
                return (
                  <button
                    key={persona.id}
                    onClick={() => simulateLoading(persona)}
                    className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      isSelected
                        ? "border-brand bg-brand-light shadow-sm ring-1 ring-brand"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-700">
                      {persona.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{persona.name}</p>
                      <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">{persona.currentTitle}</p>
                      <span className="inline-block mt-2 rounded bg-slate-200/60 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-600 uppercase">
                        Target: {persona.targetRole}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
