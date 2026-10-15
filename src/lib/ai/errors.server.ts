// Maps AI Gateway failures to safe, user-facing messages.
export function aiErrorMessage(e: unknown, fallback: string): string {
  const err = e as { statusCode?: number; status?: number; cause?: unknown; lastError?: unknown };
  const status = err?.statusCode ?? err?.status ?? (err?.lastError as { statusCode?: number } | undefined)?.statusCode;
  if (status === 402) return "AI credits have run out for this workspace. Please add credits and try again.";
  if (status === 429) return "The AI is busy right now — please wait a minute and try again.";
  if (status === 403) return "AI access is currently blocked for this workspace.";
  if (status === 400) return "That request couldn't be processed. Try a different photo or shorter message.";
  return fallback;
}
