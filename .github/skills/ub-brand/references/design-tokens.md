# UB Brand — Design Tokens Reference

Design tokens are the single source of truth for all visual values. They are
implemented as CSS custom properties using the naming convention:

```
--ub-{category}-{name}[-{modifier}]
```

Define them at `:root` (or the highest relevant scope) in a `tokens.css` file.
Components and pages consume them via `var(--ub-*)` — never hardcode raw values.

---

## Color Tokens

### Primary Palette

| Token | Value | Description |
|-------|-------|-------------|
| `--ub-color-blue` | `#005bbb` | UB Blue — primary brand color |
| `--ub-color-white` | `#ffffff` | Hayes Hall White |
| `--ub-color-black` | `#000000` | Bulls Black — text default |

### Secondary Palette

| Token | Value | Color Name |
|-------|-------|------------|
| `--ub-color-autumn` | `#e56a54` | Letchworth Autumn |
| `--ub-color-solar` | `#ffc72c` | Solar Strand |
| `--ub-color-greiner` | `#ebec00` | Greiner Green |
| `--ub-color-lasalle` | `#00a69c` | Lake LaSalle |
| `--ub-color-brick` | `#990000` | Capen Brick |
| `--ub-color-bronze` | `#ad841f` | Bronze Buffalo |
| `--ub-color-olmsted` | `#6da04b` | Olmsted Green |
| `--ub-color-whirlpool` | `#006570` | Niagara Whirlpool |
| `--ub-color-victor` | `#2f9fd0` | Victor E. Blue |
| `--ub-color-harriman` | `#002f56` | Harriman Blue |
| `--ub-color-baird` | `#e4e4e4` | Baird Point |
| `--ub-color-gray` | `#666666` | Townsend Gray |

### Semantic Aliases

Prefer these over raw palette tokens — they communicate intent.

| Token | Value | Use |
|-------|-------|-----|
| `--ub-color-primary` | `var(--ub-color-blue)` | Primary actions, links, active states |
| `--ub-color-primary-dark` | `var(--ub-color-harriman)` | Hover/active on primary |
| `--ub-color-bg` | `var(--ub-color-white)` | Page background |
| `--ub-color-text` | `var(--ub-color-black)` | Default body text |
| `--ub-color-text-muted` | `var(--ub-color-gray)` | Secondary / helper text |
| `--ub-color-border` | `var(--ub-color-baird)` | Default borders |
| `--ub-color-success` | `var(--ub-color-olmsted)` | Success states |
| `--ub-color-warning` | `var(--ub-color-solar)` | Warning states |
| `--ub-color-danger` | `var(--ub-color-brick)` | Error / danger states |
| `--ub-color-info` | `var(--ub-color-victor)` | Informational states |
| `--ub-color-focus-ring` | `var(--ub-color-blue)` | Keyboard focus outline |

---

## Typography Tokens

### Font Families

| Token | Value |
|-------|-------|
| `--ub-font-sans` | `"Sofia", Arial, sans-serif` |
| `--ub-font-serif` | `"More", Georgia, serif` |
| `--ub-font-display` | `"Kievit", "Sofia", Arial, sans-serif` |
| `--ub-font-icon` | `"ubcms"` |

### Font Sizes (modular scale — base 16px, ratio 1.25)

| Token | rem | px |
|-------|-----|----|
| `--ub-text-xs` | `0.75rem` | 12px |
| `--ub-text-sm` | `0.875rem` | 14px |
| `--ub-text-base` | `1rem` | 16px |
| `--ub-text-md` | `1.125rem` | 18px |
| `--ub-text-lg` | `1.25rem` | 20px |
| `--ub-text-xl` | `1.5rem` | 24px |
| `--ub-text-2xl` | `1.875rem` | 30px |
| `--ub-text-3xl` | `2.25rem` | 36px |
| `--ub-text-4xl` | `3rem` | 48px |

### Font Weights

| Token | Value |
|-------|-------|
| `--ub-weight-normal` | `400` |
| `--ub-weight-medium` | `500` |
| `--ub-weight-bold` | `700` |

### Line Heights

| Token | Value | Use |
|-------|-------|-----|
| `--ub-leading-tight` | `1.2` | Headings |
| `--ub-leading-normal` | `1.5` | Body text |
| `--ub-leading-loose` | `1.75` | Long-form / relaxed reading |

---

## Spacing Tokens (8px base grid)

All spacing values are multiples of 8px. Use these for margins, paddings, gaps, and
any other dimensional spacing.

| Token | rem | px |
|-------|-----|----|
| `--ub-space-0` | `0` | 0px |
| `--ub-space-1` | `0.25rem` | 4px |
| `--ub-space-2` | `0.5rem` | 8px |
| `--ub-space-3` | `0.75rem` | 12px |
| `--ub-space-4` | `1rem` | 16px |
| `--ub-space-5` | `1.25rem` | 20px |
| `--ub-space-6` | `1.5rem` | 24px |
| `--ub-space-8` | `2rem` | 32px |
| `--ub-space-10` | `2.5rem` | 40px |
| `--ub-space-12` | `3rem` | 48px |
| `--ub-space-16` | `4rem` | 64px |
| `--ub-space-20` | `5rem` | 80px |

---

## Border Radius Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--ub-radius-none` | `0` | Square corners |
| `--ub-radius-sm` | `0.25rem` (4px) | Subtle rounding (inputs, tags) |
| `--ub-radius-md` | `0.5rem` (8px) | Cards, modals, standard containers |
| `--ub-radius-lg` | `1rem` (16px) | Large cards, feature sections |
| `--ub-radius-full` | `9999px` | Pills, fully rounded badges/buttons |

---

## Shadow Tokens

| Token | Value |
|-------|-------|
| `--ub-shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `--ub-shadow-md` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` |
| `--ub-shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` |
| `--ub-shadow-xl` | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` |

---

## Transition Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--ub-transition-fast` | `150ms ease` | Micro-interactions (hover, focus rings) |
| `--ub-transition-normal` | `250ms ease` | Standard state changes |
| `--ub-transition-slow` | `400ms ease` | Deliberate, large transitions |

---

## Z-Index Scale

| Token | Value | Layer |
|-------|-------|-------|
| `--ub-z-base` | `0` | Default document flow |
| `--ub-z-dropdown` | `100` | Dropdowns, popovers |
| `--ub-z-sticky` | `200` | Sticky headers and toolbars |
| `--ub-z-overlay` | `300` | Backdrop overlays |
| `--ub-z-modal` | `400` | Modal dialogs |
| `--ub-z-toast` | `500` | Toast / snackbar notifications |
| `--ub-z-tooltip` | `600` | Tooltips |

---

## Minimal `tokens.css` Bootstrap

Copy this block into any project to establish the UB token foundation:

```css
:root {
  /* Colors — primary */
  --ub-color-blue:      #005bbb;
  --ub-color-white:     #ffffff;
  --ub-color-black:     #000000;

  /* Colors — secondary */
  --ub-color-autumn:    #e56a54;
  --ub-color-solar:     #ffc72c;
  --ub-color-greiner:   #ebec00;
  --ub-color-lasalle:   #00a69c;
  --ub-color-brick:     #990000;
  --ub-color-bronze:    #ad841f;
  --ub-color-olmsted:   #6da04b;
  --ub-color-whirlpool: #006570;
  --ub-color-victor:    #2f9fd0;
  --ub-color-harriman:  #002f56;
  --ub-color-baird:     #e4e4e4;
  --ub-color-gray:      #666666;

  /* Colors — semantic */
  --ub-color-primary:       var(--ub-color-blue);
  --ub-color-primary-dark:  var(--ub-color-harriman);
  --ub-color-bg:            var(--ub-color-white);
  --ub-color-text:          var(--ub-color-black);
  --ub-color-text-muted:    var(--ub-color-gray);
  --ub-color-border:        var(--ub-color-baird);
  --ub-color-success:       var(--ub-color-olmsted);
  --ub-color-warning:       var(--ub-color-solar);
  --ub-color-danger:        var(--ub-color-brick);
  --ub-color-info:          var(--ub-color-victor);
  --ub-color-focus-ring:    var(--ub-color-blue);

  /* Typography */
  --ub-font-sans:    "Sofia", Arial, sans-serif;
  --ub-font-serif:   "More", Georgia, serif;
  --ub-font-display: "Kievit", "Sofia", Arial, sans-serif;

  --ub-text-xs:   0.75rem;
  --ub-text-sm:   0.875rem;
  --ub-text-base: 1rem;
  --ub-text-md:   1.125rem;
  --ub-text-lg:   1.25rem;
  --ub-text-xl:   1.5rem;
  --ub-text-2xl:  1.875rem;
  --ub-text-3xl:  2.25rem;
  --ub-text-4xl:  3rem;

  --ub-weight-normal: 400;
  --ub-weight-medium: 500;
  --ub-weight-bold:   700;

  --ub-leading-tight:  1.2;
  --ub-leading-normal: 1.5;
  --ub-leading-loose:  1.75;

  /* Spacing (8px grid) */
  --ub-space-0:  0;
  --ub-space-1:  0.25rem;
  --ub-space-2:  0.5rem;
  --ub-space-3:  0.75rem;
  --ub-space-4:  1rem;
  --ub-space-5:  1.25rem;
  --ub-space-6:  1.5rem;
  --ub-space-8:  2rem;
  --ub-space-10: 2.5rem;
  --ub-space-12: 3rem;
  --ub-space-16: 4rem;
  --ub-space-20: 5rem;

  /* Border Radius */
  --ub-radius-none: 0;
  --ub-radius-sm:   0.25rem;
  --ub-radius-md:   0.5rem;
  --ub-radius-lg:   1rem;
  --ub-radius-full: 9999px;

  /* Shadows */
  --ub-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --ub-shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --ub-shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
  --ub-shadow-xl: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04);

  /* Transitions */
  --ub-transition-fast:   150ms ease;
  --ub-transition-normal: 250ms ease;
  --ub-transition-slow:   400ms ease;

  /* Z-Index */
  --ub-z-base:     0;
  --ub-z-dropdown: 100;
  --ub-z-sticky:   200;
  --ub-z-overlay:  300;
  --ub-z-modal:    400;
  --ub-z-toast:    500;
  --ub-z-tooltip:  600;
}
```
