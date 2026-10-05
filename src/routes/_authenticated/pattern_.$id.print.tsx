import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CuttingLayout } from "@/components/CuttingLayout";
import { adjustPiece, parsePieces, parseSteps, parseSupplies, readAdjustments } from "@/lib/pattern-spec";

export const Route = createFileRoute("/_authenticated/pattern_/$id/print")({
  loader: async ({ params }) => {
    const { data, error } = await supabase.from("pattern_drafts").select("*").eq("id", params.id).maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return { draft: data };
  },
  head: () => ({ meta: [{ title: "Spec sheet — Stitchology" }] }),
  notFoundComponent: () => <p className="p-8 text-center">Draft not found.</p>,
  errorComponent: () => <p className="p-8 text-center">Couldn't load this spec sheet.</p>,
  component: SpecSheet,
});

function SpecSheet() {
  const { draft } = Route.useLoaderData();
  const adj = readAdjustments(draft.adjustments);
  const pieces = parsePieces(draft.content);
  const supplies = parseSupplies(draft.content);
  const steps = parseSteps(draft.content);

  return (
    <div className="mx-auto max-w-3xl bg-background px-6 py-6 text-foreground print:max-w-none print:p-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link to="/pattern/$id" params={{ id: draft.id }} className="flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Back to draft</Link>
        <Button onClick={() => window.print()} className="rounded-full"><Printer className="size-4" /> Print / Save PDF</Button>
      </div>
      <header className="border-b-2 border-foreground pb-3">
        <p className="text-xs uppercase tracking-widest">Stitchology · Project spec sheet</p>
        <h1 className="mt-1 text-3xl font-semibold">{draft.title}</h1>
        <p className="mt-1 text-sm">Seam allowance {adj.seamAllowance} cm · Hem {adj.hem} cm · Ease +{adj.ease} cm · Fabric width {adj.fabricWidth} cm</p>
        {adj.details && <p className="mt-1 text-sm"><strong>Details:</strong> {adj.details}</p>}
      </header>

      <h2 className="mt-6 text-lg font-semibold">Cutting list</h2>
      {pieces.length ? (
        <table className="mt-2 w-full border-collapse text-sm">
          <thead><tr className="border-b text-left"><th className="py-1.5">Piece</th><th>Cut</th><th>Draft size (cm)</th><th>Cut size incl. allowances</th></tr></thead>
          <tbody>
            {pieces.map((p, i) => {
              const a = adjustPiece(p, adj);
              return (
                <tr key={i} className="border-b">
                  <td className="py-1.5 pr-2">{p.name}</td><td>{p.qty}</td>
                  <td>{p.w != null ? `${p.w} × ${p.h}` : "—"}</td>
                  <td className="font-semibold">{a ? `${a.w} × ${a.h} cm` : "See draft"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : <p className="text-sm">No pieces table found in the draft.</p>}

      <h2 className="mt-6 text-lg font-semibold">Cutting layout</h2>
      <div className="mt-2 break-inside-avoid"><CuttingLayout pieces={pieces} adj={adj} /></div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 print:grid-cols-2">
        <section className="break-inside-avoid">
          <h2 className="text-lg font-semibold">Supply checklist</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {(supplies.length ? supplies : ["Fabric", "Matching thread", "Pins or clips", "Scissors / rotary cutter"]).map((s) => (
              <li key={s} className="flex gap-2"><span className="mt-0.5 inline-block size-4 shrink-0 border border-foreground" />{s}</li>
            ))}
          </ul>
        </section>
        <section className="break-inside-avoid">
          <h2 className="text-lg font-semibold">Construction order</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
            {steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </section>
      </div>
      <p className="mt-8 border-t pt-2 text-xs">Approximate draft generated from a photo. Make a test version before cutting your final fabric.</p>
    </div>
  );
}
