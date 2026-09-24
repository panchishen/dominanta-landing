ContactItem — Строка контакта (адрес/телефон/почта/часы). Оси вариантов: type (Address/Phone/Email/Hours).

**Группа:** Molecules  ·  **Подпись карточки:** Address · Phone · Email · Hours

## Свойства / варианты

| Prop | Тип | Значения / по умолчанию |
| --- | --- | --- |
| `type` | variant | `Address` · `Phone` · `Email` · `Hours` |

## Как собрать

Crystalis — это **токены + эталонная разметка**, без импортируемых React-компонентов.
Собирайте `ContactItem` сами, используя CSS-переменные дизайн-системы (`var(--…)`) из `styles.css`/`tokens/tokens.css` и утилитарные классы типографики `.text-*`.
Точная разметка и все состояния — в превью-карточке **ContactItem.html** (откройте её как образец и повторите структуру/классы/токены).

Ключевые токены: цвета `--color-primary-*` (индиго), `--color-accent-*` (лайм), `--color-neutral-*`; радиусы `--radius-*`; отступы `--space-*`; тени `--shadow-*`; шрифт `--font-sans` (Onest).
