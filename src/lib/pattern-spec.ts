export interface Adjustments {
  seamAllowance: number; // cm
  hem: number; // cm
  ease: number; // cm added to width
  fabricWidth: number; // cm
  details: string;
}

export const defaultAdjustments: Adjustments = { seamAllowance: 1.5, hem: 3, ease: 0, fabricWidth: 150, details: "" };

export function readAdjustments(v: unknown): Adjustments {
  const o = (v && typeof v === "object" ? v : {}) as Partial<Adjustments>;
  return { ...defaultAdjustments, ...o };
}

function section(md: string, name: RegExp): string {
  const lines = md.split("\n");
  const start = lines.findIndex((l) => /^##\s/.test(l) && name.test(l));
  if (start < 0) return "";
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => /^##\s/.test(l));
  return (end < 0 ? rest : rest.slice(0, end)).join("\n");
}

const clean = (s: string) => s.replace(/\*\*|__|`/g, "").trim();

export function parseSteps(md: string): string[] {
  return section(md, /construction|steps/i)
    .split("\n")
    .map((l) => l.match(/^\s*\d+[.)]\s+(.+)/)?.[1])
    .filter((x): x is string => !!x)
    .map(clean);
}

export function parseSupplies(md: string): string[] {
  return section(md, /fabric|supplies/i)
    .split("\n")
    .map((l) => l.match(/^\s*[-*]\s+(.+)/)?.[1])
    .filter((x): x is string => !!x)
    .map(clean);
}

export interface Piece { name: string; qty: number; w: number | null; h: number | null; notes: string }

export function parsePieces(md: string): Piece[] {
  const rows = section(md, /pattern pieces/i)
    .split("\n")
    .filter((l) => l.trim().startsWith("|") && !/^\s*\|[\s:|-]+\|\s*$/.test(l));
  return rows.slice(1).map((r) => {
    const cells = r.split("|").slice(1, -1).map(clean);
    const all = cells.join(" ");
    const m = all.match(/(\d+(?:[.,]\d+)?)\s*(?:cm)?\s*[x×]\s*(\d+(?:[.,]\d+)?)\s*cm/i);
    const qty = parseInt(cells[1] ?? "1", 10);
    return {
      name: cells[0] ?? "Piece",
      qty: Number.isFinite(qty) && qty > 0 ? Math.min(qty, 8) : 1,
      w: m ? parseFloat(m[1].replace(",", ".")) : null,
      h: m ? parseFloat(m[2].replace(",", ".")) : null,
      notes: cells.slice(3).join(" "),
    };
  });
}

export function adjustPiece(p: Piece, a: Adjustments) {
  if (p.w == null || p.h == null) return null;
  return { w: +(p.w + a.ease + 2 * a.seamAllowance).toFixed(1), h: +(p.h + a.hem + 2 * a.seamAllowance).toFixed(1) };
}

export interface Placed { name: string; x: number; y: number; w: number; h: number }

/** Simple shelf packing of cut pieces across the fabric width. */
export function layout(pieces: Piece[], a: Adjustments) {
  const items: { name: string; w: number; h: number }[] = [];
  for (const p of pieces) {
    const d = adjustPiece(p, a);
    if (!d) continue;
    for (let i = 0; i < p.qty; i++) items.push({ name: p.name, w: Math.min(d.w, a.fabricWidth), h: d.h });
  }
  items.sort((x, y) => y.h - x.h);
  const placed: Placed[] = [];
  let x = 0, y = 0, shelf = 0;
  for (const it of items) {
    if (x + it.w > a.fabricWidth) { x = 0; y += shelf; shelf = 0; }
    placed.push({ ...it, x, y });
    x += it.w;
    shelf = Math.max(shelf, it.h);
  }
  return { placed, length: +(y + shelf).toFixed(1) };
}
