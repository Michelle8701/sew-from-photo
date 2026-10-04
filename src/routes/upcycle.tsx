import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { GuideList } from "@/components/GuideCard";
import { guides } from "@/lib/content";

export const Route = createFileRoute("/upcycle")({
  head: () => ({
    meta: [
      { title: "Upcycling ideas & DIY inspiration — Stitchology" },
      { name: "description", content: "Turn jeans into skirts, shirts into bags and scraps into accessories with easy upcycling projects." },
      { property: "og:title", content: "Upcycling ideas — Stitchology" },
      { property: "og:description", content: "Give old clothes, leftover fabric and unused materials a second life." },
    ],
  }),
  component: Upcycle,
});

function Upcycle() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-3xl font-semibold">Upcycle</h1>
        <p className="mt-1 text-muted-foreground">
          Repair, redesign and reuse what you already have.
        </p>
        <div className="mt-5">
          <GuideList items={guides.filter((g) => g.kind === "upcycle")} />
        </div>
      </div>
    </AppShell>
  );
}
