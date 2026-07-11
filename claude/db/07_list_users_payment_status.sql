-- Script 07: Lista de usuarios con nombre completo, correo, tipo de suscripción
-- y estado de su último pago (pending / paid / failed).
-- Incluye estudiantes con suscripción confirmada manualmente (sin registro en payments)
-- y columna "observacion" para llenar a mano en esos casos.
-- Ejecutar en el SQL Editor de Supabase (usa auth.users, requiere rol admin/postgres).

select
  pr.full_name                                    as nombre_completo,
  u.email                                          as correo,
  coalesce(pd_pay.name, pd_sub.name)               as tipo_suscripcion,
  coalesce(pay.status::text, case when sub.id is not null then 'confirmado manualmente' end) as estado_pago,
  coalesce(pay.created_at, sub.started_at, sub.created_at) as fecha,
  case
    when pay.id is null and sub.id is not null
      then 'Pago confirmado manualmente, sin registro en payments'
    else ''
  end                                               as observacion
from auth.users u
join public.profiles pr on pr.id = u.id
left join lateral (
  select p.*
  from public.payments p
  where p.user_id = u.id
  order by p.created_at desc
  limit 1
) pay on true
left join lateral (
  select s.*
  from public.subscriptions s
  where s.user_id = u.id
  order by s.started_at desc nulls last, s.created_at desc
  limit 1
) sub on true
left join public.products pd_pay on pd_pay.id = pay.product_id
left join public.products pd_sub on pd_sub.id = sub.product_id
order by pr.full_name;

-- Variante: solo usuarios con pago pending, paid o confirmado manualmente
-- where pay.status in ('pending', 'paid') or (pay.id is null and sub.id is not null)
