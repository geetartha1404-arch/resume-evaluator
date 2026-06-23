"use client";

import React from "react";

export default function Features() {
  const featuresList = [
    {
      title: "Targeted Resume Diagnosis",
      desc: "Upload your resume and get immediate context-specific warnings. No generic scores—we scan for management-track metrics and ATS triggers.",
      icon: (
        <svg className="h-6 w-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: "Interactive Skill Mapping",
      desc: "Benchmark your skills across five critical domains: Product Sense, Analytics, Execution, Technical Capability, and Stakeholder Leadership.",
      icon: (
        <svg className="h-6 w-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      ),
    },
    {
      title: "Daily Action Roadmap",
      desc: "Receive customized checklists of project builds, certification recommendations, and resume rewrites. Check off tasks to see your ATS index grow.",
      icon: (
        <svg className="h-6 w-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: "Gamified Crisis Simulations",
      desc: "Test your decision-making with quick scenarios. Face stakeholders, manage feature releases, and resolve unexpected analytics drops.",
      icon: (
        <svg className="h-6 w-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Recruiter Outreach Engine",
      desc: "Generate cold email drafts and LinkedIn notes pre-loaded with your tailored resume metrics, designed to grab recruiting attention.",
      icon: (
        <svg className="h-6 w-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Clustered Role Benchmarking",
      desc: "Don't get lost in dozens of roles. We focus your transition into primary cluster paths: Product, Project, Operations, and Strategy.",
      icon: (
        <svg className="h-6 w-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2H3m2 0h14a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="py-16 bg-white border-b border-slate-200 scroll-mt-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-light px-3 py-1 text-xs font-mono font-semibold text-brand mb-4 shadow-sm">
            THE PLATFORM METRIC CORE
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Designed for career momentum, not just format editing.
          </h2>
          <p className="text-slate-500 text-sm mt-3">
            reevalve goes beyond standard templates to provide a full execution stack for your transition into management track roles.
          </p>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((feat, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 p-6 bg-white hover:border-brand/40 hover:shadow-md hover:scale-[1.01] transition-all duration-300 group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-brand-light transition-all mb-5 border border-slate-200 group-hover:border-brand/20">
                {feat.icon}
              </div>
              <h3 className="text-base font-extrabold text-slate-900 font-sans mb-2 group-hover:text-brand transition-colors">
                {feat.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
