# 🎨 Animaciones y Assets - Plan de Implementación

## ✨ Micro-animaciones Sugeridas

### **1. Loading States & Transitions**

```typescript
// Framer Motion implementations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
```

### **2. Hover Interactions**

- **Job Cards**: Subtle lift + shadow increase
- **Company Logos**: Gentle rotation + scale
- **Social Icons**: Color transition + bounce
- **Navigation**: Underline animation + color shift

### **3. Scroll-based Animations**

- **Progress Indicator**: Timeline visual mientras scrolleas
- **Section Reveals**: Fade in from bottom con stagger
- **Skills Bar**: Animated fill basado en scroll position
- **Parallax Subtle**: Background elements con movimento diferencial

## 🎯 Assets Específicos Recomendados

### **Iconografía Personalizada**

```
src/assets/icons/
├── tech-stack/
│   ├── typescript.svg
│   ├── nextjs.svg
│   ├── node.svg
│   ├── postgresql.svg
│   └── docker.svg
├── animations/
│   ├── code-brackets.json (Lottie)
│   ├── loading-dots.json
│   └── success-checkmark.json
└── illustrations/
    ├── developer-workspace.svg
    ├── team-collaboration.svg
    └── project-delivery.svg
```

### **Animated Elements**

1. **Typing Animation**: Para el nombre en Presentation
2. **Code Block**: Animated syntax highlighting
3. **Network Graph**: Conexiones entre tecnologías
4. **Progress Rings**: Para skill levels circulares

### **Background Elements**

```css
/* Subtle pattern overlays */
.code-pattern {
  background-image: url("data:image/svg+xml,<svg>...</svg>");
  opacity: 0.02;
  animation: slidePattern 20s linear infinite;
}

.dot-grid {
  background: radial-gradient(circle, #334155 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.1;
}
```

## 🎪 Implementación por Fases

### **Fase 1: Core Animations (1 semana)**

```typescript
// 1. Framer Motion setup
npm install framer-motion

// 2. Basic page transitions
// 3. Hover states para cards
// 4. Loading skeleton para History component
```

### **Fase 2: Interactive Elements (2 semanas)**

```typescript
// 1. Scroll-triggered animations (AOS alternative)
// 2. Progress indicators
// 3. Smooth scrolling enhancements
// 4. Intersection Observer para lazy loading
```

### **Fase 3: Advanced Visuals (3 semanas)**

```typescript
// 1. Lottie animations para iconos
// 2. Three.js particles (optional)
// 3. SVG path animations
// 4. Custom cursor effects
```

## 🛠️ Herramientas Recomendadas

### **Animation Libraries**

```json
{
  "framer-motion": "^11.0.0", // React animations
  "lottie-react": "^2.4.0", // After Effects animations
  "react-spring": "^9.7.0", // Physics-based animations
  "react-intersection-observer": "^9.5.0" // Scroll triggers
}
```

### **Asset Creation Tools**

- **Figma**: Para iconos y assets vectoriales
- **LottieFiles**: Animaciones pre-hechas
- **Undraw/Storyset**: Ilustraciones consistentes
- **Heroicons/Lucide**: Icon sets modernos

## 🎨 Propuesta Visual Específica

### **Color Palette Expansion**

```css
:root {
  /* Current colors + additions */
  --accent-primary: #00ee90; /* Geome7ric green */
  --accent-secondary: #3b82f6; /* Blue for tech */
  --accent-tertiary: #f59e0b; /* Orange for highlights */

  /* Gradient stops */
  --gradient-tech: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-success: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}
```

### **Typography Enhancements**

```css
/* Animated underlines */
.animated-underline {
  position: relative;
  overflow: hidden;
}

.animated-underline::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: var(--accent-primary);
  transition: left 0.3s ease;
}

.animated-underline:hover::after {
  left: 0;
}
```

## 📱 Mobile-First Animations

### **Touch-Friendly Interactions**

```typescript
// Reduced motion for mobile
const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

const animationProps = prefersReducedMotion
  ? { initial: false, animate: false }
  : { initial: { opacity: 0 }, animate: { opacity: 1 } };
```

### **Performance Considerations**

- `will-change` property para elementos animados
- `transform` y `opacity` preferidos sobre other properties
- `requestAnimationFrame` para animaciones custom
- Lazy loading para Lottie animations

## 🎯 Quick Wins Implementables

### **Esta Semana**

1. **Hover transitions** en job cards (CSS puro)
2. **Fade in animations** con CSS keyframes
3. **Loading skeleton** para History component
4. **Smooth scrolling** mejorado

### **Próximas 2 Semanas**

1. **Framer Motion** setup básico
2. **Progress indicator** en scroll
3. **Stagger animations** para highlights
4. **Theme transition** suave

### **Mes Completo**

1. **Lottie icons** para tecnologías
2. **Intersection Observer** animations
3. **Custom cursor** effects
4. **Advanced transitions** entre secciones
