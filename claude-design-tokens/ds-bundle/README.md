# Crystalis (Кристалис) — how to build with this design system

Crystalis is a **token + reference-card** design system for Russian dental-clinic landing pages. It ships **design tokens, an Onest webfont, and 34 reference preview cards** — **not** importable React components. `window.Crystalis` is intentionally empty. You build each component yourself in your own React/HTML, styling it with the CSS variables and utility classes below, and copying the exact markup from each component's `.html` card.

## Setup (do this first, or everything renders unstyled)

1. Import the root stylesheet once at the app root: it pulls in the Onest font and every token.
   ```js
   import "./styles.css"; // @imports fonts/onest.css + tokens/tokens.css
   ```
2. **Light theme only.** There is no dark mode; the dark Header/Footer/Logo variants are dark surfaces, not a theme.
3. Font is **Onest** (Cyrillic + Latin, weights 400/500/600/700), already wired via `--font-sans`. Set `font-family: var(--font-sans)` on the body.
4. Content is Russian (Cyrillic) by default — use realistic Russian copy.

## Styling idiom: CSS variables + `.text-*` classes

Style with `var(--token)`. **Do not invent class names or hex colors** — use these:

**Colors — primitive ramps** (`50…900`): `--color-primary-*` (индиго, base `#3538CD`), `--color-accent-*` (лайм, base `#B4F03A`), `--color-neutral-*`, `--color-success-*`, `--color-warning-*`, `--color-error-*`, `--color-info-*`.

**Colors — semantic (prefer these):**
- Text: `--color-text-primary` `--color-text-secondary` `--color-text-tertiary` `--color-text-brand` `--color-text-accent` `--color-text-on-neutral` `--color-text-on-primary` `--color-text-inverse` `--color-text-disabled` `--color-text-success` `--color-text-error`
- Backgrounds: `--color-bg-canvas` `--color-bg-subtle` `--color-bg-muted` `--color-bg-brand-subtle` `--color-bg-accent-subtle` `--color-bg-inverse`
- Surface / border: `--color-surface-default` `--color-surface-sunken`; `--color-border-default` `--color-border-subtle` `--color-border-strong` `--color-border-accent` `--color-border-error` `--color-border-focus`
- Actions (buttons): `--color-action-neutral` (+ `-hover` `-pressed`), `--color-action-secondary` (+ `-hover`), `--color-action-primary` (+ `-hover`)

**Scales:** radius `--radius-{none,xs,sm,md,lg,xl,2xl,full}` · spacing `--space-{3xs,2xs,xs,sm,md,lg,xl,2xl,3xl,4xl,5xl}` plus `--space-{container-x,grid-gap,section-y,section-y-mobile}` · shadow `--shadow-{xs,sm,md,lg,xl,focus}` · border width `--border-{sm,md,lg}` · icon size `--icon-{sm,md,lg,xl,2xl}` · breakpoints `--bp-{mobile,tablet,laptop,desktop}`.

**Typography:** apply a class instead of hand-setting size/weight: `.text-display .text-h1 .text-h2 .text-h3 .text-h4 .text-h5 .text-body-lg .text-body-md .text-body-sm .text-label-lg .text-label-md .text-label-sm .text-button-lg .text-button-md .text-button-sm .text-caption .text-overline .text-quote`. (No italics in Onest — use Medium 500 / `.text-quote` for citations.)

**Accessibility rule (WCAG AA):** white text only on indigo (`--color-primary-*`) or dark surfaces. On lime (`--color-accent-*`) white fails contrast — use `--color-text-on-primary` (`#1F3304`). **Icons** are RemixIcon (Apache-2.0, Line/Fill); not bundled — use your own RemixIcon set or inline SVG, sized with `--icon-*`.

## Where the truth lives

- Token definitions: `tokens/tokens.css` (CSS vars + `.text-*`) and `tokens/design-tokens.json` (structured). The Onest `@font-face` is in `fonts/onest.css`.
- **Per component** (`components/<Group>/<Name>/`): read `<Name>.html` for the **exact markup, classes, and states** (this is the canonical source — copy it), `<Name>.prompt.md` for the variant/prop matrix, `<Name>.d.ts` for the props spec. Groups: Atoms, Molecules, Organisms, Foundations.

## Idiomatic snippet — a Primary button (built from Button.html)

```jsx
<button
  className="text-button-md"
  style={{
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: "var(--space-xs)", height: 44, padding: "var(--space-sm) 20px",
    border: "none", borderRadius: "var(--radius-md)", cursor: "pointer",
    fontFamily: "var(--font-sans)",
    background: "var(--color-action-neutral)", color: "var(--color-text-on-neutral)",
  }}
>
  Записаться
</button>
```
Accent variant: swap to `background: var(--color-action-primary); color: var(--color-text-on-primary)`. For every other component, open its `.html` card and mirror the same token-driven structure.


---

## Component index (34 cards)

### Atoms

- **Avatar** — `components/Atoms/Avatar/Avatar.html` · `Avatar.prompt.md` · `Avatar.d.ts`
- **Badge** — `components/Atoms/Badge/Badge.html` · `Badge.prompt.md` · `Badge.d.ts`
- **Button** — `components/Atoms/Button/Button.html` · `Button.prompt.md` · `Button.d.ts`
- **Checkbox** — `components/Atoms/Checkbox/Checkbox.html` · `Checkbox.prompt.md` · `Checkbox.d.ts`
- **Divider** — `components/Atoms/Divider/Divider.html` · `Divider.prompt.md` · `Divider.d.ts`
- **IconButton** — `components/Atoms/IconButton/IconButton.html` · `IconButton.prompt.md` · `IconButton.d.ts`
- **Input** — `components/Atoms/Input/Input.html` · `Input.prompt.md` · `Input.d.ts`
- **Link** — `components/Atoms/Link/Link.html` · `Link.prompt.md` · `Link.d.ts`
- **Radio** — `components/Atoms/Radio/Radio.html` · `Radio.prompt.md` · `Radio.d.ts`
- **Rating** — `components/Atoms/Rating/Rating.html` · `Rating.prompt.md` · `Rating.d.ts`
- **Switch** — `components/Atoms/Switch/Switch.html` · `Switch.prompt.md` · `Switch.d.ts`
- **Tooltip** — `components/Atoms/Tooltip/Tooltip.html` · `Tooltip.prompt.md` · `Tooltip.d.ts`

### Molecules

- **Accordion** — `components/Molecules/Accordion/Accordion.html` · `Accordion.prompt.md` · `Accordion.d.ts`
- **Alert** — `components/Molecules/Alert/Alert.html` · `Alert.prompt.md` · `Alert.d.ts`
- **Card / Doctor** — `components/Molecules/CardDoctor/CardDoctor.html` · `CardDoctor.prompt.md` · `CardDoctor.d.ts`
- **Card / Price** — `components/Molecules/CardPrice/CardPrice.html` · `CardPrice.prompt.md` · `CardPrice.d.ts`
- **Card / Review** — `components/Molecules/CardReview/CardReview.html` · `CardReview.prompt.md` · `CardReview.d.ts`
- **Card / Service** — `components/Molecules/CardService/CardService.html` · `CardService.prompt.md` · `CardService.d.ts`
- **Card / Stat** — `components/Molecules/CardStat/CardStat.html` · `CardStat.prompt.md` · `CardStat.d.ts`
- **CarouselControls** — `components/Molecules/CarouselControls/CarouselControls.html` · `CarouselControls.prompt.md` · `CarouselControls.d.ts`
- **ContactItem** — `components/Molecules/ContactItem/ContactItem.html` · `ContactItem.prompt.md` · `ContactItem.d.ts`
- **Modal** — `components/Molecules/Modal/Modal.html` · `Modal.prompt.md` · `Modal.d.ts`
- **SectionHeader** — `components/Molecules/SectionHeader/SectionHeader.html` · `SectionHeader.prompt.md` · `SectionHeader.d.ts`
- **Select** — `components/Molecules/Select/Select.html` · `Select.prompt.md` · `Select.d.ts`
- **Tabs** — `components/Molecules/Tabs/Tabs.html` · `Tabs.prompt.md` · `Tabs.d.ts`
- **Toast** — `components/Molecules/Toast/Toast.html` · `Toast.prompt.md` · `Toast.d.ts`

### Organisms

- **Footer** — `components/Organisms/Footer/Footer.html` · `Footer.prompt.md` · `Footer.d.ts`
- **Header** — `components/Organisms/Header/Header.html` · `Header.prompt.md` · `Header.d.ts`
- **Logo** — `components/Organisms/Logo/Logo.html` · `Logo.prompt.md` · `Logo.d.ts`

### Foundations

- **Colors** — `components/Foundations/Colors/Colors.html` · `Colors.prompt.md`
- **Icons** — `components/Foundations/Icons/Icons.html` · `Icons.prompt.md`
- **Shadows** — `components/Foundations/Shadows/Shadows.html` · `Shadows.prompt.md`
- **SpacingRadius** — `components/Foundations/SpacingRadius/SpacingRadius.html` · `SpacingRadius.prompt.md`
- **Typography** — `components/Foundations/Typography/Typography.html` · `Typography.prompt.md`

