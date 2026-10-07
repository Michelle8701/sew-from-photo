import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, FolderPlus, Lightbulb, List, MessageCircle, PackageOpen } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createProject } from "@/lib/projects";
import { AppShell } from "@/components/AppShell";
import { getGuide } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { TutorialVisual } from "@/components/TutorialVisual";
import { createCoachThread, PENDING_COACH_PROMPT_KEY } from "@/lib/coach";

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
           { property: "og:type", content: "article" },
           { name: "twitter:card", content: "summary" },
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
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const total = guide.steps.length;
  const back = guide.kind === "upcycle" ? "/upcycle" : "/learn";
  const navigate = useNavigate();

  async function saveToWorkroom() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) { navigate({ to: "/auth" }); return; }
    try {
      const id = await createProject({ title: guide.title, source_type: "guide", source_ref: guide.slug, steps: guide.steps.map((s) => s.title) });
      navigate({ to: "/workroom/$id", params: { id } });
    } catch {
      toast.error("Couldn't save to Workroom");
    }
  }

  async function askCoach() {
    const active = guide.steps[step];
    if (!active) return;
    const prompt = [
      `I’m working on “${guide.title}”.`,
      `I’m at step ${step + 1} of ${total}: “${active.title}”.`,
      `The instruction says: ${active.body}`,
      active.tip ? `The tutorial tip says: ${active.tip}` : "",
      "Please help me understand or complete this exact step.",
    ].filter(Boolean).join("\n\n");
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      window.sessionStorage.setItem(PENDING_COACH_PROMPT_KEY, prompt);
      navigate({ to: "/auth", search: { redirect: `/learn/${guide.slug}` } });
      return;
    }
    try {
      const id = await createCoachThread();
      navigate({ to: "/coach/$threadId", params: { threadId: id }, search: { q: prompt } });
    } catch {
      toast.error("Couldn't open the Sewing Coach");
    }
  }

  if (complete) {
    return (
      <AppShell>
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-accent text-accent-foreground"><Check className="size-7" /></span>
          <h1 className="mt-4 text-3xl font-semibold">You did it!</h1>
          <p className="mt-2 text-muted-foreground">"{guide.title}" is complete. Every finished project builds your confidence.</p>
          <div className="mt-6 flex w-full flex-col gap-3">
            <Button asChild size="lg" className="h-12 rounded-full"><Link to={back}>Find another project</Link></Button>
            <Button variant="outline" size="lg" className="h-12 rounded-full" onClick={() => { setStep(0); setComplete(false); }}>Review from step 1</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const s = guide.steps[step];
  if (!s) return null;
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-5">
        <div className="flex items-center justify-between gap-3 text-sm">
          <Link to={back} className="flex items-center gap-1 text-muted-foreground"><ArrowLeft className="size-4" /> All tutorials</Link>
          <span className="shrink-0 font-semibold">Step {step + 1} of {total}</span>
        </div>
        <div className="mt-3 flex gap-1.5" aria-label={`Step ${step + 1} of ${total}`}>
          {guide.steps.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
        <header className="py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{guide.category} · {guide.level} · {guide.time}</p>
          <h1 className="mt-1 text-3xl font-semibold leading-tight md:text-4xl">{guide.title}</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">{guide.summary}</p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,.75fr)]">
          <TutorialVisual guide={guide} stepIndex={step} />
          <section className="relative min-h-[26rem] rounded-2xl border bg-card p-5 shadow-sm md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-primary">Step {step + 1}</p>
                <h2 className="mt-1 text-2xl font-semibold leading-tight">{s.title}</h2>
              </div>
              <span className="font-display text-5xl font-semibold text-primary/20">{String(step + 1).padStart(2, "0")}</span>
            </div>
            <p className="mt-5 text-lg leading-relaxed">{s.body}</p>
            {s.tip && (
              <div className="mt-5 flex gap-3 rounded-xl bg-accent p-4 text-accent-foreground">
                <Lightbulb className="mt-0.5 size-5 shrink-0" />
                <p>{s.tip}</p>
              </div>
            )}
            <Button type="button" variant="outline" onClick={askCoach} className="mt-6 min-h-11 w-full rounded-full border-primary text-primary">
              <MessageCircle className="size-4" /> Ask Coach about this step
            </Button>
            <div className="mt-6 grid grid-cols-[3.5rem_1fr] gap-3">
              <Button variant="outline" size="icon" className="size-14 rounded-full" disabled={step === 0} onClick={() => { setStep((value) => Math.max(0, value - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="Previous step">
                <ChevronLeft className="size-6" />
              </Button>
              <Button size="lg" className="h-14 rounded-full text-base" onClick={() => { if (step + 1 === total) setComplete(true); else setStep((value) => value + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                {step + 1 === total ? "Finish tutorial" : "Next step"} <ChevronRight className="size-5" />
              </Button>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <details className="rounded-2xl border bg-card p-5">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold"><PackageOpen className="size-4 text-primary" /> You'll need</summary>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">{guide.supplies.map((item) => <li key={item}>• {item}</li>)}</ul>
          </details>
          <details className="rounded-2xl border bg-card p-5">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold"><List className="size-4 text-primary" /> Jump to a step</summary>
            <div className="mt-3 grid gap-2">{guide.steps.map((item, index) => <Button key={item.title} type="button" variant={index === step ? "secondary" : "ghost"} className="h-auto justify-start whitespace-normal py-2 text-left" onClick={() => { setStep(index); setComplete(false); }}>{index + 1}. {item.title}</Button>)}</div>
          </details>
        </div>
        <Button onClick={saveToWorkroom} size="lg" variant="outline" className="mt-4 h-12 w-full rounded-full"><FolderPlus className="size-4" /> Save to Workroom</Button>
      </div>
    </AppShell>
  );
}
