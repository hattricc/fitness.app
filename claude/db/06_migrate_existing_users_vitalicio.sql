-- Script 06: Migración — asignar Plan Vitalicio a todos los usuarios existentes.
-- Contexto: todos los usuarios en public.profiles al momento del lanzamiento
-- del sistema de suscripciones ya habían pagado acceso vitalicio previamente.
-- La tabla subscriptions estaba vacía; este script la inicializa.
--
-- Ejecutar como service role (bypasea RLS).
-- Idempotente: on conflict do nothing evita duplicados si se corre dos veces.

do $$
declare
  v_pid_vitalicio uuid;
  v_count         int;
begin
  -- Obtener ID del plan vitalicio
  select id into v_pid_vitalicio
  from public.products
  where code = 'plan-vitalicio';

  if v_pid_vitalicio is null then
    raise exception 'plan-vitalicio no encontrado en products. Ejecutar 04_seed_plans.sql primero.';
  end if;

  -- Insertar suscripción vitalicia para cada perfil sin suscripción activa
  insert into public.subscriptions (user_id, product_id, status, started_at, current_period_start, current_period_end, metadata)
  select
    p.id,
    v_pid_vitalicio,
    'active',
    p.created_at,   -- started_at = cuando se creó el perfil
    p.created_at,
    null,           -- vitalicio no tiene fecha de vencimiento
    '{"migrated": true, "reason": "pre-existing user at subscription system launch"}'::jsonb
  from public.profiles p
  where not exists (
    select 1 from public.subscriptions s
    where s.user_id = p.id
      and s.status = 'active'
  )
  on conflict do nothing;

  get diagnostics v_count = row_count;
  raise notice 'Suscripciones vitalicio insertadas: %', v_count;
end;
$$;

-- Verificar resultado
select
  p.full_name,
  p.id as user_id,
  pr.code as plan,
  s.status,
  s.started_at,
  (s.metadata->>'migrated')::boolean as migrado
from public.subscriptions s
join public.profiles p  on p.id  = s.user_id
join public.products pr on pr.id = s.product_id
order by s.started_at;
