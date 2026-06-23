export interface ResumeGap {
  id: string;
  targetText: string;
  title: string;
  type: "ATS" | "Skill Gap" | "Storytelling";
  description: string;
  remedy: string;
}

export interface SkillDetail {
  label: string;
  value: number; // 0 to 100
}

export interface PersonaRoleData {
  atsScore: number;
  skills: SkillDetail[];
  gaps: ResumeGap[];
  tasks: {
    id: string;
    label: string;
    type: "resume" | "quiz" | "project" | "networking";
    scoreImpact: number;
  }[];
}

export interface Persona {
  id: string;
  name: string;
  avatar: string;
  currentTitle: string;
  targetRole: string;
  resumeHTML: string;
  rolesData: {
    [roleKey: string]: PersonaRoleData;
  };
}

export const TARGET_ROLES = [
  { key: "pm", name: "Product Manager" },
  { key: "pjm", name: "Project Manager" },
  { key: "strategy", name: "Strategy Consultant" },
  { key: "ops", name: "Operations Lead" },
];

export const mockPersonas: Persona[] = [
  {
    id: "engineer",
    name: "Alex Chen",
    avatar: "AC",
    currentTitle: "Senior Software Engineer (SaaS)",
    targetRole: "Product Manager",
    resumeHTML: `
      <div class="space-y-4">
        <div class="border-b pb-2">
          <h2 class="text-xl font-bold text-slate-800">ALEX CHEN</h2>
          <p class="text-xs font-mono text-slate-500">alex.chen@saasdev.io | linkedin.com/in/alexchen-dev</p>
        </div>
        
        <div>
          <h3 class="text-sm font-bold text-slate-800 tracking-wider font-mono">EXPERIENCE</h3>
          <div class="mt-2">
            <div class="flex justify-between text-xs">
              <span class="font-bold text-slate-700">Senior Software Engineer</span>
              <span class="text-slate-500 font-mono">2023 - Present</span>
            </div>
            <p class="text-xs italic text-slate-600">CloudSync Platforms (Enterprise SaaS)</p>
            <ul class="list-disc pl-4 text-xs mt-1 text-slate-600 space-y-1">
              <li>Led a team of 4 engineers to rebuild the data ingestion pipeline, increasing throughput by 40%.</li>
              <li><span class="resume-gap-highlight" data-gap-id="eng-1">Responsible for implementing React dashboards and API services for custom client integrations.</span></li>
              <li>Partnered with the product management team to define feature requirements and release schedules.</li>
              <li><span class="resume-gap-highlight" data-gap-id="eng-2">Fixed database bottlenecks and resolved over 120 critical customer bugs during a 6-month support sprint.</span></li>
            </ul>
          </div>

          <div class="mt-3">
            <div class="flex justify-between text-xs">
              <span class="font-bold text-slate-700">Software Engineer II</span>
              <span class="text-slate-500 font-mono">2021 - 2023</span>
            </div>
            <p class="text-xs italic text-slate-600">DevFlow Inc. (Developer Tooling)</p>
            <ul class="list-disc pl-4 text-xs mt-1 text-slate-600 space-y-1">
              <li>Wrote over 50 unit tests and integrated Docker files to automate local build environments.</li>
              <li><span class="resume-gap-highlight" data-gap-id="eng-3">Helped coordinate development sprints using Jira and participated in retrospective meetings.</span></li>
            </ul>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-bold text-slate-800 tracking-wider font-mono">PROJECTS</h3>
          <div class="mt-2">
            <div class="flex justify-between text-xs">
              <span class="font-bold text-slate-700">Personal Dev Tracker (SaaS Side Project)</span>
              <span class="text-slate-500 font-mono">2023</span>
            </div>
            <ul class="list-disc pl-4 text-xs mt-1 text-slate-600 space-y-1">
              <li><span class="resume-gap-highlight" data-gap-id="eng-4">Built a personal time tracking app using Next.js and Firebase and hosted it on Vercel.</span></li>
            </ul>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-bold text-slate-800 tracking-wider font-mono">SKILLS</h3>
          <p class="text-xs text-slate-600 mt-1">TypeScript, Node.js, React, AWS, Postgres, Docker, Redis, Git, Agile, Jira.</p>
        </div>
      </div>
    `,
    rolesData: {
      pm: {
        atsScore: 64,
        skills: [
          { label: "Product Sense", value: 30 },
          { label: "Execution", value: 75 },
          { label: "Technical", value: 95 },
          { label: "Leadership", value: 45 },
          { label: "Analytics", value: 60 },
        ],
        gaps: [
          {
            id: "eng-1",
            targetText: "Responsible for implementing React dashboards and API services for custom client integrations.",
            title: "Task-Oriented Bullet",
            type: "Storytelling",
            description: "Lists what you were 'responsible for' instead of stating what outcome you achieved. PM resumes must highlight business outcomes.",
            remedy: "Rewrite to focus on custom integrations growth: 'Delivered dashboard features for 12 enterprise clients, unlocking $240K ARR and reducing onboarding time by 30%.'",
          },
          {
            id: "eng-2",
            targetText: "Fixed database bottlenecks and resolved over 120 critical customer bugs during a 6-month support sprint.",
            title: "Missing Strategic View",
            type: "Skill Gap",
            description: "Describes engineering bug fixing. Doesn't show PM skill of understanding root customer pain points or cross-functional coordination.",
            remedy: "Reflect systemic problem-solving: 'Analyzed post-launch support trends to prioritize engineering roadmap; reduced customer-reported database bugs by 45%.'",
          },
          {
            id: "eng-3",
            targetText: "Helped coordinate development sprints using Jira and participated in retrospective meetings.",
            title: "Weak Action Verbs",
            type: "ATS",
            description: "Using passive verbs like 'helped coordinate' or 'participated in' flags your resume as junior and lacks ownership for PM roles.",
            remedy: "Use strong ownership verbs: 'Facilitated bi-weekly sprint planning and retrospectives for a cross-functional team of 6, boosting sprint velocity by 18%.'",
          },
          {
            id: "eng-4",
            targetText: "Built a personal time tracking app using Next.js and Firebase and hosted it on Vercel.",
            title: "Developer Project vs Product Case Study",
            type: "Skill Gap",
            description: "Just shows tech stack implementation. Product managers need to demonstrate customer validation, feature prioritization, and launch metrics.",
            remedy: "Frame as a product launch: 'Launched a developer productivity utility to 150 beta users; collected user feedback to iterate on core calendar widget, increasing stickiness by 25%.'",
          },
        ],
        tasks: [
          { id: "task-eng-1", label: "Rewrite: Convert task-based integrations bullet to a business-driven PM statement (+8%)", type: "resume", scoreImpact: 8 },
          { id: "task-eng-2", label: "Case Study: Refactor the Developer Tracker project to document user validation & feedback loop (+10%)", type: "project", scoreImpact: 10 },
          { id: "task-eng-3", label: "Study: Complete 10 daily Agile and Product prioritization quizzes (+5%)", type: "quiz", scoreImpact: 5 },
          { id: "task-eng-4", label: "Networking: Draft and send cold connection requests to 3 senior PMs in SaaS (+7%)", type: "networking", scoreImpact: 7 },
        ],
      },
      pjm: {
        atsScore: 78,
        skills: [
          { label: "Product Sense", value: 20 },
          { label: "Execution", value: 85 },
          { label: "Technical", value: 85 },
          { label: "Leadership", value: 65 },
          { label: "Analytics", value: 50 },
        ],
        gaps: [
          {
            id: "eng-1",
            targetText: "Responsible for implementing React dashboards and API services for custom client integrations.",
            title: "Task-Oriented Bullet",
            type: "Storytelling",
            description: "Fails to highlight project metrics (timelines, scope, client delivery satisfaction).",
            remedy: "Reflect client delivery: 'Managed delivery of 5 custom API integrations on time and within budget, improving client retention rate by 20%.'",
          },
          {
            id: "eng-3",
            targetText: "Helped coordinate development sprints using Jira and participated in retrospective meetings.",
            title: "Lack of Delivery Leadership",
            type: "Skill Gap",
            description: "A Project Manager owns Scrum processes. 'Helped' makes you look like a passive observer.",
            remedy: "Use process ownership: 'Owned Scrum execution and workflow setups in Jira, eliminating blockers to improve release predictability from 70% to 92%.'",
          },
        ],
        tasks: [
          { id: "task-eng-pjm-1", label: "Rewrite: Take ownership of sprint coordinate bullets on resume (+12%)", type: "resume", scoreImpact: 12 },
          { id: "task-eng-pjm-2", label: "Study: Master critical path scheduling and PM tools (+10%)", type: "quiz", scoreImpact: 10 },
        ],
      },
      strategy: {
        atsScore: 48,
        skills: [
          { label: "Product Sense", value: 25 },
          { label: "Execution", value: 60 },
          { label: "Technical", value: 90 },
          { label: "Leadership", value: 30 },
          { label: "Analytics", value: 45 },
        ],
        gaps: [
          {
            id: "eng-1",
            targetText: "Responsible for implementing React dashboards and API services for custom client integrations.",
            title: "Missing Business and Market Context",
            type: "Skill Gap",
            description: "Consultants must explain the commercial value of systems they construct.",
            remedy: "Reflect financial impact: 'Designed custom client platforms supporting client growth worth $1.2M in annual revenue.'",
          },
          {
            id: "eng-2",
            targetText: "Fixed database bottlenecks and resolved over 120 critical customer bugs during a 6-month support sprint.",
            title: "Operation-heavy focus",
            type: "Storytelling",
            description: "Engineering bugs are too granular. Strategic consultants focus on systemic cost reductions or scalability operations.",
            remedy: "Elevate to infrastructure strategy: 'Audit legacy codebases to resolve database performance bottlenecks, enhancing system scalability to support a 30% surge in active users.'",
          },
        ],
        tasks: [
          { id: "task-eng-strat-1", label: "Rewrite: Connect engineering optimizations to cost savings/market scale (+15%)", type: "resume", scoreImpact: 15 },
          { id: "task-eng-strat-2", label: "Project: Conduct a structured market size estimation (TAM/SAM) for developer tooling (+17%)", type: "project", scoreImpact: 17 },
        ],
      },
      ops: {
        atsScore: 58,
        skills: [
          { label: "Product Sense", value: 15 },
          { label: "Execution", value: 70 },
          { label: "Technical", value: 85 },
          { label: "Leadership", value: 50 },
          { label: "Analytics", value: 40 },
        ],
        gaps: [
          {
            id: "eng-1",
            targetText: "Responsible for implementing React dashboards and API services for custom client integrations.",
            title: "No Process Metrics",
            type: "Skill Gap",
            description: "Operations roles require tracking turnaround time (SLA) or efficiency gains.",
            remedy: "Framed as SLA efficiency: 'Streamlined integrations onboarding workflow; designed dashboards that automated custom API integrations, shaving 8 days off client SLA.'",
          },
        ],
        tasks: [
          { id: "task-eng-ops-1", label: "Rewrite: Quantify turnaround times and manual task automation (+18%)", type: "resume", scoreImpact: 18 },
          { id: "task-eng-ops-2", label: "Study: Learn operations frameworks and KPI metrics (+14%)", type: "quiz", scoreImpact: 14 },
        ],
      },
    },
  },
  {
    id: "mba",
    name: "Sarah Jenkins",
    avatar: "SJ",
    currentTitle: "MBA Candidate (ex-Marketing Associate)",
    targetRole: "Project Manager",
    resumeHTML: `
      <div class="space-y-4">
        <div class="border-b pb-2">
          <h2 class="text-xl font-bold text-slate-800">SARAH JENKINS</h2>
          <p class="text-xs font-mono text-slate-500">sarah.jenkins@mba-stern.edu | linkedin.com/in/sarahj-mktg</p>
        </div>
        
        <div>
          <h3 class="text-sm font-bold text-slate-800 tracking-wider font-mono">EDUCATION</h3>
          <div class="mt-2">
            <div class="flex justify-between text-xs">
              <span class="font-bold text-slate-700">MBA Candidate</span>
              <span class="text-slate-500 font-mono">Expected 2026</span>
            </div>
            <p class="text-xs italic text-slate-600">Stern School of Business, NYU (Spec. in Strategy & Tech Product)</p>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-bold text-slate-800 tracking-wider font-mono">EXPERIENCE</h3>
          <div class="mt-2">
            <div class="flex justify-between text-xs">
              <span class="font-bold text-slate-700">Senior Marketing Specialist</span>
              <span class="text-slate-500 font-mono">2022 - 2024</span>
            </div>
            <p class="text-xs italic text-slate-600">StripeLabs Ecommerce</p>
            <ul class="list-disc pl-4 text-xs mt-1 text-slate-600 space-y-1">
              <li><span class="resume-gap-highlight" data-gap-id="mba-1">Assisted in managing the seasonal social ad campaigns, which resulted in a lot of clicks.</span></li>
              <li>Collaborated with design and copywriter agencies to produce 25+ digital ad creative variants.</li>
              <li><span class="resume-gap-highlight" data-gap-id="mba-2">Wrote weekly marketing emails and sent reports to stakeholders.</span></li>
            </ul>
          </div>

          <div class="mt-3">
            <div class="flex justify-between text-xs">
              <span class="font-bold text-slate-700">Digital Marketing Coordinator</span>
              <span class="text-slate-500 font-mono">2020 - 2022</span>
            </div>
            <p class="text-xs italic text-slate-600">CoreAgency Media</p>
            <ul class="list-disc pl-4 text-xs mt-1 text-slate-600 space-y-1">
              <li><span class="resume-gap-highlight" data-gap-id="mba-3">Maintained project schedules for client social posts and managed the Trello board.</span></li>
            </ul>
          </div>
        </div>
      </div>
    `,
    rolesData: {
      pjm: {
        atsScore: 61,
        skills: [
          { label: "Product Sense", value: 40 },
          { label: "Execution", value: 65 },
          { label: "Technical", value: 30 },
          { label: "Leadership", value: 60 },
          { label: "Analytics", value: 55 },
        ],
        gaps: [
          {
            id: "mba-1",
            targetText: "Assisted in managing the seasonal social ad campaigns, which resulted in a lot of clicks.",
            title: "Vague, Unquantified Metrics",
            type: "ATS",
            description: "Using generic descriptions like 'a lot of clicks' represents poor analytics capability. ATS filters flag files lacking numeric percentages/metrics.",
            remedy: "Quantify outcomes: 'Co-managed $45K seasonal social ad campaigns; generated 1.2M impressions and a 4.2% click-through-rate (CTR) exceeding benchmark by 20%.'",
          },
          {
            id: "mba-2",
            targetText: "Wrote weekly marketing emails and sent reports to stakeholders.",
            title: "Task list without scope",
            type: "Storytelling",
            description: "Simply lists a baseline task. Fails to project stakeholder management or communication processes.",
            remedy: "Show status governance: 'Established weekly cross-functional dashboard reports aligning Product, Marketing, and Sales stakeholders on key lead generation metrics.'",
          },
          {
            id: "mba-3",
            targetText: "Maintained project schedules for client social posts and managed the Trello board.",
            title: "Passive Coordinating Verbs",
            type: "Storytelling",
            description: "Managing a Trello board is too tactical for PM roles. Frame it as project roadmap execution.",
            remedy: "Frame as roadmap execution: 'Administered project lifecycle schedules for 14 simultaneous client campaigns, ensuring 100% on-time delivery using Kanban.'",
          },
        ],
        tasks: [
          { id: "task-mba-1", label: "Rewrite: Add campaign budget and CTR metrics to marketing campaigns (+10%)", type: "resume", scoreImpact: 10 },
          { id: "task-mba-2", label: "Rewrite: Frame weekly status updates as governance and alignment process (+8%)", type: "resume", scoreImpact: 8 },
          { id: "task-mba-3", label: "Case Study: Build a Project Charter document for a simulated launch (+12%)", type: "project", scoreImpact: 12 },
          { id: "task-mba-4", label: "Study: Practice daily stakeholder conflict scenarios in Daily Challenge (+9%)", type: "quiz", scoreImpact: 9 },
        ],
      },
      pm: {
        atsScore: 52,
        skills: [
          { label: "Product Sense", value: 45 },
          { label: "Execution", value: 50 },
          { label: "Technical", value: 20 },
          { label: "Leadership", value: 55 },
          { label: "Analytics", value: 60 },
        ],
        gaps: [
          {
            id: "mba-1",
            targetText: "Assisted in managing the seasonal social ad campaigns, which resulted in a lot of clicks.",
            title: "Missing Product Strategy",
            type: "Skill Gap",
            description: "Marketing ad clicks don't show PM capability. Shift the focus to user acquisition channels.",
            remedy: "Acquisition focus: 'Drove customer acquisition strategy using paid search/social channels, acquiring 3.2K active customers at a CAC 15% below target.'",
          },
        ],
        tasks: [
          { id: "task-mba-pm-1", label: "Rewrite: Frame marketing efforts around acquisition, conversion funnels, and retention (+15%)", type: "resume", scoreImpact: 15 },
          { id: "task-mba-pm-2", label: "Project: Design a product teardown and PRD for a new feature in Stripe (+18%)", type: "project", scoreImpact: 18 },
        ],
      },
      strategy: {
        atsScore: 68,
        skills: [
          { label: "Product Sense", value: 50 },
          { label: "Execution", value: 55 },
          { label: "Technical", value: 25 },
          { label: "Leadership", value: 70 },
          { label: "Analytics", value: 75 },
        ],
        gaps: [
          {
            id: "mba-1",
            targetText: "Assisted in managing the seasonal social ad campaigns, which resulted in a lot of clicks.",
            title: "Vague Campaign Impact",
            type: "ATS",
            description: "Needs commercial context and market ROI impact.",
            remedy: "Commercial ROI focus: 'Led optimization of social marketing channels, achieving 3.5x ROI on a seasonal marketing budget of $120K.'",
          },
        ],
        tasks: [
          { id: "task-mba-strat-1", label: "Rewrite: Structure marketing contributions as commercial market ROI (+12%)", type: "resume", scoreImpact: 12 },
          { id: "task-mba-strat-2", label: "Study: Master strategy consulting frameworks (Porter's 5 forces, MECE) (+10%)", type: "quiz", scoreImpact: 10 },
        ],
      },
      ops: {
        atsScore: 55,
        skills: [
          { label: "Product Sense", value: 30 },
          { label: "Execution", value: 65 },
          { label: "Technical", value: 20 },
          { label: "Leadership", value: 60 },
          { label: "Analytics", value: 45 },
        ],
        gaps: [
          {
            id: "mba-3",
            targetText: "Maintained project schedules for client social posts and managed the Trello board.",
            title: "Weak workflow automation",
            type: "Skill Gap",
            description: "Operations candidates must show pipeline speedups or automation.",
            remedy: "Show workflow scaling: 'Redesigned client onboarding pipelines in Trello; reduced template bottlenecks to scale delivery rate by 35%.'",
          },
        ],
        tasks: [
          { id: "task-mba-ops-1", label: "Rewrite: Frame project schedules as onboarding workflow pipelines (+15%)", type: "resume", scoreImpact: 15 },
          { id: "task-mba-ops-2", label: "Study: Complete 5 operations management simulation quizzes (+10%)", type: "quiz", scoreImpact: 10 },
        ],
      },
    },
  },
  {
    id: "ops",
    name: "Marcus Vance",
    avatar: "MV",
    currentTitle: "Operations Manager (Logistics)",
    targetRole: "Strategy Consultant",
    resumeHTML: `
      <div class="space-y-4">
        <div class="border-b pb-2">
          <h2 class="text-xl font-bold text-slate-800">MARCUS VANCE</h2>
          <p class="text-xs font-mono text-slate-500">m.vance@swiftlogistics.com | linkedin.com/in/marcusvance-ops</p>
        </div>
        
        <div>
          <h3 class="text-sm font-bold text-slate-800 tracking-wider font-mono">EXPERIENCE</h3>
          <div class="mt-2">
            <div class="flex justify-between text-xs">
              <span class="font-bold text-slate-700">Hub Operations Manager</span>
              <span class="text-slate-500 font-mono">2021 - Present</span>
            </div>
            <p class="text-xs italic text-slate-600">SwiftLogistics Express (Regional Fulfillment)</p>
            <ul class="list-disc pl-4 text-xs mt-1 text-slate-600 space-y-1">
              <li><span class="resume-gap-highlight" data-gap-id="ops-1">Managed a staff of 45 delivery drivers and warehouse workers, coordinating daily delivery schedules.</span></li>
              <li>Increased local distribution center fulfillment accuracy rate to 98.5%.</li>
              <li><span class="resume-gap-highlight" data-gap-id="ops-2">Worked closely with the senior regional management team to solve issues and cut down on waste.</span></li>
              <li><span class="resume-gap-highlight" data-gap-id="ops-3">Maintained supply levels and dealt with logistics vendors when things were low.</span></li>
            </ul>
          </div>
        </div>
      </div>
    `,
    rolesData: {
      strategy: {
        atsScore: 55,
        skills: [
          { label: "Product Sense", value: 35 },
          { label: "Execution", value: 85 },
          { label: "Technical", value: 40 },
          { label: "Leadership", value: 70 },
          { label: "Analytics", value: 50 },
        ],
        gaps: [
          {
            id: "ops-1",
            targetText: "Managed a staff of 45 delivery drivers and warehouse workers, coordinating daily delivery schedules.",
            title: "Operational vs Strategic Leadership",
            type: "Storytelling",
            description: "Simply lists headcount size. Strategic consulting resumes must show cost efficiencies, structural changes, or profit expansions.",
            remedy: "Reflect optimization outcomes: 'Restructured labor utilization for 45 warehouse workers, lowering overtime costs by 22% ($85K/yr) while improving delivery schedule metrics.'",
          },
          {
            id: "ops-2",
            targetText: "Worked closely with the senior regional management team to solve issues and cut down on waste.",
            title: "Fuzzy and Unquantified Statement",
            type: "ATS",
            description: "Using soft phrases like 'worked closely' or 'solve issues' fails ATS semantic tests looking for specific metrics and frameworks.",
            remedy: "Frame as a lean initiative: 'Executed a Root Cause Analysis (RCA) on local distribution leaks, slashing waste by 14% to recapture $35K in monthly operational margin.'",
          },
          {
            id: "ops-3",
            targetText: "Maintained supply levels and dealt with logistics vendors when things were low.",
            title: "Transactional Task Profile",
            type: "Skill Gap",
            description: "Deals with administrative task lines. High-level consulting tracks look for strategic vendor sourcing and contracts.",
            remedy: "Use strategic procurement: 'Negotiated service level agreements (SLAs) with 6 freight vendor partners, reducing procurement overhead by 11%.'",
          },
        ],
        tasks: [
          { id: "task-ops-1", label: "Rewrite: Quantify labor cost savings and driver efficiency metrics (+12%)", type: "resume", scoreImpact: 12 },
          { id: "task-ops-2", label: "Rewrite: Reframe waste reduction using strategic business terms like margin recapture (+10%)", type: "resume", scoreImpact: 10 },
          { id: "task-ops-3", label: "Project: Design a supply chain efficiency consulting proposal presentation (+15%)", type: "project", scoreImpact: 15 },
          { id: "task-ops-4", label: "Study: Pass 5 management consultant logic case simulations (+8%)", type: "quiz", scoreImpact: 8 },
        ],
      },
      ops: {
        atsScore: 82,
        skills: [
          { label: "Product Sense", value: 20 },
          { label: "Execution", value: 95 },
          { label: "Technical", value: 45 },
          { label: "Leadership", value: 80 },
          { label: "Analytics", value: 65 },
        ],
        gaps: [
          {
            id: "ops-2",
            targetText: "Worked closely with the senior regional management team to solve issues and cut down on waste.",
            title: "Lack of specific process methodology",
            type: "Skill Gap",
            description: "Operations hires need methodology exposure (Lean, Six Sigma, Agile).",
            remedy: "Identify framework: 'Collaborated with regional leadership to implement Lean operations, pruning fulfillment defects by 20%.'",
          },
        ],
        tasks: [
          { id: "task-ops-ops-1", label: "Rewrite: Introduce Lean or Six Sigma terms to project descriptions (+8%)", type: "resume", scoreImpact: 8 },
          { id: "task-ops-ops-2", label: "Study: Earn introductory Scrum or Lean certificate (+10%)", type: "quiz", scoreImpact: 10 },
        ],
      },
      pm: {
        atsScore: 40,
        skills: [
          { label: "Product Sense", value: 25 },
          { label: "Execution", value: 75 },
          { label: "Technical", value: 30 },
          { label: "Leadership", value: 60 },
          { label: "Analytics", value: 40 },
        ],
        gaps: [
          {
            id: "ops-1",
            targetText: "Managed a staff of 45 delivery drivers and warehouse workers, coordinating daily delivery schedules.",
            title: "No User Experience Alignment",
            type: "Skill Gap",
            description: "Fulfillment schedules are logistics tasks. Shift the wording to digital fulfillment platform workflows.",
            remedy: "Focus on delivery tooling: 'Gathered driver feedback to optimize internal tracking interfaces, cutting mobile app drop-off by 15%.'",
          },
        ],
        tasks: [
          { id: "task-ops-pm-1", label: "Rewrite: Reframe dispatch coordination around product/platform deployment and workflow testing (+15%)", type: "resume", scoreImpact: 15 },
          { id: "task-ops-pm-2", label: "Project: Draft a PRD for an automated driver dispatch optimization tool (+18%)", type: "project", scoreImpact: 18 },
        ],
      },
      pjm: {
        atsScore: 72,
        skills: [
          { label: "Product Sense", value: 25 },
          { label: "Execution", value: 85 },
          { label: "Technical", value: 35 },
          { label: "Leadership", value: 75 },
          { label: "Analytics", value: 55 },
        ],
        gaps: [
          {
            id: "ops-2",
            targetText: "Worked closely with the senior regional management team to solve issues and cut down on waste.",
            title: "No project metrics",
            type: "Storytelling",
            description: "Describe this as a dedicated cost reduction project with budget/schedule ownership.",
            remedy: "Define project boundaries: 'Directed a 6-month waste reduction program across 3 regional hubs, delivering $240K in annual savings on budget.'",
          },
        ],
        tasks: [
          { id: "task-ops-pjm-1", label: "Rewrite: Frame continuous operational duties as specific project initiatives (+12%)", type: "resume", scoreImpact: 12 },
          { id: "task-ops-pjm-2", label: "Study: Review critical chain path management methods (+8%)", type: "quiz", scoreImpact: 8 },
        ],
      },
    },
  },
];
