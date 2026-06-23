"use client";

import React from "react";

interface TaskItem {
  id: string;
  label: string;
  type: "resume" | "quiz" | "project" | "networking";
  scoreImpact: number;
}

interface ActionPlanProps {
  tasks: TaskItem[];
  checkedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  baseScore: number;
  currentScore: number;
}

export default function ActionPlan({
  tasks,
  checkedTaskIds,
  onToggleTask,
  baseScore,
  currentScore,
}: ActionPlanProps) {
  // SVG Circle calculations
  const radius = 38;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(currentScore, 100) / 100) * circumference;

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "resume":
        return (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100 font-mono text-[9px] font-bold">
            RES
          </span>
        );
      case "quiz":
        return (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 font-mono text-[9px] font-bold">
            QZ
          </span>
        );
      case "project":
        return (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 font-mono text-[9px] font-bold">
            PRJ
          </span>
        );
      case "networking":
        return (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 font-mono text-[9px] font-bold">
            NET
          </span>
        );
      default:
        return (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600 border border-slate-100 font-mono text-[9px] font-bold">
            TSK
          </span>
        );
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score < 60) return "text-rose-500 stroke-rose-500";
    if (score < 80) return "text-amber-500 stroke-amber-500";
    return "text-emerald-500 stroke-emerald-500";
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Roadmap & Task Executor
        </h4>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-mono font-bold text-slate-600">
          STABILITY CAP: 100
        </span>
      </div>

      {/* Main Score Board */}
      <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-[#FCFDFE] p-4 mb-5 shadow-sm">
        {/* Circle Score Indicator */}
        <div className="relative flex h-20 w-20 items-center justify-center shrink-0">
          <svg className="h-20 w-20 -rotate-90">
            <circle
              className="stroke-slate-100"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              className={`transition-all duration-500 ease-out ${getScoreColorClass(currentScore)}`}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + " " + circumference}
              style={{ strokeDashoffset }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="font-display text-xl font-black text-slate-800 leading-none">
              {currentScore}
            </span>
            <span className="text-[8px] font-mono text-slate-400 mt-0.5">ATS INDEX</span>
          </div>
        </div>

        {/* Score Context */}
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-800">Aligning with Target Role</p>
          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
            Complete the action items below to rewrite weak points and build missing proof of skill. Check off items to see your index grow.
          </p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto max-h-[250px] space-y-3 pr-1">
        {tasks.map((task) => {
          const isChecked = checkedTaskIds.includes(task.id);
          return (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer select-none transition-all ${
                isChecked
                  ? "border-emerald-200 bg-emerald-50/40 text-slate-500 hover:bg-emerald-50/60"
                  : "border-slate-100 bg-white text-slate-800 hover:border-slate-200 hover:shadow-sm"
              }`}
            >
              {/* Fake Checkbox */}
              <div className="pt-0.5 shrink-0">
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                    isChecked
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-300 bg-white group-hover:border-slate-400"
                  }`}
                >
                  {isChecked && (
                    <svg
                      className="h-2.5 w-2.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Icon Type Label */}
              {getTaskIcon(task.type)}

              {/* Task Label */}
              <div className="min-w-0 flex-1 pt-0.5">
                <p
                  className={`text-[11px] leading-relaxed transition-all ${
                    isChecked ? "line-through text-slate-400 font-medium" : "font-semibold text-slate-700"
                  }`}
                >
                  {task.label}
                </p>
              </div>

              {/* Score tag */}
              <span className="shrink-0 font-mono text-[9px] font-bold text-slate-400 px-1 py-0.5 rounded bg-slate-100">
                +{task.scoreImpact}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
