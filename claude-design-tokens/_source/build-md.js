/* Кристалис DS — generate design-system.md from the live Figma snapshot. */
const fs = require('fs');
const path = require('path');
const SRC = __dirname;
const OUT = path.join(__dirname, '..');
const rd = f => JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));
const primitives = rd('primitives.json');
const scale = rd('scale.json');
const semantic = rd('semantic.json');
const styles = rd('styles.json');
const components = rd('components.json');
const vn = code => code.replace('var(', '').replace(')', '');

const L = [];
const p = s => L.push(s);

p(`# Дизайн-система «Кристалис»`);
p(``);
p(`Дизайн-система универсального одностраничного сайта для стоматологических клиник. Единый источник — файл Figma \`ro7HcMQfATSiCQa6IbhYCc\`; этот документ и токены (\`tokens.css\`, \`design-tokens.json\`, \`tailwind.config.js\`) сгенерированы из него автоматически.`);
p(``);
p(`## Принципы`);
p(``);
p(`- **Тема:** только светлая.`);
p(`- **Шрифт:** Onest (Google Fonts, кириллица). Начертания: Regular 400, Medium 500, SemiBold 600, Bold 700. Курсива нет — для цитат используется Medium.`);
p(`- **Палитра:** индиго (\`primary\`, база \`#3538CD\`) + лайм (\`accent\`, база \`#B4F03A\`).`);
p(`- **Скругления:** чем крупнее объект, тем больше радиус.`);
p(`- **Доступность (WCAG AA):** белый текст — только на индиго или тёмном фоне. На лайме белый не проходит по контрасту, поэтому используется тёмный \`color/text/on-accent\` (\`#1F3304\`).`);
p(``);
p(`## Как использовать`);
p(``);
p(`- \`tokens.css\` — CSS-переменные (\`:root\`) + утилитарные классы типографики \`.text-*\`. Подключите файл и обращайтесь к \`var(--token)\`.`);
p(`- \`design-tokens.json\` — структурированные токены (значения, типы, алиасы) для сборщиков (Style Dictionary и т.п.).`);
p(`- \`tailwind.config.js\` — те же токены в \`theme.extend\` (цвета, отступы, радиусы, тени, шрифты, брейкпоинты).`);
p(`- **Claude Design** — пакет синхронизируется командой \`/design-sync\`; каждый компонент попадает в раздел Design systems как превью-карточка.`);
p(``);

// ---- Colors ----
p(`## Цвета`);
p(``);
const fams = [...new Set(primitives.map(v => v.name.split('/')[1]))];
const famTitle = { primary: 'Primary · индиго', accent: 'Accent · лайм', neutral: 'Neutral', success: 'Success', warning: 'Warning', error: 'Error', info: 'Info' };
p(`### Примитивы`);
for (const fam of fams) {
  const items = primitives.filter(v => v.name.split('/')[1] === fam)
    .sort((a, b) => parseInt(a.name.split('/')[2]) - parseInt(b.name.split('/')[2]));
  p(``);
  p(`**${famTitle[fam] || fam}**`);
  p(``);
  p(`| Токен | CSS-переменная | HEX |`);
  p(`| --- | --- | --- |`);
  for (const v of items) p(`| \`${v.name}\` | \`${vn(v.code)}\` | \`${v.value}\` |`);
}
p(``);
p(`### Семантические токены (режим Light)`);
const segs = [...new Set(semantic.map(v => v.name.split('/')[1]))];
for (const seg of segs) {
  const items = semantic.filter(v => v.name.split('/')[1] === seg);
  p(``);
  p(`**color/${seg}**`);
  p(``);
  p(`| Токен | CSS-переменная | Алиас | HEX |`);
  p(`| --- | --- | --- | --- |`);
  for (const v of items) p(`| \`${v.name}\` | \`${vn(v.code)}\` | \`${v.modes.Light.alias || '—'}\` | \`${v.modes.Light.resolved || v.modes.Light.value}\` |`);
}
p(``);

// ---- Typography ----
p(`## Типографика`);
p(``);
p(`Шрифт Onest. Класс — имя стиля с дефисом (\`text/h1\` → \`.text-h1\`).`);
p(``);
p(`| Стиль | Класс | Начертание | Размер / интерлиньяж | Трекинг |`);
p(`| --- | --- | --- | --- | --- |`);
for (const t of [...styles.textStyles].sort((a, b) => b.size - a.size)) {
  p(`| \`${t.name}\` | \`.${t.name.replace('/', '-')}\` | ${t.weight} | ${t.size}/${t.lineHeight} | ${t.letterSpacing}${t.case === 'UPPER' ? ' · UPPERCASE' : ''} |`);
}
p(``);

// ---- Scale groups ----
function scaleTable(title, prefix, note) {
  const items = scale.filter(v => v.name.startsWith(prefix)).sort((a, b) => (a.value - b.value) || a.name.localeCompare(b.name));
  if (!items.length) return;
  p(`### ${title}`);
  if (note) { p(``); p(note); }
  p(``);
  p(`| Токен | CSS-переменная | Значение |`);
  p(`| --- | --- | --- |`);
  for (const v of items) p(`| \`${v.name}\` | \`${vn(v.code)}\` | ${v.value} |`);
  p(``);
}
p(`## Шкалы`);
p(``);
scaleTable('Отступы (space)', 'space/');
scaleTable('Скругления (radius)', 'radius/', 'Правило: чипы и теги — \`sm\`/\`full\`; кнопки, инпуты, селекты — \`md\` (12); карточки, алерты, аккордеоны — \`lg\` (16); крупные поверхности и модалки — \`xl\` (24) / \`2xl\` (32); аватары и переключатели — \`full\`.');
scaleTable('Толщина границ (border)', 'border/');
scaleTable('Размеры иконок (icon)', 'icon/');
scaleTable('Прозрачность (opacity)', 'opacity/');
scaleTable('Сетка и контейнер (layout)', 'layout/');
scaleTable('Брейкпоинты (bp)', 'bp/');

// motion
const dur = scale.filter(v => v.name.startsWith('motion/duration/')).sort((a, b) => a.value - b.value);
const eas = scale.filter(v => v.name.startsWith('motion/easing/'));
p(`### Анимация (motion)`);
p(``);
p(`| Токен | CSS-переменная | Значение |`);
p(`| --- | --- | --- |`);
for (const v of dur) p(`| \`${v.name}\` | \`${vn(v.code)}\` | ${v.value} ms |`);
for (const v of eas) p(`| \`${v.name}\` | \`${vn(v.code)}\` | \`${v.value}\` |`);
p(``);

// shadows
p(`## Тени`);
p(``);
p(`| Стиль | CSS-переменная | Значение |`);
p(`| --- | --- | --- |`);
for (const s of styles.effectStyles.sort((a, b) => a.effects[0].blur - b.effects[0].blur)) {
  const e = s.effects[0];
  p(`| \`${s.name}\` | \`--shadow-${s.name.split('/')[1]}\` | \`${e.x}px ${e.y}px ${e.blur}px ${e.spread || 0}px ${e.color}\` |`);
}
p(``);

// ---- Components ----
p(`## Компоненты`);
p(``);
p(`Сборка \`Property=Value\`; слой/состояние — через дефис. Все глифы — инстансы иконок RemixIcon.`);
p(``);
const GROUP = {
  Button: 'Атомы', Input: 'Атомы', Checkbox: 'Атомы', Radio: 'Атомы', Switch: 'Атомы', Badge: 'Атомы',
  Link: 'Атомы', Avatar: 'Атомы', IconButton: 'Атомы', Divider: 'Атомы', Rating: 'Атомы', Tooltip: 'Атомы', Icon: 'Атомы',
  'Card/Service': 'Молекулы', 'Card/Stat': 'Молекулы', 'Card/Price': 'Молекулы', 'Card/Doctor': 'Молекулы', 'Card/Review': 'Молекулы',
  Accordion: 'Молекулы', Tabs: 'Молекулы', Alert: 'Молекулы', Toast: 'Молекулы', ContactItem: 'Молекулы',
  Select: 'Молекулы', SectionHeader: 'Молекулы', CarouselControls: 'Молекулы', Modal: 'Молекулы',
  Header: 'Организмы', Footer: 'Организмы', logo: 'Организмы',
};
const all = [
  ...components.sets.map(s => ({ name: s.name, variants: s.variants, props: s.props })),
  ...components.components.map(c => ({ name: c.name, variants: null, props: null })),
];
for (const grp of ['Атомы', 'Молекулы', 'Организмы']) {
  p(`### ${grp}`);
  p(``);
  p(`| Компонент | Варианты / свойства |`);
  p(`| --- | --- |`);
  for (const c of all.filter(c => (GROUP[c.name] || 'Молекулы') === grp).sort((a, b) => a.name.localeCompare(b.name))) {
    let desc = '';
    if (c.props) {
      const variantProps = c.props.filter(pr => pr.type === 'VARIANT').map(pr => `${pr.name} (${pr.options.join('/')})`);
      const other = c.props.filter(pr => pr.type !== 'VARIANT').map(pr => `${pr.name}: ${pr.type.toLowerCase()}`);
      desc = [variantProps.join(' × '), other.join(', ')].filter(Boolean).join(' · ');
    } else desc = 'одиночный компонент';
    p(`| \`${c.name}\` | ${desc} |`);
  }
  p(``);
}

// icons + foundations
const ic = components.icons;
p(`### Иконки`);
p(``);
p(`${ic.count} наборов RemixIcon (Apache 2.0), именование \`${ic.naming}\`, у каждого варианты \`Style = ${ic.styles.join(' | ')}\`. Размеры — из шкалы \`icon/*\`. Есть обёртка \`Icon\` с \`INSTANCE_SWAP\` и вынесенным наверх \`Style\`. Бренд-иконки соцсетей: ${ic.social.join(', ')}.`);
p(``);
p(`### Foundations-карточки`);
p(``);
p(`В пакете Claude Design отдельная группа **Foundations**: Colors, Typography, Spacing & Radius, Shadows, Icons.`);
p(``);
p(`---`);
p(``);
p(`Источник: Figma \`ro7HcMQfATSiCQa6IbhYCc\`. Иконки — RemixIcon (Apache 2.0). Документ сгенерирован автоматически; правьте дизайн-систему в Figma и пересоберите.`);

fs.writeFileSync(path.join(OUT, 'design-system.md'), L.join('\n') + '\n');
console.log('design-system.md written:', L.length, 'lines');
