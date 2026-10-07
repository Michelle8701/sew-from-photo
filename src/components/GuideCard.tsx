import { Link } from "@tanstack/react-router";
import { Clock, Play } from "lucide-react";
import type { Guide } from "@/lib/content";

export function GuideCard({ g }: { g: Guide }) {
  return (
    <Link
      to="/learn/$slug"
      params={{ slug: g.slug }}
      className="group block overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative flex aspect-[16/7] items-center justify-center overflow-hidden bg-paper">
        <div className="absolute inset-x-0 top-1/2 stitch-line opacity-60" />
        <div className="relative grid size-12 place-items-center rounded-full bg-secondary/90 text-secondary-foreground shadow-md backdrop-blur">
          <Play className="ml-0.5 size-5" />
        </div>
        <span className="absolute bottom-3 left-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur">Visual tutorial</span>
      </div>
      <div className="p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-primary">{g.category}</div>
        <h3 className="mt-1 text-lg font-semibold leading-snug group-hover:underline">{g.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{g.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-full bg-accent px-2 py-0.5 font-medium text-accent-foreground">{g.level}</span>
          <span className="flex items-center gap-1"><Clock className="size-3.5" /> {g.time}</span>
          <span>{g.steps.length} steps</span>
        </div>
      </div>
    </Link>
  );
}

export function GuideList({ items }: { items: Guide[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((g) => (
        <GuideCard key={g.slug} g={g} />
      ))}
    </div>
  );
}
