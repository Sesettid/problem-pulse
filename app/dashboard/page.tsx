import Link from "next/link";
import type { ComponentType } from "react";
import { BarChart3, Gauge, Lightbulb, ListChecks } from "lucide-react";
import { ImpactComplexityMatrix, ProblemsByThemeChart } from "@/components/dashboard-charts";
import { ConfigNotice } from "@/components/config-notice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { averageImpact, executiveSummary, getProblems, summarizeByTheme } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const problems = await getProblems();
  const byTheme = summarizeByTheme(problems);
  const avgImpact = averageImpact(problems);
  const highestPriority = problems.slice(0, 5);
  const topThemes = byTheme.slice(0, 4);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Insights Dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-normal">Executive opportunity view</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A concise readout of submission volume, dominant themes, impact, complexity, and priority.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/explore">Explore problems</Link>
        </Button>
      </div>
      <ConfigNotice context="read" />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={ListChecks} label="Total problems submitted" value={problems.length.toString()} />
        <MetricCard icon={Gauge} label="Average impact score" value={avgImpact.toFixed(1)} />
        <MetricCard icon={BarChart3} label="Top problem themes" value={topThemes.length.toString()} />
      </div>

      <Card className="mt-4">
        <CardHeader className="flex-row items-start gap-4">
          <Lightbulb className="mt-1 h-5 w-5 text-primary" />
          <div>
            <CardTitle>AI-generated executive summary</CardTitle>
            <CardDescription className="mt-2 text-base leading-7">{executiveSummary(problems)}</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Problems by theme</CardTitle>
            <CardDescription>Submissions grouped by AI-assigned business theme.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProblemsByThemeChart data={byTheme} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impact vs complexity matrix</CardTitle>
            <CardDescription>Higher impact and lower complexity indicate faster opportunity areas.</CardDescription>
          </CardHeader>
          <CardContent>
            <ImpactComplexityMatrix problems={problems} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Top themes</CardTitle>
            <CardDescription>Most common patterns across submissions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topThemes.length ? (
              topThemes.map((item) => (
                <div key={item.theme} className="flex items-center justify-between rounded-md border p-3">
                  <span className="font-medium">{item.theme}</span>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No analyzed themes yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highest priority problems</CardTitle>
            <CardDescription>Ranked by impact score multiplied by number of votes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {highestPriority.length ? (
              highestPriority.map((problem) => (
                <div key={problem.id} className="rounded-md border p-4">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row">
                    <div>
                      <p className="font-medium">{problem.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{problem.description}</p>
                    </div>
                    <div className="shrink-0 text-left sm:text-right">
                      <p className="text-xs text-muted-foreground">Priority</p>
                      <p className="text-xl font-semibold text-primary">{problem.priority_score}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No priority data yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardDescription>{label}</CardDescription>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
