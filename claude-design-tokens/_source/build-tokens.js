/* Кристалис DS — deterministic token + foundations builder.
   Reads _source/*.json (live snapshot from Figma) and emits:
   tokens.css, design-tokens.json, tailwind.config.js, design-system.md,
   components/foundations/*.html, and _source/_cardhead.css (preview scaffold). */
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

const FILE_KEY = 'ro7HcMQfATSiCQa6IbhYCc';
const BANNER = `/* Кристалис — дизайн-токены. Сгенерировано из Figma (${FILE_KEY}). Не редактировать вручную. */`;

// ---------- helpers ----------
const varName = code => code.replace('var(', '').replace(')', '').trim();      // var(--x) -> --x
const aliasVar = aliasPath => '--' + aliasPath.replace(/\//g, '-');             // color/primary/500 -> --color-primary-500
const WEIGHT = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700, 'Semi Bold': 600 };

function scaleUnit(name, value) {
  if (name.startsWith('opacity/')) return String(value);
  if (name === 'layout/columns') return String(value);
  if (name.startsWith('motion/duration/')) return value + 'ms';
  if (name.startsWith('motion/easing/')) return value; // already a string
  return value + 'px';
}
function lsEm(pct) { const n = parseFloat(pct); return n === 0 ? '0' : (n / 100) + 'em'; }
function shadowCss(eff) {
  return eff.effects.filter(e => e.visible !== false)
    .map(e => `${e.x}px ${e.y}px ${e.blur}px ${e.spread || 0}px ${e.color}`).join(', ');
}

// ---------- tokens.css ----------
let css = `${BANNER}\n\n:root {\n`;
css += `  /* ── Primitives · color ── */\n`;
for (const v of primitives) css += `  ${varName(v.code)}: ${v.value};\n`;
css += `\n  /* ── Scale · spacing / radius / border / icon / layout / opacity / motion / breakpoints ── */\n`;
for (const v of scale) css += `  ${varName(v.code)}: ${scaleUnit(v.name, v.value)};\n`;
css += `\n  /* ── Elevation · shadows ── */\n`;
for (const s of styles.effectStyles) css += `  --shadow-${s.name.split('/')[1]}: ${shadowCss(s)};\n`;
css += `\n  /* ── Typography ── */\n`;
css += `  --font-sans: 'Onest', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;\n`;
css += `\n  /* ── Semantic · color (Light) — alias → primitive ── */\n`;
for (const v of semantic) {
  const a = v.modes.Light.alias;
  css += `  ${varName(v.code)}: ${a ? `var(${aliasVar(a)})` : v.modes.Light.value};\n`;
}
css += `}\n\n/* ── Typography utility classes ── */\n`;
for (const t of styles.textStyles) {
  const cls = '.' + t.name.replace('/', '-');
  const tc = t.case === 'UPPER' ? '\n  text-transform: uppercase;' : '';
  css += `${cls} {\n  font-family: var(--font-sans);\n  font-weight: ${WEIGHT[t.weight]};\n  font-size: ${t.size}px;\n  line-height: ${t.lineHeight}px;\n  letter-spacing: ${lsEm(t.letterSpacing)};${tc}\n}\n`;
}
fs.writeFileSync(path.join(OUT, 'tokens.css'), css);

// ---------- design-tokens.json ----------
function setPath(obj, parts, val) {
  let o = obj;
  for (let i = 0; i < parts.length - 1; i++) { o[parts[i]] = o[parts[i]] || {}; o = o[parts[i]]; }
  o[parts[parts.length - 1]] = val;
}
const dt = { $meta: { name: 'Кристалис', source: 'Figma ' + FILE_KEY, theme: 'light', font: 'Onest' }, primitive: {}, scale: {}, shadow: {}, typography: {}, semantic: {} };
for (const v of primitives) setPath(dt.primitive, v.name.split('/'), { value: v.value, type: 'color', var: varName(v.code) });
for (const v of scale) {
  const type = v.name.startsWith('motion/easing') ? 'cubicBezier' : v.name.startsWith('motion/duration') ? 'duration'
    : v.name.startsWith('opacity') ? 'opacity' : 'dimension';
  setPath(dt.scale, v.name.split('/'), { value: v.value, css: scaleUnit(v.name, v.value), type, var: varName(v.code) });
}
for (const s of styles.effectStyles) setPath(dt.shadow, [s.name.split('/')[1]], { value: shadowCss(s), type: 'shadow', var: `--shadow-${s.name.split('/')[1]}` });
for (const t of styles.textStyles) setPath(dt.typography, [t.name.split('/')[1]], {
  fontFamily: 'Onest', fontWeight: WEIGHT[t.weight], fontSize: t.size, lineHeight: t.lineHeight,
  letterSpacing: lsEm(t.letterSpacing), textTransform: t.case === 'UPPER' ? 'uppercase' : 'none', type: 'typography'
});
for (const v of semantic) setPath(dt.semantic, v.name.split('/'), { value: v.modes.Light.alias ? `{primitive.${v.modes.Light.alias.replace(/\//g, '.')}}` : v.modes.Light.value, resolved: v.modes.Light.resolved || v.modes.Light.value, type: 'color', var: varName(v.code) });
fs.writeFileSync(path.join(OUT, 'design-tokens.json'), JSON.stringify(dt, null, 2));

// ---------- tailwind.config.js ----------
const tw = { colors: {}, spacing: {}, borderRadius: {}, boxShadow: {}, screens: {}, fontFamily: { sans: ['Onest', 'system-ui', 'sans-serif'] }, fontSize: {}, opacity: {}, transitionDuration: {}, transitionTimingFunction: {} };
const ramp = {};
for (const v of primitives) { const [, fam, step] = v.name.split('/'); ramp[fam] = ramp[fam] || {}; ramp[fam][step] = v.value; }
tw.colors = ramp;
for (const v of scale) {
  const [grp, ...rest] = v.name.split('/'); const k = rest.join('-');
  if (grp === 'space') tw.spacing[k] = v.value + 'px';
  else if (grp === 'radius') tw.borderRadius[k] = v.name === 'radius/full' ? '9999px' : v.value + 'px';
  else if (grp === 'bp') tw.screens[rest[0]] = v.value + 'px';
  else if (grp === 'opacity') tw.opacity[k] = String(v.value);
  else if (grp === 'motion' && rest[0] === 'duration') tw.transitionDuration[rest[1]] = v.value + 'ms';
  else if (grp === 'motion' && rest[0] === 'easing') tw.transitionTimingFunction[rest[1]] = v.value;
}
for (const s of styles.effectStyles) tw.boxShadow[s.name.split('/')[1]] = shadowCss(s);
for (const t of styles.textStyles) tw.fontSize[t.name.split('/')[1]] = [t.size + 'px', { lineHeight: t.lineHeight + 'px', letterSpacing: lsEm(t.letterSpacing), fontWeight: String(WEIGHT[t.weight]) }];
const twFile = `${BANNER}\n/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: ['./**/*.{html,js,jsx,ts,tsx}'],\n  theme: {\n    extend: ${JSON.stringify(tw, null, 6).replace(/\n/g, '\n    ')}\n  },\n  plugins: [],\n};\n`;
fs.writeFileSync(path.join(OUT, 'tailwind.config.js'), twFile);

// ---------- _cardhead.css (preview scaffold, NOT uploaded) ----------
const cardHead = `${css}\n/* ── preview scaffold ── */\n@import url('https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap');\n*{box-sizing:border-box}html,body{margin:0}\nbody{font-family:var(--font-sans);background:var(--color-bg-canvas);color:var(--color-text-primary);padding:32px;-webkit-font-smoothing:antialiased}\n.ds-wrap{display:flex;flex-direction:column;gap:28px;max-width:1080px;margin:0 auto}\n.ds-title{font-weight:600;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--color-text-tertiary);margin:0}\n.ds-grid{display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start}\n.ds-stack{display:flex;flex-direction:column;gap:10px}\n.ds-cap{font-size:12px;line-height:1.4;color:var(--color-text-tertiary)}\n.ds-cap b{color:var(--color-text-secondary);font-weight:600}\n.ds-cell{display:flex;flex-direction:column;gap:6px;align-items:flex-start}`;
fs.writeFileSync(path.join(SRC, '_cardhead.css'), cardHead);

// ---------- foundation cards ----------
const FCSS = fs.readFileSync(path.join(SRC, '_cardhead.css'), 'utf8');
const doc = (group, name, subtitle, viewport, body) =>
  `<!-- @dsCard group="${group}" name="${name}" subtitle="${subtitle}" viewport="${viewport}" -->\n<!DOCTYPE html>\n<html lang="ru"><head><meta charset="utf-8"><style>\n${FCSS}\n</style></head>\n<body><div class="ds-wrap">\n${body}\n</div></body></html>\n`;
const fdir = path.join(OUT, 'components', 'foundations');
fs.mkdirSync(fdir, { recursive: true });

// colors card
function swatch(label, hex, sub) {
  const dark = parseInt(hex.slice(1, 3), 16) * 0.299 + parseInt(hex.slice(3, 5), 16) * 0.587 + parseInt(hex.slice(5, 7), 16) * 0.114 < 150;
  return `<div class="ds-cell"><div style="width:104px;height:64px;border-radius:12px;background:${hex};border:1px solid var(--color-border-default);box-shadow:var(--shadow-xs)"></div><div class="ds-cap"><b>${label}</b><br>${hex}${sub ? '<br>' + sub : ''}</div></div>`;
}
function ramprow(fam, title) {
  const items = primitives.filter(v => v.name.startsWith('color/' + fam + '/'))
    .sort((a, b) => parseInt(a.name.split('/')[2]) - parseInt(b.name.split('/')[2]));
  return `<div class="ds-stack"><p class="ds-title">${title}</p><div class="ds-grid">` +
    items.map(v => swatch(v.name.split('/')[2], v.value)).join('') + `</div></div>`;
}
let colorsBody = `<h2 class="h2" style="margin:0">Цвета</h2>` +
  ramprow('primary', 'Primary · индиго') + ramprow('accent', 'Accent · лайм') + ramprow('neutral', 'Neutral') +
  ['success', 'warning', 'error', 'info'].map(f => ramprow(f, f[0].toUpperCase() + f.slice(1))).join('');
const semGroups = {};
for (const v of semantic) { const g = v.name.split('/')[1]; (semGroups[g] = semGroups[g] || []).push(v); }
colorsBody += `<div class="ds-stack"><p class="ds-title">Семантические токены</p>` +
  Object.entries(semGroups).map(([g, arr]) =>
    `<p class="ds-cap" style="margin-top:8px"><b>color/${g}</b></p><div class="ds-grid">` +
    arr.map(v => swatch(v.name.replace('color/' + g + '/', ''), v.modes.Light.resolved, varName(v.code))).join('') + `</div>`
  ).join('') + `</div>`;
fs.writeFileSync(path.join(fdir, 'colors.html'), doc('Foundations', 'Colors', 'Indigo + Lime · primitives & semantic', '1100x900', colorsBody));

// typography card
const typeBody = `<h2 class="h2" style="margin:0">Типографика · Onest</h2><div class="ds-stack">` +
  styles.textStyles.sort((a, b) => b.size - a.size).map(t =>
    `<div class="ds-cell"><div class="${t.name.replace('/', '-')}" style="color:var(--color-text-primary)">Кристалис — здоровая улыбка</div><div class="ds-cap">${t.name} · ${t.weight} ${t.size}/${t.lineHeight}</div></div>`
  ).join('') + `</div>`;
fs.writeFileSync(path.join(fdir, 'typography.html'), doc('Foundations', 'Typography', 'Onest · 18 стилей', '1100x1400', typeBody));

// spacing + radius card
const spaceItems = scale.filter(v => v.name.startsWith('space/') && !['space/container-x', 'space/grid-gap', 'space/section-y', 'space/section-y-mobile'].includes(v.name)).sort((a, b) => a.value - b.value);
const radiusItems = scale.filter(v => v.name.startsWith('radius/') && v.name !== 'radius/full').sort((a, b) => a.value - b.value);
let srBody = `<h2 class="h2" style="margin:0">Отступы и скругления</h2>`;
srBody += `<div class="ds-stack"><p class="ds-title">Spacing</p>` +
  spaceItems.map(v => `<div class="ds-grid" style="gap:12px"><div style="width:${v.value}px;height:16px;background:var(--color-accent-500);border-radius:3px"></div><div class="ds-cap"><b>${v.name.split('/')[1]}</b> · ${v.value}px</div></div>`).join('') + `</div>`;
srBody += `<div class="ds-stack"><p class="ds-title">Radius — чем крупнее объект, тем больше скругление</p><div class="ds-grid">` +
  radiusItems.map(v => `<div class="ds-cell"><div style="width:88px;height:64px;background:var(--color-bg-brand-subtle);border:1.5px solid var(--color-primary-500);border-radius:${v.value}px"></div><div class="ds-cap"><b>${v.name.split('/')[1]}</b> · ${v.value}px</div></div>`).join('') +
  `<div class="ds-cell"><div style="width:88px;height:64px;background:var(--color-bg-brand-subtle);border:1.5px solid var(--color-primary-500);border-radius:9999px"></div><div class="ds-cap"><b>full</b> · pill</div></div></div>`;
srBody += `<p class="ds-cap" style="max-width:640px">Чипы и теги — <b>sm/full</b>; кнопки, инпуты, селекты — <b>md (12)</b>; карточки, алерты, аккордеоны — <b>lg (16)</b>; крупные поверхности и модалки — <b>xl (24) / 2xl (32)</b>; аватары и переключатели — <b>full</b>.</p></div>`;
fs.writeFileSync(path.join(fdir, 'spacing-radius.html'), doc('Foundations', 'Spacing & Radius', 'Шкала отступов и правило скруглений', '1100x1100', srBody));

// shadows card
const shBody = `<h2 class="h2" style="margin:0">Тени</h2><div class="ds-grid" style="gap:28px">` +
  styles.effectStyles.filter(s => s.name !== 'shadow/focus').sort((a, b) => a.effects[0].blur - b.effects[0].blur).map(s =>
    `<div class="ds-cell"><div style="width:140px;height:96px;background:var(--color-surface-default);border-radius:16px;box-shadow:var(--shadow-${s.name.split('/')[1]})"></div><div class="ds-cap"><b>${s.name}</b></div></div>`
  ).join('') +
  `<div class="ds-cell"><div style="width:140px;height:96px;background:var(--color-surface-default);border-radius:16px;box-shadow:var(--shadow-focus)"></div><div class="ds-cap"><b>shadow/focus</b> · ring</div></div></div>`;
fs.writeFileSync(path.join(fdir, 'shadows.html'), doc('Foundations', 'Shadows', 'Высота · 6 уровней', '1100x420', shBody));

// icons card
const ic = components.icons;
const sampleSvg = {
  check: '<path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  close: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  star: '<path d="M12 3l2.6 5.6 6 .7-4.4 4.1 1.2 6L12 16.9 6.6 19.5l1.2-6L3.4 9.3l6-.7z" fill="currentColor"/>',
  phone: '<path d="M6 3h3l2 5-2 1c1 2 3 4 5 5l1-2 5 2v3c0 1-1 2-2 2C12 21 3 12 3 5c0-1 1-2 3-2z" fill="currentColor"/>'
};
let iconBody = `<h2 class="h2" style="margin:0">Иконки</h2><p class="ds-cap" style="max-width:640px">${ic.count} наборов RemixIcon (Apache 2.0), каждый в стилях <b>${ic.styles.join(' / ')}</b>, именование <b>${ic.naming}</b>. Размеры из шкалы icon/*. Соцсети: ${ic.social.join(', ')}.</p>`;
iconBody += `<div class="ds-stack"><p class="ds-title">Размеры</p><div class="ds-grid" style="align-items:flex-end">` +
  scale.filter(v => v.name.startsWith('icon/')).sort((a, b) => a.value - b.value).map(v =>
    `<div class="ds-cell"><svg width="${v.value}" height="${v.value}" viewBox="0 0 24 24" style="color:var(--color-primary-500)">${sampleSvg.check}</svg><div class="ds-cap"><b>${v.name.split('/')[1]}</b> · ${v.value}px</div></div>`
  ).join('') + `</div></div>`;
iconBody += `<div class="ds-stack"><p class="ds-title">Примеры</p><div class="ds-grid">` +
  Object.entries(sampleSvg).map(([n, p]) =>
    `<div class="ds-cell"><svg width="28" height="28" viewBox="0 0 24 24" style="color:var(--color-text-primary)">${p}</svg><div class="ds-cap">${n}</div></div>`
  ).join('') + `</div></div>`;
fs.writeFileSync(path.join(fdir, 'icons.html'), doc('Foundations', 'Icons', `${ic.count} RemixIcon · Line/Fill`, '1100x520', iconBody));

console.log('tokens.css, design-tokens.json, tailwind.config.js, _cardhead.css + 5 foundation cards written.');
console.log('counts:', { primitives: primitives.length, scale: scale.length, semantic: semantic.length, text: styles.textStyles.length, shadow: styles.effectStyles.length });
