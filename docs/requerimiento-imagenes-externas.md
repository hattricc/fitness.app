# Requerimiento: Almacenamiento externo de imágenes para el CMS

## Problema

Actualmente las imágenes subidas desde Decap CMS se guardan directamente en el repositorio de Git (`public/images/`). Esto genera problemas a medida que el contenido crece:

- **Tamaño del repo**: imágenes binarias inflanchan el historial de Git.
- **Velocidad de build**: Netlify clona el repo completo en cada deploy — más imágenes, build más lento.
- **Sin optimización**: las imágenes se sirven como archivos estáticos sin resize, compresión ni CDN dedicado.
- **Límite práctico**: repositorios Git no están diseñados para activos binarios grandes.

## Objetivo

Que el cliente pueda subir imágenes desde Decap CMS y estas se almacenen en un servicio externo (no el repo), con una URL pública que se guarda en el JSON de datos.

## Opciones evaluadas

### Opción A — Cloudinary (recomendada)
- Decap CMS tiene integración nativa vía `media_library` widget.
- El admin sube la imagen directamente a Cloudinary desde la UI de Decap, sin tocar el repo.
- URL resultante es una URL de Cloudinary (CDN global, transformaciones on-the-fly: resize, WebP automático, etc.).
- Plan gratuito: 25 GB storage + 25 GB bandwidth/mes. Suficiente para empezar.
- **Cambio de código mínimo**: solo config.yml de Decap + agregar credenciales como variables de entorno en Netlify.

### Opción B — Supabase Storage
- Ya usamos Supabase para auth y pagos — centraliza toda la infraestructura.
- Requiere un middleware (Netlify Function) que reciba el archivo desde Decap y lo suba a Supabase.
- Decap no tiene integración nativa con Supabase Storage → más trabajo custom.
- Viable pero más desarrollo que Opción A.

### Opción C — Netlify Large Media (Git LFS)
- Mantiene el flujo de Git pero los binarios van a un store externo vía LFS.
- Deprecado por Netlify desde 2023 — no recomendado para proyectos nuevos.

## Decisión propuesta

**Opción A (Cloudinary)** por:
- Integración nativa con Decap → cero desarrollo de backend.
- CDN + optimización automática incluidos.
- Free tier suficiente para el volumen actual del proyecto.

## Impacto técnico

### Cambios en `public/admin/config.yml`
```yaml
media_library:
  name: cloudinary
  config:
    cloud_name: TU_CLOUD_NAME
    api_key: TU_API_KEY
```

### Variables de entorno en Netlify
```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...   # solo para firma server-side si se requiere
```

### Script en `admin/index.html`
Agregar el SDK de Cloudinary antes del script de Decap:
```html
<script src="https://media-library.cloudinary.com/global/all.js"></script>
```

### Sin cambios en la app React
Las URLs de imágenes en los JSON pasan de `/images/archivo.jpg` a `https://res.cloudinary.com/cloud-name/image/upload/...`. La app ya renderiza `imageUrl` dinámicamente, así que funciona sin modificar componentes.

## Migración de imágenes existentes

Las imágenes actuales en `public/images/` (placeholders) se pueden subir manualmente a Cloudinary una vez. Actualizar las URLs en `arma-tu-rutina.json` y `home.json` apuntando al nuevo dominio.

## Prerequisitos

- Crear cuenta en cloudinary.com (gratuita).
- Obtener `cloud_name` y `api_key` desde el dashboard.
- Agregar variables de entorno en Netlify → Site Settings → Environment variables.

## Estado

- [ ] Pendiente de implementación
- Prioridad: media — el repo funciona con imágenes en Git por ahora, pero escalar sin esto genera deuda técnica.
