# Migraciones

Este proyecto no tenía `supabase/migrations/` versionado hasta 2026-07-30 — el schema vivía
solo en el proyecto remoto de Supabase, gestionado a mano desde el dashboard.

## Baseline pendiente

Falta capturar un baseline real del schema existente (`profiles`, `payments`, `payment_events`)
corriendo `supabase db pull` con Docker Desktop activo. No se generó a mano para evitar
declarar un `CREATE TABLE` adivinado que no coincida con la DB real y cause drift falso.

Para completarlo:
1. Abrir Docker Desktop.
2. `supabase link --project-ref lvfhovnaicppjqevsrvp` (ya hecho en este repo).
3. `supabase db pull` — genera la migración de baseline con el schema real.
4. `supabase db diff` no debería mostrar cambios después de esto.

## Migraciones nuevas a partir de acá

Toda migración nueva (tabla `subscriptions`, columna `phone`, etc.) es aditiva — no declara
ni modifica las tablas existentes, así que no depende de tener el baseline capturado primero
para ser segura de aplicar.
