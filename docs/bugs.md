# Bugs identificados

## Alta Prioridad
- [x] **Desktop video aspect ratio** — modal usaba 9:16 en todos los breakpoints. Fix: `paddingTop` responsive `{ xs: '177.77%', md: '56.25%' }` en `src/components/molecules/youtube-modal/styles.tsx`
- [x] **YouTube /live/ URLs no cargan** — regex en `extractVideoId` no tenía patrón para `/live/`. Fix: agregado `live\/` en `src/data/youtube-helper.ts`

## Media Prioridad
- [ ] Se pueden seleccionar textos de ejercicios/categorías (divs fondo negro) y actúan como botón — agregar `user-select: none` y `pointer-events: none` en texto
- [ ] el video en celular es un poco alta por demás a los videos de youtube, y el botón de cerrar no funciona correctamente, se apreta con el activar/desactivar subtítulos

## Baja Prioridad
- [ ] Splash screen — último botón ilegible: texto blanco sobre fondo blanco en hover
