import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or start your free trial — Stitchology" },
      { name: "description", content: "Create your Stitchology account to save pattern drafts and chat with the AI Sewing Coach." },
      { property: "og:title", content: "Join Stitchology" },
      { property: "og:description", content: "Start your free trial of the simple sewing companion." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/coach" });
    });
  }, [navigate]);

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
      if (data.session) navigate({ to: "/coach" });
      else setSent(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      navigate({ to: "/coach" });
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error("Google sign-in failed"); return; }
    if (result.redirected) return;
    navigate({ to: "/coach" });
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
            <Button variant="outline" size="lg" className="mt-6 h-12 w-full rounded-full" onClick={google}>
              Continue with Google
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
            <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="mt-4 w-full text-center text-sm text-muted-foreground">
              {mode === "signup" ? "Already have an account? Sign in" : "New here? Start your free trial"}
            </button>
          </>
        )}
      </div>
    </AppShell>
  );
}
