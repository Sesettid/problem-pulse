import { createClient } from "@supabase/supabase-js";

const demoProblems = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    title: "Teams manually rebuild the same status reports every week",
    description:
      "Several teams spend hours collecting updates from spreadsheets, email threads, and chat messages just to prepare weekly leadership reports.",
    affected_group:
      "Program leads, managers, and analysts are impacted. They lose time chasing updates, leaders see inconsistent numbers, and decisions are delayed because the story changes depending on the source.",
    current_impact:
      "Program leads, managers, and analysts are impacted. They lose time chasing updates, leaders see inconsistent numbers, and decisions are delayed because the story changes depending on the source.",
    desired_outcome:
      "Teams would have one reliable operating view, reporting would take minutes instead of hours, and leaders could spend more time on decisions than reconciliation.",
    created_at: "2026-07-01T14:00:00.000Z",
    vote_count: 12,
    analysis: {
      id: "10000000-0000-4000-8000-000000000001",
      summary:
        "Manual reporting work is consuming delivery capacity and creating inconsistent leadership visibility.",
      theme: "Manual Processes",
      root_cause: "Operational data is fragmented across tools without an agreed source of truth.",
      affected_personas: ["Program leads", "Managers", "Analysts"],
      suggested_solution_area: "Automated portfolio reporting and shared operating metrics",
      impact_score: 9,
      complexity_score: 5
    }
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    title: "Service teams cannot trust customer profile data",
    description:
      "Customer records often contain stale contact information, duplicated profiles, and conflicting service history.",
    affected_group:
      "Frontline service employees and customers are impacted. Employees spend extra time validating details, customers repeat information, and follow-up work is routed incorrectly.",
    current_impact:
      "Frontline service employees and customers are impacted. Employees spend extra time validating details, customers repeat information, and follow-up work is routed incorrectly.",
    desired_outcome:
      "Employees would have confidence in the customer record, customers would not need to repeat themselves, and service handoffs would be cleaner.",
    created_at: "2026-07-02T10:30:00.000Z",
    vote_count: 9,
    analysis: {
      id: "10000000-0000-4000-8000-000000000002",
      summary:
        "Low data quality is slowing service delivery and increasing customer frustration across channels.",
      theme: "Data Quality",
      root_cause: "Customer data ownership, validation, and deduplication rules are unclear.",
      affected_personas: ["Service employees", "Customers", "Operations managers"],
      suggested_solution_area: "Master data governance and customer profile cleanup",
      impact_score: 8,
      complexity_score: 7
    }
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    title: "Policy changes are hard to find and interpret",
    description:
      "Employees are not sure which policy version is current, and teams interpret guidance differently when serving customers.",
    affected_group:
      "Employees, managers, and external partners are impacted. Work slows down while people search for clarification, and customers receive inconsistent answers.",
    current_impact:
      "Employees, managers, and external partners are impacted. Work slows down while people search for clarification, and customers receive inconsistent answers.",
    desired_outcome:
      "People would find the right guidance quickly, understand what changed, and apply policy consistently across service channels.",
    created_at: "2026-07-03T16:15:00.000Z",
    vote_count: 7,
    analysis: {
      id: "10000000-0000-4000-8000-000000000003",
      summary:
        "Policy knowledge is fragmented, creating inconsistent interpretation and slower service decisions.",
      theme: "Policy",
      root_cause: "Policy updates lack a single searchable home and practical change summaries.",
      affected_personas: ["Employees", "Managers", "External partners"],
      suggested_solution_area: "Policy knowledge base with change impact summaries",
      impact_score: 7,
      complexity_score: 4
    }
  }
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false
  }
});

const demoIds = demoProblems.map((problem) => problem.id);

const { error: deleteError } = await supabase.from("problems").delete().in("id", demoIds);
if (deleteError) throw deleteError;

const { error: problemError } = await supabase.from("problems").insert(
  demoProblems.map(({ analysis: _analysis, vote_count: _voteCount, ...problem }) => problem)
);
if (problemError) throw problemError;

const { error: analysisError } = await supabase.from("ai_analysis").insert(
  demoProblems.map((problem) => ({
    ...problem.analysis,
    problem_id: problem.id
  }))
);
if (analysisError) throw analysisError;

const votes = demoProblems.flatMap((problem) =>
  Array.from({ length: problem.vote_count }, () => ({ problem_id: problem.id }))
);

const { error: voteError } = await supabase.from("problem_votes").insert(votes);
if (voteError) throw voteError;

console.log(`Seeded ${demoProblems.length} demo problems, ${votes.length} votes, and analysis rows.`);
