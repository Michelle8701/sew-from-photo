import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/coach/")({
  head: () => ({
    meta: [
      { title: "AI Sewing Coach — Stitchology" },
      { name: "description", content: "Ask the AI Sewing Coach about stitches, fabrics, patterns, zippers and sewing mistakes." },
      { property: "og:title", content: "AI Sewing Coach — Stitchology" },
      { property: "og:description", content: "Get sewing help whenever you're unsure what to do next." },
    ],
  }),
  component: CoachList,
});

const starters = [
  "Why are my stitches skipping?",
  "Which needle and thread for denim?",
  "How do I fix a stuck zipper?",
  "What does 'right sides together' mean?",
];

export async function createThread() {
  const { data, error } = await supabase.from("threads").insert({}).select("id").single();
  if (error) throw error;
  return data.id;
}

function CoachList() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: threads = [] } = useQuery({
    queryKey: ["threads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("threads").select("id,title,updated_at").order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function start(q?: string) {
    try {
      const id = await createThread();
      navigate({ to: "/coach/$threadId", params: { threadId: id }, search: q ? { q } : {} });
    } catch {
      toast.error("Couldn't start a chat");
    }
  }

  async function remove(id: string) {
    const { error } = await supabase.from("threads").delete().eq("id", id);
    if (error) return toast.error("Couldn't delete");
    qc.invalidateQueries({ queryKey: ["threads"] });
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="text-3xl font-semibold">Sewing Coach</h1>
        <p className="mt-1 text-muted-foreground">Ask anything — from skipped stitches to what to do next.</p>
        <Button size="lg" className="mt-5 h-12 w-full rounded-full" onClick={() => start()}>
          <Plus className="size-5" /> New question
        </Button>
        <div className="mt-4 flex flex-wrap gap-2">
          {starters.map((s) => (
            <button key={s} onClick={() => start(s)} className="rounded-full border bg-card px-3 py-2 text-sm">{s}</button>
          ))}
        </div>
        <h2 className="mt-8 text-lg font-semibold">Your chats</h2>
        {threads.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No chats yet.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {threads.map((t) => (
              <li key={t.id} className="flex items-center gap-2 rounded-xl border bg-card">
                <Link to="/coach/$threadId" params={{ threadId: t.id }} className="flex flex-1 items-center gap-3 p-3">
                  <MessageCircle className="size-4 text-primary" />
                  <span className="line-clamp-1 font-medium">{t.title}</span>
                </Link>
                <button onClick={() => remove(t.id)} className="p-3 text-muted-foreground" aria-label="Delete chat">
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
