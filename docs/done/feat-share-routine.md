Se desea tener una opción adicional a guardar rutina, que sea compartir rutina que actualmente se ha realizado sin guardar. El compartir debe ser un link get con parámetros que sean leíbles y no lo haga muy largo la url, con la que se pueda mandar ejercicios seleccionados. Al usar ese link, se debe abrir "Arma tu propia rutina" y los ejercicios seleccionados, listos para poder iniciar la rutina o guardarla.
También se aprovecha este feature para ajustar el botón comenzar:
- Al botón comenzar agregarle un ícono adentro
- Al lado de agregar, un botón menos ancho (menor importancia) para poder guardar la rutina sin necesidad de entrar
- Al lado del botón de guardar, un botón de compartir que sería esta opción nueva.

---

## Estado
- [x] Implementado — pendiente probar en navegador (tsc --noEmit ok)

## Plan

**1. Encode/decode compacto para URL**
- Nuevo util `src/utils/routineShareLink.ts`
- Encode: toma `selectedList` (Map de `CustomRoutineExerciseRef`) → serializa solo pares `moduleId:exerciseId` → join por `,` → `?ex=cat-empujes:ex-empujes-001,cat-jalones:ex-jalones-001`
- Decode: parsea el string → array de pares `{moduleId, exerciseId}`
- No serializa nombre/imagen/video (ya está en el JSON del workout) — URL corta

**2. Rehydrate en el builder al abrir el link**
- `RoutineBuilderPage.tsx`: leer `useSearchParams` en el mount
- Si tiene `?ex=`, decodificar pares → buscar cada exercise en `workout.modules` → poblar `selected` Map inicial (mismo shape que arma `toggleExercise`)

**3. Generar link de compartir**
- Función `buildShareUrl(workoutId, selectedList)` → `${origin}/builder/${id}?ex=...`
- Acción del botón: `navigator.share` (mobile, si está disponible) con fallback `navigator.clipboard.writeText` + feedback (snackbar/alert simple)

**4. UI botón "Comenzar" (bottom bar, `RoutineBuilderPage.tsx` líneas ~129-139)**
- Ícono dentro del "Comenzar" (ej. `PlayArrow`)
- Botón "Guardar" más angosto al lado (ícono `Save`), guarda `selectedList` directo sin entrar a la story — reusa el patrón de `showSave`/`TextField` que ya existe en `StoryViewerPage.tsx` (líneas ~88-108), pero inline en el builder
- Botón "Compartir" más angosto al lado del guardar (ícono `Share`)
- Layout: `Stack direction="row"` — Comenzar (flex:1) + Guardar (icon button) + Compartir (icon button)

**5. Reusar `useCustomRoutines().saveRoutine`** ya existente — ningún cambio en el hook necesario

**Archivos tocados:**
- `src/utils/routineShareLink.ts` (nuevo)
- `src/app/pages/RoutineBuilderPage.tsx` (bottom bar + parseo de query param)

## Todo list
- [x] Crear util `routineShareLink.ts` (encode/decode `moduleId:exerciseId` en query param)
- [x] `RoutineBuilderPage`: leer `?ex=` en el mount, rehydrate `selected` Map vía lookup en `workout.modules`
- [x] Agregar función `buildShareUrl` + acción compartir (`navigator.share` / clipboard fallback)
- [x] Bottom bar: ícono en "Comenzar", botón "Guardar" inline (reusa `saveRoutine`), botón "Compartir"