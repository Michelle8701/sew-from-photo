import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, Check, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Measurement, ProjectStep } from "@/lib/projects";

export const Route = createFileRoute("/_authenticated/workroom/$id")({
  head: () => ({ meta: [{ title: "Project — My Workroom — Stitchology" }, { name: "description", content: "Track steps, measurements, fabric and photos for this project." }] }),
  component: ProjectPage,
});

const input = "h-11 w-full rounded-xl border bg-card px-3 text-base";

async function resize(file: File): Promise<Blob> {
  const img = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * scale);
  c.height = Math.round(img.height * scale);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  return new Promise((r, j) => c.toBlob((b) => (b ? r(b) : j(new Error("resize"))), "image/jpeg", 0.85));
}

function ProjectPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: p, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState<ProjectStep[]>([]);
  const [meas, setMeas] = useState<Measurement[]>([]);
  const [fabric, setFabric] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [newStep, setNewStep] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!p) return;
    setTitle(p.title);
    setSteps((p.steps as unknown as ProjectStep[]) ?? []);
    setMeas((p.measurements as unknown as Measurement[]) ?? []);
    setFabric(p.fabric ?? "");
    setNotes(p.notes ?? "");
    setPhotos((p.photos as unknown as string[]) ?? []);
  }, [p]);

  useEffect(() => {
    const missing = photos.filter((ph) => !urls[ph]);
    if (!missing.length) return;
    supabase.storage.from("project-photos").createSignedUrls(missing, 3600).then(({ data }) => {
      if (!data) return;
      setUrls((u) => ({ ...u, ...Object.fromEntries(data.filter((d) => d.signedUrl).map((d) => [d.path!, d.signedUrl])) }));
    });
  }, [photos, urls]);

  async function save(patch: Record<string, unknown>, quiet = true) {
    const { error } = await supabase.from("projects").update(patch as never).eq("id", id);
    if (error) toast.error("Couldn't save");
    else {
      if (!quiet) toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["projects"] });
    }
  }

  function updateSteps(next: ProjectStep[]) {
    setSteps(next);
    save({ steps: next as unknown as Json });
  }

  async function addPhoto(f?: File) {
    if (!f) return;
    setUploading(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const path = `${u.user!.id}/${id}/${Date.now()}.jpg`;
      const { error } = await supabase.storage.from("project-photos").upload(path, await resize(f), { contentType: "image/jpeg" });
      if (error) throw error;
      const next = [...photos, path];
      setPhotos(next);
      await save({ photos: next });
    } catch {
      toast.error("Couldn't upload photo");
    } finally {
      setUploading(false);
    }
  }

  async function removePhoto(path: string) {
    await supabase.storage.from("project-photos").remove([path]);
    const next = photos.filter((x) => x !== path);
    setPhotos(next);
    save({ photos: next });
  }

  async function toggleComplete() {
    const completed = p!.status !== "completed";
    await save({ status: completed ? "completed" : "active", completed_at: completed ? new Date().toISOString() : null }, false);
    qc.invalidateQueries({ queryKey: ["project", id] });
  }

  async function remove() {
    if (!confirm("Delete this project?")) return;
    if (photos.length) await supabase.storage.from("project-photos").remove(photos);
    await supabase.from("projects").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["projects"] });
    navigate({ to: "/workroom" });
  }

  if (isLoading) return <AppShell><p className="p-8 text-center text-muted-foreground">Loading…</p></AppShell>;
  if (error || !p) return <AppShell><p className="p-8 text-center">Project not found. <Link to="/workroom" className="text-primary underline">Back to Workroom</Link></p></AppShell>;

  const done = steps.filter((s) => s.done).length;
  const pct = steps.length ? Math.round((done / steps.length) * 100) : 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/workroom" className="flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Workroom</Link>
          <button onClick={remove} className="flex items-center gap-1 text-sm text-muted-foreground"><Trash2 className="size-4" /> Delete</button>
        </div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => title.trim() && save({ title: title.trim() })} className="mt-4 w-full bg-transparent font-display text-3xl font-semibold outline-none" aria-label="Project name" />
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>
          <span className="text-sm font-medium">{done}/{steps.length}</span>
        </div>
        {p.source_type === "guide" && p.source_ref && <Link to="/learn/$slug" params={{ slug: p.source_ref }} className="mt-2 inline-block text-sm text-primary underline">Open the guide</Link>}
        {p.source_type === "pattern" && p.source_ref && <Link to="/pattern/$id" params={{ id: p.source_ref }} className="mt-2 inline-block text-sm text-primary underline">Open the pattern draft</Link>}

        <h2 className="mt-7 text-lg font-semibold">Steps</h2>
        <ul className="mt-2 space-y-2">
          {steps.map((s, i) => (
            <li key={i} className="flex items-center gap-3 rounded-xl border bg-card p-3">
              <button onClick={() => updateSteps(steps.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))} aria-label={s.done ? "Mark not done" : "Mark done"} className={`grid size-8 shrink-0 place-items-center rounded-full border-2 ${s.done ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}>
                {s.done && <Check className="size-4" />}
              </button>
              <span className={`flex-1 ${s.done ? "text-muted-foreground line-through" : ""}`}>{s.title}</span>
              <button onClick={() => updateSteps(steps.filter((_, j) => j !== i))} aria-label="Remove step" className="text-muted-foreground"><X className="size-4" /></button>
            </li>
          ))}
        </ul>
        <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!newStep.trim()) return; updateSteps([...steps, { title: newStep.trim(), done: false }]); setNewStep(""); }}>
          <input value={newStep} onChange={(e) => setNewStep(e.target.value)} placeholder="Add a step" className={input} />
          <Button type="submit" variant="outline" className="h-11 rounded-xl"><Plus className="size-4" /></Button>
        </form>

        <h2 className="mt-7 text-lg font-semibold">My measurements</h2>
        <div className="mt-2 space-y-2">
          {meas.map((m, i) => (
            <div key={i} className="flex gap-2">
              <input value={m.label} onChange={(e) => setMeas(meas.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} onBlur={() => save({ measurements: meas })} placeholder="e.g. Waist" className={input} />
              <input value={m.value} onChange={(e) => setMeas(meas.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} onBlur={() => save({ measurements: meas })} placeholder="e.g. 72 cm" className={`${input} max-w-36`} />
              <button onClick={() => { const n = meas.filter((_, j) => j !== i); setMeas(n); save({ measurements: n }); }} aria-label="Remove measurement" className="px-1 text-muted-foreground"><X className="size-4" /></button>
            </div>
          ))}
          <Button variant="outline" className="rounded-full" onClick={() => setMeas([...meas, { label: "", value: "" }])}><Plus className="size-4" /> Add measurement</Button>
        </div>

        <h2 className="mt-7 text-lg font-semibold">Fabric</h2>
        <input value={fabric} onChange={(e) => setFabric(e.target.value)} onBlur={() => save({ fabric: fabric || null })} placeholder="e.g. 2 m mustard linen, 150 cm wide" className={`${input} mt-2`} />

        <h2 className="mt-7 text-lg font-semibold">Progress photos</h2>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { addPhoto(e.target.files?.[0]); e.target.value = ""; }} />
        <div className="mt-2 grid grid-cols-3 gap-2">
          {photos.map((ph) => (
            <div key={ph} className="relative aspect-square overflow-hidden rounded-xl bg-muted">
              {urls[ph] && <img src={urls[ph]} alt="Progress" className="size-full object-cover" />}
              <button onClick={() => removePhoto(ph)} aria-label="Remove photo" className="absolute right-1 top-1 rounded-full bg-background/80 p-1"><X className="size-3.5" /></button>
            </div>
          ))}
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="stitch grid aspect-square place-items-center rounded-xl text-sm text-muted-foreground">
            <span className="flex flex-col items-center gap-1"><Camera className="size-6" />{uploading ? "Uploading…" : "Add photo"}</span>
          </button>
        </div>

        <h2 className="mt-7 text-lg font-semibold">Notes</h2>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => save({ notes: notes || null })} placeholder="Tweaks, ideas, what to do differently next time" className="mt-2" />

        <Button size="lg" onClick={toggleComplete} variant={p.status === "completed" ? "outline" : "default"} className="mt-8 h-14 w-full rounded-full text-base">
          {p.status === "completed" ? "Move back to active" : "Mark project complete 🎉"}
        </Button>
      </div>
    </AppShell>
  );
}
