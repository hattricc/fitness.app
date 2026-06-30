# FitnessApp — Contexto del Proyecto

## Stack
- React + Vite
- Tailwind CSS con shadcn/ui (colores via CSS variables HSL)
- `tailwindcss-animate` instalado
- `@tailwindcss/forms` instalado

## Sistema de colores
Los colores NO son clases directas de Tailwind. Siempre usar tokens semánticos:
- `bg-background`, `text-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-card`, `text-card-foreground`
- `bg-muted`, `text-muted-foreground`
- `bg-accent`, `text-accent-foreground`
- `border-border`, `ring-ring`
- `bg-destructive` para errores/eliminar

❌ NUNCA usar: `bg-white`, `text-black`, `bg-gray-*` directamente
✅ SIEMPRE usar: los tokens semánticos de arriba

## Breakpoints (Tailwind estándar)
| Nombre | Prefijo | Ancho |
|---|---|---|
| Mobile pequeño | *(sin prefijo)* | 0–374px |
| Mobile grande | `sm:` | 375px+ |
| Tablet | `md:` | 768px+ |
| Laptop | `lg:` | 1024px+ |
| Desktop | `xl:` | 1280px+ |

**Estrategia: Mobile First siempre.** Base sin prefijo = mobile.

## Reglas generales
- Componentes reutilizables en `src/components/ui/` (shadcn) y `src/components/` (propios)
- No lógica de negocio en componentes de UI
- Props siempre tipadas con PropTypes o TypeScript si aplica
- Animaciones: usar clases de `tailwindcss-animate` primero; Framer Motion solo si la animación no es posible con CSS

## Objetivo actual
Refactorización progresiva:
1. Auditoría de componentes reutilizables
2. Responsive mobile-first
3. Capa de animaciones
4. UX review + variantes de diseño
