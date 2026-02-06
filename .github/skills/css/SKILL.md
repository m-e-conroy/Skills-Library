---
name: css-modern-mastery
description: Expert implementation of modern CSS techniques including Grid/Flexbox, Container Queries, advanced animations, SVG styling, and accessibility-first design. Focuses on scalable, maintainable, and high-performance UI components.
# argument-hint: "[layout|animation|responsive|a11y]"
allowed-tools: Read, Grep, Glob
---

# Modern CSS Architecture & Design Mastery

## Purpose
Apply expert-level CSS techniques to build responsive, accessible, and high-performance user interfaces. This skill focuses on leveraging modern browser capabilities (Grid, Container Queries, :has(), Nesting) to reduce reliance on JavaScript and increase design fidelity.

## Invocation
- **Manual**: /css-modern-mastery [topic]
- **Automatic**: Triggered when requests involve "CSS styling", "layout design", "responsive fix", "CSS animation", or "centering elements".
- **Arguments**: Optional $0 to focus on a specific area (e.g., layout, a11y).

## Prerequisites & Permissions
- Standard workspace reading tools.
- No external libraries required.

## Core Workflows

### 1. Robust Layout Construction
*   **Flexbox**: Use for 1D alignment and flexible components. Prefer gap over margins for spacing.
*   **Grid**: Use for 2D layouts. Master grid-template-areas for readable complex structures and minmax(0, 1fr) to prevent layout overflow.
*   **Subgrid**: Use grid-template-columns: subgrid to align nested children with the parent grid.

### 2. Mobile-First & Responsive Strategy
*   **Mobile-First**: Define base styles outside media queries. Use min-width queries to layer complexity.
*   **Fluid Typography**: Use clamp(min, preferred, max) for scales that adapt without breakpoints.
*   **Container Queries**: Use @container for components that respond to their parent's width, enabling truly modular UI kits.

### 3. Advanced Design & Styling
*   **CSS Variables**: Use for themes and dynamic values (e.g., --brand-color).
*   **Modern Selectors**: Utilize :has() for parent styling based on children, and :is()/:where() for managing specificity.
*   **SVG Styling**: Target SVG segments with CSS classes for hover states, filters, and stroke animations.

### 4. Animation & Motion
*   **Performance**: Animate only transform and opacity to stay on the compositor thread.
*   **Scroll-Driven**: Implement scroll-timeline for parallax or progress indicators without JS.
*   **View Transitions**: Use view-transition-name for seamless morphing between page states.

### 5. Accessibility (A11y)
*   **Focus States**: Never disable :focus without providing a visible :focus-visible alternative.
*   **Motion Control**: Always wrap heavy animations in @media (prefers-reduced-motion: no-preference).
*   **Semantic Contrast**: Use color-mix() and relative color syntax to ensure contrast ratios meet WCAG standards.

## Examples

### Example 1 — Card Component with Container Queries
**Task**: Create a card that switches to horizontal layout when wide enough.
**Implementation**:
\`\`\`css
.card-container { container-type: inline-size; }

.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@container (min-width: 400px) {
  .card { flex-direction: row; align-items: center; }
}
\`\`\`

### Example 2 — The Interactive SVG Button
**Task**: Animate an SVG icon inside a button using CSS Nesting and Variables.
**Implementation**:
\`\`\`css
.btn {
  --icon-speed: 0.3s;
  display: flex;
  align-items: center;

  svg {
    transition: transform var(--icon-speed) ease;
    fill: currentColor;
  }

  &:hover svg {
    transform: rotate(15deg) scale(1.1);
  }
}
\`\`\`

## Problem Solving & Debugging
*   **Stacking Contexts**: Use isolation: isolate to create a new stacking context without hacking z-index.
*   **Specificity Wars**: Use @layer to define priority groups (e.g., base, components, utilities).
*   **Layout Overflow**: Debug with outline: 1px solid red on * to find elements breaking the viewport.

## Safety & Guardrails
- **Refuse Anti-Patterns**: Avoid !important unless overriding inline styles. Avoid fixed heights on containers with text.
- **Privacy**: Be mindful of :visited styling limitations.
- **Performance**: Warn against heavy use of filter: blur() or backdrop-filter on large mobile areas.

## Notes for maintainers
- CSS Spec Tracker: https://cssdb.org/
- Check Can I Use for features like Subgrid or Scroll-Timeline before deploying to legacy-heavy environments.
