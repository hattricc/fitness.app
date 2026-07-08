# Bugs identificados

## Alta Prioridad
- [x] **Logs error pagos Livees** — a veces el pago de la suscripción falla, pero no hay logs suficientes para hacer un buen debug en netlify ni supabase. Necesitamos hacer una mejora de logs para mostrar en los logs — Fix: prefijos `[create-livees-payment]`/`[confirm-livees-payment]` + contexto (invno/order_id/payment_id/user_id) en cada log, stack traces preservados en catches genéricos, error de insert en `payment_events` ya no se silencia. Ver `supabase/functions/create-livees-payment/index.ts` y `supabase/functions/confirm-livees-payment/index.ts`
- [x] **Poder cambiar el video de bienvenida**: El video de "Empieza aquí" del home debe poder ser cambiado por el administrador Netlify Decap, la url del video y el texto a presentar. Debe ser una colección diferente a cursos — Fix: `src/data/welcome-video.json` (url + buttonText), colección `welcomeVideo` en `public/admin/config.yml`, `home.tsx` lee del JSON
- [x] **Desktop video aspect ratio** — modal usaba 9:16 en todos los breakpoints. Fix: `paddingTop` responsive `{ xs: '177.77%', md: '56.25%' }` en `src/components/molecules/youtube-modal/styles.tsx`
- [x] **YouTube /live/ URLs no cargan** — regex en `extractVideoId` no tenía patrón para `/live/`. Fix: agregado `live\/` en `src/data/youtube-helper.ts`

## Media Prioridad
- [x] **Desktop tarjetas cursos**: Los cursos en el home en la vista desktop se ven chiquitos, no tienen un padding correcto visualmente y cada uno tiene una altura diferente según el texto — Fix: grid usa `gap` responsive + `alignItems: stretch`, cards con `height: 100%` + `minHeight: 120`, padding uniforme en `ExerciseCard`
- [x] **Selección de texto en ejercicios/categorías** — Fix: `userSelect: 'none'` en `src/components/molecules/exercise-item/styles.tsx` (createCardStyles) y `src/components/molecules/category-filter/index.tsx` (StyledToggleButtonGroup)
- [x] **Video móvil demasiado alto + botón cerrar colisiona con subtítulos** — Resuelto por ADR-001: VideoPage reemplaza el modal. El video vive dentro del layout normal (sin overlay), cierre via `←` del header. Ver `src/app/pages/VideoPage.tsx`

## Baja Prioridad

