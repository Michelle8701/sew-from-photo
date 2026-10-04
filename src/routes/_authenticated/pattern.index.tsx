import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { Camera, FileText, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generatePatternDraft } from "@/lib/pattern.functions";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/pattern/")({
  head: () => ({
    meta: [
      { title: "Pattern draft from a photo — Stitchology" },
      { name: "description", content: "Take a photo of a garment or bag and get a starter sewing pattern draft and project guide." },
      { property: "og:title", content: "Photo to pattern draft — Stitchology" },
      { property: "og:description", content: "Turn a photo into a starter sewing pattern draft." },
    ],
  }),
  component: PatternPage,
});

async function resize(file: File): Promise<string> {
  const img = await createImageBitmap(file);
  const scale = Math.min(1, 1280 / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * scale);
  c.height = Math.round(img.height * scale);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.85);
}

function PatternPage() {
  const navigate = useNavigate();
  const generate = useServerFn(generatePatternDraft);
  const cam = useRef<HTMLInputElement>(null);
  const lib = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const { data: drafts = [] } = useQuery({
    queryKey: ["drafts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pattern_drafts").select("id,title,created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function onFile(f?: File) {
    if (!f) return;
    try {
      setImage(await resize(f));
    } catch {
      toast.error("Couldn't read that image");
    }
  }

  async function go() {
    if (!image) return;
    setBusy(true);
    try {
      const { id } = await generate({ data: { image, notes: notes || undefined } });
      navigate({ to: "/pattern/$id", params: { id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="text-3xl font-semibold">Pattern from a photo</h1>
        <p className="mt-1 text-muted-foreground">Snap a garment, bag or idea you love. We'll draft a starter pattern and project guide.</p>

        <input ref={cam} type="file" accept="image/*" capture="environment" hidden onChange={(e) => onFile(e.target.files?.[0])} />
        <input ref={lib} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />

        {image ? (
          <div className="mt-5">
            <img src={image} alt="Your photo" className="max-h-96 w-full rounded-2xl object-contain bg-muted" />
            <button onClick={() => setImage(null)} className="mt-2 text-sm text-muted-foreground underline" disabled={busy}>Choose a different photo</button>
          </div>
        ) : (
          <div className="stitch mt-5 grid gap-3 rounded-3xl p-5">
            <Button size="lg" className="h-14 rounded-full text-base" onClick={() => cam.current?.click()}>
              <Camera className="size-5" /> Take a photo
            </Button>
            <Button size="lg" variant="outline" className="h-14 rounded-full text-base" onClick={() => lib.current?.click()}>
              <Upload className="size-5" /> Upload from gallery
            </Button>
          </div>
        )}

        <label className="mt-5 block text-sm font-semibold" htmlFor="notes">Notes (optional)</label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. size M, want it in linen, make it shorter" className="mt-1.5" />

        <Button size="lg" className="mt-5 h-14 w-full rounded-full text-base" disabled={!image || busy} onClick={go}>
          {busy ? (<><Loader2 className="size-5 animate-spin" /> Drafting your pattern… (up to a minute)</>) : "Create pattern draft"}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">Drafts are a creative starting point. Always check measurements and make a test version before cutting your fabric.</p>

        {drafts.length > 0 && (
          <>
            <h2 className="mt-10 text-lg font-semibold">Your drafts</h2>
            <ul className="mt-2 space-y-2">
              {drafts.map((d) => (
                <li key={d.id}>
                  <Link to="/pattern/$id" params={{ id: d.id }} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                    <FileText className="size-4 text-primary" />
                    <span className="line-clamp-1 flex-1 font-medium">{d.title}</span>
                    <span className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </AppShell>
  );
}
