/* Re-theme package + landing: indigo → black/green/white (mirrors the Figma token re-points). */
const fs = require('fs');

// 1) semantic tokens: re-point indigo aliases
const sem = JSON.parse(fs.readFileSync('semantic.json', 'utf8'));
const M = {
  'color/bg/inverse':            ['color/neutral/900', '#141A1E'],
  'color/text/brand':            ['color/accent/800',  '#4F6E0A'],
  'color/bg/brand-subtle':       ['color/neutral/100', '#EFF2F4'],
  'color/action/secondary':      ['color/neutral/100', '#EFF2F4'],
  'color/action/secondary-hover':['color/neutral/200', '#E2E7EA'],
  'color/border/focus':          ['color/accent/600',  '#97D219'],
  'color/focus/ring':            ['color/accent/600',  '#97D219'],
};
for (const v of sem) if (M[v.name]) { v.modes.Light.alias = M[v.name][0]; v.modes.Light.resolved = M[v.name][1]; }
fs.writeFileSync('semantic.json', JSON.stringify(sem));

// 2) shadow/focus effect → green tint
const st = JSON.parse(fs.readFileSync('styles.json', 'utf8'));
const f = st.effectStyles.find(s => s.name === 'shadow/focus'); if (f) f.effects[0].color = '#97D21940';
fs.writeFileSync('styles.json', JSON.stringify(st));

// 3) logo SVGs → green (default = accent/700, inverse = accent/500 lime)
let d = fs.readFileSync('logo-default.svg', 'utf8').split('#141A1E').join('#739E0E').split('#3538CD').join('#739E0E');
fs.writeFileSync('logo-default.svg', d);
let iv = fs.readFileSync('logo-inverse.svg', 'utf8').replace(/fill="white"/g, 'fill="#B4F03A"').replace(/stroke="white"/g, 'stroke="#B4F03A"');
fs.writeFileSync('logo-inverse.svg', iv);

// 4) landing hero → black, tooth card → dark
let ls = fs.readFileSync('../../landing/styles.css', 'utf8')
  .replace('var(--color-primary-500)', 'var(--color-bg-inverse)')
  .replace('var(--color-focus-ring)', 'var(--color-neutral-800)');
fs.writeFileSync('../../landing/styles.css', ls);

console.log('retheme edits: semantic(7), shadow/focus, logos, landing hero/tooth');
