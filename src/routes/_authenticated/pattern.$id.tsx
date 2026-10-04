import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { MessageResponse } from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";

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

function DraftPage() {
  const { draft } = Route.useLoaderData();
  const navigate = useNavigate();
  async function remove() {
    const { error } = await supabase.from("pattern_drafts").delete().eq("id", draft.id);
    if (error) return toast.error("Couldn't delete");
    navigate({ to: "/pattern" });
  }
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/pattern" className="flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Drafts</Link>
          <button onClick={remove} className="flex items-center gap-1 text-sm text-muted-foreground"><Trash2 className="size-4" /> Delete</button>
        </div>
        <article className="prose prose-neutral mt-4 max-w-none text-[17px]">
          <MessageResponse>{draft.content}</MessageResponse>
        </article>
        <Button asChild size="lg" variant="outline" className="mt-8 h-12 w-full rounded-full">
          <Link to="/coach"><MessageCircle className="size-4" /> Ask the coach about this draft</Link>
        </Button>
      </div>
    </AppShell>
  );
}
