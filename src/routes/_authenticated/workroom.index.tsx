import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle2, Plus, Scissors } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { createProject, type ProjectStep } from "@/lib/projects";

export const Route = createFileRoute("/_authenticated/workroom/")({
  head: () => ({
    meta: [
      { title: "My Workroom — Stitchology" },
      { name: "description", content: "Track your active sewing projects: steps, measurements, fabric and progress photos." },
      { property: "og:title", content: "My Workroom — Stitchology" },
      { property: "og:description", content: "Your active and finished sewing projects in one place." },
    ],
  }),
  component: Workroom,
});

function Workroom() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"active" | "completed">("active");
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("id,title,status,steps,source_type,updated_at").order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const list = projects.filter((p) => p.status === tab);

  async function newBlank() {
    try {
      const id = await createProject({ title: "My new project", source_type: "custom", steps: [] });
      navigate({ to: "/workroom/$id", params: { id } });
    } catch {
      toast.error("Couldn't create project");
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">My Workroom</h1>
            <p className="mt-1 text-muted-foreground">Projects on your sewing table.</p>
          </div>
          <Button onClick={newBlank} className="rounded-full"><Plus className="size-4" /> New</Button>
        </div>
        <div className="mt-5 flex gap-2">
          {(["active", "completed"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {t === "active" ? "Active" : "Completed"} ({projects.filter((p) => p.status === t).length})
            </button>
          ))}
        </div>
        {isLoading ? (
          <p className="mt-6 text-muted-foreground">Loading…</p>
        ) : list.length === 0 ? (
          <div className="stitch mt-6 rounded-3xl p-6 text-center">
            <Scissors className="mx-auto size-8 text-primary" />
            <p className="mt-2 font-medium">{tab === "active" ? "No active projects yet" : "Nothing finished yet — you've got this!"}</p>
            {tab === "active" && <p className="mt-1 text-sm text-muted-foreground">Open any <Link to="/learn" className="text-primary underline">guide</Link> or <Link to="/pattern" className="text-primary underline">pattern draft</Link> and tap "Save to Workroom".</p>}
          </div>
        ) : (
          <ul className="mt-5 space-y-3">
            {list.map((p) => {
              const steps = (p.steps as unknown as ProjectStep[]) ?? [];
              const done = steps.filter((s) => s.done).length;
              const pct = steps.length ? Math.round((done / steps.length) * 100) : p.status === "completed" ? 100 : 0;
              return (
                <li key={p.id}>
                  <Link to="/workroom/$id" params={{ id: p.id }} className="block rounded-2xl border bg-card p-4">
                    <div className="flex items-center gap-2">
                      {p.status === "completed" && <CheckCircle2 className="size-4 text-primary" />}
                      <span className="line-clamp-1 flex-1 font-semibold">{p.title}</span>
                      <span className="text-xs text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${pct}%` }} /></div>
                    <p className="mt-1.5 text-xs text-muted-foreground">{done}/{steps.length} steps · {p.source_type}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
