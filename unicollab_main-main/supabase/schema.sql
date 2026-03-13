-- Supabase SQL Schema for UniCollab Project Platform

-- 1. Profiles Table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  domain TEXT,
  year TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Projects Table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  problem_statement TEXT,
  goals TEXT,
  expected_outcome TEXT,
  domain TEXT,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  collaboration_mode TEXT CHECK (collaboration_mode IN ('Remote', 'Hybrid', 'In-Person')),
  status TEXT CHECK (status IN ('OPEN', 'IN_PROGRESS', 'CLOSED')) DEFAULT 'OPEN',
  team_size INT DEFAULT 1,
  start_date DATE,
  duration_weeks INT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Project Skills Table
CREATE TABLE public.project_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  UNIQUE(project_id, skill_name)
);

-- 4. Project Roles Table
CREATE TABLE public.project_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL,
  spots_total INT NOT NULL DEFAULT 1,
  spots_filled INT NOT NULL DEFAULT 0,
  UNIQUE(project_id, role_name)
);

-- 5. Project Members Table
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.project_roles(id) ON DELETE SET NULL,
  joined_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(project_id, user_id)
);

-- 6. Join Requests Table
CREATE TABLE public.join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(project_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_projects_creator_id ON public.projects(creator_id);
CREATE INDEX idx_projects_domain ON public.projects(domain);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_project_skills_project_id ON public.project_skills(project_id);
CREATE INDEX idx_project_roles_project_id ON public.project_roles(project_id);
CREATE INDEX idx_project_members_project_id ON public.project_members(project_id);
CREATE INDEX idx_join_requests_project_id ON public.join_requests(project_id);
CREATE INDEX idx_join_requests_user_id ON public.join_requests(user_id);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, users can update their own profile
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: Public read for OPEN/IN_PROGRESS. Creators can manage.
CREATE POLICY "Projects are viewable by everyone." ON public.projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create projects." ON public.projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Creators can update their own projects." ON public.projects FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Creators can delete their own projects." ON public.projects FOR DELETE USING (auth.uid() = creator_id);

-- Project Skills: Public read, creators manage
CREATE POLICY "Project skills are viewable by everyone." ON public.project_skills FOR SELECT USING (true);
CREATE POLICY "Creators can insert skills to their projects." ON public.project_skills FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
);
CREATE POLICY "Creators can manage project skills." ON public.project_skills FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
);

-- Project Roles: Public read, creators manage
CREATE POLICY "Project roles are viewable by everyone." ON public.project_roles FOR SELECT USING (true);
CREATE POLICY "Creators can insert roles to their projects." ON public.project_roles FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
);
CREATE POLICY "Creators can manage project roles." ON public.project_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
);

-- Project Members: Public read, creators manage (or members can leave)
CREATE POLICY "Project members are viewable by everyone." ON public.project_members FOR SELECT USING (true);
CREATE POLICY "Creators can manage members." ON public.project_members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
);

-- Join Requests: Users can view their own, creators can view requests for their projects. Users can insert.
CREATE POLICY "Users can view their own join requests." ON public.join_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Creators can view requests for their projects." ON public.join_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
);
CREATE POLICY "Authenticated users can create join requests." ON public.join_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creators can update (approve/reject) requests for their projects." ON public.join_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
);
CREATE POLICY "Users can delete their own pending requests." ON public.join_requests FOR DELETE USING (auth.uid() = user_id AND status = 'pending');
