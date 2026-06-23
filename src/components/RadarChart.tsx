"use client";

import React from "react";
import { SkillDetail } from "../data/mockPersonas";

interface RadarChartProps {
  skills: SkillDetail[];
}

export default function RadarChart({ skills }: RadarChartProps) {
  const size = 260;
  const center = size / 2;
  const maxRadius = 90;

  // Number of variables
  const totalPoints = skills.length;

  // Generate grid levels (concentric pentagons)
  const levels = [0.25, 0.5, 0.75, 1];

  const getCoordinates = (index: number, value: number) => {
    // 0 is straight up, subtract PI/2
    const angle = (index * 2 * Math.PI) / totalPoints - Math.PI / 2;
    const radius = maxRadius * (value / 100);
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y, angle };
  };

  // Generate background pentagon paths
  const getLevelPath = (levelRatio: number) => {
    const points = [];
    for (let i = 0; i < totalPoints; i++) {
      const { x, y } = getCoordinates(i, levelRatio * 100);
      points.push(`${x},${y}`);
    }
    return `M ${points.join(" L ")} Z`;
  };

  // Candidate polygon path
  const candidatePoints = skills.map((skill, i) => {
    const { x, y } = getCoordinates(i, skill.value);
    return `${x},${y}`;
  });
  const candidatePath = `M ${candidatePoints.join(" L ")} Z`;

  return (
    <div className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl bg-white shadow-sm h-full">
      <div className="border-b border-slate-100 pb-2 mb-4 w-full text-left">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Role Fit Alignment Radar
        </h4>
      </div>

      <div className="relative w-full max-w-[260px] aspect-square">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
          {/* Level lines (Grid polygons) */}
          {levels.map((level, idx) => (
            <path
              key={idx}
              d={getLevelPath(level)}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="1.5"
              strokeDasharray={idx === levels.length - 1 ? "none" : "3 3"}
            />
          ))}

          {/* Web axis lines (from center to each vertex) */}
          {skills.map((_, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
            );
          })}

          {/* Candidate Skill Polygon */}
          <path
            d={candidatePath}
            fill="rgba(15, 98, 254, 0.15)"
            stroke="#0F62FE"
            strokeWidth="2"
            className="transition-all duration-500 ease-out"
          />

          {/* Candidate data dots */}
          {skills.map((skill, i) => {
            const { x, y } = getCoordinates(i, skill.value);
            return (
              <g key={i} className="group">
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#0F62FE"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  className="transition-all duration-500 ease-out shadow-sm"
                />
                {/* Tooltip on hover */}
                <title>{`${skill.label}: ${skill.value}%`}</title>
              </g>
            );
          })}

          {/* Labels */}
          {skills.map((skill, i) => {
            const labelDist = 112; // place label further out
            const angle = (i * 2 * Math.PI) / totalPoints - Math.PI / 2;
            const lx = center + labelDist * Math.cos(angle);
            const ly = center + labelDist * Math.sin(angle);

            // Anchor adjustments based on position
            let textAnchor: "middle" | "start" | "end" = "middle";
            if (Math.cos(angle) > 0.1) textAnchor = "start";
            else if (Math.cos(angle) < -0.1) textAnchor = "end";

            let dy = "0.35em";
            if (Math.sin(angle) < -0.8) dy = "-0.2em"; // straight up label
            else if (Math.sin(angle) > 0.8) dy = "1em"; // straight down label

            return (
              <g key={i}>
                {/* Text Label */}
                <text
                  x={lx}
                  y={ly}
                  textAnchor={textAnchor}
                  dy={dy}
                  className="font-mono text-[9px] font-bold text-slate-500"
                >
                  {skill.label.toUpperCase()}
                </text>
                {/* Score label below text */}
                <text
                  x={lx}
                  y={ly + (Math.sin(angle) > 0.8 ? 16 : 10)}
                  textAnchor={textAnchor}
                  dy={dy}
                  className="font-mono text-[8px] font-semibold text-brand"
                >
                  {skill.value}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
