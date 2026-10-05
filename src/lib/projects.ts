import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface ProjectStep { title: string; done: boolean }
export interface Measurement { label: string; value: string }

export async function createProject(input: { title: string; source_type: "guide" | "pattern" | "custom"; source_ref?: string; steps: string[] }) {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: input.title,
      source_type: input.source_type,
      source_ref: input.source_ref ?? null,
      steps: input.steps.map((t) => ({ title: t, done: false })) as unknown as Json,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}
