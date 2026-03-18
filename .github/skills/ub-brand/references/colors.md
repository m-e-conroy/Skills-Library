# UB Brand — Color Reference

## Primary Palette

These two colors are the foundation of every UB-branded work. They should be the
dominant colors in any layout, page, or product. All other colors play supporting roles.

| Color Name | Hex | CSS Token | Role |
|------------|-----|-----------|------|
| UB Blue | `#005bbb` | `--ub-color-blue` | Primary brand color — CTAs, headers, active states, dominant fills |
| Hayes Hall White | `#ffffff` | `--ub-color-white` | Background, negative space |
| Bulls Black | `#000000` | `--ub-color-black` | Default body text |

**Rule:** UB Blue and Hayes Hall White should be the predominant colors overall.
Secondary colors are used occasionally and sparingly — none should become the
dominant color for any unit, section, or page.

---

## Secondary Palette

Secondary colors provide variety and emotional range. Use them as accents — for
callouts, decorative elements, charts, data visualization, or category differentiation.
Never use a secondary color as the dominant hue for a unit.

| Color Name | Hex | CSS Token | Text on White? | Notes |
|------------|-----|-----------|----------------|-------|
| Letchworth Autumn | `#e56a54` | `--ub-color-autumn` | ❌ No | Warm accent |
| Solar Strand | `#ffc72c` | `--ub-color-solar` | ❌ No | Warning accent (needs icon/text pair) |
| Greiner Green | `#ebec00` | `--ub-color-greiner` | ❌ No | Bright accent only |
| Lake LaSalle | `#00a69c` | `--ub-color-lasalle` | ❌ No | Teal accent |
| Capen Brick | `#990000` | `--ub-color-brick` | ✅ Yes | Error/danger states; deep red |
| Bronze Buffalo | `#ad841f` | `--ub-color-bronze` | ❌ No | Warm metallic accent |
| Olmsted Green | `#6da04b` | `--ub-color-olmsted` | ❌ No | Success states (icon/text pair for a11y) |
| Niagara Whirlpool | `#006570` | `--ub-color-whirlpool` | ✅ Yes | Deep teal; body-safe |
| Victor E. Blue | `#2f9fd0` | `--ub-color-victor` | ❌ No | Informational accent |
| Harriman Blue | `#002f56` | `--ub-color-harriman` | ✅ Yes | Navy; hover/pressed on UB Blue |
| Baird Point | `#e4e4e4` | `--ub-color-baird` | ❌ No | Subtle borders, dividers, backgrounds |
| Townsend Gray | `#666666` | `--ub-color-gray` | ✅ Yes | Secondary/muted text |

### Accessible on White — Summary

These are the **only** secondary colors safe to use as text color on a white background
without additional contrast workarounds:

| Color | Hex | Contrast Ratio |
|-------|-----|---------------|
| Capen Brick | `#990000` | ~7.3:1 |
| Niagara Whirlpool | `#006570` | ~6.1:1 |
| Harriman Blue | `#002f56` | ~13.8:1 |
| Townsend Gray | `#666666` | ~5.7:1 |

UB Blue (`#005bbb`) achieves ~4.29:1 on white — passes for large text (≥18px or
≥14px bold) but falls short of the 4.5:1 threshold for smaller normal-weight text.
For body copy, use Bulls Black or Harriman Blue instead.

---

## Semantic Color Aliases

When implementing the UB brand in CSS, always use semantic aliases rather than
raw palette tokens. Semantic names communicate intent, making code readable and
enabling future theming without touching every component.

| Semantic Token | Maps To | Hex | Use |
|----------------|---------|-----|-----|
| `--ub-color-primary` | `--ub-color-blue` | `#005bbb` | Primary actions, links, active states |
| `--ub-color-primary-dark` | `--ub-color-harriman` | `#002f56` | Hover/pressed on primary |
| `--ub-color-text` | `--ub-color-black` | `#000000` | Default body text |
| `--ub-color-text-muted` | `--ub-color-gray` | `#666666` | Secondary/helper text |
| `--ub-color-bg` | `--ub-color-white` | `#ffffff` | Page background |
| `--ub-color-border` | `--ub-color-baird` | `#e4e4e4` | Default borders and dividers |
| `--ub-color-success` | `--ub-color-olmsted` | `#6da04b` | Confirmations, success states |
| `--ub-color-warning` | `--ub-color-solar` | `#ffc72c` | Warnings (always pair with icon/label) |
| `--ub-color-danger` | `--ub-color-brick` | `#990000` | Errors, destructive actions |
| `--ub-color-info` | `--ub-color-victor` | `#2f9fd0` | Informational states |
| `--ub-color-focus-ring` | `--ub-color-blue` | `#005bbb` | Keyboard focus outline |

---

## Accessibility Rules

1. **Text contrast minimum:** 4.5:1 for normal-weight text under 18px; 3:1 for large
   text (≥18px regular or ≥14px bold).
2. **Non-text contrast:** UI component boundaries and graphical elements need 3:1.
3. **Color is never enough alone.** State changes (error, success, selected) must also
   be communicated via an icon, label, pattern, or structural change — not color only.
4. **Warning and success states:** Solar Strand and Olmsted Green don't pass contrast
   for text on white. Always accompany them with a text label or icon when used to
   convey status.
