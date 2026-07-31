-- Diagnóstico de solo lectura (no modifica schema). Reveló que public.subscriptions
-- ya existía con columnas id/user_id/product_id/status/started_at/current_period_start/
-- current_period_end/canceled_at/metadata/created_at/updated_at — no las columnas
-- plan/start_date/end_date que asumía la migración 20260730140500 (ver ese archivo).
-- Se deja aplicada como registro histórico de la investigación.

do $$
declare
    r record;
    enum_vals text;
begin
    raise notice '--- columns of public.subscriptions ---';
    for r in
        select column_name, data_type, udt_name, is_nullable, column_default
        from information_schema.columns
        where table_schema = 'public' and table_name = 'subscriptions'
        order by ordinal_position
    loop
        raise notice '%: % (udt=%) nullable=% default=%',
            r.column_name, r.data_type, r.udt_name, r.is_nullable, r.column_default;
    end loop;

    raise notice '--- enum labels for subscription_status ---';
    select string_agg(enumlabel, ', ') into enum_vals
    from pg_enum
    where enumtypid = 'public.subscription_status'::regtype;
    raise notice '%', coalesce(enum_vals, '(type not found)');

    raise notice '--- columns of public.profiles ---';
    for r in
        select column_name, data_type, udt_name, is_nullable
        from information_schema.columns
        where table_schema = 'public' and table_name = 'profiles'
        order by ordinal_position
    loop
        raise notice '%: % (udt=%) nullable=%',
            r.column_name, r.data_type, r.udt_name, r.is_nullable;
    end loop;
end $$;
