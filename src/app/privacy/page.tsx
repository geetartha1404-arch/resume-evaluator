"use client";

import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm">
          <span className="text-[10px] font-mono font-bold text-brand uppercase tracking-wider bg-brand/10 px-2.5 py-1 rounded">
            EFFECTIVE JUNE 2026
          </span>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 mt-4 mb-6">
            Privacy Policy
          </h1>
          
          <div className="prose prose-slate prose-sm max-w-none text-slate-600 space-y-6 leading-relaxed">
            <p>
              ReEvalve respects your digital privacy. This policy details how we process user resumes and credentials securely.
            </p>
            
            <h2 className="text-sm font-mono font-bold text-slate-800 uppercase tracking-wide pt-4">
              1. Information Collection
            </h2>
            <p>
              We collect resume details, account parameters (full name and email), and coordinate interactions when you upload a document or execute simulator diagnostics.
            </p>

            <h2 className="text-sm font-mono font-bold text-slate-800 uppercase tracking-wide pt-4">
              2. Data Encryption
            </h2>
            <p>
              All files are encrypted at rest and in transit. Document data parsed during analysis is stored in secure database schemas.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
