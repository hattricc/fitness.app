  -- Script 05: Tests de RLS y helpers.
  -- Ejecutar después de todos los scripts anteriores.
  -- Usar Supabase SQL Editor con "Run as role" para simular usuarios.

  -- ─────────────────────────────────────────────────────────────────
  -- SETUP: insertar suscripciones de prueba (ejecutar como service role)
  -- Reemplazar UUIDs con user_ids reales de auth.users
  -- ─────────────────────────────────────────────────────────────────

  do $$
  declare
    v_uid_basico    uuid := '181fd0d1-d164-4472-9e6a-221019b82549';
    v_uid_avanzado  uuid := '5aba24e8-d601-46f7-b73c-183489b2dd1d';
    v_uid_vitalicio uuid := '7d31b8af-dab9-4594-b22c-d55d836f691b';
    v_pid_basico    uuid;
    v_pid_avanzado  uuid;
    v_pid_vitalicio uuid;
  begin
    select id into v_pid_basico    from public.products where code = 'plan-basico';
    select id into v_pid_avanzado  from public.products where code = 'plan-avanzado';
    select id into v_pid_vitalicio from public.products where code = 'plan-vitalicio';

    -- Crear profile ficticio para usuario vitalicio si no existe
    -- (FK subscriptions.user_id → profiles.id, no auth.users)
    insert into public.profiles (id, full_name, role)
    values (v_uid_vitalicio, 'Test Vitalicio', 'user')
    on conflict (id) do nothing;

    insert into public.subscriptions (user_id, product_id, status, current_period_start, current_period_end)
    values
      (v_uid_basico,    v_pid_basico,    'active', now(), now() + interval '30 days'),
      (v_uid_avanzado,  v_pid_avanzado,  'active', now(), now() + interval '30 days'),
      (v_uid_vitalicio, v_pid_vitalicio, 'active', now(), null);
  end;
  $$;


  -- ─────────────────────────────────────────────────────────────────
  -- TEST 1: usuario ve solo su propia suscripción
  -- Ejecutar con JWT del usuario básico → debe ver 1 fila
  -- ─────────────────────────────────────────────────────────────────
  select s.id, p.code, s.status, s.current_period_end
  from public.subscriptions s
  join public.products p on p.id = s.product_id;

  -- ─────────────────────────────────────────────────────────────────
  -- TEST 2: helpers de acceso (ejecutar como usuario básico)
  -- ─────────────────────────────────────────────────────────────────
  select public.has_active_plan('plan-basico')    as acceso_basico;    -- true
  select public.has_active_plan('plan-avanzado')  as acceso_avanzado;  -- false
  select public.get_active_billing_interval()     as intervalo;        -- 'monthly'

  -- ─────────────────────────────────────────────────────────────────
  -- TEST 3: usuario avanzado
  -- acceso_basico → true, acceso_avanzado → true, intervalo → 'monthly'
  -- ─────────────────────────────────────────────────────────────────
  begin;
    set local role authenticated;
    set local "request.jwt.claims" to '{"sub":"5aba24e8-d601-46f7-b73c-183489b2dd1d","role":"authenticated"}';

    select s.id, p.code, s.status, s.current_period_end
    from public.subscriptions s
    join public.products p on p.id = s.product_id;  -- debe ver 1 fila (avanzado)

    select public.has_active_plan('plan-basico')    as acceso_basico;    -- true
    select public.has_active_plan('plan-avanzado')  as acceso_avanzado;  -- true
    select public.get_active_billing_interval()     as intervalo;        -- 'monthly'
  rollback;

  -- ─────────────────────────────────────────────────────────────────
  -- TEST 4: usuario vitalicio
  -- acceso_basico → true, acceso_avanzado → true, intervalo → 'one_time'
  -- ─────────────────────────────────────────────────────────────────
  begin;
    set local role authenticated;
    set local "request.jwt.claims" to '{"sub":"c9f0f89b-1c4d-4e3a-8b2c-1a2b3c4d5e6f","role":"authenticated"}';

    select s.id, p.code, s.status, s.current_period_end
    from public.subscriptions s
    join public.products p on p.id = s.product_id;  -- debe ver 1 fila (vitalicio)

    select public.has_active_plan('plan-basico')    as acceso_basico;    -- true
    select public.has_active_plan('plan-avanzado')  as acceso_avanzado;  -- true
    select public.get_active_billing_interval()     as intervalo;        -- 'one_time'
  rollback;

  -- ─────────────────────────────────────────────────────────────────
  -- TEST 5: usuario sin suscripción activa
  -- subscriptions → 0 filas, has_active_plan → false
  -- REEMPLAZAR uuid con un user_id real que NO tenga suscripción
  -- ─────────────────────────────────────────────────────────────────
  begin;
    set local role authenticated;
    set local "request.jwt.claims" to '{"sub":"5ebe1393-bb90-46fd-8c9e-1d4a48f9e292","role":"authenticated"}';

    select count(*) as filas_visibles
    from public.subscriptions;                                           -- debe ser 0

    select public.has_active_plan('plan-basico')   as acceso_basico;    -- false
    select public.has_active_plan('plan-avanzado') as acceso_avanzado;  -- false
    select public.get_active_billing_interval()    as intervalo;        -- null
  rollback;

  -- ─────────────────────────────────────────────────────────────────
  -- TEST 6: plan vitalicio oculto en storefront
  -- Ejecutar como anon o authenticated sin importar plan
  -- ─────────────────────────────────────────────────────────────────
  select code, name, price_cents, billing_interval
  from public.products
  where is_online_sellable = true
    and code like 'plan-%';
  -- Esperado: solo plan-basico y plan-avanzado

  -- ─────────────────────────────────────────────────────────────────
  -- TEST 7: service role ve todo (para Edge Functions)
  -- ─────────────────────────────────────────────────────────────────
  select s.user_id, p.code, s.status, s.current_period_end
  from public.subscriptions s
  join public.products p on p.id = s.product_id
  order by s.created_at desc;
