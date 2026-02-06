---
name: svg-animation-expert
description: Expert implementation of script-free SVG animations and interactive logic using CSS and SMIL 3.0. Specialized in path morphing, complex transforms, and event-driven transitions without JavaScript or external libraries.
# argument-hint: "[css|smil|hybrid]"
allowed-tools: Read, Grep, Glob
---

# SVG Animation & Interactive Logic (JS-Free)

## Purpose
Strategic implementation of declarative SVG animations using CSS and SMIL 3.0. This skill enables high-performance, self-contained assets that support interactive state changes, complex path morphing, and motion-path tracking without the overhead or security risks of JavaScript.

## Invocation
- **Manual**: `/svg-animation-expert [technique]`
- **Automatic**: Use when the user requests "SVG animation", "CSS SVG", "SMIL", "path morphing", or "script-free interaction".
- **Arguments**: Optional `$0` to specify focus (e.g., `smil` for path morphing or `css` for hardware-accelerated transforms).

## Prerequisites & Permissions
- Standard workspace reading tools.
- No external dependencies required (Pure standard SVG/CSS).

## Workflow

1.  **Architecture Selection**:
    *   **CSS Animations**: Use for `transform`, `opacity`, and `fill`. Best for hardware-accelerated loops and hover states (`:hover`).
    *   **SMIL (<animate>, <animateMotion>)**: Use for attributes CSS cannot reach: `d` (path morphing), `viewBox`, and complex event chaining (e.g., `begin="btn.click"`).

2.  **Implementation Logic**:
    *   **Path Morphing**: Ensure both `d` attributes have the same number of points and command types. Use `<animate attributeName="d">`.
    *   **Motion Following**: Use `<animateMotion>` with `<mpath>` for objects following complex bezier curves.
    *   **Interactive Chaining**: Use SMIL `begin` and `end` values to create logic flows (e.g., `begin="anim1.end + 0.5s"`).

3.  **Optimization**:
    *   Use `transform-box: fill-box;` and `transform-origin: center;` in CSS to simplify rotation logic.
    *   Prefer CSS for simple loops (lower battery impact in browsers like Safari).
    *   Use `calcMode="spline"` and `keySplines` in SMIL for professional easing.

## Examples

### Example 1 — CSS Pulse with SMIL Path Morph
**Command**: Create a button that pulses via CSS and changes its shape via SMIL when clicked.
**Implementation**:
```xml
<svg viewBox="0 0 100 100">
  <style>
    .pulse { animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
  </style>
  <path id="shape" class="pulse" d="M10,10 L90,10 L90,90 L10,90 Z" fill="crimson">
    <animate attributeName="d" begin="shape.click" dur="0.5s" fill="freeze"
             to="M50,10 L90,50 L50,90 L10,50 Z" />
  </path>
</svg>
```

### Example 2 — Motion Path tracking
**Command**: Animate a circle following a spiral.
**Implementation**:
```xml
<path id="spiral" d="M50,50 Q70,10 90,50 T50,90 T10,50 T50,10" fill="none" stroke="#ccc" />
<circle r="5" fill="blue">
  <animateMotion dur="4s" repeatCount="indefinite" rotate="auto">
    <mpath href="#spiral" />
  </animateMotion>
</circle>
```

## Safety & Guardrails
- **No JavaScript**: Do not suggest or include `<script>` tags or inline `on*` events.
- **Accessibility**: Always include `<title>` and `<desc>` for animated components.
- **Fallbacks**: Mention that SMIL isn't supported in IE11 (irrelevant for modern web) or some static image renderers.

## Notes for maintainers
- SMIL 3.0 Reference: https://www.w3.org/TR/SMIL3/
- CSS Path Animation (`d: path(...)`) is partially supported in Blink/WebKit but SMIL is the portable "gold standard" for path morphing in pure SVG files.
