"use client";

import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-brand/10 to-indigo-50 px-8 py-10 border-b border-slate-200 relative overflow-hidden">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand/5 blur-2xl" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-brand flex items-center justify-center text-white text-3xl font-black shadow-md">
                {profile?.full_name
                  ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
                  : user?.email?.slice(0, 2).toUpperCase() ?? "??"}
              </div>
              <div>
                <span className="inline-block rounded-full bg-brand/10 text-brand px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider mb-2">
                  EXPLORER MEMBER
                </span>
                <h1 className="text-2xl font-display font-extrabold text-slate-900">
                  {profile?.full_name || "Guest Account"}
                </h1>
                <p className="text-xs font-mono text-slate-500 mt-1">
                  {user?.email || "No email associated"}
                </p>
              </div>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                Account Parameters
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Subscription Tier</span>
                  <span className="text-xs font-bold text-slate-800">Free Trial / Explorer</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Member Since</span>
                  <span className="text-xs font-mono text-slate-600">June 2026</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Account Status</span>
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                Diagnostic Index
              </h2>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 flex flex-col justify-between h-[130px]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Uploaded Resume</h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">No custom PDF analyzed yet</p>
                  </div>
                  <span className="text-2xl font-display font-black text-brand leading-none flex items-center">
                    0<span className="font-sans font-bold text-lg text-slate-350 mx-0.5">/</span>100
                  </span>
                </div>

                <Link
                  href="/#diagnostic"
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-brand px-4 text-xs font-bold text-white shadow hover:bg-brand-hover transition-colors"
                >
                  Upload New Resume
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
