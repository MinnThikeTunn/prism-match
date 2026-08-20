GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.match_features TO authenticated;
GRANT ALL ON public.match_features TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.swipes TO authenticated;
GRANT ALL ON public.swipes TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.connections TO authenticated;
GRANT ALL ON public.connections TO service_role;

GRANT SELECT ON public.anon_profiles TO anon, authenticated;
GRANT ALL ON public.anon_profiles TO service_role;
GRANT ALL ON public.anon_profile_features TO service_role;