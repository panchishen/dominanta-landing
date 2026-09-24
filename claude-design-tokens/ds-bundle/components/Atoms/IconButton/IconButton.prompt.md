IconButton — Кнопка только с иконкой. Оси вариантов: variant (Primary/Secondary/Ghost).

**Группа:** Atoms  ·  **Подпись карточки:** Primary · Secondary · Ghost

## Свойства / варианты

| Prop | Тип | Значения / по умолчанию |
| --- | --- | --- |
| `variant` | variant | `Primary` · `Secondary` · `Ghost` |

## Как собрать

Crystalis — это **токены + эталонная разметка**, без импортируемых React-компонентов.
Собирайте `IconButton` сами, используя CSS-переменные дизайн-системы (`var(--…)`) из `styles.css`/`tokens/tokens.css` и утилитарные классы типографики `.text-*`.
Точная разметка и все состояния — в превью-карточке **IconButton.html** (откройте её как образец и повторите структуру/классы/токены).

Ключевые токены: цвета `--color-primary-*` (индиго), `--color-accent-*` (лайм), `--color-neutral-*`; радиусы `--radius-*`; отступы `--space-*`; тени `--shadow-*`; шрифт `--font-sans` (Onest).
