/* Crystalis design-system → Claude Design bundle assembler (off-script).

   This repo is a TOKENS + STATIC-HTML-PREVIEW design system: no React, no
   package.json, no dist. The standard /design-sync converter (package-build.mjs)
   does not apply, so this script produces the upload layout by hand from the repo's
   own artifacts:
     - tokens.css / design-tokens.json   -> tokens/  + styles.css import closure
     - Onest (Google Fonts)              -> fonts/   (downloaded woff2 + @font-face)
     - components/<slug>/index.html      -> components/<group>/<Name>/<Name>.html (preview card)
     - _source/components.json           -> <Name>.d.ts (props spec) + <Name>.prompt.md (usage)

   Re-run after editing the repo:  node .design-sync/build-bundle.mjs
   Outputs ./ds-bundle. Deterministic; safe to re-run.
*/
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '..', '..'); // repo root
const OUT = path.join(ROOT, 'ds-bundle');
const GLOBAL = 'Crystalis';

// slug -> { group, name(display from @dsCard), dir(PascalCase), cj(components.json key), role }
const META = [
  // Atoms
  { slug:'button', group:'Atoms', dir:'Button', cj:'Button', role:'Основная кнопка-действие (CTA «Записаться» и т.п.).' },
  { slug:'input', group:'Atoms', dir:'Input', cj:'Input', role:'Текстовое поле формы с лейблом, хелпером и состояниями валидации.' },
  { slug:'checkbox', group:'Atoms', dir:'Checkbox', cj:'Checkbox', role:'Чекбокс для множественного выбора и согласий.' },
  { slug:'radio', group:'Atoms', dir:'Radio', cj:'Radio', role:'Радиокнопка для выбора одного значения из группы.' },
  { slug:'switch', group:'Atoms', dir:'Switch', cj:'Switch', role:'Переключатель вкл/выкл.' },
  { slug:'badge', group:'Atoms', dir:'Badge', cj:'Badge', role:'Метка-индикатор статуса или категории.' },
  { slug:'link', group:'Atoms', dir:'Link', cj:'Link', role:'Текстовая ссылка с состояниями.' },
  { slug:'avatar', group:'Atoms', dir:'Avatar', cj:'Avatar', role:'Аватар пользователя/врача: инициалы, иконка или фото.' },
  { slug:'iconbutton', group:'Atoms', dir:'IconButton', cj:'IconButton', role:'Кнопка только с иконкой.' },
  { slug:'divider', group:'Atoms', dir:'Divider', cj:'Divider', role:'Разделитель (горизонтальный/вертикальный, опц. с подписью).' },
  { slug:'rating', group:'Atoms', dir:'Rating', cj:'Rating', role:'Рейтинг звёздами.' },
  { slug:'tooltip', group:'Atoms', dir:'Tooltip', cj:'Tooltip', role:'Тёмная всплывающая подсказка.' },
  // Molecules
  { slug:'card-service', group:'Molecules', dir:'CardService', cj:'Card/Service', role:'Карточка услуги клиники.' },
  { slug:'card-stat', group:'Molecules', dir:'CardStat', cj:'Card/Stat', role:'Карточка метрики/цифры клиники.' },
  { slug:'card-price', group:'Molecules', dir:'CardPrice', cj:'Card/Price', role:'Карточка тарифа/цены (обычная и «популярная»).' },
  { slug:'card-doctor', group:'Molecules', dir:'CardDoctor', cj:'Card/Doctor', role:'Карточка врача.' },
  { slug:'card-review', group:'Molecules', dir:'CardReview', cj:'Card/Review', role:'Карточка отзыва пациента.' },
  { slug:'accordion', group:'Molecules', dir:'Accordion', cj:'Accordion', role:'Аккордеон/FAQ со сворачиваемыми секциями.' },
  { slug:'tabs', group:'Molecules', dir:'Tabs', cj:'Tabs', role:'Вкладки для переключения контента.' },
  { slug:'alert', group:'Molecules', dir:'Alert', cj:'Alert', role:'Инлайн-уведомление (info/success/warning/error).' },
  { slug:'toast', group:'Molecules', dir:'Toast', cj:'Toast', role:'Всплывающее тост-уведомление.' },
  { slug:'contactitem', group:'Molecules', dir:'ContactItem', cj:'ContactItem', role:'Строка контакта (адрес/телефон/почта/часы).' },
  { slug:'select', group:'Molecules', dir:'Select', cj:'Select', role:'Выпадающий список (закрыт/открыт).' },
  { slug:'sectionheader', group:'Molecules', dir:'SectionHeader', cj:'SectionHeader', role:'Заголовок секции лендинга (надзаголовок + заголовок + описание).' },
  { slug:'carouselcontrols', group:'Molecules', dir:'CarouselControls', cj:'CarouselControls', role:'Управление каруселью: стрелки + точки.' },
  { slug:'modal', group:'Molecules', dir:'Modal', cj:'Modal', role:'Модальное окно (диалог записи).' },
  // Organisms
  { slug:'header', group:'Organisms', dir:'Header', cj:'Header', role:'Шапка сайта (4 стиля: Standard/Dark/Floating/Two-tier).' },
  { slug:'footer', group:'Organisms', dir:'Footer', cj:'Footer', role:'Подвал сайта.' },
  { slug:'logo', group:'Organisms', dir:'Logo', cj:'logo', role:'Логотип Кристалис (Default/Inverse).' },
];

const FOUNDATIONS = [
  { file:'colors.html', dir:'Colors', role:'Палитра: примитивы и семантические токены цвета.' },
  { file:'typography.html', dir:'Typography', role:'Типографическая шкала Onest (18 стилей).' },
  { file:'spacing-radius.html', dir:'SpacingRadius', role:'Шкала отступов и правило скруглений.' },
  { file:'shadows.html', dir:'Shadows', role:'Уровни теней (высота).' },
  { file:'icons.html', dir:'Icons', role:'Набор иконок RemixIcon (Line/Fill).' },
];

const FONT_IMPORT_RE = /@import url\(['"]?https:\/\/fonts\.googleapis\.com[^)]*\);?/g;
const FONT_LINK_RE = /<link[^>]*googleapis[^>]*>/g;

const camel = (s) => s.trim().split(/\s+/).map((w,i)=> i===0 ? w[0].toLowerCase()+w.slice(1) : w[0].toUpperCase()+w.slice(1)).join('').replace(/[^a-zA-Z0-9]/g,'');

function rmrf(p){ if (fs.existsSync(p)) fs.rmSync(p, {recursive:true, force:true}); }
function mkdirp(p){ fs.mkdirSync(p, {recursive:true}); }
function write(p, c){ mkdirp(path.dirname(p)); fs.writeFileSync(p, c); }

// ---- Fonts: download Onest woff2 from Google Fonts, rewrite @font-face to local ----
async function buildFonts(){
  const fontsDir = path.join(OUT, 'fonts');
  mkdirp(fontsDir);
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
  const res = await fetch('https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap', { headers:{ 'User-Agent': ua } });
  let css = await res.text();
  const urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g)].map(m=>m[1]);
  const uniq = [...new Set(urls)];
  let idx = 0; const map = new Map();
  for (const u of uniq){
    const local = `onest-${String(idx).padStart(2,'0')}.woff2`; idx++;
    const buf = Buffer.from(await (await fetch(u, { headers:{ 'User-Agent': ua } })).arrayBuffer());
    fs.writeFileSync(path.join(fontsDir, local), buf);
    map.set(u, `./${local}`);
  }
  css = css.replace(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g, (m,u)=> `url(${map.get(u)||u})`);
  write(path.join(fontsDir, 'onest.css'), '/* Onest (Google Fonts, OFL-1.1) — bundled @font-face. Cyrillic + Latin subsets, weights 400/500/600/700. */\n' + css);
  return uniq.length;
}

// ---- Cards: rewrite remote font ref -> bundled font, keep @dsCard first line ----
function cardHtml(src){
  return src.replace(FONT_IMPORT_RE, '@import url("../../../fonts/onest.css");')
            .replace(FONT_LINK_RE, '<link rel="stylesheet" href="../../../fonts/onest.css">');
}

// ---- components.json lookup ----
function loadCJ(){
  const cj = JSON.parse(fs.readFileSync(path.join(ROOT, '_source', 'components.json'), 'utf8'));
  const byName = new Map();
  for (const s of cj.sets) byName.set(s.name, { props: s.props, variants: s.variants, kind:'set' });
  for (const c of cj.components) byName.set(c.name, { props: [], variants: [], kind:'plain' });
  return byName;
}

function tsType(p){
  if (p.type === 'BOOLEAN') return 'boolean';
  if (p.type === 'TEXT') return 'string';
  if (p.type === 'VARIANT' && p.options) return p.options.map(o=>JSON.stringify(o)).join(' | ');
  return 'string';
}

function dtsFor(m, cjEntry){
  const Name = m.dir;
  const lines = [];
  lines.push(`import type { ReactNode } from "react";`);
  lines.push(``);
  lines.push(`/**`);
  lines.push(` * ${Name} — ${m.role}`);
  lines.push(` * Spec derived from the Crystalis Figma library (variant/prop matrix).`);
  lines.push(` * NOTE: Crystalis ships no importable React components — build this from the`);
  lines.push(` * tokens and the markup in ${Name}.html. See the project README for the idiom.`);
  lines.push(` */`);
  lines.push(`export interface ${Name}Props {`);
  const props = (cjEntry?.props)||[];
  for (const p of props){
    const key = camel(p.name);
    const optional = '?';
    if (p.default !== undefined && p.default !== '') lines.push(`  /** default: ${JSON.stringify(p.default)} */`);
    lines.push(`  ${key}${optional}: ${tsType(p)};`);
  }
  if (cjEntry?.kind === 'plain' || ['Card','Modal','Accordion','Header','Footer','Alert','Toast'].some(k=>Name.startsWith(k))){
    lines.push(`  children?: ReactNode;`);
  }
  lines.push(`  className?: string;`);
  lines.push(`}`);
  lines.push(``);
  return lines.join('\n');
}

function propsTable(cjEntry){
  const props = (cjEntry?.props)||[];
  if (!props.length) return '_Без вариант-свойств (одиночный компонент)._';
  const rows = ['| Prop | Тип | Значения / по умолчанию |', '| --- | --- | --- |'];
  for (const p of props){
    const key = camel(p.name);
    let vals = '';
    if (p.type==='VARIANT' && p.options) vals = p.options.map(o=>`\`${o}\``).join(' · ');
    else if (p.type==='BOOLEAN') vals = '`true` / `false`';
    else if (p.type==='TEXT') vals = 'текст';
    if (p.default!==undefined && p.default!=='') vals += (vals?' · ':'') + `default: \`${p.default}\``;
    rows.push(`| \`${key}\` | ${p.type.toLowerCase()} | ${vals} |`);
  }
  return rows.join('\n');
}

function promptFor(m, cjEntry, subtitle){
  const Name = m.dir;
  const axes = (cjEntry?.props||[]).filter(p=>p.type==='VARIANT').map(p=>`${camel(p.name)} (${p.options.join('/')})`).join(', ');
  const summary = `${Name} — ${m.role}${axes?` Оси вариантов: ${axes}.`:''}`;
  const out = [];
  out.push(summary); // line 1 = element-index summary
  out.push('');
  out.push(`**Группа:** ${m.group}  ·  **Подпись карточки:** ${subtitle}`);
  out.push('');
  out.push('## Свойства / варианты');
  out.push('');
  out.push(propsTable(cjEntry));
  out.push('');
  out.push('## Как собрать');
  out.push('');
  out.push(`Crystalis — это **токены + эталонная разметка**, без импортируемых React-компонентов.`);
  out.push(`Собирайте \`${Name}\` сами, используя CSS-переменные дизайн-системы (\`var(--…)\`) из \`styles.css\`/\`tokens/tokens.css\` и утилитарные классы типографики \`.text-*\`.`);
  out.push(`Точная разметка и все состояния — в превью-карточке **${Name}.html** (откройте её как образец и повторите структуру/классы/токены).`);
  out.push('');
  out.push('Ключевые токены: цвета `--color-primary-*` (индиго), `--color-accent-*` (лайм), `--color-neutral-*`; радиусы `--radius-*`; отступы `--space-*`; тени `--shadow-*`; шрифт `--font-sans` (Onest).');
  out.push('');
  return out.join('\n');
}

async function main(){
  rmrf(OUT); mkdirp(OUT);

  // tokens
  mkdirp(path.join(OUT,'tokens'));
  fs.copyFileSync(path.join(ROOT,'tokens.css'), path.join(OUT,'tokens','tokens.css'));
  fs.copyFileSync(path.join(ROOT,'design-tokens.json'), path.join(OUT,'tokens','design-tokens.json'));

  // fonts
  const nFonts = await buildFonts();

  // styles.css — the import closure rendered designs receive
  write(path.join(OUT,'styles.css'),
    '/* Crystalis — root stylesheet. Rendered designs receive this file\'s @import closure. */\n' +
    '@import "./fonts/onest.css";\n' +
    '@import "./tokens/tokens.css";\n');

  // _ds_bundle.js — empty-bodied (tokens-only DS: no importable components)
  const hdr = JSON.stringify({ global: GLOBAL, components: [], note: 'tokens-only design system; no importable React components — build from tokens + reference cards' });
  write(path.join(OUT,'_ds_bundle.js'),
    `/* @ds-bundle: ${hdr} */\n` +
    `(function(){ window.${GLOBAL} = window.${GLOBAL} || {}; })();\n`);

  const byName = loadCJ();
  const cardIndex = []; // {group, name, dir}

  for (const m of META){
    const srcCard = path.join(ROOT,'components',m.slug,'index.html');
    const raw = fs.readFileSync(srcCard,'utf8');
    const firstLine = raw.split('\n',1)[0];
    const subMatch = firstLine.match(/subtitle="([^"]*)"/);
    const nameMatch = firstLine.match(/name="([^"]*)"/);
    const subtitle = subMatch?subMatch[1]:'';
    const display = nameMatch?nameMatch[1]:m.dir;
    const dir = path.join(OUT,'components',m.group,m.dir);
    write(path.join(dir, `${m.dir}.html`), cardHtml(raw));
    write(path.join(dir, `${m.dir}.d.ts`), dtsFor(m, byName.get(m.cj)));
    write(path.join(dir, `${m.dir}.prompt.md`), promptFor(m, byName.get(m.cj), subtitle));
    cardIndex.push({ group:m.group, display, dir:m.dir });
  }

  // foundations
  for (const f of FOUNDATIONS){
    const raw = fs.readFileSync(path.join(ROOT,'components','foundations',f.file),'utf8');
    const dir = path.join(OUT,'components','Foundations',f.dir);
    write(path.join(dir, `${f.dir}.html`), cardHtml(raw));
    write(path.join(dir, `${f.dir}.prompt.md`), `${f.dir} — ${f.role}\n\nFoundations-карточка (справочная). См. ${f.dir}.html и токены в \`tokens/\`.\n`);
    cardIndex.push({ group:'Foundations', display:f.dir, dir:f.dir });
  }

  // README = conventions header (readmeHeader) + generated component index
  let header = '';
  const hdrPath = path.join(ROOT, '.design-sync', 'conventions.md');
  if (fs.existsSync(hdrPath)) header = fs.readFileSync(hdrPath, 'utf8').trimEnd() + '\n\n';
  const groups = {};
  for (const c of cardIndex){ (groups[c.group] ||= []).push(c); }
  let idx = `\n---\n\n## Component index (${cardIndex.length} cards)\n\n`;
  for (const g of ['Atoms','Molecules','Organisms','Foundations']){
    if (!groups[g]) continue;
    idx += `### ${g}\n\n`;
    for (const c of groups[g].sort((a,b)=>a.dir.localeCompare(b.dir))){
      const dts = g === 'Foundations' ? '' : ` · \`${c.dir}.d.ts\``;
      idx += `- **${c.display}** — \`components/${g}/${c.dir}/${c.dir}.html\` · \`${c.dir}.prompt.md\`${dts}\n`;
    }
    idx += `\n`;
  }
  write(path.join(OUT,'README.md'), header + idx);

  // sentinel
  write(path.join(OUT,'_ds_needs_recompile'), JSON.stringify({ by:'design-sync-cli' }));

  console.log(`OK: ${META.length} components + ${FOUNDATIONS.length} foundations, ${nFonts} font files.`);
  console.log(`Cards: ${cardIndex.length}`);
}
main().catch(e=>{ console.error(e); process.exit(1); });
