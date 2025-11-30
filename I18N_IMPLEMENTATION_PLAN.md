# Plan de Implementación de Internacionalización (i18n)

## Resumen Ejecutivo

Este plan detalla la implementación de internacionalización en el portfolio utilizando el enfoque nativo de Next.js 15 con App Router, soportando inglés (predeterminado) y español.

## 1. Configuración Inicial

### 1.1 Idiomas a Soportar

- **Inglés (en)**: Idioma predeterminado para alcance global
- **Español (es)**: Para mercado hispano y origen del desarrollador

### 1.2 Dependencias Requeridas

```bash
npm install negotiator @formatjs/intl-localematcher
npm install --save-dev @types/negotiator
```

**Alternativa con librería especializada** (recomendado para proyectos grandes):

```bash
npm install next-intl
```

## 2. Arquitectura Propuesta

### 2.1 Estructura de Rutas

```
src/
├── app/
│   ├── [lang]/                 # Segmento dinámico para locale
│   │   ├── layout.tsx         # Layout con locale
│   │   ├── page.tsx           # Página principal
│   │   └── ...otros archivos
│   ├── globals.css
│   └── robots.ts
├── middleware.ts              # Detección y redirección de locale
├── i18n/
│   ├── config.ts             # Configuración central de i18n
│   ├── dictionaries/
│   │   ├── en.json          # Traducciones en inglés
│   │   └── es.json          # Traducciones en español
│   └── get-dictionary.ts    # Función para obtener traducciones
```

### 2.2 Flujo de Funcionamiento

1. **Middleware** detecta el idioma preferido del usuario (headers, cookies, path)
2. Redirige a la ruta con el locale apropiado (`/en/` o `/es/`)
3. Cada página recibe el parámetro `lang`
4. Se cargan las traducciones correspondientes
5. El contenido se renderiza en el idioma seleccionado

## 3. Implementación Paso a Paso

### Fase 1: Configuración Base (2-3 horas)

#### 3.1 Crear archivo de configuración i18n

**Archivo: `src/i18n/config.ts`**

```typescript
export const i18n = {
  defaultLocale: "en",
  locales: ["en", "es"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
```

#### 3.2 Crear middleware para detección de locale

**Archivo: `src/middleware.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n } from "./i18n/config";

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, i18n.locales, i18n.defaultLocale);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar archivos estáticos y API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images")
  ) {
    return;
  }

  // Verificar si ya tiene un locale en el path
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirigir con locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|icons|images).*)"],
};
```

#### 3.3 Crear diccionarios de traducciones

**Archivo: `src/i18n/dictionaries/en.json`**

```json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "experience": "Experience",
    "projects": "Projects",
    "contact": "Contact"
  },
  "presentation": {
    "greeting": "Hi, I'm",
    "role": "Software Engineer",
    "cta": "Get in touch"
  },
  "about": {
    "title": "About Me",
    "description": "Learn more about my background and experience"
  },
  "experience": {
    "title": "Work Experience",
    "present": "PRESENT",
    "to": "to"
  },
  "projects": {
    "title": "Projects",
    "viewProject": "View Project"
  },
  "contact": {
    "title": "Get in Touch",
    "email": "Email",
    "phone": "Phone",
    "location": "Location"
  },
  "footer": {
    "rights": "All rights reserved",
    "builtWith": "Built with Next.js"
  },
  "common": {
    "loading": "Loading...",
    "skipToContent": "Skip to content",
    "darkMode": "Dark mode",
    "lightMode": "Light mode",
    "toggleTheme": "Toggle theme"
  },
  "accessibility": {
    "keyboardHint": "Press Tab to navigate",
    "focusIndicator": "Keyboard navigation active"
  }
}
```

**Archivo: `src/i18n/dictionaries/es.json`**

```json
{
  "nav": {
    "home": "Inicio",
    "about": "Acerca de",
    "experience": "Experiencia",
    "projects": "Proyectos",
    "contact": "Contacto"
  },
  "presentation": {
    "greeting": "Hola, soy",
    "role": "Ingeniero de Software",
    "cta": "Contactar"
  },
  "about": {
    "title": "Acerca de Mí",
    "description": "Conoce más sobre mi trayectoria y experiencia"
  },
  "experience": {
    "title": "Experiencia Laboral",
    "present": "PRESENTE",
    "to": "a"
  },
  "projects": {
    "title": "Proyectos",
    "viewProject": "Ver Proyecto"
  },
  "contact": {
    "title": "Contacto",
    "email": "Correo",
    "phone": "Teléfono",
    "location": "Ubicación"
  },
  "footer": {
    "rights": "Todos los derechos reservados",
    "builtWith": "Creado con Next.js"
  },
  "common": {
    "loading": "Cargando...",
    "skipToContent": "Saltar al contenido",
    "darkMode": "Modo oscuro",
    "lightMode": "Modo claro",
    "toggleTheme": "Cambiar tema"
  },
  "accessibility": {
    "keyboardHint": "Presiona Tab para navegar",
    "focusIndicator": "Navegación por teclado activa"
  }
}
```

#### 3.4 Función para obtener diccionarios

**Archivo: `src/i18n/get-dictionary.ts`**

```typescript
import "server-only";
import type { Locale } from "./config";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  es: () => import("./dictionaries/es.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();
```

### Fase 2: Reestructuración de Rutas (3-4 horas)

#### 3.5 Reorganizar estructura de app/

1. Crear carpeta `src/app/[lang]/`
2. Mover todos los archivos de `src/app/` a `src/app/[lang]/` excepto:
   - `globals.css`
   - `robots.ts`
   - `sitemap.ts`

#### 3.6 Actualizar Root Layout

**Archivo: `src/app/[lang]/layout.tsx`**

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import GlowingCursor from "@/components/GlowingCursor";
import Firebase from "@/components/Firebase";
import JsonLd from "@/components/JsonLd";
import { ThemeProvider } from "@/components/ThemeProvider";
import { i18n, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import resume from "@/resume.json";

const inter = Inter({
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const {
    basics: { name, summary: description },
  } = resume;

  return {
    title: name,
    description,
    metadataBase: new URL("https://matiasjrb.com.ar"),
    alternates: {
      canonical: "https://matiasjrb.com.ar",
      languages: {
        en: "/en",
        es: "/es",
      },
    },
    // ... resto de metadata
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <Firebase />
          <GlowingCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Fase 3: Actualización de Componentes (4-6 horas)

#### 3.7 Actualizar componentes para usar traducciones

**Ejemplo: `src/components/Presentation.tsx`**

```typescript
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

export default async function Presentation({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);

  return (
    <section>
      <h1>{dict.presentation.greeting} Matias Rios</h1>
      <p>{dict.presentation.role}</p>
      <button>{dict.presentation.cta}</button>
    </section>
  );
}
```

#### 3.8 Componentes que necesitan actualización

- `Presentation.tsx` ✓
- `About.tsx` ✓
- `History.tsx` (experiencia laboral)
- `Footer.tsx` ✓
- `MobileHeader.tsx` (navegación)
- `ThemeSwitch.tsx` (accesibilidad)
- `KeyboardNavigationHint.tsx` ✓
- `SkipToContent.tsx` ✓

### Fase 4: Contenido Dinámico - Resume.json (3-4 horas)

#### 3.9 Crear versiones multiidioma del resume

**Estructura propuesta:**

```
src/
├── data/
│   ├── resume/
│   │   ├── en.json
│   │   └── es.json
```

**Archivo: `src/data/resume/en.json`**

```json
{
  "basics": {
    "name": "Matias Rios",
    "label": "Software Engineer",
    "summary": "+5 years of experience as a software engineer...",
    "about": "<p>In 2013, I pursued a degree in computer engineering...</p>"
  },
  "work": [
    {
      "name": "Mangxo",
      "position": "Tech Lead",
      "summary": "I am responsible for technically and operationally leading..."
    }
  ]
}
```

**Archivo: `src/data/resume/es.json`**

```json
{
  "basics": {
    "name": "Matias Rios",
    "label": "Ingeniero de Software",
    "summary": "+5 años de experiencia como ingeniero de software...",
    "about": "<p>En 2013, comencé una carrera en ingeniería informática...</p>"
  },
  "work": [
    {
      "name": "Mangxo",
      "position": "Tech Lead",
      "summary": "Soy responsable de liderar técnica y operacionalmente..."
    }
  ]
}
```

#### 3.10 Función helper para obtener resume

**Archivo: `src/data/get-resume.ts`**

```typescript
import "server-only";
import type { Locale } from "@/i18n/config";

const resumes = {
  en: () => import("./resume/en.json").then((module) => module.default),
  es: () => import("./resume/es.json").then((module) => module.default),
};

export const getResume = async (locale: Locale) =>
  resumes[locale]?.() ?? resumes.en();
```

### Fase 5: Selector de Idioma (2-3 horas)

#### 3.11 Crear componente Language Switcher

**Archivo: `src/components/LanguageSwitcher.tsx`**

```typescript
"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18n, type Locale } from "@/i18n/config";

export default function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: Locale;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    if (!pathname) return;

    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="language-switcher">
      {i18n.locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={currentLocale === locale ? "active" : ""}
          aria-label={`Switch to ${locale}`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
```

### Fase 6: SEO y Metadatos (2-3 horas)

#### 3.12 Actualizar Sitemap

**Archivo: `src/app/sitemap.ts`**

```typescript
import { MetadataRoute } from "next";
import { i18n } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://matiasjrb.com.ar";

  return i18n.locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          i18n.locales.map((l) => [l, `${baseUrl}/${l}`])
        ),
      },
    },
  ]);
}
```

#### 3.13 Actualizar robots.txt

**Archivo: `src/app/robots.ts`**

```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://matiasjrb.com.ar/sitemap.xml",
  };
}
```

#### 3.14 Actualizar JSON-LD

**Archivo: `src/components/JsonLd.tsx`**

```typescript
import resume from "@/resume.json";

export default function JsonLd({ lang }: { lang?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: resume.basics.name,
    inLanguage: lang || "en",
    // ... resto del schema
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

## 4. Testing y Validación

### 4.1 Checklist de Testing

- [ ] Navegación entre idiomas funciona correctamente
- [ ] URL refleja el idioma actual (`/en/`, `/es/`)
- [ ] Redirección automática según idioma del navegador
- [ ] Todas las traducciones están completas
- [ ] SEO: hreflang tags correctos
- [ ] Sitemap incluye todas las versiones de idioma
- [ ] Metadata diferente por idioma
- [ ] Accesibilidad: atributo lang correcto en HTML
- [ ] Performance: no afecta tiempos de carga
- [ ] Generación estática funciona para ambos idiomas

### 4.2 Comandos de Testing

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Verificar rutas generadas
ls -la .next/server/app/

# Preview de producción
npm run start
```

## 5. Optimizaciones Avanzadas

### 5.1 Cookie de Preferencia de Idioma

```typescript
// src/middleware.ts
import { cookies } from "next/headers";

function getLocale(request: NextRequest): string {
  // 1. Verificar cookie
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as Locale)) {
    return cookieLocale;
  }

  // 2. Verificar Accept-Language header
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  return match(languages, i18n.locales, i18n.defaultLocale);
}
```

### 5.2 Preload de Traducciones

```typescript
// En layout.tsx
import { getDictionary } from "@/i18n/get-dictionary";

export default async function Layout({ params }) {
  const { lang } = await params;
  // Preload both dictionaries in parallel
  const [dict, resume] = await Promise.all([
    getDictionary(lang),
    getResume(lang),
  ]);

  // ...
}
```

### 5.3 TypeScript Type Safety

```typescript
// src/i18n/types.ts
import type enDict from "./dictionaries/en.json";

export type Dictionary = typeof enDict;
export type DictionaryKey = keyof Dictionary;
```

## 6. Alternativa: Usando next-intl (Recomendado)

Si prefieres una solución más robusta:

```bash
npm install next-intl
```

**Ventajas:**

- Manejo automático de plurales
- Formateo de fechas y números
- Mensajes interpolados
- Type safety completo
- Mejor DX

**Configuración básica:**

```typescript
// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./dictionaries/${locale}.json`)).default,
  };
});
```

## 7. Cronograma Estimado

| Fase    | Descripción               | Tiempo | Prioridad |
| ------- | ------------------------- | ------ | --------- |
| 1       | Configuración base        | 2-3h   | Alta      |
| 2       | Reestructuración rutas    | 3-4h   | Alta      |
| 3       | Actualización componentes | 4-6h   | Alta      |
| 4       | Contenido dinámico        | 3-4h   | Media     |
| 5       | Selector de idioma        | 2-3h   | Media     |
| 6       | SEO y metadatos           | 2-3h   | Alta      |
| Testing | Validación completa       | 2-3h   | Alta      |

**Total estimado: 18-26 horas**

## 8. Consideraciones Importantes

### 8.1 Performance

- Las traducciones se cargan solo en el servidor
- Zero impact en bundle de JavaScript del cliente
- Static generation para ambos idiomas

### 8.2 SEO

- URLs únicas por idioma
- Hreflang tags automáticos
- Sitemap multiidioma
- Metadata localizada

### 8.3 Accesibilidad

- Atributo lang correcto en HTML
- Traducciones de aria-labels
- Navegación por teclado mantiene idioma

### 8.4 Mantenimiento

- Centralized translations
- Type-safe con TypeScript
- Fácil agregar nuevos idiomas
- Separation of concerns

## 9. Recursos Adicionales

- [Next.js i18n Docs](https://nextjs.org/docs/app/guides/internationalization)
- [next-intl](https://next-intl.dev/)
- [Minimal i18n example](https://github.com/vercel/next.js/tree/canary/examples/i18n-routing)
- [Google i18n Guidelines](https://developers.google.com/search/docs/specialty/international)

## 10. Próximos Pasos

1. Revisar y aprobar este plan
2. Instalar dependencias necesarias
3. Crear branch de feature: `feature/i18n-implementation`
4. Implementar fase por fase
5. Testing exhaustivo
6. Deploy a staging
7. Review y ajustes
8. Deploy a producción
9. Monitorear analytics por idioma

---

**¿Quieres que proceda con la implementación?**
