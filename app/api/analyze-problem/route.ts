import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { analyzeProblemLocally } from "@/lib/local-analysis";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { problemThemes } from "@/lib/types";

const requestSchema = z.object({
  problem_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  affected_group: z.string().min(1),
  current_impact: z.string().min(1),
  desired_outcome: z.string().min(1)
});

const analysisSchema = z.object({
  summary: z.string(),
  theme: z.enum(problemThemes as [string, ...string[]]),
  root_cause: z.string(),
  affected_personas: z.array(z.string()).default([]),
  suggested_solution_area: z.string(),
  impact_score: z.number().int().min(1).max(10),
  complexity_score: z.number().int().min(1).max(10)
});

export async function POST(request: Request) {
  const body = await request.json();
  const problem = requestSchema.parse(body);
  const analysis = process.env.OPENAI_API_KEY
    ? await analyzeWithOpenAi(problem)
    : analyzeProblemLocally(problem);

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("ai_analysis").upsert(
    {
      problem_id: problem.problem_id,
      summary: analysis.summary,
      theme: analysis.theme,
      root_cause: analysis.root_cause,
      affected_personas: analysis.affected_personas,
      suggested_solution_area: analysis.suggested_solution_area,
      impact_score: analysis.impact_score,
      complexity_score: analysis.complexity_score
    },
    { onConflict: "problem_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(analysis);
}

async function analyzeWithOpenAi(problem: z.infer<typeof requestSchema>) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You analyze workplace problem submissions for executives. Return only valid JSON with the exact requested keys. Scores are integers from 1 to 10. Use one business-friendly theme from: Data Quality, Service Improvement, Manual Processes, Technology, Policy, Communication, Customer Experience."
      },
      {
        role: "user",
        content: JSON.stringify({
          task: "Analyze this raw workplace problem submission.",
          field_notes: {
            description:
              "Answer to: What is a problem, frustration, or opportunity you think is worth solving?",
            affected_group:
              "Answer to: Who is impacted, and what happens because of this problem?",
            current_impact:
              "Same impact answer, stored for compatibility with the current database shape.",
            desired_outcome: "Answer to: If this problem was solved, what would improve?"
          },
          expected_json: {
            summary: "one or two sentence executive summary",
            theme: "one allowed theme",
            root_cause: "likely root cause",
            affected_personas: ["personas or roles affected"],
            suggested_solution_area: "business capability or improvement area",
            impact_score: "integer 1-10",
            complexity_score: "integer 1-10"
          },
          submission: problem
        })
      }
    ]
  });

  const content = completion.choices[0]?.message.content;
  if (!content) {
    throw new Error("OpenAI returned an empty analysis");
  }

  return analysisSchema.parse(JSON.parse(content));
}
