import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCoachThread, PENDING_COACH_PROMPT_KEY } from "@/lib/coach";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } =>
    typeof search["redirect"] === "string" ? { redirect: search["redirect"] } : {},
  head: () => ({
    meta: [
      { title: "Sign in or start your free trial — Stitchology" },
      { name: "description", content: "Create your Stitchology account to save pattern drafts and chat with the AI Sewing Coach." },
      { property: "og:title", content: "Join Stitchology" },
      { property: "og:description", content: "Start your free trial of the simple sewing companion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const finishing = useRef(false);

  function safeDestination() {
    return redirect?.startsWith("/") && !redirect.startsWith("//") ? redirect : "/coach";
  }

  async function finishSignIn() {
    if (finishing.current) return;
    finishing.current = true;
    const pendingPrompt = window.sessionStorage.getItem(PENDING_COACH_PROMPT_KEY);
    if (pendingPrompt) {
      try {
        const id = await createCoachThread();
        window.sessionStorage.removeItem(PENDING_COACH_PROMPT_KEY);
        navigate({ to: "/coach/$threadId", params: { threadId: id }, search: { q: pendingPrompt }, replace: true });
        return;
      } catch {
        toast.error("You’re signed in, but the Coach question could not be opened.");
      }
    }
    navigate({ to: safeDestination(), replace: true });
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) void finishSignIn();
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      if (data.session) void finishSignIn();
      else setSent(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      void finishSignIn();
    }
  }

  async function google() {
    setGoogleBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setGoogleBusy(false);
      toast.error(result.error instanceof Error ? result.error.message : "Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    const { data, error } = await supabase.auth.getUser();
    setGoogleBusy(false);
    if (error || !data.user) { toast.error(error?.message ?? "Google finished, but your Stitchology session was not created."); return; }
    void finishSignIn();
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-sm px-4 py-10">
        <h1 className="text-3xl font-semibold">{mode === "signup" ? "Start your free trial" : "Welcome back"}</h1>
        <p className="mt-1 text-muted-foreground">Save pattern drafts and chat with your Sewing Coach.</p>
        {sent ? (
          <div className="stitch mt-6 rounded-2xl p-5">
            <p className="font-semibold">Check your email</p>
            <p className="mt-1 text-sm text-muted-foreground">We sent a confirmation link to {email}. Tap it to finish signing up.</p>
          </div>
        ) : (
          <>
            <Button variant="outline" size="lg" className="mt-6 h-12 w-full rounded-full" onClick={google} disabled={googleBusy}>
              {googleBusy ? "Connecting to Google…" : "Continue with Google"}
            </Button>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pw">Password</Label>
                <Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12" />
              </div>
              <Button type="submit" size="lg" disabled={busy} className="h-12 w-full rounded-full">
                {mode === "signup" ? "Create account" : "Sign in"}
              </Button>
            </form>
            <Button type="button" variant="ghost" onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="mt-4 w-full text-center text-sm text-muted-foreground">
              {mode === "signup" ? "Already have an account? Sign in" : "New here? Start your free trial"}
            </Button>
          </>
        )}
      </div>
    </AppShell>
  );
}
