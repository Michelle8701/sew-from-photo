import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Camera, MessageCircle, Recycle } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { AppShell } from "@/components/AppShell";
import { GuideList } from "@/components/GuideCard";
import { guides } from "@/lib/content";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stitchology — Turn sewing ideas into real projects" },
      { name: "description", content: "Learn, repair, upcycle and create with step-by-step sewing tutorials, photo-to-pattern drafts and an AI Sewing Coach." },
      { property: "og:title", content: "Stitchology — your simple sewing companion" },
      { property: "og:description", content: "Beginner-friendly sewing tutorials, upcycling ideas, pattern drafts from photos and an AI Sewing Coach." },
    ],
  }),
  component: Index,
});

const features = [
  { to: "/learn", icon: BookOpen, title: "Step-by-step tutorials", body: "Seams, hems, zippers, bags, garments, home decor and repairs — one clear step at a time." },
  { to: "/tools", icon: Camera, title: "Yardage & machine settings", body: "Estimate fabric by project and width, and look up needle, thread, stitch and tension." },
  { to: "/pattern", icon: Camera, title: "Pattern draft from a photo", body: "Snap a garment or bag you love and get a starter pattern draft and project guide." },
  { to: "/upcycle", icon: Recycle, title: "Upcycling ideas", body: "Jeans into skirts, shirts into bags, scraps into accessories. Give old fabric a second life." },
  { to: "/coach", icon: MessageCircle, title: "AI Sewing Coach", body: "Skipped stitches? Stuck zipper? Ask anytime and get a calm, clear answer." },
] as const;

const makers = [
  ["Beginners", "Simple projects, clear instructions and confidence-building techniques."],
  ["Hobbyists", "Explore new ideas and keep projects moving from inspiration to finished piece."],
  ["Makers & upcyclers", "Practical ways to repair, repurpose and restyle clothing and fabric."],
];

function Index() {
  return (
    <AppShell>
      <section className="mx-auto max-w-5xl px-4 pt-6 md:grid md:grid-cols-2 md:items-center md:gap-10 md:pt-14">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Learn · Repair · Upcycle · Create</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] md:text-6xl">
            Turn sewing ideas into <em className="text-primary">real projects.</em>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your simple sewing companion — clear guidance every step of the way, whether it's your first seam or your next big make.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full px-6 text-base">
              <Link to="/auth">Start your free trial <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-6 text-base">
              <Link to="/learn">Browse tutorials</Link>
            </Button>
          </div>
        </div>
        <div className="relative mt-8 md:mt-0">
          <div className="stitch absolute -inset-2 rounded-[1.75rem]" aria-hidden />
          <img src={hero} alt="Sewing table with denim, thread spools, pattern pieces and scissors" width={1280} height={960} className="relative aspect-[4/3] w-full rounded-3xl object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-14">
        <div className="stitch-line mb-8" />
        <h2 className="text-2xl font-semibold md:text-3xl">What you can do</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <Link key={f.to} to={f.to} className="flex gap-4 rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-paper text-primary">
                <f.icon className="size-5" />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold">{f.title}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{f.body}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-14">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold md:text-3xl">Start with these</h2>
          <Link to="/learn" className="text-sm font-semibold text-primary">See all</Link>
        </div>
        <div className="mt-5">
          <GuideList items={guides.filter((g) => ["straight-seams", "tote-bag", "jeans-to-skirt", "repair-seam"].includes(g.slug))} />
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-5xl px-4">
        <div className="rounded-3xl bg-secondary p-6 text-secondary-foreground md:p-10">
          <h2 className="text-2xl font-semibold md:text-3xl">Made for every kind of maker</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {makers.map(([t, b]) => (
              <div key={t}>
                <h3 className="text-lg font-semibold">{t}</h3>
                <p className="mt-1 text-sm opacity-80">{b}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2 text-sm">
            {["Easy to follow", "Creative", "Practical", "Supportive"].map((t) => (
              <span key={t} className="rounded-full border border-current/30 px-3 py-1">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">Start creating today</h2>
        <p className="mt-3 text-muted-foreground">
          Repairing a seam, making your first bag, upcycling old clothes, or exploring a new idea — Stitchology is right beside your machine.
        </p>
        <Button asChild size="lg" className="mt-6 h-12 rounded-full px-8 text-base">
          <Link to="/auth">Start your free trial</Link>
        </Button>
      </section>
    </AppShell>
  );
}
