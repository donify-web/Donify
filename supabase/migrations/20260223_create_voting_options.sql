-- Create voting_options table for the standalone /voting page
CREATE TABLE IF NOT EXISTS voting_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  votes INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE  voting_options ENABLE ROW LEVEL SECURITY;

-- Anyone can read active voting options
CREATE POLICY "Public can view active voting options"
  ON voting_options FOR SELECT
  USING (is_active = true);

-- Authenticated users can update (for vote increment)
CREATE POLICY "Authenticated users can update votes"
  ON voting_options FOR UPDATE
  USING (is_active = true)
  WITH CHECK (is_active = true);

-- Admins can do everything (insert, update, delete) via service role or app logic
-- For prototype: allow all inserts for admin management
CREATE POLICY "Allow inserts for admins"
  ON voting_options FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow deletes for admins"
  ON voting_options FOR DELETE
  USING (true);

-- Insert 3 default voting options for demo
INSERT INTO voting_options (title, description, image_url, votes) VALUES
  ('Reforestación Galicia', 'Plantación de 500 árboles nativos en zonas afectadas por incendios forestales. Tu voto apoya la recuperación de ecosistemas.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800', 245),
  ('Comedores Sociales Madrid', 'Apoyo nutricional diario para 200 personas en situación de vulnerabilidad en comedores comunitarios.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800', 189),
  ('Educación Digital Rural', 'Tablets y conectividad para escuelas rurales en la España vaciada. Cerremos la brecha digital.', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800', 120);
