import { createFileRoute, Link } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef } from "react";
import { ArrowLeft, Scissors } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

export const Route = createFileRoute("/_authenticated/coach/$threadId")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => (typeof s["q"] === "string" ? { q: s["q"] } : {}),
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("message_id,role,parts")
      .eq("thread_id", params.threadId)
      .order("created_at");
    if (error) throw error;
    return {
      messages: data.map((r) => ({ id: r.message_id, role: r.role, parts: r.parts }) as unknown as UIMessage),
    };
  },
  head: () => ({ meta: [{ title: "Coach chat — Stitchology" }] }),
  errorComponent: () => <AppShell><p className="p-8 text-center">Couldn't load this chat.</p></AppShell>,
  component: ChatPage,
});

function ChatPage() {
  const { threadId } = Route.useParams();
  const { messages } = Route.useLoaderData();
  return <ChatWindow key={threadId} threadId={threadId} initial={messages} />;
}

function ChatWindow({ threadId, initial }: { threadId: string; initial: UIMessage[] }) {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const sentQ = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { threadId },
        headers: async (): Promise<Record<string, string>> => {
          const { data } = await supabase.auth.getSession();
          return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
        },
      }),
    [threadId],
  );

  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: initial,
    transport,
    onError: (e) => {
      const m = e.message || "";
      if (m.includes("402")) toast.error("AI credits have run out.");
      else if (m.includes("429")) toast.error("Too many requests — please wait a moment.");
      else toast.error("The coach couldn't answer. Please try again.");
    },
  });

  useEffect(() => {
    if (q && !sentQ.current && initial.length === 0) {
      sentQ.current = true;
      sendMessage({ text: q });
      navigate({ search: {}, replace: true });
    }
  }, [q, initial.length, sendMessage, navigate]);

  useEffect(() => {
    if (status === "ready") textareaRef.current?.focus();
  }, [status]);

  const busy = status === "submitted" || status === "streaming";

  return (
    <AppShell>
      <div className="mx-auto flex h-[calc(100dvh-3.5rem-5rem)] max-w-2xl flex-col px-3 md:h-[calc(100dvh-3.5rem)]">
        <div className="flex items-center gap-2 py-3">
          <Link to="/coach" className="flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Chats</Link>
          <span className="ml-auto flex items-center gap-1.5 font-display font-semibold"><Scissors className="size-4 text-primary" /> Sewing Coach</span>
        </div>
        <Conversation className="flex-1">
          <ConversationContent>
            {messages.length === 0 && (
              <ConversationEmptyState
                icon={<Scissors className="size-8 text-primary" />}
                title="What are you working on?"
                description="Describe your project or problem — fabric, machine, what went wrong."
              />
            )}
            {messages.map((m) => (
              <Message key={m.id} from={m.role}>
                <MessageContent className="group-[.is-user]:bg-secondary group-[.is-user]:text-secondary-foreground">
                  {m.parts.map((p, i) =>
                    p.type === "text" ? (
                      m.role === "assistant" ? <MessageResponse key={i}>{p.text}</MessageResponse> : <p key={i}>{p.text}</p>
                    ) : null,
                  )}
                </MessageContent>
              </Message>
            ))}
            {status === "submitted" && <Shimmer className="text-sm">Coach is thinking…</Shimmer>}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <PromptInput
          className="mb-3"
          onSubmit={(msg) => {
            if (!msg.text.trim() || busy) return;
            sendMessage({ text: msg.text });
          }}
        >
          <PromptInputTextarea ref={textareaRef} autoFocus placeholder="Ask about a stitch, fabric, pattern…" />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </AppShell>
  );
}
