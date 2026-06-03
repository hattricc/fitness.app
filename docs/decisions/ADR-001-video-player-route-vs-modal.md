# ADR-001: Reproductor de video como ruta propia vs Modal

**Estado:** Propuesto  
**Fecha:** 2026-06-03  
**Autor:** Raiden / Claude  

---

## Contexto

La app muestra videos de YouTube cuando el usuario hace click en un ejercicio o en "Empieza aquí" del home. La implementación actual usa un `<Modal>` de MUI con `zIndex: 10005` que flota sobre toda la aplicación.

### Problemas identificados

1. **YouTube se expande en mobile** — al abrir el embed, YouTube detecta espacio "sin límites" y expande su UI (controles, recomendaciones, info del canal) más allá del contenedor del modal.
2. **El botón X no es intuitivo** — requiere un botón de cierre custom que colisiona con los controles propios de YouTube (CC, subtítulos, volumen) en mobile.
3. **El botón atrás del header no aplica** — el modal tiene su propio mecanismo de cierre desconectado del router. El gesto de "atrás" del dispositivo o el `←` del header no cierran el video.
4. **El modal flota sobre el header y footer** — el video se abre "por encima" de toda la app, rompiendo el contexto de navegación.
5. **z-index wars** — resolver el problema con CSS crea más problemas (aspect ratio, tamaño, posicionamiento del botón) en un ciclo sin fin.

### Intentos previos de fix CSS

Se hicieron múltiples iteraciones intentando arreglar el modal con CSS:
- Cambiar `paddingTop` de `177.77%` (9:16) a `56.25%` (16:9) y back
- Hacer `width` responsivo con `min(90dvw, calc(Xdvh * ratio))`
- Mover el botón X a distintas posiciones (top-right, bottom-left, top-left)
- Agregar `playsinline=1` y quitar `allowFullScreen` al iframe
- Cambiar `maxHeight` de 90dvh → 85dvh → 80dvh → 70dvh

Resultado: el problema de YouTube expandiéndose no se resuelve desde CSS porque es estructural.

---

## Decisión

Reemplazar el `YouTubeModal` (overlay global) por una **ruta dedicada `/video`** que renderiza el video dentro del shell normal de la app.

### Cómo funciona

1. Click en ejercicio → `navigate('/video', { state: { url, title } })`
2. Se renderiza `VideoPage` dentro del layout con header + footer visibles
3. El `←` del header usa `window.history.back()` (ya existente) → cierra el video sin código extra
4. El gesto de "atrás" del dispositivo también funciona
5. YouTube queda contenido en un layout normal — no puede expandirse fuera del contenedor

### Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/app/Routes.tsx` | Agregar ruta `/video` |
| `src/app/pages/VideoPage.tsx` | **Crear página nueva** (no tocar archivos existentes) |
| `src/components/organisms/exercise-class/index.tsx` | `navigate('/video', state)` en lugar de `setSelectedVideo` + `YouTubeModal` |
| `src/app/home.tsx` | Igual |
| `src/components/organisms/header/index.tsx` | Agregar `/video` a `routeConfig` con título desde `location.state` |

### Política: no borrar código antiguo

`YouTubeModal` y sus estilos (`src/components/molecules/youtube-modal/`) **se mantienen intactos**. Solo se desconectan de los flujos de ejercicio/home al actualizar los callers. Razones:

- Menor riesgo de regresión durante la transición
- El componente puede tener otros usos futuros (ej: preview rápido sin navegar)
- La limpieza (borrado) es una tarea separada post-validación en producción

### Diseño de VideoPage

```
┌─────────────────────────────┐
│  ←  Título del video        │  ← Header existente (sin cambios)
├─────────────────────────────┤
│                             │
│   ┌─────────────────────┐   │
│   │                     │   │
│   │    iframe 16:9      │   │  full-width mobile, max-width 900px desktop
│   │                     │   │
│   └─────────────────────┘   │
│                             │
│   Nombre del video          │
│   Canal                     │
│                             │
└─────────────────────────────┘
│  footer navigation (fixed)  │
```

- `aspect-ratio: 16/9` nativo en CSS — sin padding-top tricks
- Mobile: `width: 100%`
- Desktop: centrado, `max-width: 900px`
- Fondo `#1B1B1B` consistente con app
- Si `location.state` es null (refresh directo en `/video`) → redirect a `/`

---

## Alternativas consideradas

### A. Seguir ajustando el Modal con CSS
**Rechazado.** El problema raíz es que YouTube en mobile expande su UI cuando detecta que el iframe tiene espacio sin constrains reales de layout. Ningún valor de `dvh`/`dvw` ni posicionamiento del botón resuelve esto desde CSS.

### B. Modal dentro del layout de página (no full-app)
Usar un `Dialog` o `Drawer` de MUI anclado al contenedor de la página en lugar del body. Requiere restructurar el layout con `position: relative` en el contenedor padre y ajustar z-indexes. Más complejo y frágil que una ruta.

### C. Ruta `/video/:videoId` con ID en la URL
Similar a la solución elegida pero con el videoId en el path. Requiere lógica extra para mapear ID → URL completa. Se optó por pasar la URL via `router state` para simplicidad.

---

## Consecuencias

### Positivas
- El `←` del header y el gesto de "atrás" del dispositivo cierran el video de forma nativa
- YouTube no puede escapar del contenedor (layout normal)
- Se elimina la dependencia del `YouTubeModal` en estos flujos
- Mejor UX: el usuario sabe dónde está en la app
- Título del video aparece en el header de forma automática

### Negativas / Riesgos
- La URL `/video` sin state falla si el usuario hace refresh → mitigado con redirect a `/`
- La URL no es única por video (no se puede compartir un link directo al video) → aceptable para el caso de uso actual
- `YouTubeModal` queda desconectado de los flujos principales pero **no se borra** — candidato a eliminar en limpieza futura post-validación en producción

---

## Referencias
- `src/components/molecules/youtube-modal/styles.tsx` — historial de intentos CSS
- `docs/bugs.md` — bugs relacionados al modal de video
- `docs/changelog-interno.md` — contexto del proyecto
