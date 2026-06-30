---
name: animation-layer
description: >
  Agrega animaciones fluidas y profesionales a un componente React existente.
  Usar cuando el usuario quiera agregar transiciones, micro-interacciones, o
  animaciones de entrada/salida a un componente. Invocar también con
  /animation-layer. Prioriza CSS + tailwindcss-animate sobre Framer Motion
  para mantener el bundle pequeño. Trabaja sobre UN componente por llamada.
---

# Animation Layer

Agrega animaciones a un componente React sin romper su lógica ni su responsive.

## PASO 1 — Elegir la herramienta correcta

Decidir qué librería usar según el tipo de animación:

| Tipo de animación | Herramienta |
|---|---|
| Fade in/out, slide, scale al montar | `tailwindcss-animate` (clases CSS) |
| Hover, focus, active micro-interacciones | Tailwind `transition` + `hover:` |
| Animaciones orquestadas (stagger, secuencia) | Framer Motion |
| Scroll-triggered reveals | Framer Motion `whileInView` |
| Gestos (drag, swipe) | Framer Motion |
| Número contando, progreso | Framer Motion `useMotionValue` |

**Regla:** Si se puede hacer con CSS, no usar Framer Motion.

## PASO 2 — Clases de tailwindcss-animate disponibles

```
animate-in / animate-out          ← habilita la animación
fade-in / fade-out                ← opacidad
slide-in-from-top / -bottom / -left / -right
zoom-in / zoom-out
spin-in / spin-out

Modificadores:
duration-150 / duration-300 / duration-500 / duration-700
delay-0 / delay-100 / delay-200 / delay-300
ease-in / ease-out / ease-in-out / ease-linear
fill-mode-both                    ← mantiene estado final
```

Ejemplo de entrada suave:
```jsx
<div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both">
```

## PASO 3 — Patrones por tipo de componente

### Cards / Items de lista
```jsx
// Entrada escalonada con delay
<div className="animate-in fade-in slide-in-from-bottom-3 duration-400 ease-out fill-mode-both"
     style={{ animationDelay: `${index * 100}ms` }}>
```

### Botones (micro-interacción)
```jsx
<button className="transition-all duration-200 
                   hover:scale-105 hover:shadow-md 
                   active:scale-95
                   focus-visible:ring-2 focus-visible:ring-ring">
```

### Modal / Drawer
```jsx
// Overlay
<div className="animate-in fade-in duration-200">
// Panel
<div className="animate-in slide-in-from-bottom-8 duration-300 ease-out">
```

### Hero section
```jsx
// Título
<h1 className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out fill-mode-both">
// Subtítulo (delay)
<p className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 ease-out fill-mode-both">
// CTA (delay mayor)
<div className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-400 ease-out fill-mode-both">
```

### Nav links (hover underline)
```jsx
<a className="relative after:absolute after:bottom-0 after:left-0 
              after:h-0.5 after:w-0 after:bg-primary
              after:transition-all after:duration-300
              hover:after:w-full">
```

## PASO 4 — Con Framer Motion (cuando CSS no alcanza)

```jsx
import { motion } from "framer-motion"

// Scroll reveal
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.5, ease: "easeOut" }}>

// Stagger de lista
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
}

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => <motion.li key={i.id} variants={item}>)}
</motion.ul>
```

## PASO 5 — Respetar preferencias del usuario

SIEMPRE envolver animaciones opcionales con:
```jsx
// Con Tailwind
<div className="motion-reduce:animate-none motion-reduce:transition-none ...">

// Con Framer Motion
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
```

## PASO 6 — Entregar

Mostrar:
1. El componente con animaciones aplicadas
2. Lista de qué se agregó y por qué esa elección
3. Si se necesita instalar Framer Motion: `npm install framer-motion`

## Reglas de eficiencia
- Un componente por llamada
- El usuario pega el componente; no leer archivos del proyecto
- No agregar animaciones a TODOS los elementos — elegir máximo 3 puntos de animación por componente
- Menos es más: una animación bien ejecutada > cinco animaciones mediocres
