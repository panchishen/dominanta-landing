/* Кристалис DS — assemble component preview cards.
   For each component: read components/<slug>/body.html (inner markup written by the
   workflow agents), wrap it with the shared @dsCard marker + token <head>, write index.html,
   and remove body.html. Deterministic structure = no head drift across agents. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HEAD = fs.readFileSync(path.join(__dirname, '_cardhead.css'), 'utf8');

const META = [
  { slug: 'button', group: 'Atoms', name: 'Button', subtitle: 'Primary · Secondary · Accent · White / SM·MD·LG', viewport: '980x540' },
  { slug: 'input', group: 'Atoms', name: 'Input', subtitle: '6 состояний', viewport: '820x640' },
  { slug: 'checkbox', group: 'Atoms', name: 'Checkbox', subtitle: 'Unchecked · Checked · Indeterminate · Disabled', viewport: '680x240' },
  { slug: 'radio', group: 'Atoms', name: 'Radio', subtitle: 'Unselected · Selected · Disabled', viewport: '560x200' },
  { slug: 'switch', group: 'Atoms', name: 'Switch', subtitle: 'Off · On · Disabled', viewport: '540x200' },
  { slug: 'badge', group: 'Atoms', name: 'Badge', subtitle: '6 вариантов', viewport: '820x200' },
  { slug: 'link', group: 'Atoms', name: 'Link', subtitle: '5 состояний', viewport: '740x200' },
  { slug: 'avatar', group: 'Atoms', name: 'Avatar', subtitle: 'Initials · Icon · Image / SM·MD·LG', viewport: '800x340' },
  { slug: 'iconbutton', group: 'Atoms', name: 'IconButton', subtitle: 'Primary · Secondary · Ghost', viewport: '560x200' },
  { slug: 'divider', group: 'Atoms', name: 'Divider', subtitle: 'Horizontal · Vertical · Labelled', viewport: '620x260' },
  { slug: 'rating', group: 'Atoms', name: 'Rating', subtitle: '3 · 4 · 5', viewport: '560x240' },
  { slug: 'tooltip', group: 'Atoms', name: 'Tooltip', subtitle: 'Тёмная подсказка', viewport: '560x260' },
  { slug: 'card-service', group: 'Molecules', name: 'Card / Service', subtitle: 'Default · Hover', viewport: '800x460' },
  { slug: 'card-stat', group: 'Molecules', name: 'Card / Stat', subtitle: 'Метрики клиники', viewport: '780x260' },
  { slug: 'card-price', group: 'Molecules', name: 'Card / Price', subtitle: 'Обычная · Популярная', viewport: '860x560' },
  { slug: 'card-doctor', group: 'Molecules', name: 'Card / Doctor', subtitle: 'Карточка врача', viewport: '720x560' },
  { slug: 'card-review', group: 'Molecules', name: 'Card / Review', subtitle: 'Отзыв пациента', viewport: '800x380' },
  { slug: 'accordion', group: 'Molecules', name: 'Accordion', subtitle: 'Collapsed · Expanded', viewport: '800x400' },
  { slug: 'tabs', group: 'Molecules', name: 'Tabs', subtitle: 'Active · Default · Hover', viewport: '800x280' },
  { slug: 'alert', group: 'Molecules', name: 'Alert', subtitle: 'Info · Success · Warning · Error', viewport: '840x560' },
  { slug: 'toast', group: 'Molecules', name: 'Toast', subtitle: 'Success · Error · Info', viewport: '740x360' },
  { slug: 'contactitem', group: 'Molecules', name: 'ContactItem', subtitle: 'Address · Phone · Email · Hours', viewport: '800x360' },
  { slug: 'select', group: 'Molecules', name: 'Select', subtitle: 'Default · Open', viewport: '740x460' },
  { slug: 'sectionheader', group: 'Molecules', name: 'SectionHeader', subtitle: 'Заголовок секции', viewport: '800x320' },
  { slug: 'carouselcontrols', group: 'Molecules', name: 'CarouselControls', subtitle: 'Стрелки + точки', viewport: '640x220' },
  { slug: 'modal', group: 'Molecules', name: 'Modal', subtitle: 'Диалог записи', viewport: '900x660' },
  { slug: 'header', group: 'Organisms', name: 'Header', subtitle: 'Standard · Two-tier · Dark · Floating', viewport: '1180x760' },
  { slug: 'footer', group: 'Organisms', name: 'Footer', subtitle: 'Подвал сайта', viewport: '1180x560' },
  { slug: 'logo', group: 'Organisms', name: 'Logo', subtitle: 'Default · Inverse', viewport: '720x300' },
];

let ok = 0; const missing = [];
for (const m of META) {
  const bodyPath = path.join(ROOT, 'components', m.slug, 'body.html');
  const outPath = path.join(ROOT, 'components', m.slug, 'index.html');
  if (!fs.existsSync(bodyPath)) { missing.push(m.slug); continue; }
  let body = fs.readFileSync(bodyPath, 'utf8').trim();
  body = body
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<\/?html[^>]*>/gi, '')
    .replace(/<head>[\s\S]*?<\/head>/gi, '')
    .replace(/<\/?body[^>]*>/gi, '')
    .replace(/^<!--\s*@dsCard[\s\S]*?-->\s*/i, '')
    .trim();
  const html = `<!-- @dsCard group="${m.group}" name="${m.name}" subtitle="${m.subtitle}" viewport="${m.viewport}" -->\n<!DOCTYPE html>\n<html lang="ru"><head><meta charset="utf-8"><style>\n${HEAD}\n</style></head>\n<body><div class="ds-wrap">\n${body}\n</div></body></html>\n`;
  fs.writeFileSync(outPath, html);
  fs.unlinkSync(bodyPath);
  ok++;
}
console.log(JSON.stringify({ assembled: ok, total: META.length, missing }));
