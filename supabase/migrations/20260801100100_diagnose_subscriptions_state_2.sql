do $$
declare
    r record;
begin
    raise notice '--- products row for LSF4F-SUB-UNICA ---';
    for r in
        select code, name, is_recurring, billing_interval, price_cents, currency, is_online_sellable
        from public.products
        where code = 'LSF4F-SUB-UNICA'
    loop
        raise notice '% | % | recurring=% | interval=% | price=% % | sellable=%',
            r.code, r.name, r.is_recurring, r.billing_interval, r.price_cents, r.currency, r.is_online_sellable;
    end loop;

    raise notice '--- profiles with NO subscription row (names) ---';
    for r in
        select p.full_name, p.created_at
        from public.profiles p
        where not exists (select 1 from public.subscriptions s where s.user_id = p.id)
        order by p.created_at
        limit 40
    loop
        raise notice '% | created %', r.full_name, r.created_at;
    end loop;
end $$;
