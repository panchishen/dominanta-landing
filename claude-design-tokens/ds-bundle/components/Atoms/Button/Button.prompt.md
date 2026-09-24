Button — Основная кнопка-действие (CTA «Записаться» и т.п.). Оси вариантов: variant (Primary/Secondary/Accent/White), size (SM/MD/LG).

**Группа:** Atoms  ·  **Подпись карточки:** Primary · Secondary · Accent · White / SM·MD·LG

## Свойства / варианты

| Prop | Тип | Значения / по умолчанию |
| --- | --- | --- |
| `label` | text | текст · default: `Записаться` |
| `iconLeft` | boolean | `true` / `false` · default: `false` |
| `iconRight` | boolean | `true` / `false` · default: `false` |
| `variant` | variant | `Primary` · `Secondary` · `Accent` · `White` |
| `size` | variant | `SM` · `MD` · `LG` |

## Как собрать

Crystalis — это **токены + эталонная разметка**, без импортируемых React-компонентов.
Собирайте `Button` сами, используя CSS-переменные дизайн-системы (`var(--…)`) из `styles.css`/`tokens/tokens.css` и утилитарные классы типографики `.text-*`.
Точная разметка и все состояния — в превью-карточке **Button.html** (откройте её как образец и повторите структуру/классы/токены).

Ключевые токены: цвета `--color-primary-*` (индиго), `--color-accent-*` (лайм), `--color-neutral-*`; радиусы `--radius-*`; отступы `--space-*`; тени `--shadow-*`; шрифт `--font-sans` (Onest).
