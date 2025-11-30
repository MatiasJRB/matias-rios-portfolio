// 🎨 EJEMPLO DE USO - Componentes Modernos 2025
// Este archivo muestra cómo implementar todos los nuevos efectos

import {
  MagneticButton,
  GlowCard,
  TiltCard,
  FloatingElement,
  GradientText,
  PulseGlow,
} from "@/components/AdvancedEffects";

import {
  ScrollReveal,
  ScrollParallax,
  ScrollScale,
  StaggerChildren,
  staggerItemVariants,
} from "@/components/ScrollReveal";

import { ExperimentalNav, FloatingNav } from "@/components/ExperimentalNav";
import { motion } from "framer-motion";

export default function ModernComponentsExample() {
  const navItems = [
    { id: "hero", label: "Inicio" },
    { id: "features", label: "Características" },
    { id: "projects", label: "Proyectos" },
    { id: "contact", label: "Contacto" },
  ];

  return (
    <div className="min-h-screen">
      {/* Navegación Experimental Lateral */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden lg:block z-40">
        <ExperimentalNav items={navItems} />
      </div>

      {/* Navegación Flotante (Mobile/Tablet) */}
      <FloatingNav items={navItems} />

      {/* SECCIÓN HÉROE */}
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        {/* Elemento flotante de fondo */}
        <ScrollParallax speed={0.5} className="absolute top-20 right-20">
          <FloatingElement duration={4} yOffset={20}>
            <div className="w-64 h-64 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
          </FloatingElement>
        </ScrollParallax>

        <div className="container mx-auto px-4 text-center z-10">
          <ScrollReveal direction="up">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6">
              <GradientText gradient="var(--gradient-primary)">
                Portafolio 2025
              </GradientText>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto mb-12">
              Diseño moderno con efectos visuales avanzados y animaciones
              fluidas
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <MagneticButton strength={0.3}>
              <button className="btn-modern text-lg px-8 py-4">
                Ver Proyectos
              </button>
            </MagneticButton>
          </ScrollReveal>
        </div>
      </section>

      {/* SECCIÓN CARACTERÍSTICAS */}
      <section id="features" className="py-32 px-4">
        <div className="container mx-auto">
          <ScrollReveal direction="up">
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-16">
              Características{" "}
              <span className="gradient-text-secondary">Modernas</span>
            </h2>
          </ScrollReveal>

          <StaggerChildren
            staggerDelay={0.15}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Card 1 - Glow Effect */}
            <motion.div variants={staggerItemVariants}>
              <GlowCard glowColor="#00ff94" className="h-full">
                <div className="p-8 bg-card rounded-xl border border-border h-full">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-2xl font-bold mb-4">Glow Cards</h3>
                  <p className="text-muted">
                    Cards con efectos de brillo que reaccionan al movimiento del
                    cursor
                  </p>
                </div>
              </GlowCard>
            </motion.div>

            {/* Card 2 - Tilt Effect */}
            <motion.div variants={staggerItemVariants}>
              <TiltCard maxTilt={10}>
                <div className="p-8 bg-card rounded-xl border border-border h-full">
                  <div className="text-4xl mb-4">🎭</div>
                  <h3 className="text-2xl font-bold mb-4">Tilt 3D</h3>
                  <p className="text-muted">
                    Efecto de inclinación 3D para mayor profundidad visual
                  </p>
                </div>
              </TiltCard>
            </motion.div>

            {/* Card 3 - Pulse Glow */}
            <motion.div variants={staggerItemVariants}>
              <PulseGlow color="rgba(255, 0, 110, 0.5)">
                <div className="p-8 bg-card rounded-xl border border-border h-full">
                  <div className="text-4xl mb-4">💫</div>
                  <h3 className="text-2xl font-bold mb-4">Pulse Glow</h3>
                  <p className="text-muted">
                    Efecto de pulso luminoso para elementos destacados
                  </p>
                </div>
              </PulseGlow>
            </motion.div>

            {/* Card 4 - Scroll Reveal */}
            <motion.div variants={staggerItemVariants}>
              <div className="p-8 bg-card rounded-xl border border-primary glow-card h-full">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-4">Scroll Triggers</h3>
                <p className="text-muted">
                  Animaciones activadas por scroll con múltiples direcciones
                </p>
              </div>
            </motion.div>

            {/* Card 5 - Magnetic */}
            <motion.div variants={staggerItemVariants}>
              <div className="p-8 bg-card rounded-xl border border-border h-full">
                <div className="text-4xl mb-4">🧲</div>
                <h3 className="text-2xl font-bold mb-4">Magnetic Buttons</h3>
                <p className="text-muted mb-4">
                  Botones que siguen el movimiento del cursor
                </p>
                <MagneticButton strength={0.4}>
                  <button className="px-4 py-2 rounded-lg border border-primary hover:bg-primary hover:text-black transition-colors">
                    Pruébame
                  </button>
                </MagneticButton>
              </div>
            </motion.div>

            {/* Card 6 - Gradients */}
            <motion.div variants={staggerItemVariants}>
              <div className="p-8 bg-card rounded-xl border border-border h-full">
                <div className="text-4xl mb-4">🌈</div>
                <h3 className="text-2xl font-bold mb-4">
                  <GradientText>Gradient Text</GradientText>
                </h3>
                <p className="text-muted">
                  Texto con gradientes animados para mayor impacto visual
                </p>
              </div>
            </motion.div>
          </StaggerChildren>
        </div>
      </section>

      {/* SECCIÓN PROYECTOS CON SCROLL SCALE */}
      <section id="projects" className="py-32 px-4 bg-surface">
        <div className="container mx-auto">
          <ScrollScale>
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-16">
              Proyectos <span className="gradient-text">Destacados</span>
            </h2>
          </ScrollScale>

          <div className="space-y-32">
            {[1, 2, 3].map((project) => (
              <ScrollReveal key={project} direction="up" delay={0.1}>
                <GlowCard glowColor="#8338ec">
                  <div className="p-8 md:p-12 bg-card rounded-2xl">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-bold mb-4">
                          Proyecto {project}
                        </h3>
                        <p className="text-lg text-muted mb-6">
                          Descripción del proyecto con todas las tecnologías y
                          logros alcanzados
                        </p>
                        <div className="flex gap-2 flex-wrap mb-6">
                          <span className="skill">React</span>
                          <span className="skill">TypeScript</span>
                          <span className="skill">Next.js</span>
                          <span className="skill">Tailwind</span>
                        </div>
                        <MagneticButton>
                          <button className="btn-modern">Ver Proyecto</button>
                        </MagneticButton>
                      </div>
                      <div className="aspect-video bg-gradient-primary rounded-xl opacity-50" />
                    </div>
                  </div>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN CONTACTO */}
      <section id="contact" className="py-32 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <ScrollReveal direction="up">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Trabajemos <span className="gradient-text-secondary">Juntos</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <p className="text-xl text-muted mb-12">
              ¿Tienes un proyecto en mente? Conversemos sobre cómo puedo
              ayudarte
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton strength={0.3}>
                <button className="btn-modern">Enviar Email</button>
              </MagneticButton>

              <MagneticButton strength={0.3}>
                <button className="glass px-8 py-4 rounded-xl font-bold hover:border-primary transition-all">
                  Descargar CV
                </button>
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ELEMENTOS FLOTANTES DE FONDO */}
      <div className="fixed top-20 left-10 pointer-events-none opacity-30">
        <FloatingElement duration={5} yOffset={15}>
          <div className="w-32 h-32 rounded-full bg-gradient-secondary blur-2xl" />
        </FloatingElement>
      </div>

      <div className="fixed bottom-20 right-10 pointer-events-none opacity-30">
        <FloatingElement duration={6} yOffset={20}>
          <div className="w-40 h-40 rounded-full bg-gradient-accent blur-2xl" />
        </FloatingElement>
      </div>
    </div>
  );
}

// ============================================
// GUÍA RÁPIDA DE USO
// ============================================

/*

1. GLOW CARDS
   <GlowCard glowColor="#00ff94">
     <div className="p-6">Contenido</div>
   </GlowCard>

2. TILT 3D
   <TiltCard maxTilt={15}>
     <YourCard />
   </TiltCard>

3. MAGNETIC BUTTON
   <MagneticButton strength={0.3}>
     <button>Click me</button>
   </MagneticButton>

4. SCROLL REVEAL
   <ScrollReveal direction="up" delay={0.2}>
     <YourContent />
   </ScrollReveal>

5. GRADIENT TEXT
   <GradientText gradient="var(--gradient-primary)">
     Texto destacado
   </GradientText>
   
   // O con clase CSS
   <h2 className="gradient-text">Título</h2>

6. STAGGER CHILDREN
   <StaggerChildren staggerDelay={0.1}>
     {items.map(item => (
       <motion.div variants={staggerItemVariants}>
         {item}
       </motion.div>
     ))}
   </StaggerChildren>

7. FLOATING ELEMENT
   <FloatingElement duration={3} yOffset={10}>
     <BackgroundShape />
   </FloatingElement>

8. CLASES CSS UTILITY
   - .gradient-text
   - .gradient-text-secondary
   - .glow-card
   - .btn-modern
   - .glass
   - .skill

*/
