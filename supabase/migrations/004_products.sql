-- Products table for dynamic product management
CREATE TABLE IF NOT EXISTS public.products (
  id text PRIMARY KEY,                            -- slug: analyse, ebook, etc.
  name text NOT NULL,
  description text,
  icon text DEFAULT '📦',
  price integer NOT NULL DEFAULT 0,               -- in cents
  price_display text NOT NULL DEFAULT '0,00',
  type text NOT NULL DEFAULT 'one_time',          -- one_time | subscription
  stripe_product_id text,
  stripe_price_id text,
  content_file text,                              -- legacy: filename in /produkte/
  content_markdown text,                          -- new: full markdown content in DB
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can read active products
CREATE POLICY "Anyone can read active products" ON public.products
  FOR SELECT USING (active = true);

-- Service role has full access (admin API routes)
CREATE POLICY "Service role full access" ON public.products
  FOR ALL USING (true) WITH CHECK (true);

-- Seed with existing 5 products
INSERT INTO public.products (id, name, description, icon, price, price_display, type, content_file, active, sort_order) VALUES
  ('analyse', '10-Sekunden Reiseanalyse', 'Deine persönliche Reiseanalyse mit maßgeschneiderten Empfehlungen.', '✈️', 700, '7,00', 'one_time', NULL, true, 1),
  ('ebook', 'Top 10 Buchungs-Hacks E-Book', '10 erprobte Buchungs-Hacks für günstige Business Class Flüge.', '📖', 1900, '19,00', 'one_time', 'top-10-buchungs-hacks-ebook.md', true, 2),
  ('kreditkarten', 'Kreditkarten-Vergleich 2026', 'Der ultimative Vergleich der besten Reise-Kreditkarten 2026.', '💳', 900, '9,00', 'one_time', 'kreditkarten-vergleich-2026.md', true, 3),
  ('crashkurs', 'Meilen-Crashkurs', '5-Module Video-Kurs zum Meilen sammeln und einlösen.', '🎓', 4900, '49,00', 'one_time', 'meilen-crashkurs-curriculum.md', true, 4),
  ('masterplan', 'Lounge & Upgrade Masterplan', 'Dein kompletter Guide für Lounge-Zugang und Upgrades.', '🛋️', 2900, '29,00', 'one_time', 'lounge-upgrade-masterplan.md', true, 5)
ON CONFLICT (id) DO NOTHING;
