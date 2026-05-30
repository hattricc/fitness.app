-- Script 03: Funciones helper para RLS + template para tablas de contenido.
-- La policy SELECT en subscriptions ya existe ("users read own subscriptions").
-- Solo agregamos helpers reutilizables.

-- ─────────────────────────────────────────────────────────────────
-- Helper: tipo de plan activo del usuario actual
-- Retorna: 'monthly' | 'one_time' | null
-- ─────────────────────────────────────────────────────────────────
create or replace function public.get_active_billing_interval()
returns text
language sql
security definer
stable
as $$
  select p.billing_interval::text
  from public.subscriptions s
  join public.products p on p.id = s.product_id
  where s.user_id = auth.uid()
    and s.status = 'active'
  order by
    case p.billing_interval::text
      when 'one_time' then 0   -- vitalicio tiene prioridad
      when 'monthly'  then 1
      else 2
    end
  limit 1;
$$;

-- ─────────────────────────────────────────────────────────────────
-- Helper: verificar acceso mínimo por code de producto
-- Uso: has_active_plan('plan-basico') | has_active_plan('plan-avanzado')
--
-- Jerarquía de acceso (de mayor a menor):
--   plan-vitalicio  → accede a TODO
--   plan-avanzado   → accede a avanzado + básico
--   plan-basico     → accede solo a básico
-- ─────────────────────────────────────────────────────────────────
create or replace function public.has_active_plan(required_code text)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.subscriptions s
    join public.products p on p.id = s.product_id
    where s.user_id = auth.uid()
      and s.status = 'active'
      and (
        -- vitalicio accede a todo
        p.code = 'plan-vitalicio'
        -- avanzado accede a básico también
        or (required_code = 'plan-basico'   and p.code in ('plan-avanzado', 'plan-vitalicio'))
        -- coincidencia exacta
        or p.code = required_code
      )
  );
$$;

-- ─────────────────────────────────────────────────────────────────
-- TEMPLATE: RLS para tabla de contenido
--
-- Cuando se creen tablas de contenido (recursos, módulos, etc.),
-- agregar una columna 'plan_code' text que indique el plan mínimo requerido.
-- Luego aplicar estas policies:
-- ─────────────────────────────────────────────────────────────────

/*
-- Ejemplo para tabla "resources" con columna plan_code:

alter table public.resources enable row level security;

-- Contenido sin restricción (libre para todos los planes)
create policy "resources_free_access"
  on public.resources for select
  using (plan_code is null or plan_code = 'free');

-- Contenido básico
create policy "resources_basico_access"
  on public.resources for select
  to authenticated
  using (
    plan_code = 'plan-basico'
    and public.has_active_plan('plan-basico')
  );

-- Contenido avanzado
create policy "resources_avanzado_access"
  on public.resources for select
  to authenticated
  using (
    plan_code = 'plan-avanzado'
    and public.has_active_plan('plan-avanzado')
  );
*/
