"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

// Shape returned by the AI evaluator (matches what the API route returns)
export interface ResumeEvaluation {
  overall_score?: number;
  ats_score?: number;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  skills?: {
    technical?: string[];
    soft?: string[];
  };
  experience_years?: number | null;
  education?: string | null;
  suggested_roles?: string[];
  gap_analysis?: Array<{
    category: string;
    gap: string;
    recommendation: string;
  }>;
  keyword_density?: {
    found?: string[];
    missing?: string[];
  };
  formatting_feedback?: string;
  action_items?: string[];
}

export interface UploadedResume {
  id: string;                  // DB row id
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  status: "processing" | "evaluated" | "error";
  evaluation: ResumeEvaluation | null;
  error?: string | null;
}

interface ResumeContextType {
  uploadedResume: UploadedResume | null;
  setUploadedResume: (r: UploadedResume | null) => void;
  clearResume: () => void;
}

const ResumeContext = createContext<ResumeContextType>({
  uploadedResume: null,
  setUploadedResume: () => {},
  clearResume: () => {},
});

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [uploadedResume, setUploadedResumeState] = useState<UploadedResume | null>(null);

  const setUploadedResume = useCallback((r: UploadedResume | null) => {
    setUploadedResumeState(r);
  }, []);

  const clearResume = useCallback(() => {
    setUploadedResumeState(null);
  }, []);

  return (
    <ResumeContext.Provider value={{ uploadedResume, setUploadedResume, clearResume }}>
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => useContext(ResumeContext);
