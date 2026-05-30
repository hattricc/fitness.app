-- Script 02: Agregar valores faltantes a enums existentes (si no existen ya).
-- Ejecutar DESPUÉS de verificar con 01_verify_existing_schema.sql.
-- Cada ALTER TYPE es idempotente-safe: falla silencioso si el valor ya existe.

-- ─────────────────────────────────────────────────────────────────
-- subscription_status: asegurar todos los estados del checklist
-- ─────────────────────────────────────────────────────────────────
-- Verificar primero con script 01. Agregar solo los que falten:

do $$
begin
  -- 'active' probablemente ya existe (es el default)
  begin
    alter type subscription_status add value 'active';
  exception when duplicate_object then null;
  end;

  begin
    alter type subscription_status add value 'pending';
  exception when duplicate_object then null;
  end;

  begin
    alter type subscription_status add value 'past_due';
  exception when duplicate_object then null;
  end;

  begin
    alter type subscription_status add value 'cancelled';
  exception when duplicate_object then null;
  end;
end;
$$;

-- ─────────────────────────────────────────────────────────────────
-- billing_interval: asegurar 'monthly' existe para planes mensuales
-- ─────────────────────────────────────────────────────────────────
do $$
begin
  begin
    alter type billing_interval add value 'monthly';
  exception when duplicate_object then null;
  end;

  -- 'one_time' ya existe (se vio en el schema)
end;
$$;

-- Verificar resultado
select typname, enumlabel
from pg_type t
join pg_enum e on e.enumtypid = t.oid
where t.typname in ('subscription_status', 'billing_interval')
order by t.typname, e.enumsortorder;
