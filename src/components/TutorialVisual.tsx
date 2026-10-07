import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { Guide, StepVisual } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categoryVisuals: Record<string, StepVisual> = {
  Basics: "machine",
  Clothing: "pattern",
  "Bags & accessories": "zipper",
  "Home decor": "piping",
  Repair: "mending",
};

function Diagram({ visual, playing }: { visual: StepVisual; playing: boolean }) {
  const kind = visual === "auto" ? "machine" : visual;
  return (
    <svg viewBox="0 0 720 420" role="img" aria-label={`${kind} sewing diagram`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <rect width="720" height="420" className="fill-paper" />
      <path d="M0 332 C145 300 250 366 410 330 S610 305 720 345 V420 H0Z" className="fill-accent/70" />
      {kind === "machine" && <>
        <path d="M185 280h355v34H165c-18 0-30-11-30-28s12-28 30-28h44V122h238l75 62v74h-65v-45H295v67" className="fill-card stroke-secondary" strokeWidth="10" strokeLinejoin="round" />
        <path d="M295 213v82M280 295h30" className={cn("stroke-primary", playing && "tutorial-needle")} strokeWidth="8" strokeLinecap="round" />
        <circle cx="427" cy="165" r="28" className="fill-paper stroke-primary" strokeWidth="8" />
      </>}
      {kind === "thread" && <>
        <path d="M180 92c160 0 83 128 222 128s88 100 210 100" className={cn("fill-none stroke-primary", playing && "tutorial-thread")} strokeWidth="10" strokeDasharray="14 12" strokeLinecap="round" />
        <circle cx="160" cy="92" r="42" className="fill-card stroke-secondary" strokeWidth="9" />
        <circle cx="404" cy="220" r="34" className="fill-card stroke-secondary" strokeWidth="9" />
        <path d="M585 272l44 48-44 48" className="fill-none stroke-secondary" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      </>}
      {kind === "hem" && <>
        <path d="M110 105h500v220H110z" className="fill-card stroke-secondary" strokeWidth="9" />
        <path d="M110 260h500M110 294h500" className="stroke-primary" strokeWidth="7" strokeDasharray="18 12" />
        <path d="M170 255q75-70 150 0t150 0t100 0" className={cn("fill-none stroke-secondary", playing && "tutorial-stitch")} strokeWidth="8" />
      </>}
      {kind === "zipper" && <>
        <path d="M120 100h220v230H120zM380 100h220v230H380z" className="fill-card stroke-secondary" strokeWidth="9" />
        <path d="M360 105v220" className="stroke-primary" strokeWidth="17" strokeDasharray="10 8" />
        <rect x="337" y="150" width="46" height="62" rx="10" className={cn("fill-primary", playing && "tutorial-zip")} />
      </>}
      {kind === "pattern" && <>
        <path d="M160 75h150l35 85-34 175H115l-20-175zM430 75h125l70 250H395z" className="fill-card stroke-secondary" strokeWidth="9" strokeLinejoin="round" />
        <path d="M130 178h180M445 180h132" className={cn("stroke-primary", playing && "tutorial-measure")} strokeWidth="7" strokeDasharray="14 10" />
      </>}
      {kind === "piping" && <>
        <path d="M145 125h430v180H145z" className="fill-card stroke-secondary" strokeWidth="9" />
        <path d="M145 125q215 48 430 0M145 305q215-48 430 0" className={cn("fill-none stroke-primary", playing && "tutorial-stitch")} strokeWidth="11" />
      </>}
      {kind === "mending" && <>
        <path d="M175 75h370v280H175z" className="fill-secondary/90" />
        <path d="M295 150l64-34 69 43-35 91-95-13z" className="fill-card stroke-primary" strokeWidth="8" />
        <path d="M280 175h170M285 205h155M295 235h125" className={cn("stroke-primary", playing && "tutorial-stitch")} strokeWidth="7" strokeDasharray="12 9" />
      </>}
    </svg>
  );
}

export function TutorialVisual({ guide, stepIndex }: { guide: Guide; stepIndex: number }) {
  const step = guide.steps[stepIndex];
  const [playing, setPlaying] = useState(true);
  useEffect(() => setPlaying(true), [guide.slug, stepIndex]);
  if (!step) return null;
  const visual = step.visual ?? categoryVisuals[guide.category] ?? "machine";
  return (
    <figure className="overflow-hidden rounded-2xl border bg-secondary shadow-sm">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {step.video ? (
          <video key={step.video} className="h-full w-full object-cover" src={step.video} controls={playing} autoPlay={playing} loop muted playsInline aria-label={step.mediaLabel ?? step.title} />
        ) : (
          <Diagram visual={visual} playing={playing} />
        )}
        {!step.video && (
          <Button type="button" size="icon" onClick={() => setPlaying((value) => !value)} className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-foreground/30 bg-secondary/75 text-secondary-foreground shadow-lg backdrop-blur-md hover:bg-secondary" aria-label={playing ? "Pause diagram" : "Play diagram"}>
            {playing ? <Pause className="size-6" /> : <Play className="ml-0.5 size-6" />}
          </Button>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold text-secondary-foreground backdrop-blur-md">Visual guide · Step {stepIndex + 1}</span>
      </div>
      <figcaption className="bg-card px-4 py-3 text-sm text-muted-foreground">{step.mediaLabel ?? `Follow the motion as you complete “${step.title}”.`}</figcaption>
    </figure>
  );
}