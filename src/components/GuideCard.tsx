import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import type { Guide } from "@/lib/content";

export function GuideCard({ g }: { g: Guide }) {
  return (
    <Link
      to="/learn/$slug"
      params={{ slug: g.slug }}
      className="group block rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
        {g.category}
      </div>
      <h3 className="mt-1 text-lg font-semibold leading-snug group-hover:underline">{g.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{g.summary}</p>
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="rounded-full bg-accent px-2 py-0.5 font-medium text-accent-foreground">{g.level}</span>
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" /> {g.time}
        </span>
        <span>{g.steps.length} steps</span>
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
