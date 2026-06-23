"use client";

import React, { useState } from "react";
import { mockPersonas, Persona } from "../data/mockPersonas";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ResumeAnalyzer from "../components/ResumeAnalyzer";
import Features from "../components/Features";
import MiniGame from "../components/MiniGame";
import TemplateBuilder from "../components/TemplateBuilder";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";

export default function Home() {
  // Pre-load the first candidate (Alex Chen) so the interactive dashboard is active on load
  const [selectedPersona, setSelectedPersona] = useState<Persona>(mockPersonas[0]);

  const handleSelectPersona = (persona: Persona) => {
    setSelectedPersona(persona);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Header */}
      <Header />

      <main className="flex-1">
        {/* Hero & Upload Panel */}
        <Hero
          onSelectPersona={handleSelectPersona}
          selectedPersona={selectedPersona}
        />

        {/* Feature Highlights */}
        <Features />

        {/* Diagnostic Dashboard Analyzer */}
        {selectedPersona && (
          <ResumeAnalyzer selectedPersona={selectedPersona} />
        )}

        {/* Daily Stakeholder Emergency Game */}
        <MiniGame />

        {/* Recruiter Outreach template customizer */}
        <TemplateBuilder />

        {/* Subscriptions */}
        <Pricing />
      </main>

      {/* Footer Info Coordinates */}
      <Footer />
    </div>
  );
}
