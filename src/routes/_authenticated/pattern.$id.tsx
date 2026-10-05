import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, FolderPlus, MessageCircle, Printer, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { AppShell } from "@/components/AppShell";
import { MessageResponse } from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import { CuttingLayout } from "@/components/CuttingLayout";
import { adjustPiece, parsePieces, parseSteps, readAdjustments, type Adjustments } from "@/lib/pattern-spec";
import { createProject } from "@/lib/projects";

export const Route = createFileRoute("/_authenticated/pattern/$id")({
  loader: async ({ params }) => {
    const { data, error } = await supabase.from("pattern_drafts").select("*").eq("id", params.id).maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return { draft: data };
  },
  head: () => ({ meta: [{ title: "Pattern draft — Stitchology" }] }),
  notFoundComponent: () => <AppShell><p className="p-8 text-center">Draft not found.</p></AppShell>,
  errorComponent: () => <AppShell><p className="p-8 text-center">Couldn't load this draft.</p></AppShell>,
  component: DraftPage,
});

const num = "h-11 w-full rounded-xl border bg-card px-3 text-base";

function DraftPage() {
  const { draft } = Route.useLoaderData();
  const navigate = useNavigate();
  const [adj, setAdj] = useState<Adjustments>(readAdjustments(draft.adjustments));
  const [saving, setSaving] = useState(false);
  const pieces = parsePieces(draft.content);

  async function remove() {
    const { error } = await supabase.from("pattern_drafts").delete().eq("id", draft.id);
    if (error) { toast.error("Couldn't delete"); return; }
    navigate({ to: "/pattern" });
  }

  async function saveAdj() {
    setSaving(true);
    const { error } = await supabase.from("pattern_drafts").update({ adjustments: adj as unknown as Json }).eq("id", draft.id);
    setSaving(false);
    if (error) toast.error("Couldn't save adjustments");
    else toast.success("Adjustments saved");
  }

  async function toWorkroom() {
    try {
      const steps = parseSteps(draft.content);
      const id = await createProject({ title: draft.title, source_type: "pattern", source_ref: draft.id, steps });
      navigate({ to: "/workroom/$id", params: { id } });
    } catch {
      toast.error("Couldn't save to Workroom");
    }
  }

  const field = (k: "seamAllowance" | "hem" | "ease" | "fabricWidth", label: string, step = 0.5) => (
    <label className="block text-sm font-semibold">
      {label}
      <input type="number" inputMode="decimal" step={step} min={0} value={adj[k]} onChange={(e) => setAdj({ ...adj, [k]: Number(e.target.value) || 0 })} className={`${num} mt-1 font-normal`} />
    </label>
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/pattern" className="flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Drafts</Link>
          <button onClick={remove} className="flex items-center gap-1 text-sm text-muted-foreground"><Trash2 className="size-4" /> Delete</button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button onClick={toWorkroom} className="h-12 rounded-full"><FolderPlus className="size-4" /> Save to Workroom</Button>
          <Button asChild variant="outline" className="h-12 rounded-full">
            <Link to="/pattern/$id/print" params={{ id: draft.id }}><Printer className="size-4" /> Spec sheet</Link>
          </Button>
        </div>
        <article className="prose prose-neutral mt-6 max-w-none text-[17px]">
          <MessageResponse>{draft.content}</MessageResponse>
        </article>

        <section className="mt-8 rounded-3xl bg-paper p-5">
          <h2 className="text-xl font-semibold">Adjust this pattern</h2>
          <p className="mt-1 text-sm text-muted-foreground">All values in cm. Cut sizes update below and on your spec sheet.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {field("seamAllowance", "Seam allowance", 0.1)}
            {field("hem", "Hem length")}
            {field("ease", "Extra ease (width)")}
            {field("fabricWidth", "Fabric width", 5)}
          </div>
          <label className="mt-3 block text-sm font-semibold">
            Other details
            <input value={adj.details} onChange={(e) => setAdj({ ...adj, details: e.target.value })} placeholder="e.g. add pockets, shorten by 5 cm" className={`${num} mt-1 font-normal`} />
          </label>
          {pieces.length > 0 && (
            <table className="mt-4 w-full text-sm">
              <thead><tr className="text-left text-muted-foreground"><th className="py-1">Piece</th><th>Cut</th><th>Cut size</th></tr></thead>
              <tbody>
                {pieces.map((p, i) => {
                  const a = adjustPiece(p, adj);
                  return <tr key={i} className="border-t"><td className="py-1.5 pr-2">{p.name}</td><td>{p.qty}</td><td className="font-semibold">{a ? `${a.w} × ${a.h} cm` : "—"}</td></tr>;
                })}
              </tbody>
            </table>
          )}
          <div className="mt-4"><CuttingLayout pieces={pieces} adj={adj} /></div>
          <Button onClick={saveAdj} disabled={saving} className="mt-4 h-12 w-full rounded-full">{saving ? "Saving…" : "Save adjustments"}</Button>
        </section>

        <Button asChild size="lg" variant="outline" className="mt-8 h-12 w-full rounded-full">
          <Link to="/coach"><MessageCircle className="size-4" /> Ask the coach about this draft</Link>
        </Button>
      </div>
    </AppShell>
  );
}
