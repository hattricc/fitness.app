do $$
declare
    r record;
begin
    raise notice '--- payments status for the 32 backfilled users ---';
    for r in
        select
            p.full_name,
            s.id as sub_id,
            coalesce(pay.status::text, '(sin fila en payments)') as payment_status,
            pay.created_at as payment_date
        from public.subscriptions s
        join public.profiles p on p.id = s.user_id
        left join lateral (
            select pm.*
            from public.payments pm
            where pm.user_id = s.user_id
            order by pm.created_at desc
            limit 1
        ) pay on true
        where s.metadata->>'reason' like 'backfill 2026-08-01%'
        order by p.full_name
    loop
        raise notice '% | payment_status=% | payment_date=%', r.full_name, r.payment_status, r.payment_date;
    end loop;
end $$;
