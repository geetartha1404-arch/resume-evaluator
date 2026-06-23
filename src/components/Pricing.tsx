"use client";

import React from "react";

export default function Pricing() {
  const tiers = [
    {
      name: "Explorer",
      price: "$0",
      description: "Basic resume diagnosis and single target role alignment.",
      features: [
        "Resume Parsing & Score Index",
        "Target Role selection (1 cluster)",
        "Static gap highlights (up to 3 items)",
        "Daily mini-game demo",
        "Standard networking outreach template",
      ],
      cta: "Start Diagnostics",
      popular: false,
      href: "#diagnostic",
    },
    {
      name: "Navigator",
      price: "$19",
      period: "/month",
      description: "Complete roadmap planner and daily role-specific mock tests.",
      features: [
        "Unrestricted resume gap reviews",
        "Target Role selector (all clusters)",
        "Dynamic roadmap with custom task planner",
        "Unlimited PM & strategy simulation games",
        "Full outreach email & LinkedIn note builders",
        "Skill-path certification resources",
      ],
      cta: "Unlock Navigation Path",
      popular: true,
      href: "#diagnostic",
    },
    {
      name: "Commander",
      price: "Custom",
      description: "Tailored preparation with human-in-the-loop review and mock audits.",
      features: [
        "Everything in Navigator tier",
        "FAANG & tier-1 startup case studies",
        "Monthly human-expert resume audit review",
        "1-on-1 mock interview simulation prep",
        "Private community referral slack channel",
        "Company-specific ATS benchmarks",
      ],
      cta: "Contact Career Desk",
      popular: false,
      href: "#diagnostic",
    },
  ];

  return (
    <section id="pricing" className="py-16 bg-white border-b border-slate-200 scroll-mt-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-light px-3 py-1 text-xs font-mono font-semibold text-brand mb-4 shadow-sm">
            FLEXIBLE SUBSCRIPTION PLANS
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Clear coordinates. Simple pricing.
          </h2>
          <p className="text-slate-500 text-sm mt-3">
            Choose the diagnostic depth you need to land your ideal product or strategy role.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-6 flex flex-col justify-between relative bg-white transition-all duration-300 ${
                tier.popular
                  ? "border-brand shadow-xl ring-2 ring-brand/10 md:scale-[1.03] z-10"
                  : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow"
              }`}
            >
              {tier.popular && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-brand px-3 py-0.5 text-[9px] font-mono font-black text-white uppercase tracking-wider shadow">
                  MOST POPULAR
                </span>
              )}

              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  {tier.name}
                </span>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-display text-4xl font-black text-slate-900 leading-none">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-slate-500 text-xs font-bold">{tier.period}</span>
                  )}
                </div>
                <p className="text-slate-500 text-xs leading-relaxed font-semibold mb-6">
                  {tier.description}
                </p>

                {/* Features divider */}
                <div className="border-t border-slate-100 my-4" />

                {/* Features check list */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-2.5 text-[11px] text-slate-600 font-semibold leading-tight">
                      <svg
                        className="h-4.5 w-4.5 text-brand shrink-0 pt-0.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={tier.href}
                className={`flex h-10 w-full items-center justify-center rounded-lg text-xs font-bold transition-all active:scale-[0.98] ${
                  tier.popular
                    ? "bg-brand text-white shadow-md shadow-brand/20 hover:bg-brand-hover"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
