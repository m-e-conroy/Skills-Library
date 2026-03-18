# UB Brand — Typography Reference

## Font Families

UB uses three typefaces with clearly separated roles. Mixing them freely
undermines the brand's visual coherence.

| Font | CSS Token | Role | Web Fallback |
|------|-----------|------|-------------|
| Sofia Pro | `--ub-font-sans` | Sans-serif workhorse — headings, UI labels, navigation, buttons, captions | `Arial, sans-serif` |
| More Pro | `--ub-font-serif` | Serif — body text, long-form reading, formal/editorial contexts | `Georgia, serif` |
| Freeland / Kievit | `--ub-font-display` | Display — large-scale headlines only; use sparingly as a statement | `"Sofia", Arial, sans-serif` |
| ubcms (icon font) | `--ub-font-icon` | Icon glyphs from the UB CMS icon set | — |

**Sofia Pro is the default for almost everything.** Use More Pro when the content
is long-form or editorial in nature. Reserve the display font for a single large
headline per page/screen — never for body copy, labels, or interactive elements.

---

## Font Size Scale

Sizes follow a modular scale with a base of 16px (1rem) and a ratio of 1.25.
All sizes are expressed in `rem` so user browser settings are respected.

| Token | rem | px | Typical Use |
|-------|-----|----|-------------|
| `--ub-text-xs` | `0.75rem` | 12px | Fine print, captions, badges |
| `--ub-text-sm` | `0.875rem` | 14px | Small labels, helper text, metadata |
| `--ub-text-base` | `1rem` | 16px | Body text default |
| `--ub-text-md` | `1.125rem` | 18px | Lead paragraphs, large body |
| `--ub-text-lg` | `1.25rem` | 20px | h4, subheadings |
| `--ub-text-xl` | `1.5rem` | 24px | h3 |
| `--ub-text-2xl` | `1.875rem` | 30px | h2 |
| `--ub-text-3xl` | `2.25rem` | 36px | h1 |
| `--ub-text-4xl` | `3rem` | 48px | Display / hero headlines |

**Accessibility note:** Avoid setting `font-size` below `--ub-text-sm` (14px/0.875rem)
for any text that conveys information. At `--ub-text-xs`, test carefully — it is
allowed for true supplemental content (e.g., image credits) but not for anything
a user needs to read to understand the interface.

---

## Font Weights

| Token | Value | Use |
|-------|-------|-----|
| `--ub-weight-normal` | `400` | Body text, descriptions |
| `--ub-weight-medium` | `500` | Emphasis, UI labels, nav items |
| `--ub-weight-bold` | `700` | Headings, CTAs, strong emphasis |

---

## Line Heights

Line height directly affects readability. Tight values work for short headings; looser
values help readers track long lines of body text.

| Token | Value | Use |
|-------|-------|-----|
| `--ub-leading-tight` | `1.2` | Headings and display text |
| `--ub-leading-normal` | `1.5` | Standard body text |
| `--ub-leading-loose` | `1.75` | Relaxed reading (long-form, prose) |

---

## Typography Combinations (Common Patterns)

### Page Heading
```css
font-family: var(--ub-font-sans);
font-size: var(--ub-text-3xl);     /* 36px */
font-weight: var(--ub-weight-bold);
line-height: var(--ub-leading-tight);
color: var(--ub-color-text);
```

### Section Heading (h2)
```css
font-family: var(--ub-font-sans);
font-size: var(--ub-text-2xl);     /* 30px */
font-weight: var(--ub-weight-bold);
line-height: var(--ub-leading-tight);
color: var(--ub-color-text);
```

### Body Text
```css
font-family: var(--ub-font-sans);
font-size: var(--ub-text-base);    /* 16px */
font-weight: var(--ub-weight-normal);
line-height: var(--ub-leading-normal);
color: var(--ub-color-text);
```

### Long-Form / Editorial Body
```css
font-family: var(--ub-font-serif);
font-size: var(--ub-text-base);    /* 16px */
font-weight: var(--ub-weight-normal);
line-height: var(--ub-leading-loose);
color: var(--ub-color-text);
```

### UI Label / Button
```css
font-family: var(--ub-font-sans);
font-size: var(--ub-text-sm);      /* 14px */
font-weight: var(--ub-weight-medium);
line-height: var(--ub-leading-tight);
```

### Hero Display Headline
```css
font-family: var(--ub-font-display);
font-size: var(--ub-text-4xl);     /* 48px */
font-weight: var(--ub-weight-bold);
line-height: var(--ub-leading-tight);
color: var(--ub-color-text);
```

---

## Usage Rules

1. **Never set font sizes in `px` directly** — always use a `--ub-text-*` token so
   the scale is consistent and browser zoom works correctly.
2. **Sofia Pro for UI; More Pro for prose.** When in doubt, default to Sofia Pro.
3. **Display font is a headline accent, not a typeface.** One prominent headline per
   page or section is appropriate; using it for subheadings or labels dilutes its impact.
4. **Line height matters.** Headings should use `--ub-leading-tight`; body text
   `--ub-leading-normal` or `--ub-leading-loose` for long reads.
