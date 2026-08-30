# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Recruiters and hiring managers evaluating Matias Rios for senior engineering and technical leadership roles.
- Technical peers, founders, and potential collaborators reviewing his experience, projects, and approach to building products.
- Visitors interested in the evolution of his work and personal portfolio from 2019 to the present.

## Product Purpose

The portfolio presents Matias' professional experience, technical capabilities, selected projects, CV, and contact paths in English and Spanish. Success means a visitor can quickly understand his current role and evidence, then explore deeper context or contact him.

## Positioning

The site combines a recruiter-focused professional record with direct project evidence and an interactive history of the portfolio itself, turning the interface into proof of Matias' growth as an engineer and product builder.

## Operating Context

The experience is a public responsive website, commonly scanned on desktop by recruiters and on mobile by peers and collaborators. It supports light and dark themes, keyboard navigation, localized content, a printable CV, and an optional recruiter assistant.

## Capabilities and Constraints

- English and Spanish routes must remain available.
- The current portfolio is the default experience; historical designs are optional and selected from within the site.
- Historical eras must not depend on running obsolete Quasar or Webpack applications.
- Motion must respect `prefers-reduced-motion` and preserve keyboard and screen-reader access.
- The existing URL structure, professional content, theme system, and recruiter assistant must continue to work.

## Brand Commitments

- Product name: Matias Rios Portfolio.
- Preserve the current editorial technical field-journal identity outside the historical experience.
- Keep the voice direct, personal, technically credible, and free of fabricated claims.

## Evidence on Hand

- Structured resume data: `src/data/resume/en.json` and `src/data/resume/es.json`.
- Current design system: `DESIGN.md` and `src/app/globals.css`.
- Historical repositories and verified screenshots from 2019, 2021, 2022, 2024, 2025, and 2026.
- Historical portrait assets from the original Quasar portfolios.

## Product Principles

1. Current professional truth comes first; nostalgia is discoverable, not forced.
2. Demonstrate growth with authentic evidence rather than decorative claims.
3. Make ambitious interaction optional, accessible, and performant.
4. Preserve bilingual parity and responsive behavior.
5. Prefer maintained present-day components over shipping obsolete runtimes.

## Accessibility & Inclusion

Keyboard navigation, visible focus, semantic controls, screen-reader labels, reduced-motion behavior, sufficient contrast, and usable mobile touch targets are required.
