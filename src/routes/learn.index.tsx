import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GuideList } from "@/components/GuideCard";
import { guides } from "@/lib/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "Sewing tutorials — Stitchology" },
      { name: "description", content: "Beginner-friendly, step-by-step sewing tutorials: seams, hems, zippers, bags, garments, home decor and repairs." },
      { property: "og:title", content: "Step-by-step sewing tutorials — Stitchology" },
      { property: "og:description", content: "Learn sewing with clear, visual instructions designed for beginners." },
    ],
  }),
  component: Learn,
});

const tutorials = guides.filter((g) => g.kind === "tutorial");
const cats = ["All", ...Array.from(new Set(tutorials.map((g) => g.category)))];

function Learn() {
  const [cat, setCat] = useState("All");
  const items = cat === "All" ? tutorials : tutorials.filter((g) => g.category === cat);
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-3xl font-semibold">Tutorials</h1>
        <p className="mt-1 text-muted-foreground">Each project broken into manageable steps.</p>
        <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium",
                c === cat ? "border-secondary bg-secondary text-secondary-foreground" : "bg-card",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-5">
          <GuideList items={items} />
        </div>
      </div>
    </AppShell>
  );
}
