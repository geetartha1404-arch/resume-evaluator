"use client";

import React, { useState, useEffect } from "react";
import { Persona, TARGET_ROLES, ResumeGap } from "../data/mockPersonas";
import ResumeGapView from "./ResumeGapView";
import RadarChart from "./RadarChart";
import ActionPlan from "./ActionPlan";
import { useResume, ResumeEvaluation } from "@/context/ResumeContext";

interface ResumeAnalyzerProps {
  selectedPersona: Persona;
}

// ---------- helpers to map AI evaluation → existing display structures ----------

function buildResumeHTML(ev: ResumeEvaluation): string {
  const name = "YOUR RESUME";
  const skills = [
    ...(ev.skills?.technical ?? []).slice(0, 8),
    ...(ev.skills?.soft ?? []).slice(0, 4),
  ].join(", ");

  const strengthItems = (ev.strengths ?? [])
    .map((s) => `<li>${s}</li>`)
    .join("\n");

  const weaknessItems = (ev.weaknesses ?? [])
    .map((w) => `<li class="resume-gap-highlight" data-gap-id="ai-w-${w.slice(0, 20).replace(/\s/g, "-")}">${w}</li>`)
    .join("\n");

  const actionItems = (ev.action_items ?? [])
    .slice(0, 4)
    .map((a) => `<li>${a}</li>`)
    .join("\n");

  return `
    <div class="space-y-4">
      <div class="border-b pb-2">
        <h2 class="text-xl font-bold text-slate-800">${name}</h2>
        <p class="text-xs font-mono text-slate-500">
          ${ev.education ? ev.education + " · " : ""}${ev.experience_years != null ? ev.experience_years + " yrs exp" : ""}
        </p>
        ${ev.summary ? `<p class="text-xs text-slate-600 mt-1 italic">${ev.summary}</p>` : ""}
      </div>

      ${skills ? `
      <div>
        <h3 class="text-sm font-bold text-slate-800 tracking-wider font-mono">SKILLS</h3>
        <p class="text-xs text-slate-600 mt-1">${skills}</p>
      </div>` : ""}

      ${strengthItems ? `
      <div>
        <h3 class="text-sm font-bold text-slate-800 tracking-wider font-mono">STRENGTHS</h3>
        <ul class="list-disc pl-4 text-xs mt-1 text-slate-600 space-y-1">${strengthItems}</ul>
      </div>` : ""}

      ${weaknessItems ? `
      <div>
        <h3 class="text-sm font-bold text-slate-800 tracking-wider font-mono">GAPS DETECTED</h3>
        <ul class="list-disc pl-4 text-xs mt-1 text-slate-600 space-y-1">${weaknessItems}</ul>
      </div>` : ""}

      ${actionItems ? `
      <div>
        <h3 class="text-sm font-bold text-slate-800 tracking-wider font-mono">ACTION ITEMS</h3>
        <ul class="list-disc pl-4 text-xs mt-1 text-slate-600 space-y-1">${actionItems}</ul>
      </div>` : ""}

      ${ev.formatting_feedback ? `
      <div>
        <h3 class="text-sm font-bold text-slate-800 tracking-wider font-mono">FORMATTING</h3>
        <p class="text-xs text-slate-600 mt-1">${ev.formatting_feedback}</p>
      </div>` : ""}
    </div>
  `;
}

function buildGapsFromEvaluation(ev: ResumeEvaluation): ResumeGap[] {
  return (ev.gap_analysis ?? []).map((g, i) => ({
    id: `ai-gap-${i}`,
    targetText: g.gap,
    title: g.category,
    type: "Skill Gap" as const,
    description: g.gap,
    remedy: g.recommendation,
  }));
}

function buildSkillsFromEvaluation(ev: ResumeEvaluation) {
  const score = ev.ats_score ?? ev.overall_score ?? 50;
  // Derive rough radar values from the overall score + keyword density
  const found = ev.keyword_density?.found?.length ?? 5;
  const missing = ev.keyword_density?.missing?.length ?? 5;
  const keywordRatio = found / Math.max(found + missing, 1);

  return [
    { label: "Technical",     value: Math.min(score + 10, 100) },
    { label: "Execution",     value: Math.round(score * 0.9) },
    { label: "Product Sense", value: Math.round(score * keywordRatio * 0.8) },
    { label: "Leadership",    value: Math.round(score * 0.7) },
    { label: "Analytics",     value: Math.round(score * keywordRatio) },
  ];
}

function buildTasksFromEvaluation(ev: ResumeEvaluation) {
  return (ev.action_items ?? []).slice(0, 5).map((item, i) => ({
    id: `ai-task-${i}`,
    label: item,
    type: (["resume", "quiz", "project", "networking"] as const)[i % 4],
    scoreImpact: 5 + (i % 3) * 3,
  }));
}

export default function ResumeAnalyzer({ selectedPersona }: ResumeAnalyzerProps) {
  const { uploadedResume } = useResume();
  const isRealResume = !!uploadedResume?.evaluation;

  const [activeRoleKey, setActiveRoleKey] = useState<string>("pm");
  const [checkedTaskIds, setCheckedTaskIds] = useState<string[]>([]);
  const [activeGap, setActiveGap] = useState<ResumeGap | null>(null);

  // Sync role with persona on load
  useEffect(() => {
    if (!isRealResume && selectedPersona) {
      const matchedRole = TARGET_ROLES.find(
        (r) => r.name.toLowerCase() === selectedPersona.targetRole.toLowerCase()
      );
      setActiveRoleKey(matchedRole ? matchedRole.key : "pm");
      setCheckedTaskIds([]);
      setActiveGap(null);
    }
  }, [selectedPersona, isRealResume]);

  // Reset checked tasks when role changes
  useEffect(() => {
    setCheckedTaskIds([]);
    setActiveGap(null);
  }, [activeRoleKey]);

  // ---------- build display data ----------
  let resumeHTML: string;
  let gaps: ResumeGap[];
  let skills: { label: string; value: number }[];
  let tasks: { id: string; label: string; type: "resume" | "quiz" | "project" | "networking"; scoreImpact: number }[];
  let baseAtsScore: number;
  let displayName: string;

  if (isRealResume && uploadedResume.evaluation) {
    const ev = uploadedResume.evaluation;
    resumeHTML    = buildResumeHTML(ev);
    gaps          = buildGapsFromEvaluation(ev);
    skills        = buildSkillsFromEvaluation(ev);
    tasks         = buildTasksFromEvaluation(ev);
    baseAtsScore  = ev.ats_score ?? ev.overall_score ?? 50;
    displayName   = uploadedResume.fileName.replace(/\.[^.]+$/, "");
  } else {
    const activeRoleData = selectedPersona.rolesData[activeRoleKey] || selectedPersona.rolesData["pm"];
    resumeHTML    = selectedPersona.resumeHTML;
    gaps          = activeRoleData.gaps;
    skills        = activeRoleData.skills;
    tasks         = activeRoleData.tasks;
    baseAtsScore  = activeRoleData.atsScore;
    displayName   = selectedPersona.name;
  }

  const handleToggleTask = (taskId: string) => {
    setCheckedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  // Dynamic score
  const scoreOffset = tasks
    .filter((t) => checkedTaskIds.includes(t.id))
    .reduce((sum, t) => sum + t.scoreImpact, 0);
  const currentATSScore = Math.min(baseAtsScore + scoreOffset, 100);

  // Dynamic radar boost (same logic as before for mock; for real resume it's already derived)
  const dynamicSkills = skills.map((skill) => {
    let boost = 0;
    tasks.forEach((task) => {
      if (checkedTaskIds.includes(task.id)) {
        if (task.type === "project"    && (skill.label === "Technical"     || skill.label === "Execution"))    boost += 8;
        if (task.type === "resume"     && (skill.label === "Leadership"    || skill.label === "Product Sense")) boost += 6;
        if (task.type === "quiz"       && (skill.label === "Analytics"     || skill.label === "Product Sense")) boost += 8;
        if (task.type === "networking" && (skill.label === "Leadership"    || skill.label === "Execution"))    boost += 6;
      }
    });
    return { label: skill.label, value: Math.min(skill.value + boost, 100) };
  });

  return (
    <section id="diagnostic" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-brand-light px-2 py-0.5 text-[10px] font-mono font-bold text-brand uppercase border border-brand/10">
              {isRealResume ? "YOUR RESUME: LIVE ANALYSIS" : "Diagnostic Mode: Active"}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Career Gap Analysis Dashboard
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Currently analyzing:{" "}
              <span className="font-semibold text-slate-800">{displayName}</span>
              {isRealResume && uploadedResume.evaluation?.suggested_roles?.length ? (
                <span className="ml-2 text-[10px] font-mono text-brand bg-brand-light px-1.5 py-0.5 rounded">
                  Best fit: {uploadedResume.evaluation.suggested_roles[0]}
                </span>
              ) : null}
            </p>
          </div>

          {/* Role selector — only for mock personas */}
          {!isRealResume && (
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
                  <option key={role.key} value={role.key}>{role.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Keyword pills for real resume */}
          {isRealResume && uploadedResume.evaluation?.keyword_density?.found?.length ? (
            <div className="flex flex-wrap gap-1 max-w-xs">
              {uploadedResume.evaluation.keyword_density.found.slice(0, 6).map((kw) => (
                <span key={kw} className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  ✓ {kw}
                </span>
              ))}
              {uploadedResume.evaluation.keyword_density.missing?.slice(0, 3).map((kw) => (
                <span key={kw} className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-50 text-red-600 border border-red-100">
                  ✗ {kw}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 h-full">
            <ResumeGapView
              resumeHTML={resumeHTML}
              gaps={gaps}
              activeGap={activeGap}
              onSelectGap={setActiveGap}
            />
          </div>
          <div className="lg:col-span-3 h-full">
            <RadarChart skills={dynamicSkills} />
          </div>
          <div className="lg:col-span-4 h-full">
            <ActionPlan
              tasks={tasks}
              checkedTaskIds={checkedTaskIds}
              onToggleTask={handleToggleTask}
              baseScore={baseAtsScore}
              currentScore={currentATSScore}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
