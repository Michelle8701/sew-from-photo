import { supabase } from "@/integrations/supabase/client";

export async function createCoachThread() {
  const { data, error } = await supabase.from("threads").insert({}).select("id").single();
  if (error) throw error;
  return data.id;
}

export const PENDING_COACH_PROMPT_KEY = "stitchology.pendingCoachPrompt";