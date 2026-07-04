import { createServerSupabaseClient } from "@/lib/supabase/server";
import { demoProblems } from "@/lib/demo-data";
import type { AiAnalysis, Problem, ProblemTheme, ProblemWithAnalysis } from "@/lib/types";

type ProblemRow = Problem & {
  ai_analysis: AiAnalysis[] | null;
  problem_votes: { id: string }[] | null;
};

export async function getProblems(): Promise<ProblemWithAnalysis[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return demoProblems;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("problems")
    .select(
      "id,title,description,affected_group,current_impact,desired_outcome,created_at,ai_analysis(*),problem_votes(id)"
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    return demoProblems;
  }

  return (data as ProblemRow[])
    .map((problem) => {
      const analysis = problem.ai_analysis?.[0] ?? null;
      const voteCount = problem.problem_votes?.length ?? 0;
      const priorityScore = (analysis?.impact_score ?? 0) * Math.max(voteCount, 1);

      return {
        ...problem,
        ai_analysis: analysis,
        vote_count: voteCount,
        priority_score: priorityScore
      };
    })
    .sort((a, b) => b.priority_score - a.priority_score);
}

export function summarizeByTheme(problems: ProblemWithAnalysis[]) {
  const counts = new Map<ProblemTheme | "Uncategorized", number>();

  for (const problem of problems) {
    const theme = problem.ai_analysis?.theme ?? "Uncategorized";
    counts.set(theme, (counts.get(theme) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count);
}

export function averageImpact(problems: ProblemWithAnalysis[]) {
  const scored = problems.filter((problem) => problem.ai_analysis);
  if (!scored.length) return 0;

  return (
    scored.reduce((sum, problem) => sum + (problem.ai_analysis?.impact_score ?? 0), 0) /
    scored.length
  );
}

export function executiveSummary(problems: ProblemWithAnalysis[]) {
  if (!problems.length) {
    return "Based on all submissions, Surface will identify the top organizational opportunities as employees begin sharing problems.";
  }

  const themeSummary = summarizeByTheme(problems)
    .slice(0, 3)
    .map((item) => item.theme)
    .join(", ");

  const topProblem = problems[0];

  return `Based on all submissions, these are the top organizational opportunities: focus on ${themeSummary || "emerging patterns"}, prioritize the highest-impact work around "${topProblem.title}", and investigate repeatable improvements that reduce the most common friction employees are describing.`;
}
