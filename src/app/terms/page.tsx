"use client";

import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm">
          <span className="text-[10px] font-mono font-bold text-brand uppercase tracking-wider bg-brand/10 px-2.5 py-1 rounded">
            EFFECTIVE JUNE 2026
          </span>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 mt-4 mb-6">
            Terms & Conditions
          </h1>
          
          <div className="prose prose-slate prose-sm max-w-none text-slate-600 space-y-6 leading-relaxed">
            <p>
              Welcome to ReEvalve. By accessing or using our resume diagnostics, simulators, and templates, you agree to comply with and be bound by the following terms.
            </p>
            
            <h2 className="text-sm font-mono font-bold text-slate-800 uppercase tracking-wide pt-4">
              1. Services Scope
            </h2>
            <p>
              ReEvalve provides AI-driven evaluations of resume drafts, template generations, and outreach creation models. These coordinates are for informational preparations only.
            </p>

            <h2 className="text-sm font-mono font-bold text-slate-800 uppercase tracking-wide pt-4">
              2. Data and Privacy
            </h2>
            <p>
              You maintain ownership of all resume drafts uploaded to the system. By uploading content, you grant ReEvalve permission to process documents using secure AI parsing integrations.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
