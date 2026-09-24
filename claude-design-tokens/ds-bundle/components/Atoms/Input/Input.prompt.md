Input — Текстовое поле формы с лейблом, хелпером и состояниями валидации. Оси вариантов: state (Default/Hover/Focus/Filled/Error/Disabled).

**Группа:** Atoms  ·  **Подпись карточки:** 6 состояний

## Свойства / варианты

| Prop | Тип | Значения / по умолчанию |
| --- | --- | --- |
| `label` | text | текст · default: `Имя` |
| `value` | text | текст · default: `Ваше имя` |
| `helper` | boolean | `true` / `false` · default: `true` |
| `required` | boolean | `true` / `false` · default: `false` |
| `state` | variant | `Default` · `Hover` · `Focus` · `Filled` · `Error` · `Disabled` |

## Как собрать

Crystalis — это **токены + эталонная разметка**, без импортируемых React-компонентов.
Собирайте `Input` сами, используя CSS-переменные дизайн-системы (`var(--…)`) из `styles.css`/`tokens/tokens.css` и утилитарные классы типографики `.text-*`.
Точная разметка и все состояния — в превью-карточке **Input.html** (откройте её как образец и повторите структуру/классы/токены).

Ключевые токены: цвета `--color-primary-*` (индиго), `--color-accent-*` (лайм), `--color-neutral-*`; радиусы `--radius-*`; отступы `--space-*`; тени `--shadow-*`; шрифт `--font-sans` (Onest).
