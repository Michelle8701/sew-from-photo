import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Camera, FileText, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generatePatternDraft } from "@/lib/pattern.functions";
import { PHOTO_ERROR, resizeToDataUrl } from "@/lib/image";
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

function PickerButton({ label, icon, primary, onFile }: { label: string; icon: React.ReactNode; primary?: boolean; onFile: (f?: File) => void }) {
  // The real file input sits directly over the button so tablets always open the OS picker.
  return (
    <div className="relative">
      <div
        className={`inline-flex h-14 w-full items-center justify-center gap-2 rounded-full px-8 text-base font-medium shadow-sm ${
          primary ? "bg-primary text-primary-foreground" : "border border-input bg-background text-foreground"
        }`}
      >
        {icon} {label}
      </div>
      <input
        type="file"
        accept="image/*"
        aria-label={label}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function PatternPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const generate = useServerFn(generatePatternDraft);
  const [image, setImage] = useState<string | null>(null);
  const [reading, setReading] = useState(false);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const { data: drafts = [], error: draftsError, refetch } = useQuery({
    queryKey: ["drafts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pattern_drafts").select("id,title,created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function onFile(f?: File) {
    if (!f) return;
    setReading(true);
    try {
      setImage(await resizeToDataUrl(f, 1024));
    } catch {
      toast.error(PHOTO_ERROR);
    } finally {
      setReading(false);
    }
  }

  async function go() {
    if (!image || busy) return;
    setBusy(true);
    try {
      const { id } = await generate({ data: { image, notes: notes.trim() || undefined } });
      qc.invalidateQueries({ queryKey: ["drafts"] });
      navigate({ to: "/pattern/$id", params: { id } });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      toast.error(msg && !msg.startsWith("Unauthorized") && msg.length < 200 ? msg : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="text-3xl font-semibold">Pattern from a photo</h1>
        <p className="mt-1 text-muted-foreground">Snap a garment, bag or idea you love. We'll draft a starter pattern and project guide.</p>

        {image ? (
          <div className="mt-5">
            <img src={image} alt="Your photo" className="max-h-96 w-full rounded-2xl bg-muted object-contain" />
            <button onClick={() => setImage(null)} className="mt-2 text-sm text-muted-foreground underline" disabled={busy}>
              Choose a different photo
            </button>
          </div>
        ) : (
          <div className="stitch mt-5 grid gap-3 rounded-3xl p-5">
            {reading ? (
              <p className="flex h-14 items-center justify-center gap-2 text-muted-foreground"><Loader2 className="size-5 animate-spin" /> Preparing photo…</p>
            ) : (
              <>
                <PickerButton label="Take a photo" primary icon={<Camera className="size-5" />} onFile={onFile} />
                <PickerButton label="Upload from gallery" icon={<Upload className="size-5" />} onFile={onFile} />
              </>
            )}
          </div>
        )}

        <label className="mt-5 block text-sm font-semibold" htmlFor="notes">Notes (optional)</label>
        <Textarea id="notes" value={notes} maxLength={1000} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. size M, want it in linen, make it shorter" className="mt-1.5" />

        <Button size="lg" className="mt-5 h-14 w-full rounded-full text-base" disabled={!image || busy} onClick={go}>
          {busy ? (<><Loader2 className="size-5 animate-spin" /> Drafting your pattern… (up to a minute)</>) : "Create pattern draft"}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Drafts are a creative starting point. Always check measurements and make a test version before cutting your fabric.
        </p>

        {draftsError && (
          <p className="mt-8 text-sm text-muted-foreground">Couldn't load your drafts. <button className="text-primary underline" onClick={() => refetch()}>Try again</button></p>
        )}
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
