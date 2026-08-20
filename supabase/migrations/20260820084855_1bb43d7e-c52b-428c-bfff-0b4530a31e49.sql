
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  email text,
  avatar text,
  title text,
  bio text,
  location text,
  profile_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);

CREATE TABLE public.match_features (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  features jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.match_features TO authenticated;
GRANT ALL ON public.match_features TO service_role;
ALTER TABLE public.match_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own match features" ON public.match_features FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.swipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_id text NOT NULL,
  decision text NOT NULL CHECK (decision IN ('connect', 'pass')),
  context text,
  score numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, candidate_id, context)
);
CREATE INDEX swipes_user_id_idx ON public.swipes(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.swipes TO authenticated;
GRANT ALL ON public.swipes TO service_role;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own swipes" ON public.swipes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id text NOT NULL,
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'accepted', 'declined')),
  context text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (requester_id, target_id)
);
CREATE INDEX connections_requester_idx ON public.connections(requester_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.connections TO authenticated;
GRANT ALL ON public.connections TO service_role;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own connections" ON public.connections FOR ALL TO authenticated USING (auth.uid() = requester_id) WITH CHECK (auth.uid() = requester_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_match_features_updated_at BEFORE UPDATE ON public.match_features FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON public.connections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
