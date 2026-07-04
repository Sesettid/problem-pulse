import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, MessageSquareText, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: MessageSquareText,
    title: "Capture the real friction",
    description: "Employees describe what is slowing work down in their own words."
  },
  {
    icon: BrainCircuit,
    title: "Analyze common themes",
    description: "AI summarizes root causes, themes, impact, and complexity for each submission."
  },
  {
    icon: Vote,
    title: "Let patterns rise",
    description: "Teams upvote shared problems so priority is shaped by both impact and demand."
  },
  {
    icon: BarChart3,
    title: "Brief leaders faster",
    description: "Executives see themes, opportunity areas, and the highest-priority problems."
  }
];

export default function Home() {
  return (
    <main>
      <section className="pulse-grid border-b">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.86fr] lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-md border bg-white px-3 py-1 text-sm text-muted-foreground shadow-sm">
              Workplace discovery for modern teams
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-foreground sm:text-6xl lg:text-7xl">
              Surface
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Discover what matters. Solve what counts.
            </p>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              Help employees surface workplace problems, group repeated pain points, and turn
              scattered feedback into executive-ready opportunities.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/submit">
                  Submit a problem <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">View insights</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-lg border bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Live opportunity signal</p>
                <span className="rounded-md bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
                  AI scored
                </span>
              </div>
              <div className="space-y-4">
                {["Manual reporting loops", "Disconnected service data", "Policy handoff delays"].map(
                  (item, index) => (
                    <div key={item} className="rounded-md border bg-background p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{item}</p>
                        <span className="text-sm font-semibold text-primary">{92 - index * 11}</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${86 - index * 13}%` }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-5 w-5 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
