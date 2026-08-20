REVOKE SELECT ON public.profiles FROM authenticated;
GRANT SELECT (id, name, avatar, title, bio, location, profile_data, created_at, updated_at) ON public.profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

DROP POLICY IF EXISTS "Targets can view connection requests" ON public.connections;
CREATE POLICY "Targets can view connection requests"
ON public.connections FOR SELECT TO authenticated
USING (auth.uid()::text = target_id::text);

DROP POLICY IF EXISTS "Targets can update connection requests" ON public.connections;
CREATE POLICY "Targets can update connection requests"
ON public.connections FOR UPDATE TO authenticated
USING (auth.uid()::text = target_id::text)
WITH CHECK (auth.uid()::text = target_id::text);