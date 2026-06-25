"use client";

import React, { useState, useEffect } from "react";
import { useResume } from "@/context/ResumeContext";

interface TemplateType {
  id: string;
  name: string;
  channel: "LinkedIn" | "Email";
  getDraft: (params: {
    userName: string;
    contactName: string;
    company: string;
    role: string;
    backgroundType: string;
  }) => string;
}

const TEMPLATE_TYPES: TemplateType[] = [
  {
    id: "linkedin",
    name: "LinkedIn Cold Connection note",
    channel: "LinkedIn",
    getDraft: ({ userName, contactName, company, role, backgroundType }) => {
      const recName = contactName ? contactName.split(" ")[0] : "there";
      let pitch = "";
      if (backgroundType === "engineer") {
        pitch = "engineering background optimizing API pipelines and custom SaaS dashboards";
      } else if (backgroundType === "mba") {
        pitch = "MBA background managing $45K marketing campaigns and stakeholder status reporting";
      } else {
        pitch = "operations background managing 45 logistics personnel and streamlining vendor SLAs";
      }
      
      return `Hi ${recName}, noticed you coordinate teams at ${company || "[Company]"}. I'm a candidate with an ${pitch} transitioning into a ${role || "Product Manager"} path. Wrote a product teardown on ${company || "[Company]"}'s search friction—would love to connect and share. Best, ${userName || "[Your Name]"}.`;
    },
  },
  {
    id: "founder",
    name: "Cold Email to Founder / Hiring Manager",
    channel: "Email",
    getDraft: ({ userName, contactName, company, role, backgroundType }) => {
      const fName = contactName ? contactName.split(" ")[0] : "there";
      let details = "";
      
      if (backgroundType === "engineer") {
        details = "I spent 3 years scaling SaaS architectures and integrating custom customer dashboards (unlocking $240K ARR). I have strong execution skills, but I'm looking to apply them from a product strategy direction.";
      } else if (backgroundType === "mba") {
        details = "I'm currently completing my MBA at NYU Stern, following 4 years in digital marketing where I owned campaign execution, managed cross-functional design sprints, and reported to executive stakeholders.";
      } else {
        details = "I have managed regional operations hubs directing 45 staff members, negotiating vendor SLAs, and restructuring logistics workflows to cut annual overhead costs by 22% ($85K/yr).";
      }

      return `Subject: Value-add & transition from ${userName || "[Your Name]"} // ${role || "Product Manager"} candidate

Hi ${fName},

I hope you're having a great week. I've been following ${company || "[Company]"}'s growth, particularly your recent updates in user-facing platform features. 

I'm reaching out because I believe my background fits your team's current product/operations needs. Briefly on me:
${details}

I've put together a brief 1-page breakdown of minor onboarding friction points I found in ${company || "[Company]"} and potential low-lift product fixes. 

Would you be open to a brief 10-minute chat next week to share feedback on my analysis?

Sincerely,

${userName || "[Your Name]"}
linkedin.com/in/yourlink`;
    },
  },
  {
    id: "referral",
    name: "Alumni / Peer Referral Request",
    channel: "Email",
    getDraft: ({ userName, contactName, company, role, backgroundType }) => {
      const aName = contactName ? contactName.split(" ")[0] : "there";
      let exp = "";
      if (backgroundType === "engineer") exp = "developing developer tools and SaaS platforms";
      if (backgroundType === "mba") exp = "working in agency digital marketing projects";
      if (backgroundType === "ops") exp = "coordinating regional warehouse and logistics hubs";

      return `Subject: NYU Stern Stern Alumni Connection // Chat request from ${userName || "[Your Name]"}

Hi ${aName},

I hope you're doing well! I saw on LinkedIn that you graduated from NYU Stern and are now working at ${company || "[Company]"} as a ${role || "Product Manager"}.

I'm currently an MBA candidate at Stern myself, specializing in tech product strategy. Prior to Stern, I spent my career ${exp}. 

I am incredibly interested in the product and operations culture at ${company || "[Company]"}. Would you have 10 minutes sometime next week for a quick virtual coffee? I'd love to learn more about your career transition and hear any advice you have for positioning my background.

Thank you so much for your time and support!

Best,

${userName || "[Your Name]"}`;
    },
  },
];

export default function TemplateBuilder() {
  const { uploadedResume } = useResume();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("linkedin");
  const [userName, setUserName] = useState<string>("Alex Chen");
  const [contactName, setContactName] = useState<string>("Rebecca Holmes");
  const [company, setCompany] = useState<string>("FinTech Corp");
  const [role, setRole] = useState<string>("Product Manager");
  const [backgroundType, setBackgroundType] = useState<string>("engineer");
  const [copied, setCopied] = useState<boolean>(false);

  // Seed / reset form based on uploaded resume
  useEffect(() => {
    const ev = uploadedResume?.evaluation;
    if (ev) {
      const suggestedRole = ev.suggested_roles?.[0] ?? "Product Manager";
      setRole(suggestedRole);

      // Derive background type from technical vs soft skills
      const tech = ev.skills?.technical ?? [];
      const hasEngSkills = tech.some((s) =>
        /react|node|python|java|sql|api|cloud|aws|docker/i.test(s)
      );
      const hasMbaSkills = tech.some((s) =>
        /strategy|marketing|consulting|mba|finance/i.test(s)
      );
      if (hasEngSkills) setBackgroundType("engineer");
      else if (hasMbaSkills) setBackgroundType("mba");
      else setBackgroundType("ops");
    } else {
      // Reset to defaults when resume is removed
      setRole("Product Manager");
      setBackgroundType("engineer");
      setUserName("Alex Chen");
    }
  }, [uploadedResume]);

  const activeTemplate = TEMPLATE_TYPES.find((t) => t.id === selectedTemplateId) || TEMPLATE_TYPES[0];

  const draftText = activeTemplate.getDraft({
    userName,
    contactName,
    company,
    role,
    backgroundType,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(draftText);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <section id="templates" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-light px-3 py-1 text-xs font-mono font-semibold text-brand mb-4 shadow-sm">
            OUTREACH & NETWORKING CORE
          </div>
          <h2 className="font-display text-3xl font-extrabold text-slate-900">
            Recruiter Outreach Template Builder
          </h2>
          <p className="max-w-xl mx-auto text-slate-500 text-sm mt-2">
            AI-driven, role-tailored templates that frame your background metrics specifically for recruiters, founders, and alumni.
          </p>
          {uploadedResume?.evaluation && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-mono text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Template seeded from your resume · Target role: <strong>{uploadedResume.evaluation.suggested_roles?.[0] ?? role}</strong>
            </div>
          )}
        </div>

        {/* Builder Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Form Controls (5 cols) */}
          <div className="md:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Draft Coordinates
                </h4>
              </div>

              {/* Template selector */}
              <div>
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Outreach Format
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  {TEMPLATE_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.channel.toUpperCase()}] {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* User Background Selector */}
              <div>
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  My Target Resume Profile
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "engineer", label: "Engineer" },
                    { id: "mba", label: "MBA" },
                    { id: "ops", label: "Operations" },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setBackgroundType(bg.id)}
                      className={`h-8 rounded text-[10px] font-bold border transition-all ${
                        backgroundType === bg.id
                          ? "border-brand bg-brand-light text-brand font-black"
                          : "border-slate-200 bg-white hover:border-slate-350 text-slate-600"
                      }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    My Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 font-semibold shadow-sm focus:border-brand focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Recruiter/Founder Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 font-semibold shadow-sm focus:border-brand focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Target Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 font-semibold shadow-sm focus:border-brand focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Target Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 font-semibold shadow-sm focus:border-brand focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-[9px] font-mono text-slate-450 leading-relaxed border-t border-slate-100 pt-3">
              <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold border border-slate-200">
                ★
              </span>
              This output matches character guidelines and uses your proven resume metrics.
            </div>
          </div>

          {/* Right Column: Output Screen (7 cols) */}
          <div className="md:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between h-full">
            <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                System Output Draft
              </h4>
              {activeTemplate.channel === "LinkedIn" && (
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  Char count: {draftText.length} / 300
                </span>
              )}
            </div>

            {/* Output Paper */}
            <div className="relative flex-1 bg-slate-50/50 rounded-lg p-5 border border-slate-100 font-mono text-xs text-slate-700 whitespace-pre-wrap select-text leading-relaxed min-h-[220px] max-h-[300px] overflow-y-auto">
              {draftText}
            </div>

            {/* Copy button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCopy}
                className={`inline-flex h-9 items-center justify-center rounded-lg px-6 text-xs font-bold transition-all active:scale-[0.98] ${
                  copied
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                    : "bg-brand text-white shadow-md shadow-brand/10 hover:bg-brand-hover"
                }`}
              >
                {copied ? "DRAFT COPIED!" : "COPY TO CLIPBOARD"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
