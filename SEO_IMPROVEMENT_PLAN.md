# Plan de Mejora de SEO - Portfolio Next.js

## Estado Actual del SEO

### ✅ Aspectos Positivos Implementados
- **Metadata básica**: Título y descripción en `layout.tsx`
- **Open Graph**: Configuración completa para redes sociales
- **Twitter Cards**: Metadata específica para Twitter
- **JSON-LD Schema**: Schema markup para datos estructurados (Person, Organization)
- **Sitemap**: Generación dinámica de sitemap.xml
- **Robots.txt**: Configuración básica de rastreo
- **Favicons**: Múltiples tamaños de iconos implementados

### ⚠️ Oportunidades de Mejora Identificadas

1. **Aplicación Client-Side**: `page.tsx` usa `"use client"` - limita SSR y SEO
2. **Falta de contenido semántico HTML**: No hay tags HTML5 semánticos adecuados
3. **Falta de meta tags específicos**: Canonical URLs, keywords, author
4. **Imágenes sin optimización SEO**: Falta de alt texts, dimensiones, lazy loading
5. **URLs no optimizadas**: No hay estructura de URLs descriptivas
6. **Falta de contenido textual indexable**: Mucho contenido dinámico en cliente
7. **Sin estrategia de enlaces internos**
8. **Performance no optimizada**: Sin configuración de caché, compresión
9. **Internacionalización**: Solo en inglés, sin hreflang
10. **Analytics y Search Console**: No configurados

---

## Plan de Mejora SEO (Priorizado)

### 🔴 PRIORIDAD ALTA (Impacto Inmediato)

#### 1. Migrar a Server Components (SSR)
**Problema**: La página principal es Client Component, limitando el SEO
**Solución**:
- Separar lógica de cliente y servidor
- Hacer `page.tsx` Server Component
- Mover interactividad a componentes específicos con `"use client"`

**Archivos a modificar**:
- `src/app/page.tsx`
- Crear `src/components/InteractiveLayout.tsx`

**Beneficios**: 
- Contenido HTML completo en primera carga
- Mejor indexación por bots
- Improved Time to First Byte (TTFB)

---

#### 2. Implementar HTML Semántico
**Problema**: Estructura sin tags semánticos adecuados
**Solución**:
```html
<main id="main-content">
  <section aria-label="Presentación">
    <header>...</header>
  </section>
  <section aria-label="Sobre mí">
    <article>...</article>
  </section>
  <section aria-label="Experiencia">
    <article>...</article>
  </section>
</main>
```

**Archivos a modificar**:
- `src/app/page.tsx`
- Todos los componentes en `src/components/`

**Beneficios**:
- Mejor comprensión del contenido por motores de búsqueda
- Accesibilidad mejorada
- Featured snippets en Google

---

#### 3. Optimización de Metadatos
**Problema**: Falta metadata crítica
**Solución**:
```typescript
// src/app/layout.tsx - Agregar
export const metadata: Metadata = {
  // ... existing
  keywords: [
    'Matias Rios',
    'Software Engineer',
    'Full Stack Developer',
    'React Developer',
    'Next.js Developer',
    'Backend Engineer',
    'Bahía Blanca Developer',
    'Argentina Developer',
    'TypeScript',
    'Node.js'
  ],
  authors: [{ name: 'Matias Rios', url: 'https://matiasjrb.com.ar' }],
  creator: 'Matias Rios',
  publisher: 'Matias Rios',
  alternates: {
    canonical: 'https://matiasjrb.com.ar',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    // yandex: 'YOUR_YANDEX_CODE',
    // bing: 'YOUR_BING_CODE',
  },
  category: 'technology',
};
```

**Archivos a crear/modificar**:
- `src/app/layout.tsx`
- Crear `src/lib/metadata.ts` para centralizar metadata

**Beneficios**:
- Mejor clasificación en búsquedas
- Rich snippets en resultados
- Verificación de propiedad

---

#### 4. Optimización de Imágenes
**Problema**: Sin alt texts, sin Next.js Image optimization
**Solución**:
```typescript
import Image from 'next/image'

// Reemplazar todas las <img> por:
<Image
  src="/images/work/project.jpg"
  alt="Descripción detallada del proyecto - keywords relevantes"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/..."
  quality={85}
/>
```

**Archivos a modificar**:
- Todos los componentes que usen imágenes
- Crear `src/lib/image-utils.ts` para generar blurDataURL

**Tareas adicionales**:
- Crear imágenes en formatos WebP/AVIF
- Generar og-image.jpg optimizado (1200x630px)
- Implementar responsive images con srcset

**Beneficios**:
- Carga más rápida (Core Web Vitals)
- SEO de imágenes mejorado
- Mejor UX móvil

---

#### 5. Mejorar Schema Markup (JSON-LD)
**Problema**: Schema básico, falta información rica
**Solución**: Expandir JSON-LD con:
```typescript
{
  "@context": "https://schema.org",
  "@type": "Person",
  // ... existing
  "knowsAbout": ["React", "Next.js", "TypeScript", "Node.js", ...],
  "hasOccupation": {
    "@type": "Occupation",
    "name": "Software Engineer",
    "occupationalCategory": "15-1252.00" // SOC Code
  },
  "alumniOf": {
    "@type": "Organization",
    "name": "Universidad que corresponda"
  },
  "image": "https://matiasjrb.com.ar/images/profile.jpg",
  "award": ["Lista de premios/reconocimientos"],
  "knowsLanguage": ["Spanish", "English"],
  // Agregar BreadcrumbList
  // Agregar WebSite schema
  // Agregar ProfilePage schema
}
```

**Archivos a modificar**:
- `src/components/JsonLd.tsx`
- Crear schemas adicionales: `WebSite`, `BreadcrumbList`, `Article`

**Beneficios**:
- Rich results en Google
- Knowledge Graph
- Mejor comprensión contextual

---

### 🟡 PRIORIDAD MEDIA (Impacto Significativo)

#### 6. Implementar Canonical URLs y Breadcrumbs
**Solución**:
```typescript
// En cada página
export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: `https://matiasjrb.com.ar${pathname}`,
    },
  }
}

// Componente Breadcrumbs
<nav aria-label="Breadcrumb">
  <ol itemScope itemType="https://schema.org/BreadcrumbList">
    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
      <a href="/" itemProp="item">Home</a>
      <meta itemProp="position" content="1" />
    </li>
  </ol>
</nav>
```

**Archivos a crear**:
- `src/components/Breadcrumbs.tsx`
- Actualizar metadata en `layout.tsx`

---

#### 7. Optimización de Performance (Core Web Vitals)
**Acciones**:
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  
  // Configurar headers para caché
  async headers() {
    return [
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
};
```

**Instalar paquetes**:
```bash
npm install --save-dev @next/bundle-analyzer
```

**Archivos a modificar**:
- `next.config.ts`
- Crear `src/app/manifest.ts` para PWA

**Métricas a optimizar**:
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1
- TTFB (Time to First Byte) < 800ms

---

#### 8. Crear Sitemap Avanzado
**Solución**:
```typescript
// src/app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://matiasjrb.com.ar";
  
  // Agregar más páginas
  // Agregar alternateRefs para i18n
  // Agregar images en sitemap
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      images: ['/images/og-image.jpg'],
    },
    // ... más páginas
  ]
}

// Crear sitemap.xml para imágenes
// src/app/image-sitemap.xml/route.ts
```

**Archivos a crear/modificar**:
- `src/app/sitemap.ts`
- `src/app/image-sitemap.xml/route.ts`

---

#### 9. Contenido Enriquecido y Blog
**Problema**: Portfolio estático sin contenido actualizable
**Solución**:
- Crear sección de blog técnico
- Implementar sistema MDX para artículos
- Crear páginas de proyectos individuales

**Estructura a crear**:
```
src/
  app/
    blog/
      page.tsx
      [slug]/
        page.tsx
    projects/
      page.tsx
      [slug]/
        page.tsx
  content/
    blog/
      2025-01-15-nextjs-seo.mdx
    projects/
      mangxo.mdx
```

**Paquetes a instalar**:
```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react
npm install rehype-highlight rehype-slug remark-gfm
npm install gray-matter reading-time
```

**Beneficios**:
- Contenido fresco (factor de ranking)
- Long-tail keywords
- Backlinks naturales
- Autoridad de dominio

---

#### 10. Internacionalización (i18n)
**Problema**: Solo en inglés
**Solución**:
```typescript
// src/app/[lang]/layout.tsx
export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }]
}

// Metadata con hreflang
alternates: {
  canonical: 'https://matiasjrb.com.ar',
  languages: {
    'en-US': 'https://matiasjrb.com.ar/en',
    'es-AR': 'https://matiasjrb.com.ar/es',
  },
}
```

**Archivos a crear**:
```
src/
  locales/
    en.json
    es.json
  lib/
    i18n.ts
```

---

### 🟢 PRIORIDAD BAJA (Optimización Avanzada)

#### 11. Integración con Herramientas SEO
**Herramientas a integrar**:
- Google Search Console
- Google Analytics 4
- Bing Webmaster Tools
- Google Tag Manager
- Schema Validator

**Implementación**:
```typescript
// src/components/Analytics.tsx
// src/app/layout.tsx - agregar scripts
```

---

#### 12. Link Building y SEO Off-Page
**Estrategias**:
- Crear perfil en Dev.to, Hashnode, Medium
- Contribuir a proyectos Open Source
- Guest posts en blogs técnicos
- Compartir en comunidades (Reddit, HackerNews)
- Actualizar perfil LinkedIn con link
- GitHub README con link destacado

---

#### 13. Seguridad y HTTPS
**Checklist**:
- ✅ HTTPS activo
- Implementar HSTS headers
- Configurar CSP (Content Security Policy)
- Implementar SRI (Subresource Integrity)

```typescript
// next.config.ts
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains'
      },
      {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
      }
    ]
  }]
}
```

---

#### 14. Monitoreo de Velocidad
**Herramientas**:
- Lighthouse CI en GitHub Actions
- Web Vitals monitoring
- Real User Monitoring (RUM)

**Implementación**:
```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Agregar en layout
<Analytics />
<SpeedInsights />
```

---

## Implementación por Fases

### Fase 1 (Semana 1-2): Fundamentos SEO
- [ ] Migrar a Server Components
- [ ] Implementar HTML semántico
- [ ] Optimizar metadata
- [ ] Optimizar imágenes con Next.js Image

### Fase 2 (Semana 3-4): Contenido y Estructura
- [ ] Mejorar JSON-LD Schema
- [ ] Implementar Breadcrumbs
- [ ] Optimizar Performance (Core Web Vitals)
- [ ] Crear sitemap avanzado

### Fase 3 (Mes 2): Expansión de Contenido
- [ ] Crear sección de blog
- [ ] Páginas de proyectos individuales
- [ ] Implementar MDX
- [ ] Internacionalización (ES/EN)

### Fase 4 (Mes 3): Analítica y Optimización
- [ ] Integrar Analytics y Search Console
- [ ] Implementar headers de seguridad
- [ ] Lighthouse CI
- [ ] Link building estrategia

---

## Métricas de Éxito (KPIs)

### Métricas Técnicas
- **Lighthouse SEO Score**: Objetivo 100/100 (actual: ~85)
- **Core Web Vitals**: Todos en verde
- **Páginas indexadas**: Objetivo 15+ páginas
- **Tiempo de carga**: < 2 segundos

### Métricas de Negocio
- **Tráfico orgánico**: +100% en 6 meses
- **Posiciones en SERP**: Top 10 para "Matias Rios Software Engineer"
- **Click-through rate (CTR)**: > 5%
- **Tiempo en página**: > 2 minutos

### Herramientas de Seguimiento
- Google Search Console
- Google Analytics 4
- Ahrefs / SEMrush (análisis competencia)
- PageSpeed Insights

---

## Checklist Rápido de Implementación

```markdown
## SEO Técnico
- [ ] Server-side rendering (SSR)
- [ ] HTML semántico correcto
- [ ] Meta tags completos
- [ ] Canonical URLs
- [ ] Sitemap.xml optimizado
- [ ] Robots.txt configurado
- [ ] Schema markup (JSON-LD)
- [ ] Imágenes optimizadas con alt text
- [ ] URLs amigables
- [ ] HTTPS habilitado
- [ ] Headers de seguridad

## Contenido
- [ ] Títulos descriptivos (H1, H2, H3)
- [ ] Meta descriptions únicas
- [ ] Contenido original y valioso
- [ ] Keywords relevantes
- [ ] Internal linking
- [ ] Blog técnico activo
- [ ] Páginas de proyectos

## Performance
- [ ] Core Web Vitals optimizados
- [ ] Compresión habilitada
- [ ] Caché configurado
- [ ] Lazy loading de imágenes
- [ ] CSS/JS minificado
- [ ] Fuentes optimizadas

## Off-Page
- [ ] Perfiles sociales actualizados
- [ ] Backlinks de calidad
- [ ] Guest posting
- [ ] Comunidades técnicas
```

---

## Recursos y Referencias

### Documentación
- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Web.dev](https://web.dev/)

### Herramientas
- [Google Search Console](https://search.google.com/search-console)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Schema Validator](https://validator.schema.org/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### Librerías útiles
```bash
npm install next-seo next-sitemap @vercel/analytics
npm install sharp # Para optimización de imágenes
npm install @next/mdx # Para blog
```

---

## Notas Finales

Este plan está diseñado para ser implementado de forma incremental. Cada mejora debe ser medida y validada antes de pasar a la siguiente. El SEO es un proceso continuo que requiere:

1. **Paciencia**: Los resultados pueden tardar 3-6 meses
2. **Consistencia**: Actualizaciones regulares de contenido
3. **Medición**: Tracking constante de métricas
4. **Adaptación**: Ajustar estrategia según resultados

**Próximo paso recomendado**: Comenzar con la Fase 1, específicamente con la migración a Server Components y optimización de metadata.
