"use client";

import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoAnalysis, setAutoAnalysis] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-8 py-8 border-b border-slate-100">
            <h1 className="text-xl font-display font-extrabold text-slate-900">
              System Settings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure parameters for the AI evaluation and coordination environment.
            </p>
          </div>

          <div className="p-8 space-y-8">
            {/* General Settings */}
            <div className="space-y-4">
              <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                General Parameters
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Automatic Resume Scan</h3>
                    <p className="text-[10px] text-slate-400">Trigger parsing immediately upon dropping files.</p>
                  </div>
                  <button
                    onClick={() => setAutoAnalysis(!autoAnalysis)}
                    className={`h-5 w-10 rounded-full transition-colors relative focus:outline-none ${
                      autoAnalysis ? "bg-brand" : "bg-slate-200"
                    }`}
                  >
                    <span className={`h-4.5 w-4.5 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm ${
                      autoAnalysis ? "translate-x-5" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Email Reports</h3>
                    <p className="text-[10px] text-slate-400">Receive copy of AI diagnostics and roadmap in inbox.</p>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`h-5 w-10 rounded-full transition-colors relative focus:outline-none ${
                      emailNotifications ? "bg-brand" : "bg-slate-200"
                    }`}
                  >
                    <span className={`h-4.5 w-4.5 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm ${
                      emailNotifications ? "translate-x-5" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Newsletter updates</h3>
                    <p className="text-[10px] text-slate-400">Keep up to date with new role simulator metrics.</p>
                  </div>
                  <button
                    onClick={() => setMarketingEmails(!marketingEmails)}
                    className={`h-5 w-10 rounded-full transition-colors relative focus:outline-none ${
                      marketingEmails ? "bg-brand" : "bg-slate-200"
                    }`}
                  >
                    <span className={`h-4.5 w-4.5 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm ${
                      marketingEmails ? "translate-x-5" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Account Management */}
            <div className="border-t border-slate-100 pt-8 space-y-4">
              <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                Data Management
              </h2>
              
              <div className="flex flex-col gap-3">
                <button className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors w-fit">
                  Export Diagnostic History
                </button>
                <button className="inline-flex h-9 items-center justify-center rounded-lg bg-red-50 border border-red-200 px-4 text-xs font-bold text-red-600 hover:bg-red-100/50 transition-colors w-fit">
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
