# Pasos pendientes — Admin: estudiantes y suscripciones

> Generado: 2026-07-30
> Completa la ejecución de [PLAN-ACCION-admin-suscripciones.md](./PLAN-ACCION-admin-suscripciones.md) (Fases 0-3, código ya escrito y verificado con `pnpm test` / `pnpm exec tsc --noEmit` / `pnpm run build`).
> Proyecto Supabase: `LuisSuarezf4f` (ref `lvfhovnaicppjqevsrvp`), ya linkeado en este repo.

Correr los pasos **en este orden exacto** — el orden importa, saltarlo rompe producción (ver nota en Paso 2).

---

## Paso 1 — Aplicar migraciones a la base de datos real ✅ HECHO (2026-07-30)

Confirmado con `supabase migration list`: ambas migraciones ya están aplicadas en remoto.
Seguir directo al Paso 2.

Crea la tabla `subscriptions` y la columna `profiles.phone`. Son migraciones aditivas —
no tocan ni borran nada que ya exista.

```bash
supabase db push
```

**Verificar que funcionó:**
```bash
supabase migration list
```
Las columnas `Local` y `Remote` deben mostrar el mismo timestamp para cada migración
(`20260730140500`, `20260730140600`). Si `Remote` está vacío en alguna fila, no se aplicó.

> Nota: `supabase db diff` NO sirve acá — necesita Docker Desktop corriendo para crear una
> shadow database, y no está disponible en esta máquina. `migration list` compara contra el
> proyecto remoto directamente, sin Docker.

---

## Paso 2 — Deployar la función `ensure-profile` actualizada ✅ HECHO (2026-07-31)

⚠️ **No saltarse el Paso 1 antes de este.** `ensure-profile` ahora lee/escribe la columna
`profiles.phone`. Si se deploya sin que la columna exista, se rompe la creación/actualización
de perfil para **todos los usuarios**, porque esta función se llama automáticamente en cada
login (`AuthProvider` la dispara en cada sesión).

```bash
supabase functions deploy ensure-profile
```

**Verificar:** loguearse en la app (cualquier usuario) y confirmar que no tira error 500 —
revisar logs en https://supabase.com/dashboard/project/lvfhovnaicppjqevsrvp/functions

---

## Paso 3 — Asignar rol admin a tu cuenta

`admin-list-students` ya está deployada, pero rechaza (401) a cualquiera que no tenga
`role = 'admin'` en `profiles`. Necesitás tu `user_id` (UUID) de Supabase Auth.

**3a. Buscar tu UUID** (dashboard → Authentication → Users, o SQL Editor):
```sql
SELECT id, email FROM auth.users WHERE email = 'tu-email@ejemplo.com';
```

**3b. Asignar el rol** (SQL Editor del dashboard, o `psql`):
```sql
UPDATE profiles SET role = 'admin' WHERE id = '<uuid-del-paso-3a>';
```

**Verificar:**
```sql
SELECT role FROM profiles WHERE id = '<uuid>';
-- debe devolver: admin
```

---

## Paso 4 — Probar el panel completo

1. Entrar a la app logueado con la cuenta que ahora tiene `role='admin'`.
2. Ir a `/panel/estudiantes` (⚠️ **no** `/admin/estudiantes` — ese path está tomado por
   Decap CMS a nivel Netlify, ver nota abajo).
3. Debería cargar la tabla (vacía de suscripciones hasta que se creen filas en `subscriptions`,
   pero con nombre/teléfono de cada perfil existente).
4. Con una cuenta SIN rol admin, `/panel/estudiantes` debe redirigir a `/`.

Si algo fallara: revisar logs de la función en el dashboard (link del Paso 2) — casi siempre
es el JWT expirado o el rol mal escrito (`'Admin'` con mayúscula no matchea `'admin'`).

> **Por qué se movió de `/admin/estudiantes` a `/panel/estudiantes`:** `netlify.toml` y
> `public/_redirects` ya tenían `/admin/*` → `/admin/index.html` (Decap CMS) como redirect
> estático con status 200. Netlify resuelve esto ANTES de que la SPA cargue, así que
> cualquier ruta bajo `/admin/*` — sin importar lo que diga React Router — siempre sirve el
> CMS. Por eso entrar con una cuenta sin rol admin también caía en Decap: nunca llegaba al
> código de `AdminRoute` para redirigir.

---

---

## Corrección 2026-07-31 — schema real de suscripciones ya existía

`admin-list-students` tiraba `column subscriptions_1.plan does not exist`. Razón: la
tabla `public.subscriptions` **ya existía en producción desde 2026-05-30** con un schema
real y mejor (`product_id → products`, `status` enum, `current_period_end`), documentado en
`claude/db/01_verify_existing_schema.sql` y `docs/changelog-interno.md` — que no había leído
al armar el roadmap original (verifiqué contra `supabase/functions/*.ts`, no contra la DB en
vivo, porque no tenía Docker en ese momento).

Se corrigió:
- `supabase/functions/admin-list-students/index.ts` reescrita para usar `subscriptions.product_id → products` (plan viene de `products.name`) y `current_period_end` (no `end_date` propio). Redeployada.
- `20260730140500_create_subscriptions.sql` marcada como no-op documentado (la tabla ya existía, el `CREATE TABLE IF NOT EXISTS` no hizo nada).
- Estados que no son `active`/`pending` (`canceled`, `cancelled`, `past_due`, `incomplete`) se muestran directo como "vencido" en el panel, sin importar la fecha.

No hace falta ningún paso manual nuevo — ya está deployado. Si `/panel/estudiantes` sigue
fallando después de esto, revisar el Network tab de nuevo y pasar el JSON de error.

---

## Después de esto — qué queda del roadmap

Fases 0-3 quedan cerradas. Lo que sigue (Fase 4: activar/desactivar/cambiar plan, Fase 5:
WhatsApp) está solo esbozado en el plan de acción — no tiene tareas ni AC desarrollados
todavía. Para bajarlas a detalle, correr `/propose-action-plan` de nuevo eligiendo esas fases
como alcance inmediato.
