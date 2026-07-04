import { ProblemForm } from "@/components/problem-form";
import { ConfigNotice } from "@/components/config-notice";

export default function SubmitProblemPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Submit Problem</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-normal">What is getting in the way?</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Share the problem clearly. Surface will save the submission and generate an initial
          analysis for the insights dashboard.
        </p>
      </div>
      <ConfigNotice context="submit" />
      <ProblemForm />
    </main>
  );
}
