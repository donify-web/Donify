-- ==========================================
-- SCRIPT PARA SOLUCIONAR EL ERROR 401 (UNAUTHORIZED)
-- EN POSTGREST (Supabase API)
-- ==========================================

-- 1. Crear las tablas principales si por alguna razón no existen en producción
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid default gen_random_uuid() primary key,
  ngo_id uuid, -- Reference omitted here to avoid foreign key errors if ngo_profiles doesn't exist
  title text not null,
  description text,
  category text,
  image_url text,
  goal_amount numeric default 0,
  status text check (status in ('draft', 'pending_approval', 'voting', 'completed')) default 'draft',
  voting_month text,
  current_votes int default 0,
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS public.voting_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  votes INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Asegurar que los roles de Supabase (anon y authenticated)
-- tienen los privilegios de base de datos correctos para leer estas tablas
-- (Este suele ser el motivo principal del error 401 / failed to load resource)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.voting_options TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.projects TO anon, authenticated;

-- (Opcional) Otorgar permisos a secuencias si se requiere
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 3. Habilitar la Seguridad por Filas (RLS)
ALTER TABLE public.voting_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 4. Re-crear explícitamente las políticas PÚBLICAS de lectura (SELECT)
-- Esto permite que "cualquiera" (incluso sin login) pueda ver estos datos (Landing Page)
DROP POLICY IF EXISTS "Public can view active voting options" ON public.voting_options;
CREATE POLICY "Public can view active voting options"
  ON public.voting_options FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON public.projects;
CREATE POLICY "Public projects are viewable by everyone"
  ON public.projects FOR SELECT
  USING (status IN ('voting', 'completed'));

-- 5. Insertar datos de ejemplo sólo si la tabla está vacía
INSERT INTO public.voting_options (title, description, image_url, votes, is_active)
SELECT 'Causa Medioambiental [Ejemplo]', 'Plantación de árboles...', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800', 0, true
WHERE NOT EXISTS (SELECT 1 FROM public.voting_options);

INSERT INTO public.voting_options (title, description, image_url, votes, is_active)
SELECT 'Acción Social [Ejemplo]', 'Apoyo humanitario...', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800', 0, true
WHERE NOT EXISTS (SELECT 1 FROM public.voting_options WHERE title = 'Acción Social [Ejemplo]');
