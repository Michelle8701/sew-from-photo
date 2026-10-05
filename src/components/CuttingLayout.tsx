import type { Adjustments, Piece } from "@/lib/pattern-spec";
import { layout } from "@/lib/pattern-spec";

export function CuttingLayout({ pieces, adj }: { pieces: Piece[]; adj: Adjustments }) {
  const { placed, length } = layout(pieces, adj);
  if (!placed.length) return <p className="text-sm text-muted-foreground">No piece sizes found in this draft to draw a layout.</p>;
  const W = adj.fabricWidth;
  return (
    <figure>
      <svg viewBox={`-2 -2 ${W + 4} ${length + 4}`} className="w-full rounded-lg border bg-paper" role="img" aria-label="Cutting layout">
        <rect x={0} y={0} width={W} height={length} fill="none" stroke="currentColor" strokeDasharray="2 2" strokeWidth={0.4} />
        {placed.map((p, i) => (
          <g key={i}>
            <rect x={p.x + 0.5} y={p.y + 0.5} width={p.w - 1} height={p.h - 1} className="fill-primary/15 stroke-primary" strokeWidth={0.5} />
            <text x={p.x + p.w / 2} y={p.y + p.h / 2} textAnchor="middle" dominantBaseline="middle" fontSize={Math.max(2.5, Math.min(p.w, p.h) / 8)} className="fill-foreground">
              {p.name} ({p.w}×{p.h})
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-1 text-xs text-muted-foreground">
        Fabric width {W} cm · approx. length needed {length} cm ({(length / 91.44).toFixed(2)} yd). Sizes include seam allowance, hem and ease. Not to scale for fold or grain — check before cutting.
      </figcaption>
    </figure>
  );
}
