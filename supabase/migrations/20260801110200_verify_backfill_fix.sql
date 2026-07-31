do $$
declare
    r record;
begin
    raise notice '--- backfilled subscriptions by final status ---';
    for r in
        select s.status, count(*) as n
        from public.subscriptions s
        where s.metadata->>'reason' like 'backfill 2026-08-01%'
        group by s.status
        order by s.status
    loop
        raise notice '%: %', r.status, r.n;
    end loop;
end $$;
