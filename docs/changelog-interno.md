# Changelog Interno — Decisiones Técnicas
> Historial de cambios relevantes, decisiones de diseño y ajustes al plan original.
> Uso interno — no compartir con cliente.

---

## 2026-05-30 — Base de datos completada y tests verificados

### Ejecutado en Supabase
- `02_patch_enums.sql` — enums `subscription_status` y `billing_interval` parcheados (`monthly`, `past_due`, `cancelled`, etc.)
- `03_rls_helpers.sql` — funciones `has_active_plan(required_code)` y `get_active_billing_interval()` creadas
- `04_seed_plans.sql` — 3 productos insertados: `plan-basico` (15000 BOB), `plan-avanzado` (25000 BOB), `plan-vitalicio` (150000 BOB, oculto)
- `05_test_rls.sql` — Tests 1–7 ejecutados y confirmados

### Resultados de tests
- Test 6 confirmado: storefront muestra solo `plan-basico` y `plan-avanzado` (`plan-vitalicio` con `is_online_sellable = false` no aparece)
- RLS helpers funcionan correctamente por jerarquía de `products.code`
- Toggle vitalicio via `is_online_sellable` verificado

### Pendiente (se aplica cuando se creen tablas de contenido)
- Policy RLS en tablas de recursos usando `has_active_plan()` — template en `03_rls_helpers.sql`

---

## 2026-05-30 — Scripts de base de datos: v1 → v2

### Contexto
Se generó una primera versión de scripts SQL (`claude/db/`) basada en las historias de usuario del documento interno, sin tener acceso al esquema real de Supabase.

### V1 — Diseño inicial (basado en historias)
- `01_create_plans_table.sql` — creaba tabla `plans` (id, nombre, precio, tipo, activo)
- `02_create_subscriptions_table.sql` — creaba tabla `subscriptions` (id, user_id, **plan_id**, status, renews_at)
- `03_rls_policies.sql` — helpers con referencias a `plans.tipo` y `plans.nombre`
- `04_seed_plans.sql` — `INSERT INTO plans` con precios directos (no centavos)
- `05_test_rls.sql` — queries con columnas inexistentes (`plan_id`, `renews_at`)

### Problema encontrado
Al revisar el esquema real de Supabase, se encontró que:
- Tabla `plans` **no existe** y **no es necesaria** — `products` ya sirve como catálogo de planes
- Tabla `subscriptions` **ya existe** con esquema diferente:
  - Usa `product_id → products` (no `plan_id → plans`)
  - `renews_at` no existe — el equivalente es `current_period_end`
  - `status` es un enum `subscription_status` (no text libre)
  - Ya tiene RLS policy "users read own subscriptions"
- Tabla `products` tiene campos clave no contemplados:
  - `is_recurring` boolean (distingue mensual vs vitalicio)
  - `billing_interval` enum (`one_time` confirmado, `monthly` a verificar)
  - `is_online_sellable` boolean — funciona como toggle de visibilidad del plan vitalicio
  - `code` text — identificador único por producto (usado en helpers RLS)

### V2 — Scripts ajustados
| Script | Cambio |
|---|---|
| `01_verify_existing_schema.sql` | Renombrado; solo diagnóstico, no crea nada |
| `02_patch_enums.sql` | Agrega valores faltantes a enums existentes |
| `03_rls_helpers.sql` | Helpers usan `products.code` (`plan-basico`, `plan-avanzado`, `plan-vitalicio`) |
| `04_seed_plans.sql` | `INSERT INTO products`; precios en centavos; `on conflict (code) do nothing` |
| `05_test_rls.sql` | Columnas correctas: `current_period_end`, `product_id`, `code like 'plan-%'` |

### Decisión de diseño
`products` actúa como catálogo de planes. El toggle del Plan Vitalicio se implementa con `products.is_online_sellable = false`, sin afectar suscripciones activas existentes. La jerarquía de acceso se resuelve por `products.code` en los helpers RLS.

---

*Agregar entradas nuevas al inicio de este archivo con fecha y contexto.*
