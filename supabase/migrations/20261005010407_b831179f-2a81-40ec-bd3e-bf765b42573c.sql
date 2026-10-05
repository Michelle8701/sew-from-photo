CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  title text NOT NULL,
  source_type text NOT NULL DEFAULT 'custom',
  source_ref text,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  measurements jsonb NOT NULL DEFAULT '[]'::jsonb,
  fabric text,
  notes text,
  photos jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active',
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own projects" ON public.projects FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.pattern_drafts ADD COLUMN adjustments jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE POLICY "own project photos read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'project-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "own project photos insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "own project photos delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-photos' AND (storage.foldername(name))[1] = auth.uid()::text);