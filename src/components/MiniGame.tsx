"use client";

import React, { useState } from "react";

interface Choice {
  text: string;
  feedback: string;
  score: number;
  trait: string;
}

interface GameStep {
  prompt: string;
  choices: Choice[];
}

interface Scenario {
  id: string;
  title: string;
  role: string;
  difficulty: "Easy" | "Medium" | "Hard";
  intro: string;
  steps: GameStep[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "launch",
    title: "Feature Delay vs. Marketing Deadline",
    role: "Product Manager",
    difficulty: "Medium",
    intro: "It is Friday. Your tech lead informs you that a critical checkout API integration is buggy and needs 5 more days of development. However, the marketing team has scheduled a launch press release for next Tuesday morning, backed by a $12,000 paid ad spend. What do you do?",
    steps: [
      {
        prompt: "STEP 1: Choose your initial communication and mitigation response.",
        choices: [
          {
            text: "Demand the engineering team work through the weekend to hit the Tuesday deadline.",
            feedback: "Engineering burnout risk: The team is frustrated. Sprints are rushed, increasing database regression errors by 30%. Short-term patch, long-term technical debt.",
            score: 40,
            trait: "Authoritative Executor",
          },
          {
            text: "Immediately email the CMO requesting a marketing launch delay of 1 week.",
            feedback: "Marketing frustration: Ad campaign contracts are locked; canceling on short notice burns $4K in non-refundable ad deposits. Stakeholder friction is high.",
            score: 55,
            trait: "Risk-Averse Coordinator",
          },
          {
            text: "Schedule an urgent alignment meeting with both Tech Lead and Marketing Lead to review scopes.",
            feedback: "Alignment created: Tech lead proposes a 'mock checkout' staging flow that runs on Tuesday, delaying only the production release to Friday. Marketing is satisfied.",
            score: 90,
            trait: "Collaborative Strategist",
          },
        ],
      },
      {
        prompt: "STEP 2: The mock checkout is built, but QA finds a security token leak. Time is running out.",
        choices: [
          {
            text: "Deploy anyway and hotfix it silently live on Tuesday afternoon.",
            feedback: "Security breach: User tokens are leaked, resulting in a thread on Twitter. Major security liability. Index drops drastically.",
            score: 10,
            trait: "High-Risk Gambler",
          },
          {
            text: "Pull the mock feature. Run the launch with a simple 'Coming Soon' waitlist page.",
            feedback: "Waitlist salvage: Zero security risk. Collects 1,200 emails instead. Safe trade-off, though marketing CTR drops slightly.",
            score: 85,
            trait: "Pragmatic Improviser",
          },
          {
            text: "Call off the entire launch launch, regardless of marketing budgets.",
            feedback: "Extreme safety: Saves product credibility but damages cross-functional trust with CMO. No user feedback gathered.",
            score: 50,
            trait: "Conservative Protector",
          },
        ],
      },
      {
        prompt: "STEP 3: Post-incident. Your team is holding a retrospective. How do you prevent this next time?",
        choices: [
          {
            text: "Write a PRD template section mandating a 2-week buffer for all API integrations.",
            feedback: "Process inflation: Heavy rules slow down shipping velocity. Engineers bypass the rules for minor releases.",
            score: 65,
            trait: "Over-Process Optimizer",
          },
          {
            text: "Introduce 'Feature Flags' to decouple code deployment from marketing launch dates.",
            feedback: "Best practice: Allows engineering to deploy buggy code turned off in production, turning it on only after final QA signs off.",
            score: 100,
            trait: "Modern Technical PM",
          },
          {
            text: "Instruct marketing to check with engineering before booking ads in the future.",
            feedback: "Blame shifting: Creates organizational silos. Siloed teams build poor user loops.",
            score: 30,
            trait: "Siloed Administrator",
          },
        ],
      },
    ],
  },
  {
    id: "retention",
    title: "The Sudden Retention Drop",
    role: "Strategy & Analytics Analyst",
    difficulty: "Hard",
    intro: "Your dashboard alerts you that the Daily Active Users (DAU) to Monthly Active Users (MAU) stickiness ratio has plunged by 18% over the last 4 days. CEO is asking for an immediate slide deck explaining the drop. Where do you start?",
    steps: [
      {
        prompt: "STEP 1: Identify the source of the drop in the user funnel.",
        choices: [
          {
            text: "Query database for user logins categorized by marketing referral source.",
            feedback: "Marketing check: Finds ad channels are consistent. No sudden drops in signup acquisition. The leak is elsewhere in the funnel.",
            score: 60,
            trait: "Channel Analyst",
          },
          {
            text: "Perform a cohort retention analysis segmented by app platform (iOS, Android, Web) and version release.",
            feedback: "Root Cause! Shows a 50% plunge specifically in Web users who updated to Chrome v124 due to an unhandled JS loop in the onboarding flow.",
            score: 95,
            trait: "Funnel Scientist",
          },
          {
            text: "Draft a survey to email to active users asking why they are leaving.",
            feedback: "High friction: Emails take 48 hours to get replies. CEO needs answers in 4 hours. Good practice but too slow for crises.",
            score: 45,
            trait: "Qualitative Explorer",
          },
        ],
      },
      {
        prompt: "STEP 2: The JS bug is identified in Chrome Web. You need to coordinate the fix and message the CEO.",
        choices: [
          {
            text: "Send a slide stating 'Web bug found, fixing now' and wait for engineers to deploy.",
            feedback: "Communication gap: CEO doesn't know financial risk or estimated time of resolution (ETR).",
            score: 50,
            trait: "Passive Communicator",
          },
          {
            text: "Provide a 3-slide deck outlining: Bug cause, Total impacted users (14K), Revenue risk ($2.1k/day), and an ETR of 2 hours.",
            feedback: "Executive excellence: Translates raw technical bugs into concrete financial and user risk. CEO is highly impressed.",
            score: 100,
            trait: "Strategic Communicator",
          },
          {
            text: "Blame the QA contractor team for missing the Chrome v124 browser testing specs.",
            feedback: "Faulty culture: Blame shifting damages trust. CEO questions your team leadership skills.",
            score: 20,
            trait: "Defensive Manager",
          },
        ],
      },
      {
        prompt: "STEP 3: The fix is deployed. How do you recover the lost active users?",
        choices: [
          {
            text: "Trigger a push notification / email campaign offering a 10% coupon to impacted users.",
            feedback: "Sales-heavy fix: Short term boost, but trains users to expect coupons during errors. High margin loss.",
            score: 70,
            trait: "Transactional Optimizer",
          },
          {
            text: "Publish a transparent, friendly post-mortem email explaining the bug and offering a personal apology from the team.",
            feedback: "Trust building: Transparency drives user loyalty. Re-engagement metrics climb back to 97% of normal baseline.",
            score: 90,
            trait: "User Advocate",
          },
          {
            text: "Do nothing and let natural traffic cycle recover back to normal.",
            feedback: "Passive strategy: Slow recovery. Impacted users churn permanently to competitors.",
            score: 40,
            trait: "Laissez-faire Operator",
          },
        ],
      },
    ],
  },
];

export default function MiniGame() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [gameScores, setGameScores] = useState<number[]>([]);
  const [traits, setTraits] = useState<string[]>([]);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const startScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCurrentStep(0);
    setGameScores([]);
    setTraits([]);
    setSelectedChoiceIdx(null);
    setShowFeedback(false);
    setIsFinished(false);
  };

  const handleSelectChoice = (choiceIdx: number) => {
    setSelectedChoiceIdx(choiceIdx);
    setShowFeedback(true);
  };

  const handleNextStep = () => {
    if (!selectedScenario || selectedChoiceIdx === null) return;

    const choice = selectedScenario.steps[currentStep].choices[selectedChoiceIdx];
    setGameScores((prev) => [...prev, choice.score]);
    setTraits((prev) => [...prev, choice.trait]);
    setSelectedChoiceIdx(null);
    setShowFeedback(false);

    if (currentStep < selectedScenario.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const resetGame = () => {
    setSelectedScenario(null);
    setCurrentStep(0);
    setGameScores([]);
    setTraits([]);
    setSelectedChoiceIdx(null);
    setShowFeedback(false);
    setIsFinished(false);
  };

  // Calculate final results
  const averageScore = gameScores.length > 0 ? Math.round(gameScores.reduce((a, b) => a + b, 0) / gameScores.length) : 0;
  
  // Find the dominant trait (simplification: last trait or highest scored trait)
  const dominantTrait = traits.length > 0 ? traits[gameScores.indexOf(Math.max(...gameScores))] : "Aspiring Specialist";

  return (
    <section id="game" className="py-16 bg-white border-b border-slate-200 blueprint-grid scroll-mt-24">
      <div className="absolute inset-0 blueprint-grid-fine pointer-events-none opacity-30" />
      
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-light px-3 py-1 text-xs font-mono font-semibold text-brand mb-4 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-ping" />
            DAILY reevalve MINI-GAME
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Interactive Role Simulator
          </h2>
          <p className="max-w-xl mx-auto text-slate-500 text-sm mt-2">
            Practice handling product emergencies and strategic dilemmas. Experience the live, gamified coaching built into reevalve.
          </p>
        </div>

        {/* Terminal Screen Container */}
        <div className="rounded-xl border border-slate-300 bg-white shadow-xl overflow-hidden">
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between bg-slate-50 border-b border-slate-200 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <span className="font-mono text-[10px] font-bold text-slate-400">
              SIMULATOR_CORE_V4.0 // {selectedScenario ? selectedScenario.title.toUpperCase() : "CHOOSE_SCENARIO"}
            </span>
            <div className="w-12" /> {/* spacer */}
          </div>

          {/* Terminal Screen Body */}
          <div className="p-6 md:p-8 min-h-[360px] flex flex-col justify-between font-mono text-xs">
            {!selectedScenario ? (
              /* Scenario Selector Screen */
              <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
                <p className="text-slate-400 mb-6 text-xs max-w-md leading-relaxed">
                  Select a live scenario to begin the simulation. Your decisions will be scored in real-time across execution, stakeholder leadership, and technical capability.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                  {SCENARIOS.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => startScenario(sc)}
                      className="flex flex-col justify-between text-left p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-brand hover:bg-brand-light/20 hover:scale-[1.01] active:scale-[0.99] transition-all group"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="rounded bg-brand-light border border-brand/10 text-brand px-1.5 py-0.5 text-[9px] font-bold">
                            {sc.role}
                          </span>
                          <span className="text-[9px] font-semibold text-slate-400">
                            Diff: {sc.difficulty}
                          </span>
                        </div>
                        <h4 className="font-sans font-bold text-slate-800 text-sm group-hover:text-brand transition-colors mb-2">
                          {sc.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-sans line-clamp-3 leading-relaxed">
                          {sc.intro}
                        </p>
                      </div>
                      <span className="inline-block mt-4 text-[10px] font-bold text-brand group-hover:translate-x-1 transition-transform">
                        INITIALIZE SCAN &gt;
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : isFinished ? (
              /* Results Screen */
              <div className="flex-1 flex flex-col justify-center items-center py-6 text-center animate-in fade-in duration-300">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-light border border-brand/20 text-brand mb-4">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-sans font-extrabold text-xl text-slate-900 mb-1">
                  Simulation Finished
                </h3>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-6">
                  Evaluation profile compiled.
                </p>

                {/* Score Panel */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-md border border-slate-200 rounded-xl bg-slate-50 p-4 mb-6 shadow-sm">
                  <div>
                    <span className="text-[9px] text-slate-400 block mb-1">DECISION STABILITY</span>
                    <span className="text-2xl font-display font-black text-brand">{averageScore}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block mb-1">DOMINANT STRENGTH</span>
                    <span className="text-xs font-bold text-slate-800 uppercase block mt-2.5 tracking-tight truncate px-1">
                      {dominantTrait}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={resetGame}
                    className="h-9 px-5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    Select Another
                  </button>
                  <a
                    href="#diagnostic"
                    className="inline-flex items-center justify-center h-9 px-5 rounded-lg bg-brand text-[10px] font-bold text-white shadow hover:bg-brand-hover active:scale-95 transition-all"
                  >
                    Get Full Roadmap
                  </a>
                </div>
              </div>
            ) : (
              /* Active Game Step */
              <div className="flex-1 flex flex-col justify-between">
                {/* Scenario details */}
                <div className="mb-4">
                  {currentStep === 0 && (
                    <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 text-[11px] text-slate-600 font-sans leading-relaxed mb-4">
                      <span className="font-bold text-slate-800">SCENARIO SITUATION:</span> {selectedScenario.intro}
                    </div>
                  )}
                  
                  {/* Step prompt */}
                  <div className="text-[10px] font-bold text-brand uppercase tracking-wider mb-2">
                    {selectedScenario.steps[currentStep].prompt}
                  </div>
                </div>

                {/* Choices or Feedback */}
                <div className="flex-1 flex flex-col justify-center gap-3">
                  {!showFeedback ? (
                    selectedScenario.steps[currentStep].choices.map((choice, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectChoice(idx)}
                        className="flex items-start text-left p-3 rounded-lg border border-slate-200 bg-white hover:border-brand hover:bg-brand-light/10 transition-all font-sans text-[11px] text-slate-700 font-semibold active:scale-[0.99] group"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-500 mr-3 group-hover:bg-brand group-hover:text-white transition-colors">
                          {idx + 1}
                        </span>
                        <span>{choice.text}</span>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5 font-sans animate-in fade-in duration-300">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono text-[9px] font-bold text-slate-400">CHOICE OUTCOME:</span>
                        <span className="rounded bg-brand-light text-brand px-1.5 py-0.2 text-[8px] font-mono font-bold">
                          +{selectedScenario.steps[currentStep].choices[selectedChoiceIdx!].score} PTS
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium mb-1">
                        {selectedScenario.steps[currentStep].choices[selectedChoiceIdx!].feedback}
                      </p>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="mt-6 flex justify-between items-center border-t border-slate-150 pt-4">
                  <span className="text-[9px] font-mono text-slate-400">
                    STEP {currentStep + 1} OF {selectedScenario.steps.length}
                  </span>
                  
                  {showFeedback ? (
                    <button
                      onClick={handleNextStep}
                      className="h-8 px-4 rounded bg-slate-800 text-[10px] font-bold text-white hover:bg-slate-900 active:scale-95 transition-all"
                    >
                      {currentStep < selectedScenario.steps.length - 1 ? "NEXT STEP >" : "VIEW SIM RESULTS >"}
                    </button>
                  ) : (
                    <button
                      onClick={resetGame}
                      className="text-slate-400 hover:text-slate-600 text-[10px] font-bold"
                    >
                      ABORT SIMULATION
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
