export const projectTypes = [
  { id: "tshirt", label: "T-shirt / top", w45: 2, w60: 1.5 },
  { id: "shirt", label: "Button-up shirt", w45: 2.75, w60: 2 },
  { id: "dress", label: "Dress (knee length)", w45: 3.5, w60: 2.5 },
  { id: "skirt", label: "A-line skirt", w45: 2, w60: 1.5 },
  { id: "pants", label: "Pants / trousers", w45: 3, w60: 2.25 },
  { id: "jacket", label: "Jacket", w45: 3.5, w60: 2.5 },
  { id: "tote", label: "Tote bag", w45: 1, w60: 0.75 },
  { id: "pillow", label: "Pillow cover (45 cm)", w45: 0.75, w60: 0.5 },
  { id: "apron", label: "Apron", w45: 1.5, w60: 1 },
  { id: "curtain", label: "Curtain panel (per 2 m drop)", w45: 2.75, w60: 2.5 },
] as const;

export const sizes = [
  { id: "XS", f: 0.9 }, { id: "S", f: 0.95 }, { id: "M", f: 1 },
  { id: "L", f: 1.1 }, { id: "XL", f: 1.2 }, { id: "2XL", f: 1.3 },
] as const;

export function estimateYardage(typeId: string, width: 45 | 60, sizeId: string, directional: boolean) {
  const t = projectTypes.find((p) => p.id === typeId) ?? projectTypes[0];
  const s = sizes.find((x) => x.id === sizeId) ?? sizes[2];
  let yd = (width === 45 ? t.w45 : t.w60) * s.f * (directional ? 1.1 : 1);
  yd = Math.ceil(yd * 4) / 4; // round up to 1/4 yd
  return { yards: yd, meters: Math.ceil(yd * 0.9144 * 10) / 10 };
}

export interface FabricSetting {
  fabric: string;
  needle: string;
  thread: string;
  stitch: string;
  tension: string;
  tip: string;
}

export const fabricSettings: FabricSetting[] = [
  { fabric: "Quilting cotton", needle: "Universal 80/12", thread: "All-purpose polyester or cotton 50 wt", stitch: "Straight, 2.5 mm", tension: "Normal (4)", tip: "Pre-wash — cotton shrinks." },
  { fabric: "Denim", needle: "Denim/Jeans 100/16 (110/18 for heavy)", thread: "Heavy-duty or topstitch 30 wt for topstitching", stitch: "Straight, 3–3.5 mm", tension: "Slightly higher (5)", tip: "Hammer thick seams flat before sewing over them." },
  { fabric: "Knit / jersey", needle: "Ballpoint or Stretch 75/11–80/12", thread: "All-purpose polyester (has stretch)", stitch: "Narrow zigzag 0.5 × 2.5 mm or stretch stitch", tension: "Slightly lower (3–4)", tip: "Don't pull the fabric — use a walking foot if it waves." },
  { fabric: "Linen", needle: "Universal 80/12–90/14", thread: "All-purpose polyester or cotton 50 wt", stitch: "Straight, 2.5–3 mm", tension: "Normal (4)", tip: "Finish raw edges — linen frays a lot." },
  { fabric: "Silk / satin", needle: "Microtex 60/8–70/10", thread: "Fine polyester or silk 60 wt", stitch: "Straight, 2 mm", tension: "Lower (3)", tip: "Use fresh needle and tissue paper under slippery layers." },
  { fabric: "Chiffon / voile", needle: "Microtex 60/8", thread: "Fine polyester 60 wt", stitch: "Straight, 1.8–2 mm", tension: "Lower (3)", tip: "French seams look neat and hide fraying." },
  { fabric: "Canvas / duck", needle: "Denim 100/16–110/18", thread: "Heavy-duty polyester", stitch: "Straight, 3–3.5 mm", tension: "Slightly higher (5)", tip: "Sew slowly through layers; hand-turn the wheel at bulky spots." },
  { fabric: "Fleece / minky", needle: "Ballpoint 80/12–90/14", thread: "All-purpose polyester", stitch: "Straight 3 mm or narrow zigzag", tension: "Slightly lower (3–4)", tip: "Use lots of pins or clips and a walking foot." },
  { fabric: "Wool suiting", needle: "Universal 80/12–90/14", thread: "All-purpose polyester", stitch: "Straight, 2.5–3 mm", tension: "Normal (4)", tip: "Press with a pressing cloth to avoid shine." },
  { fabric: "Leather / vinyl", needle: "Leather 90/14–100/16", thread: "Heavy-duty polyester or nylon", stitch: "Straight, 3.5–4 mm", tension: "Slightly higher (5)", tip: "Use clips, not pins — holes are permanent." },
];
