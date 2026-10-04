import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Lightbulb, MessageCircle, PartyPopper } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getGuide } from "@/lib/content";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/learn/$slug")({
  loader: ({ params }) => {
    const guide = getGuide(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.guide.title} — Stitchology` },
          { name: "description", content: loaderData.guide.summary },
          { property: "og:title", content: loaderData.guide.title },
          { property: "og:description", content: loaderData.guide.summary },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <AppShell>
      <p className="p-8 text-center">Tutorial not found. <Link to="/learn" className="text-primary underline">Back to tutorials</Link></p>
    </AppShell>
  ),
  errorComponent: () => <AppShell><p className="p-8 text-center">Couldn't load this tutorial.</p></AppShell>,
  component: GuidePage,
});

function GuidePage() {
  const { guide } = Route.useLoaderData();
  const [step, setStep] = useState(-1); // -1 = overview
  const total = guide.steps.length;
  const back = guide.kind === "upcycle" ? "/upcycle" : "/learn";

  if (step === -1) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-6">
          <Link to={back} className="flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Back</Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">{guide.category} · {guide.level} · {guide.time}</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight">{guide.title}</h1>
          <p className="mt-2 text-muted-foreground">{guide.summary}</p>
          <div className="mt-6 rounded-2xl bg-paper p-5">
            <h2 className="text-lg font-semibold">You'll need</h2>
            <ul className="mt-2 space-y-1.5">
              {guide.supplies.map((s) => (
                <li key={s} className="flex gap-2"><span className="text-primary">✂</span>{s}</li>
              ))}
            </ul>
          </div>
          <h2 className="mt-6 text-lg font-semibold">Steps</h2>
          <ol className="mt-2 space-y-2">
            {guide.steps.map((s, i) => (
              <li key={s.title}>
                <button onClick={() => setStep(i)} className="flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold">{i + 1}</span>
                  <span className="font-medium">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
          <Button onClick={() => setStep(0)} size="lg" className="mt-6 h-14 w-full rounded-full text-base">Start step 1</Button>
        </div>
      </AppShell>
    );
  }

  if (step >= total) {
    return (
      <AppShell>
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
          <PartyPopper className="size-12 text-primary" />
          <h1 className="mt-4 text-3xl font-semibold">You did it!</h1>
          <p className="mt-2 text-muted-foreground">"{guide.title}" is complete. Every finished project builds your confidence.</p>
          <div className="mt-6 flex w-full flex-col gap-3">
            <Button asChild size="lg" className="h-12 rounded-full"><Link to={back}>Find another project</Link></Button>
            <Button variant="outline" size="lg" className="h-12 rounded-full" onClick={() => setStep(-1)}>Back to overview</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const s = guide.steps[step]!;
  return (
    <AppShell>
      <div className="mx-auto flex min-h-[calc(100dvh-9rem)] max-w-2xl flex-col px-4 py-5">
        <div className="flex items-center justify-between text-sm">
          <button onClick={() => setStep(-1)} className="flex items-center gap-1 text-muted-foreground"><ArrowLeft className="size-4" /> Overview</button>
          <span className="font-semibold">Step {step + 1} of {total}</span>
        </div>
        <div className="mt-3 flex gap-1.5">
          {guide.steps.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
        <div className="mt-8 flex-1">
          <span className="font-display text-6xl font-semibold text-primary/30">{String(step + 1).padStart(2, "0")}</span>
          <h1 className="mt-1 text-3xl font-semibold leading-tight">{s.title}</h1>
          <p className="mt-4 text-xl leading-relaxed">{s.body}</p>
          {s.tip && (
            <div className="mt-6 flex gap-3 rounded-2xl bg-accent p-4 text-accent-foreground">
              <Lightbulb className="mt-0.5 size-5 shrink-0" />
              <p>{s.tip}</p>
            </div>
          )}
          <Link to="/coach" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <MessageCircle className="size-4" /> Stuck? Ask the Sewing Coach
          </Link>
        </div>
        <div className="sticky bottom-20 mt-8 grid grid-cols-[auto_1fr] gap-3 md:bottom-4">
          <Button variant="outline" size="lg" className="h-16 w-16 rounded-full" disabled={step === 0} onClick={() => setStep(step - 1)} aria-label="Previous step">
            <ChevronLeft className="size-6" />
          </Button>
          <Button size="lg" className="h-16 rounded-full text-lg" onClick={() => { setStep(step + 1); window.scrollTo(0, 0); }}>
            {step + 1 === total ? "Finish" : "Next step"} <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
