-- Create projects table
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  ngo_id uuid references ngo_profiles(id) on delete cascade not null,
  title text not null,
  description text,
  category text,
  image_url text,
  goal_amount numeric default 0,
  status text check (status in ('draft', 'pending_approval', 'voting', 'completed')) default 'draft',
  voting_month text, -- Format: 'YYYY-MM'
  current_votes int default 0,
  created_at timestamptz default now()
);

-- Enable RLS
alter table projects enable row level security;

-- Policies
-- Public read access for voting/completed projects
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON projects;
create policy "Public projects are viewable by everyone"
  on projects for select
  using (status in ('voting', 'completed'));

-- NGO read/write own projects
DROP POLICY IF EXISTS "NGOs can view own projects" ON projects;
create policy "NGOs can view own projects"
  on projects for select
  using (auth.uid() = ngo_id);

DROP POLICY IF EXISTS "NGOs can insert own projects" ON projects;
create policy "NGOs can insert own projects"
  on projects for insert
  with check (auth.uid() = ngo_id);

DROP POLICY IF EXISTS "NGOs can update own projects" ON projects;
create policy "NGOs can update own projects"
  on projects for update
  using (auth.uid() = ngo_id);

DROP POLICY IF EXISTS "NGOs can delete own projects" ON projects;
create policy "NGOs can delete own projects"
  on projects for delete
  using (auth.uid() = ngo_id);

-- Admins can view/edit all projects (assuming admin has a role or flag - simplifying for now to public read for admin dashboard if logic is handled in app, but ideally admin RLS)
-- For now, relying on Service Role or Admin flag in app logic if RLS enforcement is strict. 
-- In this prototype, we might skip complex Admin RLS and rely on the fact that admins are users.
-- Ideally: create policy "Admins can do everything" ... using (auth.jwt() ->> 'is_admin' = 'true'); provided user metadata has is_admin.
