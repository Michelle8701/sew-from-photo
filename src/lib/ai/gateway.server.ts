import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

export const MODEL = "openai/gpt-6-astra";
const BASE = "https://ai.gateway.lovable.dev/v1";

export function streamCoach(opts: {
  system: string;
  messages: ModelMessage[];
  signal?: AbortSignal;
  runId?: string;
}) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured");
  const runIdFetch = createLovableAiGatewayRunIdFetch(opts.runId);
  const provider = createOpenAI({
    baseURL: BASE,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  const result = streamText({
    model: provider.responses(MODEL),
    system: opts.system,
    messages: opts.messages,
    abortSignal: opts.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  return { result, runIdFetch };
}

export const COACH_SYSTEM = `You are the Stitchology Sewing Coach: a warm, patient, practical sewing teacher for beginners, hobbyists and upcyclers.
- Give clear, numbered steps when explaining how to do something. Keep answers short enough to read on a phone next to a sewing machine.
- Use plain words; briefly explain any sewing term you use.
- Include both metric and imperial measurements where relevant.
- Mention safety (irons, rotary cutters, needles) when relevant.
- If a question is unclear, make a sensible assumption and say what it is, then offer one follow-up question.`;
