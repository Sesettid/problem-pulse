import type { ProblemTheme, RawProblemSubmission } from "@/lib/types";

type LocalAnalysis = {
  summary: string;
  theme: ProblemTheme;
  root_cause: string;
  affected_personas: string[];
  suggested_solution_area: string;
  impact_score: number;
  complexity_score: number;
};

type ThemeSignal = {
  theme: ProblemTheme;
  keywords: string[];
  rootCause: string;
  solutionArea: string;
};

const themeSignals: ThemeSignal[] = [
  {
    theme: "Data Quality",
    keywords: ["data", "record", "duplicate", "accuracy", "incorrect", "stale", "report", "number"],
    rootCause: "Information is fragmented, inconsistent, or not trusted across the workflow.",
    solutionArea: "Data governance, cleanup, and source-of-truth improvements"
  },
  {
    theme: "Service Improvement",
    keywords: ["service", "delay", "wait", "backlog", "response", "queue", "handoff"],
    rootCause: "Service flow has bottlenecks or unclear ownership between steps.",
    solutionArea: "Service design, workflow ownership, and process simplification"
  },
  {
    theme: "Manual Processes",
    keywords: ["manual", "spreadsheet", "copy", "paste", "email", "rework", "duplicate work", "chasing"],
    rootCause: "People are compensating for missing automation or disconnected tools.",
    solutionArea: "Workflow automation and integrated operating processes"
  },
  {
    theme: "Technology",
    keywords: ["system", "tool", "platform", "software", "login", "integration", "portal", "bug"],
    rootCause: "Current tools are not supporting the work cleanly end to end.",
    solutionArea: "Platform improvement, integration, and digital enablement"
  },
  {
    theme: "Policy",
    keywords: ["policy", "approval", "compliance", "rule", "guidance", "procedure", "regulation"],
    rootCause: "Rules or decision rights are unclear, hard to find, or inconsistently applied.",
    solutionArea: "Policy clarification, guidance design, and decision standards"
  },
  {
    theme: "Communication",
    keywords: ["communication", "message", "update", "meeting", "alignment", "clarity", "feedback"],
    rootCause: "Important context is not reaching the right people at the right time.",
    solutionArea: "Communication routines, shared updates, and clearer escalation paths"
  },
  {
    theme: "Customer Experience",
    keywords: ["customer", "citizen", "client", "user", "public", "experience", "frustration"],
    rootCause: "The current experience creates avoidable effort or confusion for the people served.",
    solutionArea: "Customer journey improvement and front-line experience design"
  }
];

const highImpactWords = ["risk", "cost", "delay", "urgent", "critical", "missed", "lost", "compliance"];
const complexityWords = ["integration", "policy", "multiple", "system", "department", "approval", "legacy"];
const personaWords = [
  "citizens",
  "employees",
  "managers",
  "executives",
  "customers",
  "partners",
  "analysts",
  "teams",
  "leaders"
];

export function analyzeProblemLocally(problem: RawProblemSubmission): LocalAnalysis {
  const text = `${problem.description} ${problem.current_impact} ${problem.desired_outcome}`.toLowerCase();
  const theme = pickTheme(text);
  const signal = themeSignals.find((item) => item.theme === theme) ?? themeSignals[0];
  const affectedPersonas = pickPersonas(text);
  const impactScore = scoreText(text, highImpactWords, 5, 10);
  const complexityScore = scoreText(text, complexityWords, 3, 9);

  return {
    summary: summarize(problem, theme),
    theme,
    root_cause: signal.rootCause,
    affected_personas: affectedPersonas,
    suggested_solution_area: signal.solutionArea,
    impact_score: impactScore,
    complexity_score: complexityScore
  };
}

function pickTheme(text: string): ProblemTheme {
  const scored = themeSignals.map((signal) => ({
    theme: signal.theme,
    score: signal.keywords.reduce((count, keyword) => count + (text.includes(keyword) ? 1 : 0), 0)
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.score ? scored[0].theme : "Service Improvement";
}

function pickPersonas(text: string) {
  const matches = personaWords.filter((persona) => text.includes(persona));
  if (matches.length) {
    return matches.map((persona) => persona[0].toUpperCase() + persona.slice(1));
  }

  return ["Employees"];
}

function scoreText(text: string, keywords: string[], base: number, max: number) {
  const keywordHits = keywords.reduce((count, keyword) => count + (text.includes(keyword) ? 1 : 0), 0);
  const lengthBoost = text.length > 500 ? 2 : text.length > 240 ? 1 : 0;
  return Math.min(max, base + keywordHits + lengthBoost);
}

function summarize(problem: RawProblemSubmission, theme: ProblemTheme) {
  const problemText = trimSentence(problem.description, 140);
  const outcomeText = trimSentence(problem.desired_outcome, 110);

  return `${theme}: ${problemText} Solving it would help ${outcomeText.toLowerCase()}`;
}

function trimSentence(value: string, maxLength: number) {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (trimmed.length <= maxLength) return trimmed.endsWith(".") ? trimmed : `${trimmed}.`;

  return `${trimmed.slice(0, maxLength - 4).trim()}...`;
}
