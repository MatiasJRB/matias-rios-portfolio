---
name: "Matias Rios Portfolio"
description: "An editorial technical portfolio built as a calm, precise field journal."
colors:
  primary: "#176b45"
  primary-hover: "#115538"
  amber-accent: "#9b5f18"
  blue-accent: "#355f78"
  supporting-green: "#4d654f"
  bone-background: "#f2efe6"
  paper-surface: "#faf8f2"
  paper-hover: "#e9e4d8"
  charcoal-ink: "#171a17"
  secondary-ink: "#303630"
  muted-ink: "#4e574e"
  warm-border: "#cbc5b7"
  error: "#a63d32"
  night-background: "#101419"
  night-surface: "#171d23"
  night-surface-hover: "#202a32"
  night-ink: "#f1eee7"
  night-secondary-ink: "#d2d3d0"
  night-muted-ink: "#a5abb0"
  night-border: "#35424b"
  night-primary: "#79cbb0"
  night-amber-accent: "#d7a05b"
  project-teal: "#2f6e68"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.18em"
rounded:
  none: "0"
  sm: "0.25rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
  full: "9999px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2rem"
  xl: "3rem"
  2xl: "4rem"
  3xl: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.charcoal-ink}"
    textColor: "{colors.bone-background}"
    typography: "{typography.label}"
    rounded: "{rounded.xl}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-secondary:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.charcoal-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.xl}"
    padding: "0 1.25rem"
    height: "2.75rem"
  card-featured:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  card-archive:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.none}"
    padding: "1.5rem 0"
  chip-context:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.charcoal-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.625rem"
---

# Design System: Matias Rios Portfolio

## Overview

**Creative North Star: "The Technical Field Journal"**

The portfolio should feel like a senior engineer's field journal edited for publication: exact without becoming sterile, warm without becoming decorative, and confident without relying on spectacle. Inter keeps the interface direct, familiar, and highly readable while hierarchy comes from scale and weight rather than a contrasting display face. Warm paper and charcoal surfaces make the work feel considered; green and amber behave like sparse annotations rather than brand-colored wallpaper.

The existing two-column identity is foundational. On large screens, the profile and navigation form a steady left-hand index while the right column carries the evolving record; projects then widen across both columns. Inline project artifacts, hairline timelines, measured labels, and quiet ambient texture communicate technical depth with custom evidence instead of generic product imagery.

**Key Characteristics:**

- A restrained single-family hierarchy built through scale, weight, spacing, and measure.
- Warm bone and near-charcoal surfaces in equally intentional light and dark themes.
- Restrained green primary actions, amber annotations, and project-specific accent colors.
- Generous text measure, strong section rhythm, and a preserved two-column desktop identity.
- Custom technical SVG artifacts and linework in place of stock thumbnails.
- Short, purposeful state motion with full reduced-motion support.

## Colors

The palette resembles paper, graphite, evergreen ink, technical drafting ink, and amber indexing tabs; color is a navigational and evidentiary signal, not ambient decoration. Dark mode shifts to a cool ink canvas with mint annotations so it feels technical without inheriting an olive cast.

### Primary

- **Evergreen Annotation** (`primary`, with `night-primary` in dark mode): marks focus, selection, primary interaction, success, and the Geome7ric project family. Its rarity gives it authority.
- **Deep Evergreen** (`primary-hover`): strengthens primary interaction on hover in the light theme.

### Secondary

- **Archive Amber** (`amber-accent`, with `night-amber-accent` in dark mode): calls out supporting categories, Mango work, warnings, and secondary technical detail.

### Tertiary

- **Blueprint Blue** (`blue-accent`): identifies product-engineering capability without competing with the primary action color.
- **Field Green** (`supporting-green`): separates technical-leadership content from primary interaction.
- **Instrument Teal** (`project-teal`): gives selected project artifacts an individual but related signature.

### Neutral

- **Warm Bone** (`bone-background`): the light-mode canvas.
- **Clean Paper** (`paper-surface`): cards, composer surfaces, and lightly separated regions.
- **Handled Paper** (`paper-hover`): a quiet light-mode state layer.
- **Charcoal Ink** (`charcoal-ink`): primary text and dark light-mode actions.
- **Secondary Ink** (`secondary-ink`) and **Muted Graphite** (`muted-ink`): supporting copy, metadata, and labels while maintaining readable contrast.
- **Warm Hairline** (`warm-border`): dividers and structural borders.
- **Night Ink** (`night-background`) and **Raised Ink** (`night-surface`): cool blue-charcoal dark-mode canvas and raised surface.
- **Bone Ink** (`night-ink`), **Soft Bone** (`night-secondary-ink`), and **Ash Label** (`night-muted-ink`): the dark-mode text hierarchy.
- **Night Hairline** (`night-border`): low-contrast structure on dark surfaces.
- **Editorial Red** (`error`): errors only; never a decorative project accent.

### Named Rules

**The Annotation Rule.** Green and amber should read like marks made on the page, so keep large uninterrupted surfaces neutral.

**The Theme Parity Rule.** Dark mode is not an inversion filter; use cool ink surfaces, mint interaction accents, and warm amber annotations as authored equivalents.

## Typography

**Display Font:** Inter (with sans-serif fallback)
**Body Font:** Inter (with sans-serif fallback)

**Character:** Inter keeps names, section headings, descriptions, metadata, controls, and detailed work evidence clear and neutral. Hierarchy comes from weight, size, measure, and spacing rather than a contrasting display family.

### Hierarchy

- **Display** (semibold, `display`, tight leading): the name and rare hero-scale identity moments; it grows from 3rem to 4.5rem across the responsive range.
- **Headline** (semibold, `headline`, solid leading): primary section headings; preserve the close tracking and compact vertical form.
- **Title** (semibold, `title`, solid leading): capability areas, featured projects, and archive headings.
- **Body** (regular, `body`): descriptions and narrative evidence. Keep portfolio copy between approximately 58ch and 68ch and prefer a relaxed 1.7–1.75 line height.
- **Label** (semibold, `label`): dates, roles, group headings, and navigation; usually uppercase, widely tracked, and brief.

### Named Rules

**The Single-Family Rule.** Inter carries both hierarchy and reading. Use weight and scale deliberately; do not introduce another display, body, or monospace voice without a functional requirement.

**The Measure Rule.** Long-form text stops near 68 characters; hierarchy should create emphasis before color or decoration does.

## Layout

The spatial model is a single column below the large breakpoint and a balanced two-column grid from 1024px upward. The desktop grid preserves a sticky, full-height profile/index on the left and a naturally scrolling content record on the right, separated by a 4rem gap. The projects section and closing footer span both columns so the portfolio can shift from personal context to broad work evidence without abandoning the identity.

The main canvas is capped at 1280px and centered. Implemented horizontal gutters are 1.5rem on small screens, 3rem from 768px, and 5rem from 1024px. Major sections generally advance by 5–6rem, project content opens to 7rem on desktop, and internal component spacing follows the 8px-based spacing scale. On mobile, navigation moves out of the sticky identity, content remains in document order, and touch targets maintain a minimum 44px height.

**The Index-and-Record Rule.** Preserve the left identity/right evidence relationship on desktop; new content should join that grammar rather than replacing it with a centered landing-page stack.

**The Breathing-Room Rule.** Use borders, measure, and whitespace to separate ideas before adding extra containers.

## Elevation & Depth

The system is flat by default and gains depth through tonal layering, translucent paper surfaces, borders, and the ambient shader field. Shadows are shallow and diffuse: the portrait and featured project cards receive a restrained lift, while archive rows and capability areas remain structural and mostly flat. Backdrop blur is reserved for timeline markers and focused assistant surfaces where content must remain legible over the ambient field.

### Shadow Vocabulary

- **Ambient Card** (`0 14px 34px -26px var(--shadow-hover)`): a nearly-flat shadow for featured project cards.
- **Portrait Lift** (`8px 10px 26px var(--shadow)`): separates the asymmetric portrait from the paper canvas.
- **Composer Focus** (`0 10px 24px color-mix(in srgb, #000 10%, transparent)` plus a primary hairline): confirms active input without turning the composer into a floating modal.

### Named Rules

**The Evidence-First Depth Rule.** Elevation distinguishes interaction priority; it never substitutes for hierarchy or creates ornamental glass panels.

## Shapes

The form language combines editorial linework with gently softened tools. Featured cards and primary controls use 1rem corners; artifacts and archive rows use 0.75rem; focusable text links keep a compact 0.25rem accommodation for the focus ring. Pills and circles are limited to compact tags, timeline markers, status dots, logos, and icon buttons. The profile portrait is a deliberate exception with three 1.35rem corners and one 0.45rem corner, giving the identity a crafted signature.

Borders are usually one pixel and warm, often mixed toward transparency. Full-bleed capsules, excessive nested rounding, and unrelated organic shapes dilute the technical editorial character.

## Components

### Buttons

- **Shape:** compact, generous controls with gently curved corners (`button-primary` and `button-secondary`) and a minimum 44px touch height.
- **Primary:** charcoal ink on warm bone in light mode, reversed through theme tokens in dark mode; use for the single dominant next step.
- **Secondary:** a transparent-to-paper surface with a warm hairline border; use for contact and adjacent lower-priority actions.
- **Hover / Focus:** every standalone action button and icon control lifts by 2px over 200ms, returns to rest on press, and shows a two-pixel evergreen focus ring with background-colored offset. Preserve role-specific color changes, but do not add scale, glow, or magnetic cursor effects. Keep tap highlight visible and intentional.

### Chips

- **Style:** full pills for attached context or compact machine-readable metadata; use paper-derived fill, warm border, bold small text, and a primary-tinted edge only when the chip is actionable or selected.
- **State:** color changes must be paired with border, text, or icon change; do not rely on hue alone.

### Cards / Archive Ledger

- **Corner Style:** featured project cards are softly framed (`card-featured`); archive entries are border-separated ledger rows with no container radius (`card-archive`).
- **Background:** featured work uses a translucent paper surface; archive work begins transparent and only public rows receive a subtle primary-tinted hover/focus layer.
- **Shadow Strategy:** only featured evidence receives the ambient card shadow and a 4px hover/focus lift.
- **Archive Structure:** desktop rows use `index | project + impact | role + stack`; mobile rows collapse to one column. Impact copy follows `scope → decision → result`, stays near 65ch, and outranks technology metadata.
- **Archive Affordance:** public work makes the complete row a link and labels the destination; private work stays visually static and is explicitly labeled as a private case.
- **Border:** mix the project accent lightly into featured borders. Archive groups use shared hairlines with 1.5–1.75rem vertical row padding.
- **Signature Artifact:** each featured card begins with a project-specific inline SVG diagram in a 16:9 frame. It may scale to 1.035 and rise 2px over 420ms on card hover or focus-within; it must remain non-photographic and relevant to the project.

### Inputs / Fields

- **Style:** the assistant composer is a 1rem-corner paper field with a warm border; the textarea itself is transparent and visually belongs to the surrounding field.
- **Focus:** focus-within mixes primary into the border and adds one hairline plus a shallow shadow. The inner textarea does not add a second ring.
- **Error / Disabled:** warning color replaces the focus tint for over-limit content; disabled controls retain form and reduce opacity while using a not-allowed cursor.
- **Assistant Shell:** the chat opens with a compact identity header, clear title, scope description, and 44px controls before conversation content begins.
- **First-Use Guidance:** the welcome state offers three concrete prompt starters; selecting one fills and focuses the composer without sending automatically.
- **Avatar Palette:** the pixel cat is monochromatic Ink + Mint: a mint body, deeper mint shadow/tail/`M` mark, and the current ink/background token for facial contrast. Never introduce amber/orange inside the compact sprite.
- **Mobile Behavior:** opening the assistant must not summon the software keyboard automatically. Composer focus is desktop-only until the visitor explicitly chooses an action.

### Navigation

- **Desktop:** uppercase Inter labels pair with a horizontal rule that grows from 2.5rem to 4rem. Selected state uses primary on the rule; hover uses charcoal. Transitions use the standard 300ms material curve.
- **Mobile:** the identity becomes a compact header and leaves the page in natural reading order. Preserve theme and language controls as reachable tap targets.
- **Links:** external work links use a small northeast arrow that moves approximately 2px on hover. Keyboard focus must mirror hover emphasis.

### Capability Rows

Capability areas are border-separated rather than carded. Inter titles change to a category color on hover and keyboard focus, while a persistent 8px dot preserves the category key. Descriptions stay muted and readable; the row uses an inset focus ring so interaction never changes its geometry.

### Work Timeline

Experience highlights attach to a one-pixel vertical hairline. Circular 28px markers hold small semantic icons; hover moves the evidence 4px and mixes the company accent into the marker. This is technical annotation, not a decorative stepper.

Motion across all components is measured: 150–220ms for direct state feedback, 300ms for navigation and theme transitions, 420ms for artifact inspection, and 600ms for entrance sequencing. Section headings, education records, and closing content participate in the same entrance sequence as their adjacent content so no static element breaks the page-load composition. Under `prefers-reduced-motion: reduce`, animation and transition durations collapse to 0.01ms and shader movement stops.

## Do's and Don'ts

### Do:

- **Do** preserve the two-column desktop index and allow major work evidence to span both columns.
- **Do** use Inter consistently across display, reading, metadata, and controls, separating roles through scale and weight.
- **Do** let warm neutral surfaces, hairlines, and whitespace carry most of the composition.
- **Do** create project-specific inline SVG artifacts that explain a system, workflow, or relationship.
- **Do** match hover with keyboard focus and maintain a 44px minimum touch target for primary controls.
- **Do** stop motion cleanly for reduced-motion users, including ambient shaders.

### Don't:

- **Don't** flood a page with green, amber, gradients, glows, or glass effects; accents are annotations.
- **Don't** replace project artifacts with generic stock photography, browser mockups, or unrelated decorative geometry.
- **Don't** flatten dark mode into a mechanical inversion of the light palette.
- **Don't** wrap every section in a rounded card; border rhythm and measure are the default separators.
- **Don't** introduce another headline or body family, oversized pill language, or exaggerated spring motion.
- **Don't** remove visible focus, tap feedback, or motion preference handling for aesthetic simplicity.
