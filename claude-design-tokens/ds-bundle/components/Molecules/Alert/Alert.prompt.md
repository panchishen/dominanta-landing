Alert — Инлайн-уведомление (info/success/warning/error). Оси вариантов: variant (Info/Success/Warning/Error).

**Группа:** Molecules  ·  **Подпись карточки:** Info · Success · Warning · Error

## Свойства / варианты

| Prop | Тип | Значения / по умолчанию |
| --- | --- | --- |
| `variant` | variant | `Info` · `Success` · `Warning` · `Error` |

## Как собрать

Crystalis — это **токены + эталонная разметка**, без импортируемых React-компонентов.
Собирайте `Alert` сами, используя CSS-переменные дизайн-системы (`var(--…)`) из `styles.css`/`tokens/tokens.css` и утилитарные классы типографики `.text-*`.
Точная разметка и все состояния — в превью-карточке **Alert.html** (откройте её как образец и повторите структуру/классы/токены).

Ключевые токены: цвета `--color-primary-*` (индиго), `--color-accent-*` (лайм), `--color-neutral-*`; радиусы `--radius-*`; отступы `--space-*`; тени `--shadow-*`; шрифт `--font-sans` (Onest).
