-- CMS Sections: Editable content for the landing page
CREATE TABLE IF NOT EXISTS public.cms_sections (
  id text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cms_sections ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read cms_sections" ON public.cms_sections
  FOR SELECT USING (true);

-- Service role full access
CREATE POLICY "Service role can manage cms_sections" ON public.cms_sections
  FOR ALL USING (true) WITH CHECK (true);

-- Seed with empty rows for all sections
INSERT INTO public.cms_sections (id, data) VALUES
  ('hero', '{}'::jsonb),
  ('hack_finder', '{}'::jsonb),
  ('cards', '{}'::jsonb),
  ('about', '{}'::jsonb),
  ('testimonials', '{}'::jsonb),
  ('products_display', '{}'::jsonb),
  ('freebies', '{}'::jsonb),
  ('credit_cards', '{}'::jsonb),
  ('gallery', '{}'::jsonb),
  ('faq', '{}'::jsonb),
  ('contact', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
