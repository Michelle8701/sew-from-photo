import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, type UIMessage } from "ai";
import { COACH_SYSTEM, streamCoach } from "@/lib/ai/gateway.server";
import { getUserClient } from "@/lib/ai/supabase-user.server";
import {
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai/run-id.server";

const json = (status: number, message: string) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getUserClient(request);
        if (!user) return json(401, "Please sign in again.");
        const body = (await request.json()) as { messages?: UIMessage[]; threadId?: string };
        const messages = body.messages;
        if (!Array.isArray(messages) || !body.threadId) return json(400, "Invalid request");
        const threadId = body.threadId;

        const { data: thread } = await user.supabase
          .from("threads")
          .select("id,title")
          .eq("id", threadId)
          .maybeSingle();
        if (!thread) return json(404, "Chat not found");

        const { result, runIdFetch } = streamCoach({
          system: COACH_SYSTEM,
          messages: await convertToModelMessages(messages),
          signal: request.signal,
          runId: getLovableAiGatewayRunId(request),
        });

        const response = result.toUIMessageStreamResponse({
          originalMessages: messages,
          sendReasoning: true,
          onError: (e) => {
            console.error("coach error", e);
            return "The coach couldn't answer right now. Please try again in a moment.";
          },
          onFinish: async ({ messages: all }) => {
            const rows = all.map((m) => ({
              thread_id: threadId,
              user_id: user.userId,
              message_id: m.id,
              role: m.role,
              parts: m.parts as unknown as never,
            }));
            const { error } = await user.supabase
              .from("chat_messages")
              .upsert(rows, { onConflict: "thread_id,message_id", ignoreDuplicates: true });
            if (error) console.error("save messages failed", error);
            const update: { updated_at: string; title?: string } = {
              updated_at: new Date().toISOString(),
            };
            if (thread.title === "New chat") {
              const first = all.find((m) => m.role === "user");
              const text = first?.parts.find((p) => p.type === "text");
              if (text && "text" in text) update.title = text.text.slice(0, 60);
            }
            const { error: tErr } = await user.supabase.from("threads").update(update).eq("id", threadId);
            if (tErr) console.error("thread update failed", tErr);
          },
        });
        return withLovableAiGatewayRunIdHeader(response, runIdFetch);
      },
    },
  },
});
