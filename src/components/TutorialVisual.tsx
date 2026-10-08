import { useState } from "react";
import { Play, Youtube } from "lucide-react";
import type { Guide } from "@/lib/content";
import { tutorialVideos } from "@/lib/videos";

export function TutorialVisual({ guide, stepIndex }: { guide: Guide; stepIndex: number }) {
  const step = guide.steps[stepIndex];
  const video = tutorialVideos[guide.slug];
  const [started, setStarted] = useState(false);
  if (!step) return null;

  if (step.video) {
    return (
      <figure className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <video key={step.video} className="aspect-video w-full bg-secondary object-cover" src={step.video} controls playsInline aria-label={step.mediaLabel ?? step.title} />
      </figure>
    );
  }

  if (!video) return null;

  return (
    <figure className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="relative aspect-video w-full bg-secondary">
        {started ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setStarted(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play video: ${video.title}`}>
            <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
            <span className="absolute inset-0 bg-secondary/30 transition group-hover:bg-secondary/15" />
            <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition group-hover:scale-105">
              <Play className="ml-1 size-7" fill="currentColor" />
            </span>
          </button>
        )}
      </div>
      <figcaption className="flex items-start gap-2 px-4 py-3 text-sm">
        <Youtube className="mt-0.5 size-4 shrink-0 text-primary" />
        <span>
          <span className="font-semibold text-foreground">{video.title}</span>
          <span className="text-muted-foreground"> · {video.channel}. Watch the full technique, then follow step {stepIndex + 1} below.</span>
        </span>
      </figcaption>
    </figure>
  );
}
