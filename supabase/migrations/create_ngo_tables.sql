-- Tabla de perfiles de ONGs
CREATE TABLE IF NOT EXISTS ngo_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id),
  ngo_name TEXT NOT NULL,
  legal_name TEXT,
  cif TEXT UNIQUE,
  category TEXT,
  description TEXT,
  mission TEXT,
  logo_url TEXT,
  banner_url TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  social_media JSONB,
  bank_account TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de proyectos de ONGs
CREATE TABLE IF NOT EXISTS ngo_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ngo_id UUID REFERENCES ngo_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  goal_amount DECIMAL(10,2),
  image_url TEXT,
  status TEXT DEFAULT 'draft',
  voting_month DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de votos mensuales
CREATE TABLE IF NOT EXISTS monthly_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  ngo_id UUID REFERENCES ngo_profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES ngo_projects(id) ON DELETE SET NULL,
  voting_month DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, voting_month)
);

-- Tabla de pagos a ONGs
CREATE TABLE IF NOT EXISTS ngo_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ngo_id UUID REFERENCES ngo_profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE,
  status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_ngo_profiles_auth_user ON ngo_profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_ngo_projects_ngo ON ngo_projects(ngo_id);
CREATE INDEX IF NOT EXISTS idx_monthly_votes_user ON monthly_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_votes_ngo ON monthly_votes(ngo_id);
CREATE INDEX IF NOT EXISTS idx_monthly_votes_month ON monthly_votes(voting_month);
CREATE INDEX IF NOT EXISTS idx_ngo_payouts_ngo ON ngo_payouts(ngo_id);

-- Políticas de seguridad RLS (Row Level Security)
ALTER TABLE ngo_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_payouts ENABLE ROW LEVEL SECURITY;

-- Política: ONGs pueden ver y editar su propio perfil
CREATE POLICY ngo_profiles_own_data ON ngo_profiles
  FOR ALL
  USING (auth.uid() = auth_user_id);

-- Política: Todos pueden ver perfiles activos de ONGs verificadas
CREATE POLICY ngo_profiles_public_read ON ngo_profiles
  FOR SELECT
  USING (is_verified = true AND is_active = true);

-- Política: ONGs pueden gestionar sus propios proyectos
CREATE POLICY ngo_projects_own_data ON ngo_projects
  FOR ALL
  USING (ngo_id IN (SELECT id FROM ngo_profiles WHERE auth_user_id = auth.uid()));

-- Política: Todos pueden ver proyectos activos
CREATE POLICY ngo_projects_public_read ON ngo_projects
  FOR SELECT
  USING (status IN ('active', 'voting'));

-- Política: Usuarios pueden crear votos
CREATE POLICY monthly_votes_insert ON monthly_votes
  FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE id = auth.uid()));

-- Política: Usuarios pueden ver sus propios votos
CREATE POLICY monthly_votes_own_read ON monthly_votes
  FOR SELECT
  USING (user_id IN (SELECT id FROM profiles WHERE id = auth.uid()));

-- Política: ONGs pueden ver votos que recibieron
CREATE POLICY monthly_votes_ngo_read ON monthly_votes
  FOR SELECT
  USING (ngo_id IN (SELECT id FROM ngo_profiles WHERE auth_user_id = auth.uid()));

-- Política: ONGs pueden ver sus propios pagos
CREATE POLICY ngo_payouts_own_read ON ngo_payouts
  FOR SELECT
  USING (ngo_id IN (SELECT id FROM ngo_profiles WHERE auth_user_id = auth.uid()));
