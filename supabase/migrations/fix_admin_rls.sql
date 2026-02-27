-- ==========================================
-- SCRIPT PARA SOLUCIONAR PERMISOS DEL ADMIN
-- ==========================================

-- 0. Crear función segura para verificar si un usuario es admin sin causar recursión infinita
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT is_admin FROM profiles WHERE id = auth.uid();
$$;

-- 1. Políticas para ngo_profiles (Permitir a los administradores ver todas las ONGs y verificarlas)
DROP POLICY IF EXISTS "Admins can view all ngo_profiles" ON ngo_profiles;
CREATE POLICY "Admins can view all ngo_profiles" 
  ON ngo_profiles FOR SELECT 
  TO authenticated
  USING (public.check_is_admin());

DROP POLICY IF EXISTS "Admins can update ngo_profiles" ON ngo_profiles;
CREATE POLICY "Admins can update ngo_profiles" 
  ON ngo_profiles FOR UPDATE 
  TO authenticated
  USING (public.check_is_admin());

DROP POLICY IF EXISTS "Admins can delete ngo_profiles" ON ngo_profiles;
CREATE POLICY "Admins can delete ngo_profiles" 
  ON ngo_profiles FOR DELETE 
  TO authenticated
  USING (public.check_is_admin());

-- 2. Políticas para profiles (Permitir a los admins ver todos los donantes/usuarios y a cada uno ver el suyo)
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" 
  ON profiles FOR SELECT 
  TO authenticated
  USING (public.check_is_admin());

-- 3. Políticas para projects (Permitir a los admins gestionar proyectos)
DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
CREATE POLICY "Admins can view all projects" 
  ON projects FOR SELECT 
  TO authenticated
  USING (public.check_is_admin());

DROP POLICY IF EXISTS "Admins can update projects" ON projects;
CREATE POLICY "Admins can update projects" 
  ON projects FOR UPDATE 
  TO authenticated
  USING (public.check_is_admin());

