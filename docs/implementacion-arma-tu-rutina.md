# Tutorial: "Arma tu propia rutina"

Plan completo: `C:\Users\usuario\.claude\plans\toasty-wobbling-fairy.md`

Cada paso indica archivo, ubicación, y bloque exacto a pegar. No reescribir el archivo entero — solo insertar/modificar lo indicado.

---

## Paso 1 — Tipos: `src/types/course.ts`

Dentro de `interface Exercise { ... }`, antes del `}` de cierre, agregar:

```ts
    mediaType?: 'image' | 'video';
    imageUrl?: string;
    videoUrl?: string;
```

Dentro de `interface Course { ... }`, antes del `}` de cierre, agregar:

```ts
    builder?: boolean;
```

---

## Paso 2 — Tipo nuevo: `src/types/customRoutine.ts` (archivo nuevo)

Crear archivo completo con este contenido:

```ts
export interface CustomRoutineExerciseRef {
    exerciseId: string;
    moduleId: string;
    name: string;
    mediaType: 'image' | 'video';
    imageUrl?: string;
    videoUrl?: string;
    url?: string;
}

export interface CustomRoutine {
    id: string;
    name: string;
    createdAt: number;
    exercises: CustomRoutineExerciseRef[];
}
```

---

## Paso 3 — Data: `src/data/home.json`

3a. En el objeto con `"id": "category-002"` (Gimnasio), agregar la propiedad `"visible": false` junto a las demás propiedades de top-level (ej. después de `"locked": true,`):

```json
        "visible": false,
```

3b. Al final del array (después del `}` que cierra `category-002`, antes del `]` final), agregar `,` y este nuevo objeto `Course`:

```json
    {
        "id": "category-003",
        "name": "Arma tu propia rutina",
        "title": "Arma tu propia rutina",
        "showTitle": true,
        "showDescription": true,
        "showInfo": true,
        "locked": false,
        "builder": true,
        "description": "Elige tus ejercicios favoritos por categoría y arma tu rutina personalizada",
        "infoDescription": "Selecciona ejercicios de cada categoría y visualízalos como una historia",
        "imageUrl": "./images/welcome/bienvenida-3.jpg",
        "category": "Rutinas",
        "modules": [
            {
                "id": "cat-empujes",
                "category": "Empujes",
                "subcategory": "General",
                "duration": "",
                "name": "Empujes",
                "exercises": [
                    {
                        "id": "ex-empujes-001",
                        "name": "Empuje con barra en banca plana",
                        "mediaType": "image",
                        "imageUrl": "/images/exercises/arma-tu-rutina/empujes/empuje-barra-banca.jpg",
                        "locked": false
                    }
                ]
            },
            {
                "id": "cat-jalones",
                "category": "Jalones",
                "subcategory": "General",
                "duration": "",
                "name": "Jalones",
                "exercises": [
                    {
                        "id": "ex-jalones-001",
                        "name": "Jalón vertical con cable",
                        "mediaType": "image",
                        "imageUrl": "/images/exercises/arma-tu-rutina/jalones/jalon-vertical-cable.jpg",
                        "locked": false
                    }
                ]
            },
            {
                "id": "cat-piernas",
                "category": "Piernas",
                "subcategory": "General",
                "duration": "",
                "name": "Piernas",
                "exercises": [
                    {
                        "id": "ex-piernas-001",
                        "name": "Sentadilla en barra guiada",
                        "mediaType": "image",
                        "imageUrl": "/images/exercises/arma-tu-rutina/piernas/sentadilla-barra-guiada.jpg",
                        "locked": false
                    }
                ]
            },
            {
                "id": "cat-complementos",
                "category": "Complementos",
                "subcategory": "General",
                "duration": "",
                "name": "Complementos",
                "exercises": [
                    {
                        "id": "ex-complementos-001",
                        "name": "Curl de bíceps con mancuernas",
                        "mediaType": "image",
                        "imageUrl": "/images/exercises/arma-tu-rutina/complementos/curl-biceps-mancuernas.jpg",
                        "locked": false
                    }
                ]
            },
            {
                "id": "cat-estabilizadores",
                "category": "Estabilizadores",
                "subcategory": "General",
                "duration": "",
                "name": "Estabilizadores",
                "exercises": [
                    {
                        "id": "ex-estabilizadores-001",
                        "name": "Plancha abdominal",
                        "mediaType": "image",
                        "imageUrl": "/images/exercises/arma-tu-rutina/estabilizadores/plancha-abdominal.jpg",
                        "locked": false
                    }
                ]
            }
        ]
    }
```

> Nota: cada módulo trae 1 ejercicio placeholder — agregar más objetos al array `exercises` con el mismo shape cuando lleguen los assets reales del cliente. Las imágenes deben existir en `public/images/exercises/arma-tu-rutina/<categoria>/...` (crear las carpetas).

---

## Paso 4 — Home: `src/app/home.tsx`

4a. Ubicar línea (~99):

```ts
  const links = linksData as unknown as ExerciseRoutine[];
```

Reemplazar por:

```ts
  const links = (linksData as unknown as ExerciseRoutine[]).filter((item: any) => item.visible !== false);
```

4b. Dentro de `goToCourse()` (~línea 101), justo después de la línea `const goToCourse = (item: ExerciseRoutine) => {`, agregar antes del primer `if (item.directLink)`:

```ts
    if ((item as any).builder) {
      return navigate(`/builder/${item.id}`);
    }
```

---

## Paso 5 — Hook: `src/hooks/useCustomRoutines.ts` (archivo nuevo)

```ts
import { useCallback, useEffect, useState } from 'react';
import { CustomRoutine, CustomRoutineExerciseRef } from '@/types/customRoutine';

const STORAGE_KEY = 'custom_routines_v1';
const MAX_ROUTINES = 3;

const readRoutines = (): CustomRoutine[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CustomRoutine[]) : [];
  } catch {
    return [];
  }
};

const writeRoutines = (routines: CustomRoutine[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
};

export const useCustomRoutines = () => {
  const [routines, setRoutines] = useState<CustomRoutine[]>(() => readRoutines());

  useEffect(() => {
    setRoutines(readRoutines());
  }, []);

  const saveRoutine = useCallback((name: string, exercises: CustomRoutineExerciseRef[]) => {
    const current = readRoutines();
    if (current.length >= MAX_ROUTINES) {
      return { ok: false as const, reason: 'limit_reached' as const };
    }
    const next: CustomRoutine[] = [
      ...current,
      { id: `routine-${Date.now()}`, name, createdAt: Date.now(), exercises },
    ];
    writeRoutines(next);
    setRoutines(next);
    return { ok: true as const };
  }, []);

  const deleteRoutine = useCallback((id: string) => {
    const next = readRoutines().filter((r) => r.id !== id);
    writeRoutines(next);
    setRoutines(next);
  }, []);

  const getRoutine = useCallback((id: string) => {
    return readRoutines().find((r) => r.id === id);
  }, []);

  return { routines, saveRoutine, deleteRoutine, getRoutine, maxRoutines: MAX_ROUTINES };
};
```

---

## Paso 6 — Componente: `src/components/molecules/routine-builder-item/index.tsx` (archivo nuevo)

Referencia de estilo: `src/components/molecules/exercise-item/index.tsx` y `./styles.ts` (reusar `CardStylesSquared`, `TextContainerStyles`, etc. — importar desde `'../exercise-item/styles'`).

```tsx
import React from 'react';
import { Box, Typography, Card, Checkbox } from '@mui/material';
import { Exercise } from '@/types/course';
import { CardStylesSquared, TextContainerStyles, ExerciseNameStyles } from '../exercise-item/styles';

interface RoutineBuilderItemProps {
  exercise: Exercise;
  isSelected: boolean;
  onToggle: (exercise: Exercise) => void;
}

const RoutineBuilderItem: React.FC<RoutineBuilderItemProps> = ({ exercise, isSelected, onToggle }) => {
  return (
    <Card
      onClick={() => onToggle(exercise)}
      sx={{ ...CardStylesSquared, position: 'relative', cursor: 'pointer' }}
    >
      {exercise.imageUrl && (
        <Box
          component="img"
          src={exercise.imageUrl}
          alt={exercise.name}
          sx={{ width: 60, height: 60, borderRadius: 3, objectFit: 'cover' }}
        />
      )}

      <Box sx={TextContainerStyles}>
        <Typography variant="subtitle1" component="h3" fontWeight="bold" sx={ExerciseNameStyles}>
          {exercise.name}
        </Typography>
      </Box>

      <Box sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}>
        <Checkbox checked={isSelected} onChange={() => onToggle(exercise)} onClick={(e) => e.stopPropagation()} />
      </Box>
    </Card>
  );
};

export default RoutineBuilderItem;
```

---

## Paso 7 — Componente: `src/components/organisms/routine-builder-class/index.tsx` (archivo nuevo)

```tsx
import React from 'react';
import { Box } from '@mui/material';
import RoutineBuilderItem from '../../molecules/routine-builder-item';
import { Exercise, Module } from '@/types/course';

interface RoutineBuilderClassProps {
  module: Module;
  selectedIds: Set<string>;
  onToggle: (exercise: Exercise, module: Module) => void;
}

const RoutineBuilderClass: React.FC<RoutineBuilderClassProps> = ({ module, selectedIds, onToggle }) => {
  return (
    <>
      {module.exercises.map((exercise) => (
        <Box key={exercise.id} sx={{ mb: 1 }}>
          <RoutineBuilderItem
            exercise={exercise}
            isSelected={selectedIds.has(exercise.id)}
            onToggle={(ex) => onToggle(ex, module)}
          />
        </Box>
      ))}
    </>
  );
};

export default RoutineBuilderClass;
```

---

## Paso 8 — Página: `src/app/pages/RoutineBuilderPage.tsx` (archivo nuevo)

Calcado de `CoursePage.tsx` (acordeones MUI por módulo), sin gating de suscripción.

```tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { ExpandMore, Delete } from '@mui/icons-material';
import RoutineBuilderClass from '../../components/organisms/routine-builder-class';
import { getWorkoutById } from '../../data/getWorkout';
import { Exercise, Module } from '@/types/course';
import { CustomRoutineExerciseRef } from '@/types/customRoutine';
import { useCustomRoutines } from '@/hooks/useCustomRoutines';

const RoutineBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const workout = id ? getWorkoutById(id) : null;
  const [selected, setSelected] = useState<Map<string, CustomRoutineExerciseRef>>(new Map());
  const { routines, deleteRoutine } = useCustomRoutines();

  const toggleExercise = (exercise: Exercise, module: Module) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(exercise.id)) {
        next.delete(exercise.id);
      } else {
        next.set(exercise.id, {
          exerciseId: exercise.id,
          moduleId: module.id,
          name: exercise.name,
          mediaType: exercise.mediaType ?? 'video',
          imageUrl: exercise.imageUrl,
          videoUrl: exercise.videoUrl,
          url: exercise.url,
        });
      }
      return next;
    });
  };

  const startStory = (exercises: CustomRoutineExerciseRef[]) => {
    navigate(`/story/${id}`, { state: { exercises } });
  };

  if (!workout) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Rutina no encontrada</Typography>
      </Container>
    );
  }

  const selectedList = Array.from(selected.values());

  return (
    <Container maxWidth={false} disableGutters sx={{ pb: 14, width: '100%' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '2rem', mb: 2 }}>
        {workout.title}
      </Typography>

      {workout.modules.map((module) => (
        <Accordion key={module.id} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{module.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RoutineBuilderClass
              module={module}
              selectedIds={new Set(selected.keys())}
              onToggle={toggleExercise}
            />
          </AccordionDetails>
        </Accordion>
      ))}

      {routines.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Rutinas guardadas</Typography>
          <List>
            {routines.map((r) => (
              <ListItem
                key={r.id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => deleteRoutine(r.id)}>
                    <Delete />
                  </IconButton>
                }
                onClick={() => startStory(r.exercises)}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemText primary={r.name} secondary={`${r.exercises.length} ejercicios`} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, bgcolor: 'background.paper', boxShadow: 4 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={selectedList.length === 0}
          onClick={() => startStory(selectedList)}
        >
          Comenzar ({selectedList.length} seleccionados)
        </Button>
      </Box>
    </Container>
  );
};

export default RoutineBuilderPage;
```

---

## Paso 9 — Página: `src/app/pages/StoryViewerPage.tsx` (archivo nuevo)

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, IconButton, LinearProgress, TextField, Button, Stack } from '@mui/material';
import { PlayArrow, Pause, SkipNext, SkipPrevious, Close, Save } from '@mui/icons-material';
import { CustomRoutineExerciseRef } from '@/types/customRoutine';
import { useCustomRoutines } from '@/hooks/useCustomRoutines';

const IMAGE_DWELL_MS = 4500;

const StoryViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const exercises = (location.state as { exercises?: CustomRoutineExerciseRef[] } | null)?.exercises;

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showSave, setShowSave] = useState(false);
  const [routineName, setRoutineName] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const { saveRoutine } = useCustomRoutines();

  useEffect(() => {
    if (!exercises || exercises.length === 0) {
      navigate(`/builder/${id}`, { replace: true });
    }
  }, [exercises, id, navigate]);

  const current = exercises?.[index];

  useEffect(() => {
    if (!current || current.mediaType !== 'image' || !isPlaying) return;
    timerRef.current = setTimeout(() => {
      setIndex((i) => Math.min(i + 1, (exercises?.length ?? 1) - 1));
    }, IMAGE_DWELL_MS);
    return () => clearTimeout(timerRef.current);
  }, [current, isPlaying, exercises]);

  if (!exercises || exercises.length === 0 || !current) return null;

  const goNext = () => setIndex((i) => Math.min(i + 1, exercises.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  const handleSave = () => {
    const name = routineName.trim();
    if (!name) return;
    const result = saveRoutine(name, exercises);
    if (result.ok) {
      setShowSave(false);
      setRoutineName('');
    } else {
      alert('Máximo 3 rutinas guardadas. Elimina una desde el módulo para continuar.');
    }
  };

  return (
    <Box sx={{ position: 'fixed', inset: 0, bgcolor: '#000', zIndex: 1300, display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={1} sx={{ p: 1 }}>
        {exercises.map((_, i) => (
          <LinearProgress
            key={i}
            variant="determinate"
            value={i < index ? 100 : i === index ? 100 : 0}
            sx={{ flex: 1, height: 3, borderRadius: 2 }}
          />
        ))}
      </Stack>

      <IconButton onClick={() => navigate(`/builder/${id}`)} sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }}>
        <Close />
      </IconButton>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {current.mediaType === 'image' && current.imageUrl && (
          <Box component="img" src={current.imageUrl} alt={current.name} sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        )}
        {current.mediaType === 'video' && (current.videoUrl || current.url) && (
          <Box component="video" src={current.videoUrl || current.url} autoPlay={isPlaying} controls={false} sx={{ maxWidth: '100%', maxHeight: '100%' }} />
        )}
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={3} sx={{ p: 2 }}>
        <IconButton onClick={goPrev} disabled={index === 0} sx={{ color: '#fff' }}>
          <SkipPrevious fontSize="large" />
        </IconButton>
        <IconButton onClick={() => setIsPlaying((p) => !p)} sx={{ color: '#fff' }}>
          {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
        </IconButton>
        <IconButton onClick={goNext} disabled={index === exercises.length - 1} sx={{ color: '#fff' }}>
          <SkipNext fontSize="large" />
        </IconButton>
        <IconButton onClick={() => setShowSave((s) => !s)} sx={{ color: '#fff' }}>
          <Save fontSize="large" />
        </IconButton>
      </Stack>

      {showSave && (
        <Stack direction="row" spacing={1} sx={{ p: 2, bgcolor: '#111' }}>
          <TextField
            size="small"
            placeholder="Nombre de la rutina"
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            sx={{ flex: 1, input: { color: '#fff' } }}
          />
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </Stack>
      )}
    </Box>
  );
};

export default StoryViewerPage;
```

---

## Paso 10 — Rutas: `src/app/Routes.tsx`

10a. Agregar imports junto a los demás imports de páginas (~línea 14, después de `import VideoPage from './pages/VideoPage.tsx';`):

```ts
import RoutineBuilderPage from './pages/RoutineBuilderPage.tsx';
import StoryViewerPage from './pages/StoryViewerPage.tsx';
```

10b. Dentro del array que retorna `createAppRoutes`, después del bloque de la ruta `/workout/:id` (después de su `},`), agregar:

```tsx
        {
            path: "/builder/:id",
            element: <RoutineBuilderPage />,
        },
        {
            path: "/story/:id",
            element: <StoryViewerPage />,
        },
```

---

## Verificación

1. `npm run dev` → Home: confirmar "Gimnasio" no aparece, "Arma tu propia rutina" sí.
2. Click en nueva card → `/builder/category-003`, ver 5 acordeones, seleccionar ejercicios, "Comenzar".
3. `/story/category-003`: next/prev, play/pause (auto-advance en imagen), guardar con nombre, volver al builder y ver la rutina guardada, cargarla de nuevo, intentar guardar una 4ta y ver el bloqueo de límite (alert).
4. Confirmar `/workout/category-002` sigue funcionando por URL directa.
5. `npx tsc --noEmit` para chequear tipos.
