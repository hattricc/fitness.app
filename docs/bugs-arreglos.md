# Bugs identificados

## Alta Prioridad
- [x] **Poder cambiar el video de bienvenida** — Fix: `src/data/welcome-video.json` (url + buttonText), colección `welcomeVideo` en `public/admin/config.yml`, `home.tsx` lee del JSON
- [x] **Desktop video aspect ratio** — modal usaba 9:16 en todos los breakpoints. Fix: `paddingTop` responsive `{ xs: '177.77%', md: '56.25%' }` en `src/components/molecules/youtube-modal/styles.tsx`
- [x] **YouTube /live/ URLs no cargan** — regex en `extractVideoId` no tenía patrón para `/live/`. Fix: agregado `live\/` en `src/data/youtube-helper.ts`

## Media Prioridad
- [x] **Desktop tarjetas cursos** — Fix: grid usa `gap` responsive + `alignItems: stretch`, cards con `height: 100%` + `minHeight: 120`, padding uniforme en `ExerciseCard`
- [x] **Selección de texto en ejercicios/categorías** — Fix: `userSelect: 'none'` en `src/components/molecules/exercise-item/styles.tsx` (createCardStyles) y `src/components/molecules/category-filter/index.tsx` (StyledToggleButtonGroup)
- [x] **Video móvil demasiado alto + botón cerrar colisiona con subtítulos** — Resuelto por ADR-001: VideoPage reemplaza el modal. El video vive dentro del layout normal (sin overlay), cierre via `←` del header. Ver `src/app/pages/VideoPage.tsx`

## Baja Prioridad

