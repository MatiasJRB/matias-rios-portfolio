# ♿ Plan de Accesibilidad - Portfolio Web

## 🎯 Objetivo

Lograr **WCAG 2.1 Level AA compliance** y una puntuación de **95+ en Lighthouse Accessibility**.

## 📊 Auditoría Actual

### ✅ Fortalezas Identificadas

- ✅ **Estructura semántica**: HTML5 elements apropiados
- ✅ **Responsive design**: Funciona en múltiples dispositivos
- ✅ **Color contrast**: Cumple ratios básicos en modo oscuro
- ✅ **Focus management**: Estados de focus visibles

### ❌ Issues Críticos Detectados

#### **1. Navegación y Focus**

```typescript
// Problemas actuales
- Falta skip navigation links
- Focus trap inexistente en modales
- Tab order no optimizado
- No hay focus indicators consistentes
```

#### **2. Content y Labels**

```typescript
// Problemas actuales
- Falta alt text descriptivo en logos
- No hay aria-labels en iconos
- Headings hierarchy inconsistente
- Links sin contexto descriptivo
```

#### **3. Color y Contraste**

```typescript
// Problemas actuales
- Light mode sin implementar completamente
- Algunos elementos de bajo contraste
- Información solo por color (icons)
- No hay high contrast mode
```

## 🚀 Plan de Implementación

### **FASE 1: Fundamentos (Semana 1)**

#### **P0 - Skip Navigation**

```typescript
// components/SkipNavigation.tsx
export default function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                 bg-blue-600 text-white px-4 py-2 rounded-md z-50 
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Skip to main content
    </a>
  );
}
```

#### **P0 - Semantic HTML Structure**

```typescript
// Estructura mejorada
<main id="main-content" role="main">
  <section aria-labelledby="about-heading">
    <h2 id="about-heading" className="sr-only">
      About Matias Rios
    </h2>
    <About />
  </section>

  <section aria-labelledby="experience-heading">
    <h2 id="experience-heading" className="sr-only">
      Work Experience
    </h2>
    <History />
  </section>
</main>
```

#### **P0 - Focus Management**

```typescript
// utils/focusManager.ts
export const focusManager = {
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    // Implementation for focus trapping
  },

  restoreFocus: (previousElement: HTMLElement) => {
    previousElement?.focus();
  },
};
```

### **FASE 2: Content Accessibility (Semana 2)**

#### **P0 - Alt Texts y Labels**

```typescript
// History.tsx - Mejoras
<Image
  src={getCompanyLogo(job.name)!}
  alt={`${job.name} company logo - ${job.position} role`}
  width={32}
  height={32}
  className="object-contain"
/>;

// Icon improvements
{
  getIconForHighlight(task);
}
<span className="sr-only">
  {getIconDescription(task)} - {task}
</span>;
```

#### **P0 - ARIA Labels**

```typescript
// SocialMedia.tsx - Mejoras
<button
  onClick={() => handleURL(profile.url)}
  aria-label={`Visit Matias Rios' ${getProfileName(profile.icon)} profile`}
  className="..."
>
  <IconComponent size={24} aria-hidden="true" />
</button>
```

#### **P1 - Headings Hierarchy**

```typescript
// Estructura semántica mejorada
<h1>Matias Rios</h1>
  <h2>About</h2>
  <h2>Experience</h2>
    <h3>{job.position} at {job.name}</h3>
      <h4>Key Responsibilities</h4>
```

### **FASE 3: Theme y Contraste (Semana 3)**

#### **P0 - High Contrast Mode**

```typescript
// ThemeSwitch.tsx - Expansion
const themes = [
  { name: "light", icon: FaSun, label: "Light theme" },
  { name: "dark", icon: FaMoon, label: "Dark theme" },
  { name: "high-contrast", icon: FaEye, label: "High contrast" },
  { name: "system", icon: FaDesktop, label: "System preference" },
];
```

#### **P0 - Color Contrast Compliance**

```css
/* globals.css - Contraste mejorado */
:root {
  --text-primary: #111827; /* 4.5:1 ratio */
  --text-secondary: #374151; /* 4.5:1 ratio */
  --text-accent: #059669; /* 4.5:1 ratio */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
}

.dark {
  --text-primary: #f9fafb; /* 4.5:1 ratio */
  --text-secondary: #d1d5db; /* 4.5:1 ratio */
  --text-accent: #10b981; /* 4.5:1 ratio */
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
}

.high-contrast {
  --text-primary: #000000; /* 21:1 ratio */
  --text-secondary: #000000; /* 21:1 ratio */
  --bg-primary: #ffffff;
  --bg-secondary: #ffffff;
}
```

### **FASE 4: Interactividad (Semana 4)**

#### **P1 - Keyboard Navigation**

```typescript
// hooks/useKeyboardNavigation.ts
export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Tab":
          // Enhanced tab navigation
          break;
        case "Escape":
          // Close modals/dropdowns
          break;
        case "Enter":
        case " ":
          // Activate interactive elements
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
}
```

#### **P1 - Screen Reader Optimizations**

```typescript
// components/ScreenReaderContent.tsx
export function ScreenReaderContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <span className="sr-only">{children}</span>;
}

// Usage in components
<ScreenReaderContent>
  Currently viewing work experience at {job.name}
</ScreenReaderContent>;
```

## 🧪 Testing Strategy

### **Automated Testing**

```json
{
  "devDependencies": {
    "@axe-core/react": "^4.8.0",
    "jest-axe": "^8.0.0",
    "cypress-axe": "^1.5.0"
  }
}
```

```typescript
// __tests__/accessibility.test.tsx
import { axe, toHaveNoViolations } from "jest-axe";
import { render } from "@testing-library/react";

expect.extend(toHaveNoViolations);

test("should not have accessibility violations", async () => {
  const { container } = render(<HomePage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### **Manual Testing Checklist**

#### **Screen Readers**

- [ ] NVDA (Windows) - Navegación completa
- [ ] JAWS (Windows) - Compatibilidad empresarial
- [ ] VoiceOver (Mac) - Testing en Safari
- [ ] TalkBack (Android) - Mobile testing

#### **Keyboard Navigation**

- [ ] Tab order lógico y predecible
- [ ] Todos los elementos interactivos accesibles
- [ ] Focus indicators claramente visibles
- [ ] Skip links funcionando correctamente

#### **Motor Disabilities**

- [ ] Click targets mínimo 44x44px
- [ ] Hover states no requeridos para funcionalidad
- [ ] Tiempo suficiente para interacciones
- [ ] No hay flickering o movimiento excesivo

## 📊 Métricas de Éxito

### **Lighthouse Accessibility Score**

```
Target: 95+
Current: ~78 (estimado)

Mejoras esperadas:
- Semantic HTML: +5 puntos
- ARIA labels: +8 puntos
- Color contrast: +4 puntos
- Focus management: +5 puntos
```

### **WCAG 2.1 Compliance**

```
Level A: 100% compliance
Level AA: 95%+ compliance
Level AAA: 80%+ compliance (aspiracional)
```

### **Real User Metrics**

```typescript
// Analytics para accesibilidad
const a11yMetrics = {
  screenReaderUsers: "track via analytics",
  keyboardOnlyUsers: "track navigation patterns",
  highContrastUsers: "track theme preferences",
  assistiveTechErrors: "error tracking específico",
};
```

## 🛠️ Herramientas de Desarrollo

### **VS Code Extensions**

```json
{
  "recommendations": [
    "deque-systems.vscode-axe-linter",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### **ESLint Rules**

```javascript
// eslint.config.mjs
{
  extends: [
    'plugin:jsx-a11y/recommended'
  ],
  rules: {
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error'
  }
}
```

## 🚀 Action Items Inmediatos

### **Esta Semana (Quick Wins)**

1. [ ] Agregar skip navigation links
2. [ ] Mejorar alt texts en imágenes existentes
3. [ ] Implementar aria-labels en iconos
4. [ ] Verificar heading hierarchy

### **Próximas 2 Semanas**

1. [ ] Implementar focus management completo
2. [ ] High contrast theme
3. [ ] Keyboard navigation mejorada
4. [ ] Screen reader testing básico

### **Mes Completo**

1. [ ] Automated accessibility testing
2. [ ] Manual testing con usuarios
3. [ ] Documentation completa
4. [ ] Performance optimizations

## 🎯 Consideraciones Especiales

### **Portfolio Context**

```typescript
// Specific to portfolio sites
const portfolioA11y = {
  projectShowcase: "Alt texts descriptivos para screenshots",
  skillsVisualization: "Alternativas textuales para gráficos",
  contactForms: "Error handling accesible",
  downloadableCV: "Formatos alternativos (TXT, HTML)",
};
```

### **International Users**

```typescript
// Future considerations
const i18nA11y = {
  rightToLeft: "RTL support para idiomas árabes",
  fontScaling: "Support para escalado de texto",
  culturalColors: "Color meanings en diferentes culturas",
};
```

---

## 📋 Conclusión

Este plan de accesibilidad se enfoca en mejoras incrementales que maximizan el impacto para usuarios con discapacidades mientras mantienen una excelente experiencia para todos los usuarios. La implementación por fases permite validación continua y mejoras iterativas.
