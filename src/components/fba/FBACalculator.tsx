import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FBACalculator() {
  const [fullBust, setFullBust] = useState<number | "">(40);
  const [highBust, setHighBust] = useState<number | "">(38);
  const [result, setResult] = useState<number | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  function handleCalculate() {
    if (fullBust === "" || highBust === "") {
      return;
    }
    const fullBustNum = Number(fullBust);
    const highBustNum = Number(highBust);
    const width = (fullBustNum - highBustNum - 2) / 2;
    setResult(width);
    setHasCalculated(true);
  }

  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-amber-50 to-transparent p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">FBA Calculator</h3>
        <p className="mt-1 text-sm text-slate-600">Calculate your Full Bust Adjustment width for pattern fitting.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="fullBust" className="block text-sm font-medium text-slate-700">
            Full Bust (inches)
          </label>
          <input
            id="fullBust"
            type="number"
            step="0.5"
            min="0"
            value={fullBust}
            onChange={(e) => setFullBust(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="e.g., 40"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label htmlFor="highBust" className="block text-sm font-medium text-slate-700">
            High Bust (inches)
          </label>
          <input
            id="highBust"
            type="number"
            step="0.5"
            min="0"
            value={highBust}
            onChange={(e) => setHighBust(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="e.g., 38"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <Button
        onClick={handleCalculate}
        disabled={fullBust === "" || highBust === ""}
        className="mt-6 w-full rounded-lg bg-slate-900 py-2.5 text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500"
      >
        Calculate Width
      </Button>

      {hasCalculated && result !== null && (
        <div className="mt-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
          <p className="text-sm font-medium text-slate-900">
            ✓ Your calculated adjustment width is{" "}
            <span className="font-semibold text-blue-600">{result.toFixed(2)}</span> inches per pattern side.
          </p>
          <p className="mt-2 text-xs text-slate-600">
            This is the amount you'll need to add to each side of your bodice pattern for proper fit.
          </p>
        </div>
      )}
    </div>
  );
}
