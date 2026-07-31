-- Corrige el backfill de 20260801100200: se dio status='active' a los 32 usuarios sin
-- fila previa en subscriptions, sin chequear si realmente pagaron. Mantiene el plan
-- (plan-vitalicio) pero deja en 'canceled' a quienes no tienen payments.status='paid'.

do $$
declare
    v_count int;
begin
    update public.subscriptions s
    set status = 'canceled',
        canceled_at = now(),
        updated_at = now()
    where s.metadata->>'reason' like 'backfill 2026-08-01%'
      and not exists (
          select 1
          from public.payments pm
          where pm.user_id = s.user_id
            and pm.status = 'paid'
      );

    get diagnostics v_count = row_count;
    raise notice 'Suscripciones pasadas a canceled (sin pago confirmado): %', v_count;
end;
$$;
