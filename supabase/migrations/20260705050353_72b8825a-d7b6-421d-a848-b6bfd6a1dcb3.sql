
DROP POLICY IF EXISTS "Merchants public read" ON public.merchants;

CREATE POLICY "Admins read merchants full" ON public.merchants
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

REVOKE SELECT ON public.merchants FROM anon, authenticated;
GRANT SELECT (slug, name, domain, logo_bg, active) ON public.merchants TO anon, authenticated;

CREATE OR REPLACE VIEW public.merchants_public
WITH (security_invoker = true) AS
SELECT slug, name, domain, logo_bg, active
FROM public.merchants
WHERE active;

GRANT SELECT ON public.merchants_public TO anon, authenticated;

CREATE POLICY "Users self-assign user role only" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND role = 'user');

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
