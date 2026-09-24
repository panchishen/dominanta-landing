# Дизайн-система «Кристалис»

Дизайн-система универсального одностраничного сайта для стоматологических клиник. Единый источник — файл Figma `ro7HcMQfATSiCQa6IbhYCc`; этот документ и токены (`tokens.css`, `design-tokens.json`, `tailwind.config.js`) сгенерированы из него автоматически.

## Принципы

- **Тема:** только светлая.
- **Шрифт:** Onest (Google Fonts, кириллица). Начертания: Regular 400, Medium 500, SemiBold 600, Bold 700. Курсива нет — для цитат используется Medium.
- **Палитра:** индиго (`primary`, база `#3538CD`) + лайм (`accent`, база `#B4F03A`).
- **Скругления:** чем крупнее объект, тем больше радиус.
- **Доступность (WCAG AA):** белый текст — только на индиго или тёмном фоне. На лайме белый не проходит по контрасту, поэтому используется тёмный `color/text/on-accent` (`#1F3304`).

## Как использовать

- `tokens.css` — CSS-переменные (`:root`) + утилитарные классы типографики `.text-*`. Подключите файл и обращайтесь к `var(--token)`.
- `design-tokens.json` — структурированные токены (значения, типы, алиасы) для сборщиков (Style Dictionary и т.п.).
- `tailwind.config.js` — те же токены в `theme.extend` (цвета, отступы, радиусы, тени, шрифты, брейкпоинты).
- **Claude Design** — пакет синхронизируется командой `/design-sync`; каждый компонент попадает в раздел Design systems как превью-карточка.

## Цвета

### Примитивы

**Accent · лайм**

| Токен | CSS-переменная | HEX |
| --- | --- | --- |
| `color/accent/50` | `--color-accent-50` | `#F5FCE0` |
| `color/accent/100` | `--color-accent-100` | `#E9F9B8` |
| `color/accent/200` | `--color-accent-200` | `#D8F584` |
| `color/accent/300` | `--color-accent-300` | `#C6F157` |
| `color/accent/400` | `--color-accent-400` | `#BFF44A` |
| `color/accent/500` | `--color-accent-500` | `#B4F03A` |
| `color/accent/600` | `--color-accent-600` | `#97D219` |
| `color/accent/700` | `--color-accent-700` | `#739E0E` |
| `color/accent/800` | `--color-accent-800` | `#4F6E0A` |
| `color/accent/900` | `--color-accent-900` | `#1F3304` |

**Error**

| Токен | CSS-переменная | HEX |
| --- | --- | --- |
| `color/error/50` | `--color-error-50` | `#FCEBEB` |
| `color/error/500` | `--color-error-500` | `#D83A3A` |
| `color/error/600` | `--color-error-600` | `#B62A2A` |

**Info**

| Токен | CSS-переменная | HEX |
| --- | --- | --- |
| `color/info/50` | `--color-info-50` | `#E9F1FD` |
| `color/info/500` | `--color-info-500` | `#2E73D6` |
| `color/info/600` | `--color-info-600` | `#1F5AB0` |

**Neutral**

| Токен | CSS-переменная | HEX |
| --- | --- | --- |
| `color/neutral/0` | `--color-neutral-0` | `#FFFFFF` |
| `color/neutral/50` | `--color-neutral-50` | `#F7F9FA` |
| `color/neutral/100` | `--color-neutral-100` | `#EFF2F4` |
| `color/neutral/200` | `--color-neutral-200` | `#E2E7EA` |
| `color/neutral/300` | `--color-neutral-300` | `#CBD3D8` |
| `color/neutral/400` | `--color-neutral-400` | `#9FAAB1` |
| `color/neutral/500` | `--color-neutral-500` | `#6E7A82` |
| `color/neutral/600` | `--color-neutral-600` | `#515C64` |
| `color/neutral/700` | `--color-neutral-700` | `#3B454C` |
| `color/neutral/800` | `--color-neutral-800` | `#252D32` |
| `color/neutral/900` | `--color-neutral-900` | `#141A1E` |

**Primary · индиго**

| Токен | CSS-переменная | HEX |
| --- | --- | --- |
| `color/primary/50` | `--color-primary-50` | `#EEEEFB` |
| `color/primary/100` | `--color-primary-100` | `#D9DAF6` |
| `color/primary/200` | `--color-primary-200` | `#B7B8EE` |
| `color/primary/300` | `--color-primary-300` | `#9092E6` |
| `color/primary/400` | `--color-primary-400` | `#6366DA` |
| `color/primary/500` | `--color-primary-500` | `#3538CD` |
| `color/primary/600` | `--color-primary-600` | `#2A2DAE` |
| `color/primary/700` | `--color-primary-700` | `#23258C` |
| `color/primary/800` | `--color-primary-800` | `#1D1E6E` |
| `color/primary/900` | `--color-primary-900` | `#161747` |

**Success**

| Токен | CSS-переменная | HEX |
| --- | --- | --- |
| `color/success/50` | `--color-success-50` | `#E7F6EE` |
| `color/success/500` | `--color-success-500` | `#1E9E5A` |
| `color/success/600` | `--color-success-600` | `#157A45` |

**Warning**

| Токен | CSS-переменная | HEX |
| --- | --- | --- |
| `color/warning/50` | `--color-warning-50` | `#FDF3E2` |
| `color/warning/500` | `--color-warning-500` | `#E08A12` |
| `color/warning/600` | `--color-warning-600` | `#B86E0C` |

**brand**

| Токен | CSS-переменная | HEX |
| --- | --- | --- |
| `color/brand/50` | `--color-brand-50` | `#F5FCE0` |
| `color/brand/100` | `--color-brand-100` | `#E9F9B8` |
| `color/brand/200` | `--color-brand-200` | `#D8F584` |
| `color/brand/300` | `--color-brand-300` | `#C6F157` |
| `color/brand/400` | `--color-brand-400` | `#BFF44A` |
| `color/brand/500` | `--color-brand-500` | `#B4F03A` |
| `color/brand/600` | `--color-brand-600` | `#97D219` |
| `color/brand/700` | `--color-brand-700` | `#739E0E` |
| `color/brand/800` | `--color-brand-800` | `#4F6E0A` |
| `color/brand/900` | `--color-brand-900` | `#1F3304` |
| `color/brand/on` | `--color-brand-on` | `#1F3304` |

### Семантические токены (режим Light)

**color/action**

| Токен | CSS-переменная | Алиас | HEX |
| --- | --- | --- | --- |
| `color/action/primary` | `--color-action-primary` | `color/brand/500` | `#B4F03A` |
| `color/action/primary-hover` | `--color-action-primary-hover` | `color/brand/600` | `#97D219` |
| `color/action/neutral` | `--color-action-neutral` | `color/neutral/900` | `#141A1E` |
| `color/action/neutral-hover` | `--color-action-neutral-hover` | `color/neutral/800` | `#252D32` |
| `color/action/neutral-pressed` | `--color-action-neutral-pressed` | `color/neutral/900` | `#141A1E` |
| `color/action/secondary` | `--color-action-secondary` | `color/neutral/100` | `#EFF2F4` |
| `color/action/secondary-hover` | `--color-action-secondary-hover` | `color/neutral/200` | `#E2E7EA` |

**color/bg**

| Токен | CSS-переменная | Алиас | HEX |
| --- | --- | --- | --- |
| `color/bg/accent-subtle` | `--color-bg-accent-subtle` | `color/brand/50` | `#F5FCE0` |
| `color/bg/brand-subtle` | `--color-bg-brand-subtle` | `color/neutral/100` | `#EFF2F4` |
| `color/bg/canvas` | `--color-bg-canvas` | `color/neutral/0` | `#FFFFFF` |
| `color/bg/inverse` | `--color-bg-inverse` | `color/neutral/900` | `#141A1E` |
| `color/bg/muted` | `--color-bg-muted` | `color/neutral/100` | `#EFF2F4` |
| `color/bg/subtle` | `--color-bg-subtle` | `color/neutral/50` | `#F7F9FA` |

**color/border**

| Токен | CSS-переменная | Алиас | HEX |
| --- | --- | --- | --- |
| `color/border/accent` | `--color-border-accent` | `color/brand/500` | `#B4F03A` |
| `color/border/default` | `--color-border-default` | `color/neutral/200` | `#E2E7EA` |
| `color/border/error` | `--color-border-error` | `color/error/500` | `#D83A3A` |
| `color/border/focus` | `--color-border-focus` | `color/brand/600` | `#97D219` |
| `color/border/strong` | `--color-border-strong` | `color/neutral/300` | `#CBD3D8` |
| `color/border/subtle` | `--color-border-subtle` | `color/neutral/100` | `#EFF2F4` |

**color/feedback**

| Токен | CSS-переменная | Алиас | HEX |
| --- | --- | --- | --- |
| `color/feedback/error` | `--color-feedback-error` | `color/error/500` | `#D83A3A` |
| `color/feedback/error-bg` | `--color-feedback-error-bg` | `color/error/50` | `#FCEBEB` |
| `color/feedback/info` | `--color-feedback-info` | `color/info/500` | `#2E73D6` |
| `color/feedback/info-bg` | `--color-feedback-info-bg` | `color/info/50` | `#E9F1FD` |
| `color/feedback/success` | `--color-feedback-success` | `color/success/500` | `#1E9E5A` |
| `color/feedback/success-bg` | `--color-feedback-success-bg` | `color/success/50` | `#E7F6EE` |
| `color/feedback/warning` | `--color-feedback-warning` | `color/warning/500` | `#E08A12` |
| `color/feedback/warning-bg` | `--color-feedback-warning-bg` | `color/warning/50` | `#FDF3E2` |

**color/focus**

| Токен | CSS-переменная | Алиас | HEX |
| --- | --- | --- | --- |
| `color/focus/ring` | `--color-focus-ring` | `color/brand/600` | `#97D219` |

**color/surface**

| Токен | CSS-переменная | Алиас | HEX |
| --- | --- | --- | --- |
| `color/surface/default` | `--color-surface-default` | `color/neutral/0` | `#FFFFFF` |
| `color/surface/sunken` | `--color-surface-sunken` | `color/neutral/50` | `#F7F9FA` |

**color/text**

| Токен | CSS-переменная | Алиас | HEX |
| --- | --- | --- | --- |
| `color/text/accent` | `--color-text-accent` | `color/brand/700` | `#739E0E` |
| `color/text/accent-on-dark` | `--color-text-accent-on-dark` | `color/brand/400` | `#BFF44A` |
| `color/text/accent-strong` | `--color-text-accent-strong` | `color/brand/800` | `#4F6E0A` |
| `color/text/brand` | `--color-text-brand` | `color/brand/800` | `#4F6E0A` |
| `color/text/disabled` | `--color-text-disabled` | `color/neutral/400` | `#9FAAB1` |
| `color/text/error` | `--color-text-error` | `color/error/600` | `#B62A2A` |
| `color/text/inverse` | `--color-text-inverse` | `color/neutral/0` | `#FFFFFF` |
| `color/text/on-primary` | `--color-text-on-primary` | `color/brand/on` | `#1F3304` |
| `color/text/on-neutral` | `--color-text-on-neutral` | `color/neutral/0` | `#FFFFFF` |
| `color/text/primary` | `--color-text-primary` | `color/neutral/900` | `#141A1E` |
| `color/text/secondary` | `--color-text-secondary` | `color/neutral/600` | `#515C64` |
| `color/text/success` | `--color-text-success` | `color/success/600` | `#157A45` |
| `color/text/tertiary` | `--color-text-tertiary` | `color/neutral/500` | `#6E7A82` |

## Типографика

Шрифт Onest. Класс — имя стиля с дефисом (`text/h1` → `.text-h1`).

| Стиль | Класс | Начертание | Размер / интерлиньяж | Трекинг |
| --- | --- | --- | --- | --- |
| `text/display` | `.text-display` | Medium | 60/64 | -1.5% |
| `text/h1` | `.text-h1` | Medium | 48/56 | -1% |
| `text/h2` | `.text-h2` | SemiBold | 38/46 | -0.5% |
| `text/h3` | `.text-h3` | SemiBold | 30/38 | 0% |
| `text/h4` | `.text-h4` | SemiBold | 24/32 | 0% |
| `text/quote` | `.text-quote` | Medium | 22/32 | 0% |
| `text/h5` | `.text-h5` | SemiBold | 20/28 | 0% |
| `text/body-lg` | `.text-body-lg` | Regular | 18/28 | 0% |
| `text/button-lg` | `.text-button-lg` | SemiBold | 17/24 | 0% |
| `text/body-md` | `.text-body-md` | Regular | 16/26 | 0% |
| `text/label-lg` | `.text-label-lg` | Medium | 16/20 | 0% |
| `text/button-md` | `.text-button-md` | SemiBold | 15/20 | 0% |
| `text/body-sm` | `.text-body-sm` | Regular | 14/22 | 0% |
| `text/button-sm` | `.text-button-sm` | SemiBold | 14/18 | 0% |
| `text/label-md` | `.text-label-md` | Medium | 14/18 | 0% |
| `text/overline` | `.text-overline` | SemiBold | 13/16 | 8% · UPPERCASE |
| `text/caption` | `.text-caption` | Regular | 12/16 | 0% |
| `text/label-sm` | `.text-label-sm` | Medium | 12/16 | 0% |

## Шкалы

### Отступы (space)

| Токен | CSS-переменная | Значение |
| --- | --- | --- |
| `space/3xs` | `--space-3xs` | 2 |
| `space/2xs` | `--space-2xs` | 4 |
| `space/xs` | `--space-xs` | 8 |
| `space/sm` | `--space-sm` | 12 |
| `space/md` | `--space-md` | 16 |
| `space/container-x` | `--space-container-x` | 24 |
| `space/grid-gap` | `--space-grid-gap` | 24 |
| `space/lg` | `--space-lg` | 24 |
| `space/xl` | `--space-xl` | 32 |
| `space/2xl` | `--space-2xl` | 48 |
| `space/section-y-mobile` | `--space-section-y-mobile` | 56 |
| `space/3xl` | `--space-3xl` | 64 |
| `space/4xl` | `--space-4xl` | 96 |
| `space/section-y` | `--space-section-y` | 96 |
| `space/5xl` | `--space-5xl` | 128 |

### Скругления (radius)

Правило: чипы и теги — `sm`/`full`; кнопки, инпуты, селекты — `md` (12); карточки, алерты, аккордеоны — `lg` (16); крупные поверхности и модалки — `xl` (24) / `2xl` (32); аватары и переключатели — `full`.

| Токен | CSS-переменная | Значение |
| --- | --- | --- |
| `radius/none` | `--radius-none` | 0 |
| `radius/xs` | `--radius-xs` | 4 |
| `radius/sm` | `--radius-sm` | 8 |
| `radius/md` | `--radius-md` | 12 |
| `radius/lg` | `--radius-lg` | 16 |
| `radius/xl` | `--radius-xl` | 24 |
| `radius/2xl` | `--radius-2xl` | 32 |
| `radius/full` | `--radius-full` | 999 |

### Толщина границ (border)

| Токен | CSS-переменная | Значение |
| --- | --- | --- |
| `border/sm` | `--border-sm` | 1 |
| `border/md` | `--border-md` | 1.5 |
| `border/lg` | `--border-lg` | 2 |

### Размеры иконок (icon)

| Токен | CSS-переменная | Значение |
| --- | --- | --- |
| `icon/sm` | `--icon-sm` | 16 |
| `icon/md` | `--icon-md` | 20 |
| `icon/lg` | `--icon-lg` | 24 |
| `icon/xl` | `--icon-xl` | 32 |
| `icon/2xl` | `--icon-2xl` | 40 |

### Прозрачность (opacity)

| Токен | CSS-переменная | Значение |
| --- | --- | --- |
| `opacity/hover` | `--opacity-hover` | 0.08 |
| `opacity/pressed` | `--opacity-pressed` | 0.12 |
| `opacity/disabled` | `--opacity-disabled` | 0.4 |
| `opacity/backdrop` | `--opacity-backdrop` | 0.5 |

### Сетка и контейнер (layout)

| Токен | CSS-переменная | Значение |
| --- | --- | --- |
| `layout/columns` | `--layout-columns` | 12 |
| `layout/gutter` | `--layout-gutter` | 24 |
| `layout/container-max` | `--layout-container-max` | 1200 |

### Брейкпоинты (bp)

| Токен | CSS-переменная | Значение |
| --- | --- | --- |
| `bp/mobile` | `--bp-mobile` | 375 |
| `bp/tablet` | `--bp-tablet` | 768 |
| `bp/laptop` | `--bp-laptop` | 1024 |
| `bp/desktop` | `--bp-desktop` | 1440 |

### Анимация (motion)

| Токен | CSS-переменная | Значение |
| --- | --- | --- |
| `motion/duration/exit` | `--motion-duration-exit` | 150 ms |
| `motion/duration/fast` | `--motion-duration-fast` | 150 ms |
| `motion/duration/base` | `--motion-duration-base` | 200 ms |
| `motion/duration/moderate` | `--motion-duration-moderate` | 300 ms |
| `motion/duration/slow` | `--motion-duration-slow` | 400 ms |
| `motion/easing/enter` | `--motion-easing-enter` | `cubic-bezier(0, 0, 0.2, 1)` |
| `motion/easing/exit` | `--motion-easing-exit` | `cubic-bezier(0.4, 0, 1, 1)` |
| `motion/easing/spring` | `--motion-easing-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `motion/easing/standard` | `--motion-easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` |

## Тени

| Стиль | CSS-переменная | Значение |
| --- | --- | --- |
| `shadow/focus` | `--shadow-focus` | `0px 0px 0px 4px #97D21940` |
| `shadow/xs` | `--shadow-xs` | `0px 1px 2px 0px #101E280F` |
| `shadow/sm` | `--shadow-sm` | `0px 2px 6px 0px #101E2814` |
| `shadow/md` | `--shadow-md` | `0px 6px 16px 0px #101E281A` |
| `shadow/lg` | `--shadow-lg` | `0px 12px 28px 0px #101E281F` |
| `shadow/xl` | `--shadow-xl` | `0px 24px 48px 0px #101E2829` |

## Компоненты

Сборка `Property=Value`; слой/состояние — через дефис. Все глифы — инстансы иконок RemixIcon.

### Атомы

| Компонент | Варианты / свойства |
| --- | --- |
| `Avatar` | Type (Initials/Icon/Image) × Size (SM/MD/LG) |
| `Badge` | Variant (Neutral/Primary/Success/Warning/Error/Accent) |
| `Button` | Variant (Primary/Secondary/Accent/White) × Size (SM/MD/LG) · Label: text, Icon Left: boolean, Icon Right: boolean |
| `Checkbox` | State (Unchecked/Checked/Indeterminate/Disabled) |
| `Divider` | Orientation (Horizontal/Vertical) |
| `Icon` | одиночный компонент |
| `IconButton` | Variant (Primary/Secondary/Ghost) |
| `Input` | State (Default/Hover/Focus/Filled/Error/Disabled) · Label: text, Value: text, Helper: boolean, Required: boolean |
| `Link` | State (Default/Hover/Pressed/Visited/Disabled) |
| `Radio` | State (Unselected/Selected/Disabled) |
| `Rating` | Value (3/4/5) |
| `Switch` | State (Off/On/Disabled) |
| `Tooltip` | одиночный компонент |

### Молекулы

| Компонент | Варианты / свойства |
| --- | --- |
| `Accordion` | State (Collapsed/Expanded) |
| `Alert` | Variant (Info/Success/Warning/Error) |
| `Card/Doctor` | одиночный компонент |
| `Card/Price` | Popular (False/True) |
| `Card/Review` | одиночный компонент |
| `Card/Service` | State (Default/Hover) |
| `Card/Stat` | одиночный компонент |
| `CarouselControls` | одиночный компонент |
| `ContactItem` | Type (Address/Phone/Email/Hours) |
| `Modal` | одиночный компонент |
| `SectionHeader` | одиночный компонент |
| `Select` | State (Default/Open) |
| `Tabs` | State (Active/Default/Hover) |
| `Toast` | Variant (Success/Error/Info) |

### Организмы

| Компонент | Варианты / свойства |
| --- | --- |
| `Footer` | одиночный компонент |
| `Header` | Style (Standard/Dark/Floating/Two-tier) |
| `logo` | Style (Default/Inverse) |

### Иконки

116 наборов RemixIcon (Apache 2.0), именование `icon/<name>`, у каждого варианты `Style = Line | Fill`. Размеры — из шкалы `icon/*`. Есть обёртка `Icon` с `INSTANCE_SWAP` и вынесенным наверх `Style`. Бренд-иконки соцсетей: telegram, whatsapp, instagram.

### Foundations-карточки

В пакете Claude Design отдельная группа **Foundations**: Colors, Typography, Spacing & Radius, Shadows, Icons.

---

Источник: Figma `ro7HcMQfATSiCQa6IbhYCc`. Иконки — RemixIcon (Apache 2.0). Документ сгенерирован автоматически; правьте дизайн-систему в Figma и пересоберите.
