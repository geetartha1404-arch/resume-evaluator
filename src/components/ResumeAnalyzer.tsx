"use client";

import React, { useState, useEffect } from "react";
import { Persona, TARGET_ROLES, ResumeGap } from "../data/mockPersonas";
import ResumeGapView from "./ResumeGapView";
import RadarChart from "./RadarChart";
import ActionPlan from "./ActionPlan";

interface ResumeAnalyzerProps {
  selectedPersona: Persona;
}

export default function ResumeAnalyzer({ selectedPersona }: ResumeAnalyzerProps) {
  const [activeRoleKey, setActiveRoleKey] = useState<string>("pm");
  const [checkedTaskIds, setCheckedTaskIds] = useState<string[]>([]);
  const [activeGap, setActiveGap] = useState<ResumeGap | null>(null);

  // Sync initial target role with persona's target role on load
  useEffect(() => {
    if (selectedPersona) {
      const matchedRole = TARGET_ROLES.find(
        (r) => r.name.toLowerCase() === selectedPersona.targetRole.toLowerCase()
      );
      if (matchedRole) {
        setActiveRoleKey(matchedRole.key);
      } else {
        setActiveRoleKey("pm");
      }
      setCheckedTaskIds([]);
      setActiveGap(null);
    }
  }, [selectedPersona]);

  // Reset checked tasks when active role changes
  useEffect(() => {
    setCheckedTaskIds([]);
    setActiveGap(null);
  }, [activeRoleKey]);

  const activeRoleData = selectedPersona.rolesData[activeRoleKey] || selectedPersona.rolesData["pm"];

  const handleToggleTask = (taskId: string) => {
    setCheckedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  // Calculate current dynamic ATS index (clamped at 100)
  const scoreOffset = activeRoleData.tasks
    .filter((task) => checkedTaskIds.includes(task.id))
    .reduce((sum, task) => sum + task.scoreImpact, 0);
  const currentATSScore = Math.min(activeRoleData.atsScore + scoreOffset, 100);

  // Calculate dynamic skill levels based on checked tasks
  const dynamicSkills = activeRoleData.skills.map((skill) => {
    let valueBoost = 0;
    
    activeRoleData.tasks.forEach((task) => {
      if (checkedTaskIds.includes(task.id)) {
        if (task.type === "project" && (skill.label === "Technical" || skill.label === "Execution")) {
          valueBoost += 8;
        }
        if (task.type === "resume" && (skill.label === "Leadership" || skill.label === "Product Sense")) {
          valueBoost += 6;
        }
        if (task.type === "quiz" && (skill.label === "Analytics" || skill.label === "Product Sense")) {
          valueBoost += 8;
        }
        if (task.type === "networking" && (skill.label === "Leadership" || skill.label === "Execution")) {
          valueBoost += 6;
        }
      }
    });

    return {
      label: skill.label,
      value: Math.min(skill.value + valueBoost, 100),
    };
  });

  return (
    <section id="diagnostic" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-brand-light px-2 py-0.5 text-[10px] font-mono font-bold text-brand uppercase border border-brand/10">
              Diagnostic Mode: Active
            </div>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 mt-2">
              Career Gap Analysis Dashboard
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Currently analyzing: <span className="font-semibold text-slate-800">{selectedPersona.name}</span>
            </p>
          </div>

          {/* Role selector dropdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Evaluate For Target Role:
            </span>
            <select
              value={activeRoleKey}
              onChange={(e) => setActiveRoleKey(e.target.value)}
              className="w-full sm:w-56 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              {TARGET_ROLES.map((role) => (
                <option key={role.key} value={role.key}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Column 1: Resume Canvas (5 cols) */}
          <div className="lg:col-span-5 h-full">
            <ResumeGapView
              resumeHTML={selectedPersona.resumeHTML}
              gaps={activeRoleData.gaps}
              activeGap={activeGap}
              onSelectGap={setActiveGap}
            />
          </div>

          {/* Column 2: Radar Fit Chart (3 cols) */}
          <div className="lg:col-span-3 h-full">
            <RadarChart skills={dynamicSkills} />
          </div>

          {/* Column 3: Roadmap Actions (4 cols) */}
          <div className="lg:col-span-4 h-full">
            <ActionPlan
              tasks={activeRoleData.tasks}
              checkedTaskIds={checkedTaskIds}
              onToggleTask={handleToggleTask}
              baseScore={activeRoleData.atsScore}
              currentScore={currentATSScore}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
