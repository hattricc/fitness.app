-- Completa claude/db/06_migrate_existing_users_vitalicio.sql para los perfiles creados
-- después de esa migración (2026-05-30) que nunca recibieron una fila en subscriptions.
-- Misma lógica, idempotente (on conflict do nothing, where not exists).

do $$
declare
  v_pid_vitalicio uuid;
  v_count         int;
begin
  select id into v_pid_vitalicio
  from public.products
  where code = 'plan-vitalicio';

  if v_pid_vitalicio is null then
    raise exception 'plan-vitalicio no encontrado en products.';
  end if;

  insert into public.subscriptions (user_id, product_id, status, started_at, current_period_start, current_period_end, metadata)
  select
    p.id,
    v_pid_vitalicio,
    'active',
    p.created_at,
    p.created_at,
    null,
    '{"migrated": true, "reason": "backfill 2026-08-01: profile created after original vitalicio migration"}'::jsonb
  from public.profiles p
  where not exists (
    select 1 from public.subscriptions s
    where s.user_id = p.id
  )
  on conflict do nothing;

  get diagnostics v_count = row_count;
  raise notice 'Suscripciones vitalicio insertadas: %', v_count;
end;
$$;
