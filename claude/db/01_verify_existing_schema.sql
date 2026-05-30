-- Script 01: Verificar esquema existente antes de ejecutar los demás.
-- NO crea nada. Solo consultas de diagnóstico.

-- ─────────────────────────────────────────────────────────────────
-- Enums existentes y sus valores
-- ─────────────────────────────────────────────────────────────────
select
  t.typname      as enum_name,
  e.enumlabel    as value,
  e.enumsortorder as sort
from pg_type t
join pg_enum e on e.enumtypid = t.oid
where t.typname in ('subscription_status', 'billing_interval', 'payment_status', 'product_kind')
order by t.typname, e.enumsortorder;

-- ─────────────────────────────────────────────────────────────────
-- Productos existentes (planes ya cargados)
-- ─────────────────────────────────────────────────────────────────
select id, code, name, is_recurring, billing_interval, price_cents, currency, is_online_sellable
from public.products
order by created_at;

-- ─────────────────────────────────────────────────────────────────
-- Suscripciones existentes
-- ─────────────────────────────────────────────────────────────────
select
  s.id,
  s.user_id,
  p.code as product_code,
  s.status,
  s.current_period_end,
  s.created_at
from public.subscriptions s
join public.products p on p.id = s.product_id
order by s.created_at desc
limit 20;

-- ─────────────────────────────────────────────────────────────────
-- RLS activo en cada tabla
-- ─────────────────────────────────────────────────────────────────
select relname, relrowsecurity
from pg_class
where relname in ('products', 'subscriptions', 'payments', 'profiles', 'payment_events')
  and relnamespace = 'public'::regnamespace;
