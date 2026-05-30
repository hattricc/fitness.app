-- Script 04: Insertar los 3 planes como productos.
-- Ejecutar DESPUÉS de 02_patch_enums.sql.
-- VERIFICAR antes: que no existan ya productos con code 'plan-basico' etc.
--   SELECT code FROM products WHERE code LIKE 'plan-%';

-- ─────────────────────────────────────────────────────────────────
-- AJUSTAR precios antes de ejecutar:
--   price_cents: precio en centavos (150 BOB = 15000 centavos)
-- ─────────────────────────────────────────────────────────────────

insert into public.products
  (code, name, description, kind, is_online_sellable, is_recurring, billing_interval, price_cents, currency)
values
  (
    'plan-basico',
    'Plan Básico',
    'Acceso a contenido básico: rutinas de inicio, nutrición base y seguimiento de progreso.',
    'online_course',
    true,          -- visible en el storefront
    true,          -- renovación mensual
    'monthly',
    15000,         -- 150.00 BOB — AJUSTAR
    'BOB'
  ),
  (
    'plan-avanzado',
    'Plan Avanzado',
    'Todo lo del Plan Básico más rutinas avanzadas, planes nutricionales personalizados y soporte prioritario.',
    'online_course',
    true,          -- visible en el storefront
    true,          -- renovación mensual
    'monthly',
    25000,         -- 250.00 BOB — AJUSTAR
    'BOB'
  ),
  (
    'plan-vitalicio',
    'Plan Vitalicio',
    'Acceso de por vida a todos los contenidos presentes y futuros. Pago único.',
    'online_course',
    false,         -- OCULTO por defecto; admin activa con is_online_sellable = true
    false,         -- no renueva
    'one_time',
    150000,        -- 1500.00 BOB — AJUSTAR
    'BOB'
  )
on conflict (code) do nothing;   -- evita duplicados si se corre dos veces

-- Verificar resultado
select id, code, name, price_cents, is_recurring, billing_interval, is_online_sellable
from public.products
where code like 'plan-%'
order by price_cents;
