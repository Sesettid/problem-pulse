import Link from "next/link";
import { AlertCircle, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigNotice } from "@/components/config-notice";
import { VoteButton } from "@/components/vote-button";
import { getProblems } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ExploreProblemsPage() {
  const problems = await getProblems();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Explore Problems</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-normal">Shared pain points, ranked by signal</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Problems are sorted by AI impact score multiplied by the number of people who also
            experience the issue.
          </p>
        </div>
        <Button asChild>
          <Link href="/submit">Submit a problem</Link>
        </Button>
      </div>
      <ConfigNotice context="read" />

      {!problems.length ? (
        <Card>
          <CardContent className="flex flex-col items-center p-10 text-center">
            <AlertCircle className="h-10 w-10 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">No problems yet</h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
              Add the first submission, then connect Supabase and OpenAI environment variables to
              start generating analysis.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {problems.map((problem) => (
            <Card key={problem.id}>
              <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {problem.ai_analysis ? <Badge>{problem.ai_analysis.theme}</Badge> : null}
                  </div>
                  <CardTitle>{problem.title}</CardTitle>
                  <CardDescription className="mt-2 max-w-3xl">{problem.description}</CardDescription>
                </div>
                <div className="rounded-md border bg-background px-3 py-2 text-center">
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <p className="text-2xl font-semibold text-primary">{problem.priority_score}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Who is impacted and what happens</p>
                    <p className="mt-1 text-sm text-muted-foreground">{problem.current_impact}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Desired outcome</p>
                    <p className="mt-1 text-sm text-muted-foreground">{problem.desired_outcome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">AI readout</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {problem.ai_analysis?.summary ?? "Analysis pending"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-3 border-t pt-5 sm:flex-row sm:items-center">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Impact {problem.ai_analysis?.impact_score ?? "-"}/10</span>
                    <span>Complexity {problem.ai_analysis?.complexity_score ?? "-"}/10</span>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <VoteButton problemId={problem.id} initialVotes={problem.vote_count} />
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/dashboard">
                        See dashboard <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
