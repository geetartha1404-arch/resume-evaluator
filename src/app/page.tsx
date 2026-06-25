"use client";

import React, { useState } from "react";
import { mockPersonas, Persona } from "../data/mockPersonas";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ResumeAnalyzer from "../components/ResumeAnalyzer";
import Features from "../components/Features";
import MiniGame from "../components/MiniGame";
import TemplateBuilder from "../components/TemplateBuilder";
import Footer from "../components/Footer";
import { ResumeProvider } from "@/context/ResumeContext";

export default function Home() {
  const [selectedPersona, setSelectedPersona] = useState<Persona>(mockPersonas[0]);

  const handleSelectPersona = (persona: Persona) => {
    setSelectedPersona(persona);
  };

  return (
    <ResumeProvider>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">
          <Hero
            onSelectPersona={handleSelectPersona}
            selectedPersona={selectedPersona}
          />

          <Features />

          {selectedPersona && (
            <ResumeAnalyzer selectedPersona={selectedPersona} />
          )}

          <MiniGame />

          <TemplateBuilder />
        </main>

        <Footer />
      </div>
    </ResumeProvider>
  );
}
