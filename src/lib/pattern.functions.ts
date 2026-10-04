import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PATTERN_SYSTEM = `You are Stitchology's pattern assistant. From a photo of a garment, bag, or design idea, create a STARTER sewing pattern draft and project guide in Markdown for a home sewist.
Start with a first line "# <short project name>".
Then include these sections:
## What we see — key design features.
## Difficulty & time
## Fabric & supplies — fabric types, yardage estimate, notions.
## Pattern pieces — a table: piece, cut quantity, approximate dimensions (cm and inches) for a medium size, notes. Say how to scale to other sizes.
## Measurements to take — list body/object measurements the user should take.
## Construction steps — numbered, beginner-friendly.
## Adjust before cutting — remind the user this is an approximate draft; suggest making a test version (muslin/toile) first.
Be honest about uncertainty. Never claim exact measurements from a photo.`;

export const generatePatternDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        image: z.string().startsWith("data:image/").max(8_000_000),
        notes: z.string().max(1000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { streamCoach } = await import("@/lib/ai/gateway.server");
    const { result } = streamCoach({
      system: PATTERN_SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Create a starter pattern draft from this photo.${data.notes ? ` My notes: ${data.notes}` : ""}`,
            },
            { type: "image", image: new URL(data.image) },
          ],
        },
      ],
    });
    let content: string;
    try {
      content = await result.text;
    } catch (e) {
      console.error("pattern generation failed", e);
      throw new Error("We couldn't create a draft right now. Please try again shortly.");
    }
    if (!content.trim()) throw new Error("No draft was returned. Try a clearer photo.");
    const title = (content.match(/^#\s+(.+)$/m)?.[1] ?? "Pattern draft").slice(0, 80);
    const { data: row, error } = await context.supabase
      .from("pattern_drafts")
      .insert({ title, notes: data.notes ?? null, content, user_id: context.userId })
      .select("id")
      .single();
    if (error) throw new Error("Draft created but couldn't be saved.");
    return { id: row.id };
  });
