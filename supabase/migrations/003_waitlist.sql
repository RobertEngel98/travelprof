-- Waitlist table for community signups and leadmagnet downloads
CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  source text DEFAULT 'community',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow inserts from service role (API route uses service role key)
CREATE POLICY "Service role can manage waitlist" ON public.waitlist
  FOR ALL USING (true) WITH CHECK (true);
