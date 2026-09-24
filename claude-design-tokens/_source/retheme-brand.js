/* Multibrand: add color/brand/* ramp (Кристалис=green) to primitives, re-point brand semantics → brand/*,
   add themes.css link to the landing. Mirrors the Figma "Brand" collection + modes. */
const fs = require('fs');

const steps = ['50','100','200','300','400','500','600','700','800','900'];
const green = ['#F5FCE0','#E9F9B8','#D8F584','#C6F157','#BFF44A','#B4F03A','#97D219','#739E0E','#4F6E0A','#1F3304'];

// 1) primitives: add brand ramp + on (idempotent)
const prim = JSON.parse(fs.readFileSync('primitives.json', 'utf8'));
const has = new Set(prim.map(p => p.name));
for (let i = 0; i < steps.length; i++) {
  const nm = 'color/brand/' + steps[i];
  if (!has.has(nm)) prim.push({ name: nm, type: 'COLOR', scopes: [], code: 'var(--color-brand-' + steps[i] + ')', value: green[i] });
}
if (!has.has('color/brand/on')) prim.push({ name: 'color/brand/on', type: 'COLOR', scopes: ['TEXT_FILL'], code: 'var(--color-brand-on)', value: '#1F3304' });
fs.writeFileSync('primitives.json', JSON.stringify(prim));

// 2) semantic re-point brand-accent tokens → brand/*
const sem = JSON.parse(fs.readFileSync('semantic.json', 'utf8'));
const M = {
  'color/action/accent':       ['color/brand/500', '#B4F03A'],
  'color/action/accent-hover': ['color/brand/600', '#97D219'],
  'color/bg/accent-subtle':    ['color/brand/50',  '#F5FCE0'],
  'color/border/accent':       ['color/brand/500', '#B4F03A'],
  'color/text/accent':         ['color/brand/700', '#739E0E'],
  'color/text/accent-on-dark': ['color/brand/400', '#BFF44A'],
  'color/text/accent-strong':  ['color/brand/800', '#4F6E0A'],
  'color/text/brand':          ['color/brand/800', '#4F6E0A'],
  'color/text/on-accent':      ['color/brand/on',  '#1F3304'],
  'color/border/focus':        ['color/brand/600', '#97D219'],
  'color/focus/ring':          ['color/brand/600', '#97D219'],
};
for (const v of sem) if (M[v.name]) { v.modes.Light.alias = M[v.name][0]; v.modes.Light.resolved = M[v.name][1]; }
fs.writeFileSync('semantic.json', JSON.stringify(sem));

// 3) link themes.css in the landing (after tokens.css)
let h = fs.readFileSync('../../landing/index.html', 'utf8');
if (!h.includes('themes.css')) {
  h = h.replace('<link rel="stylesheet" href="styles.css">', '<link rel="stylesheet" href="themes.css">\n  <link rel="stylesheet" href="styles.css">');
  fs.writeFileSync('../../landing/index.html', h);
}
console.log('brand ramp + semantics re-pointed; themes.css linked');
