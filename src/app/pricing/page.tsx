"use client";

import React from "react";
import Header from "../../components/Header";
import Pricing from "../../components/Pricing";
import Footer from "../../components/Footer";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/30 py-12">
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
