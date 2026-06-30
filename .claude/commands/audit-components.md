---
name: audit-components
description: >
  Audita el código fuente de un proyecto React + Tailwind para detectar
  duplicaciones, componentes candidatos a extracción, y patrones inconsistentes.
  Usar cuando el usuario quiera saber qué componentes se repiten, qué se puede
  reutilizar, o quiera un mapa del estado actual de la UI. Invocar también con
  /audit-components. Siempre genera un reporte priorizado por impacto.
---

# Audit Components

Analiza el proyecto React para producir un reporte de auditoría accionable.
El objetivo es identificar qué refactorizar primero, no hacer un análisis exhaustivo.

## PASO 1 — Escaneo de estructura

Leer la estructura de carpetas:
```
src/
├── components/
├── pages/  (o views/, o routes/)
├── hooks/
└── ...
```

Listar todos los archivos `.jsx` / `.tsx` con su tamaño aproximado (líneas).
Ordenar de mayor a menor. Los más grandes son candidatos prioritarios.

## PASO 2 — Detectar duplicaciones por categoría

### A) JSX estructuralmente similar
Buscar patrones que se repiten en múltiples archivos:
- Misma combinación de clases Tailwind en elementos distintos
- Misma estructura `<div className="flex flex-col gap-*">` repetida
- Bloques de card, badge, avatar, botón con variantes hardcodeadas

### B) Componentes inline que deberían ser propios
Señales de alerta:
- `<div>` con más de 5 clases Tailwind que aparece 2+ veces
- Listas `map()` que renderizan JSX idéntico en distintos archivos
- Secciones de hero, CTA, testimonios, pricing hardcodeadas en páginas

### C) Inconsistencias de estilo
- Mezcla de colores semánticos (`bg-primary`) con colores directos (`bg-blue-500`)
- Espaciados inconsistentes (`gap-4` vs `gap-[16px]`)
- Breakpoints mezclados con valores arbitrarios

## PASO 3 — Generar reporte priorizado

Formato del reporte:

```
## REPORTE DE AUDITORÍA — FitnessApp
Fecha: [fecha]
Archivos analizados: N

### 🔴 ALTA PRIORIDAD (impacto inmediato)
| Componente candidato | Aparece en | Esfuerzo | Impacto |
|---|---|---|---|
| <Button> con variantes | 8 archivos | Bajo | Alto |

### 🟡 MEDIA PRIORIDAD
...

### 🟢 BAJA PRIORIDAD
...

### ⚠️ INCONSISTENCIAS DE ESTILO
- Lista de archivos con colores hardcodeados
- Lista de valores arbitrarios que deberían ser tokens

### 📋 ORDEN SUGERIDO DE TRABAJO
1. Extraer X → usa /extract-component
2. Responsive de Y → usa /responsive-refactor
3. ...
```

## PASO 4 — No hacer nada más

No extraer componentes todavía.
No refactorizar código.
Solo reportar y sugerir el orden de trabajo.
El usuario decidirá qué atacar primero.

## Reglas
- Máximo 1 archivo de código a la vez en contexto para ahorrar tokens
- Si el proyecto tiene más de 20 componentes, auditar por carpeta, no todo junto
- Priorizar por frecuencia de repetición × complejidad del componente
