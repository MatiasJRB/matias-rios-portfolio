# Detección Automática de Idioma - Guía Completa

## 🌍 Cómo Funciona la Detección Automática

Tu portfolio ahora detecta **automáticamente** el idioma del usuario mediante un sistema de prioridades inteligente.

### 📊 Orden de Prioridades

```
1. Cookie de preferencia (NEXT_LOCALE) ✨ NUEVO
   ↓ (si no existe)
2. Header Accept-Language del navegador
   ↓ (si no coincide con idiomas soportados)
3. Idioma predeterminado (inglés)
```

## 🔧 Componentes del Sistema

### 1. **Middleware** (`src/middleware.ts`)

El middleware intercepta **todas las peticiones** y aplica esta lógica:

```typescript
function getLocale(request: NextRequest): string {
  // 1️⃣ Primero: Verificar cookie de preferencia
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && i18n.locales.includes(cookieLocale)) {
    return cookieLocale // ✅ Usa la preferencia guardada
  }

  // 2️⃣ Segundo: Detectar del navegador
  const languages = new Negotiator({ headers }).languages()
  return match(languages, i18n.locales, i18n.defaultLocale)
}
```

**Características**:
- ✅ Lee la cookie `NEXT_LOCALE` primero
- ✅ Si no existe cookie, usa `Accept-Language` del navegador
- ✅ Guarda automáticamente la preferencia en cookie (1 año)
- ✅ Actualiza la cookie cuando el usuario cambia de idioma

### 2. **LanguageSwitcher** (`src/components/LanguageSwitcher.tsx`)

Cuando el usuario cambia manualmente el idioma:

```typescript
const switchLocale = (newLocale: Locale) => {
  // Guardar preferencia en cookie
  setLocaleCookie(newLocale) // ✨ NUEVO
  
  // Navegar a la nueva ruta
  router.push(`/${newLocale}/...`)
}
```

**Características**:
- ✅ Guarda la preferencia del usuario
- ✅ La cookie persiste por 1 año
- ✅ Se respeta en todas las visitas futuras

### 3. **Cookie Helper** (`src/i18n/cookies.ts`)

Funciones auxiliares para manejar cookies:

```typescript
// Guardar preferencia
setLocaleCookie('es') // Guarda por 1 año

// Leer preferencia (cliente)
getLocaleCookie() // Returns 'es' | 'en' | null
```

## 🎯 Flujos de Usuario

### Escenario 1: Primera Visita

```
Usuario visita → matiasjrb.com.ar
         ↓
Middleware detecta idioma del navegador
         ↓
Navegador configurado en español → Redirige a /es/
         ↓
Guarda cookie: NEXT_LOCALE=es
         ↓
Usuario ve contenido en español ✨
```

### Escenario 2: Cambio Manual de Idioma

```
Usuario en /es/ → Hace clic en "EN"
         ↓
LanguageSwitcher actualiza cookie: NEXT_LOCALE=en
         ↓
Navega a /en/
         ↓
Próximas visitas usarán inglés automáticamente ✨
```

### Escenario 3: Visita Recurrente

```
Usuario retorna a matiasjrb.com.ar
         ↓
Middleware lee cookie: NEXT_LOCALE=en
         ↓
Redirige directamente a /en/
         ↓
Ignora el idioma del navegador ✨
```

### Escenario 4: Usuario Cambia Config del Navegador

```
Usuario con cookie NEXT_LOCALE=en
         ↓
Cambia navegador a español
         ↓
Middleware SIGUE usando inglés (respeta la cookie)
         ↓
Usuario puede cambiar manualmente si lo desea
```

## 🔍 Detalles Técnicos

### Headers Accept-Language

El navegador envía un header como:

```
Accept-Language: es-AR,es;q=0.9,en-US;q=0.8,en;q=0.7
```

**Interpretación**:
- `es-AR` (prioridad máxima)
- `es` (0.9)
- `en-US` (0.8)
- `en` (0.7)

El sistema usa **@formatjs/intl-localematcher** para encontrar la mejor coincidencia.

### Cookie Configuration

```javascript
{
  name: 'NEXT_LOCALE',
  value: 'es' | 'en',
  maxAge: 365 * 24 * 60 * 60, // 1 año
  path: '/',
  SameSite: 'Lax'
}
```

### Middleware Matcher

```typescript
matcher: ['/((?!_next|api|icons|images|.*\\..*).*)']
```

**Excluye**:
- `/_next/*` - Assets de Next.js
- `/api/*` - API routes
- `/icons/*` - Iconos
- `/images/*` - Imágenes
- Archivos con extensión (`.js`, `.css`, etc.)

## 🧪 Cómo Probar

### Test 1: Detección Automática

1. **Borrar cookies del sitio** (DevTools → Application → Cookies)
2. **Configurar navegador en español**:
   - Chrome: Settings → Languages → Español (Argentina)
3. **Visitar** `http://localhost:3000`
4. **Verificar**: Debería redirigir a `/es/`

### Test 2: Cambio Manual

1. **En `/es/`**: Click en botón "EN"
2. **Verificar cookie** (DevTools → Application → Cookies)
   - Debe existir `NEXT_LOCALE=en`
3. **Recargar página**: Sigue en `/en/`

### Test 3: Persistencia

1. **Cerrar navegador** completamente
2. **Abrir de nuevo** y visitar el sitio
3. **Verificar**: Mantiene el último idioma seleccionado

### Test 4: Navegador en Inglés

1. **Configurar navegador en inglés**
2. **Borrar cookies**
3. **Visitar sitio**: Debería ir a `/en/`

## 🎨 Personalización

### Cambiar Duración de Cookie

En `src/i18n/cookies.ts`:

```typescript
// De 1 año a 30 días
maxAge: 30 * 24 * 60 * 60
```

### Forzar Respeto al Navegador

Si prefieres que siempre detecte del navegador (sin cookies):

```typescript
// En middleware.ts, comentar la parte de cookie
function getLocale(request: NextRequest): string {
  // const cookieLocale = ... ❌ Comentar esto
  
  // Siempre detectar del navegador
  const negotiatorHeaders = ...
  return match(languages, i18n.locales, i18n.defaultLocale)
}
```

### Agregar Detección de Geolocalización

Podrías usar headers de Vercel/Cloudflare:

```typescript
function getLocale(request: NextRequest): string {
  // Cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale) return cookieLocale
  
  // Geolocalización (Vercel)
  const country = request.headers.get('x-vercel-ip-country')
  if (country === 'AR' || country === 'ES') return 'es'
  
  // Accept-Language
  // ...
}
```

## 📊 Analytics Recomendados

Para trackear qué idioma usan más tus usuarios:

```typescript
// En LanguageSwitcher.tsx
const switchLocale = (newLocale: Locale) => {
  // Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'language_change', {
      previous_language: currentLocale,
      new_language: newLocale,
    })
  }
  
  setLocaleCookie(newLocale)
  router.push(...)
}
```

## ✅ Ventajas de Este Sistema

| Ventaja | Descripción |
|---------|-------------|
| 🎯 **Automático** | Detecta idioma sin intervención del usuario |
| 💾 **Persistente** | Recuerda preferencia del usuario |
| 🚀 **Rápido** | Cookie se lee antes de renderizar |
| 🌍 **Inteligente** | Usa mejores prácticas de i18n |
| 🔒 **Seguro** | Cookie con SameSite=Lax |
| ⚡ **Performance** | Zero impacto en bundle JS |

## 🐛 Troubleshooting

### Cookie no se guarda

**Problema**: La cookie no persiste entre recargas.

**Solución**: Verificar que el navegador permite cookies:
```javascript
// DevTools Console
document.cookie = "test=1"
console.log(document.cookie) // Debe mostrar "test=1"
```

### Siempre redirige al mismo idioma

**Problema**: Ignora el cambio de idioma.

**Solución**: Borrar la cookie `NEXT_LOCALE`:
```javascript
// DevTools Console
document.cookie = "NEXT_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
```

### Middleware no ejecuta

**Problema**: No hay redirección automática.

**Solución**: Verificar que `middleware.ts` está en `src/`:
```
src/
├── middleware.ts  ✅ Debe estar aquí
└── app/
```

## 🎉 Resumen

Tu portfolio ahora tiene **detección automática de idioma inteligente**:

1. ✅ **Primera visita**: Detecta del navegador
2. ✅ **Cambio manual**: Guarda preferencia
3. ✅ **Visitas futuras**: Respeta preferencia guardada
4. ✅ **Cookie persistente**: 1 año de duración
5. ✅ **SEO friendly**: URLs limpias (`/en/`, `/es/`)

¡Los usuarios ahora verán automáticamente el contenido en su idioma preferido! 🌍
