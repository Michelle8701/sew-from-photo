import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { estimateYardage, fabricSettings, projectTypes, sizes } from "@/lib/sewing-data";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Fabric yardage & machine settings — Stitchology" },
      { name: "description", content: "Estimate fabric yardage by project and width, and look up needle, thread, stitch and tension for common fabrics." },
      { property: "og:title", content: "Sewing calculators — Stitchology" },
      { property: "og:description", content: "Yardage calculator and machine settings for denim, knit, linen, silk and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Tools,
});

const select = "h-12 w-full rounded-xl border bg-card px-3 text-base";

function Tools() {
  const [type, setType] = useState<string>(projectTypes[0].id);
  const [width, setWidth] = useState<45 | 60>(45);
  const [size, setSize] = useState("M");
  const [dir, setDir] = useState(false);
  const [fabric, setFabric] = useState(fabricSettings[0].fabric);
  const est = estimateYardage(type, width, size, dir);
  const fs = fabricSettings.find((f) => f.fabric === fabric)!;

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="text-3xl font-semibold">Sewing tools</h1>
        <p className="mt-1 text-muted-foreground">Quick answers for the cutting table and the machine.</p>

        <section className="mt-6 rounded-3xl bg-paper p-5">
          <h2 className="text-xl font-semibold">Fabric yardage</h2>
          <label className="mt-4 block text-sm font-semibold">Project</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={`${select} mt-1.5`}>
            {projectTypes.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <label className="mt-4 block text-sm font-semibold">Fabric width</label>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {([45, 60] as const).map((w) => (
              <button key={w} onClick={() => setWidth(w)} className={`h-12 rounded-xl border font-medium ${width === w ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>
                {w}" ({w === 45 ? 115 : 150} cm)
              </button>
            ))}
          </div>
          <label className="mt-4 block text-sm font-semibold">Size</label>
          <div className="mt-1.5 grid grid-cols-6 gap-1.5">
            {sizes.map((s) => (
              <button key={s.id} onClick={() => setSize(s.id)} className={`h-11 rounded-xl border text-sm font-medium ${size === s.id ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{s.id}</button>
            ))}
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={dir} onChange={(e) => setDir(e.target.checked)} className="size-5 accent-primary" />
            Directional print, nap or plaid (+10%)
          </label>
          <div className="mt-5 rounded-2xl bg-card p-4 text-center">
            <p className="text-sm text-muted-foreground">You'll need about</p>
            <p className="font-display text-4xl font-semibold text-primary">{est.yards} yd</p>
            <p className="text-muted-foreground">≈ {est.meters} m</p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Estimates for average proportions. Always check your pattern envelope and buy a little extra for pre-washing shrinkage.</p>
        </section>

        <section className="mt-6 rounded-3xl bg-paper p-5">
          <h2 className="text-xl font-semibold">Machine settings</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {fabricSettings.map((f) => (
              <button key={f.fabric} onClick={() => setFabric(f.fabric)} className={`rounded-full px-3 py-1.5 text-sm font-medium ${fabric === f.fabric ? "bg-primary text-primary-foreground" : "bg-card"}`}>{f.fabric}</button>
            ))}
          </div>
          <dl className="mt-4 divide-y rounded-2xl bg-card">
            {([["Needle", fs.needle], ["Thread", fs.thread], ["Stitch", fs.stitch], ["Tension", fs.tension]] as const).map(([k, v]) => (
              <div key={k} className="flex gap-4 p-4">
                <dt className="w-20 shrink-0 font-semibold">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 rounded-xl bg-card p-3 text-sm"><span className="font-semibold text-primary">Tip:</span> {fs.tip}</p>
          <p className="mt-2 text-xs text-muted-foreground">Tension numbers vary by machine — always test on a scrap of your fabric first.</p>
        </section>
      </div>
    </AppShell>
  );
}
