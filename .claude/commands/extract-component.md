---
name: extract-component
description: >
  Extrae un bloque de JSX repetido en un componente React reutilizable con props
  bien definidas. Usar cuando el usuario pega código con duplicación clara y quiere
  convertirlo en un componente propio. Invocar también con /extract-component.
  Trabaja sobre UN solo componente por llamada para mantener el contexto pequeño.
---

# Extract Component

Convierte JSX duplicado o complejo en un componente React reutilizable.
Trabaja sobre el código que el usuario pega directamente en el chat.

## PASO 1 — Entender el contexto

Antes de escribir código, identificar:
- ¿Qué hace visualmente este bloque?
- ¿Qué partes cambian entre instancias? → esas serán las props
- ¿Qué partes son siempre iguales? → esas van hardcodeadas en el componente
- ¿Dónde irá el archivo? (`src/components/` o `src/components/ui/`)

## PASO 2 — Diseñar la interfaz de props

Antes de escribir el componente, declarar las props:

```
Props del componente <NombreComponente>:
- title: string (requerido)
- description: string (opcional, default: "")
- variant: "primary" | "secondary" (opcional, default: "primary")
- onClick: function (opcional)
- children: ReactNode (opcional)
```

Reglas para props:
- Nombres en camelCase
- Variantes visuales como strings literales, nunca booleanos múltiples
- Un solo `children` si el contenido es variable
- No pasar clases Tailwind como props (usar `variant` en su lugar)

## PASO 3 — Escribir el componente

Plantilla base:

```jsx
// src/components/NombreComponente.jsx

const VARIANTS = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
}

export function NombreComponente({
  title,
  description = "",
  variant = "primary",
  onClick,
  children,
}) {
  return (
    <div className={`... ${VARIANTS[variant]}`}>
      {/* JSX extraído */}
    </div>
  )
}
```

Reglas de estilo:
- Colores SIEMPRE con tokens semánticos (`bg-primary`, `text-foreground`, etc.)
- Mobile first en todas las clases responsivas
- Sin valores arbitrarios salvo que vengan del Figma y no exista token

## PASO 4 — Mostrar los cambios de uso

Después del componente nuevo, mostrar cómo reemplazarlo en el archivo original:

```jsx
// ANTES
<div className="...largo...">
  <h2>Título hardcodeado</h2>
  ...
</div>

// DESPUÉS
<NombreComponente title="Título hardcodeado" variant="primary" />
```

## PASO 5 — Checklist antes de entregar

- [ ] ¿El componente funciona con las props mínimas sin crashear?
- [ ] ¿Tiene valor default en props opcionales?
- [ ] ¿Los colores usan tokens semánticos?
- [ ] ¿El nombre del archivo coincide con el nombre del componente?
- [ ] ¿Se puede usar en mobile sin cambios?

## Reglas de eficiencia
- Un componente por llamada
- No leer archivos del proyecto; el usuario pega el código
- No crear archivos index.js de barrel exports automáticamente
- Si hay dudas sobre props, preguntar UNA sola pregunta antes de continuar
