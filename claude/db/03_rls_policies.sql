-- RLS Policies: subscriptions + template para tablas de contenido
-- Ejecutar DESPUÉS de 02_create_subscriptions_table.sql.

-- ─────────────────────────────────────────────────────────────────
-- 1. subscriptions: usuario solo lee su propia suscripción
-- ─────────────────────────────────────────────────────────────────
alter table public.subscriptions enable row level security;

-- SELECT: solo propia suscripción
create policy "sub_select_own"
  on public.subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);

-- INSERT / UPDATE / DELETE: solo service role (Edge Functions, webhooks)
-- No se necesita policy — RLS bloquea por defecto para authenticated.
-- Las Edge Functions usan SUPABASE_SERVICE_ROLE_KEY que bypasea RLS.


-- ─────────────────────────────────────────────────────────────────
-- 2. Helper: función para verificar plan activo del usuario actual
--    Usada por las policies de tablas de contenido.
-- ─────────────────────────────────────────────────────────────────
create or replace function public.get_active_plan_type()
returns text
language sql
security definer
stable
as $$
  select p.tipo
  from public.subscriptions s
  join public.plans p on p.id = s.plan_id
  where s.user_id = auth.uid()
    and s.status = 'active'
  order by
    case p.tipo
      when 'vitalicio' then 0
      when 'mensual'   then 1
      else 2
    end
  limit 1;
$$;

-- ─────────────────────────────────────────────────────────────────
-- 3. Helper: verifica si el usuario tiene suscripción activa
--    con nivel mínimo requerido ('basico' | 'avanzado' | 'vitalicio')
-- ─────────────────────────────────────────────────────────────────
create or replace function public.has_active_subscription(nivel_minimo text default 'basico')
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.subscriptions s
    join public.plans p on p.id = s.plan_id
    where s.user_id = auth.uid()
      and s.status = 'active'
      and (
        -- vitalicio accede a todo
        p.nombre ilike '%vitalicio%'
        or
        -- avanzado accede a básico y avanzado
        (nivel_minimo = 'basico' and p.nombre ilike '%avanzado%')
        or
        -- coincide con el nivel pedido
        p.nombre ilike ('%' || nivel_minimo || '%')
      )
  );
$$;


-- ─────────────────────────────────────────────────────────────────
-- 4. TEMPLATE: RLS para tabla de contenido (ej: "recursos")
--
-- Reemplazar "resources" con el nombre real de la tabla de contenido
-- cuando se cree. El patrón es el mismo para cualquier tabla protegida.
-- ─────────────────────────────────────────────────────────────────

-- Ejemplo para tabla "resources" con columna "plan_nivel" (basico|avanzado):
/*
alter table public.resources enable row level security;

-- Contenido básico: accesible con cualquier plan activo
create policy "resources_basico_access"
  on public.resources
  for select
  to authenticated
  using (
    plan_nivel = 'basico'
    and public.has_active_subscription('basico')
  );

-- Contenido avanzado: requiere plan avanzado o vitalicio
create policy "resources_avanzado_access"
  on public.resources
  for select
  to authenticated
  using (
    plan_nivel = 'avanzado'
    and public.has_active_subscription('avanzado')
  );
*/
