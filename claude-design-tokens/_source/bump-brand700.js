/* Bump brand/700 from #75A30F -> #739E0E (brightest brand chartreuse that actually clears
   WCAG AA-large, 3.17:1 on white vs 2.999 before). Visually ~identical. This is the value
   behind text/accent (large bright brand text) AND the logo mark — both follow.
   Also rebind Card/Stat's big number from text/brand (dark olive) -> text/accent. */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');            // claude-design-tokens
const LANDING = path.join(ROOT, '..', 'landing');
const OLD = /#75A30F/gi, NEW = '#739E0E';
const SKIP = new Set(['wcag-green.js', 'bump-brand700.js']);

function walk(dir, acc) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp, acc);
    else if (!SKIP.has(e.name) && /\.(html|css|json|md|svg|js)$/.test(e.name)) acc.push(fp);
  }
  return acc;
}

let n = 0;
for (const fp of [...walk(ROOT, []), ...walk(LANDING, [])]) {
  const b = fs.readFileSync(fp, 'utf8');
  const a = b.replace(OLD, NEW);
  if (a !== b) { fs.writeFileSync(fp, a); n++; }
}
console.log('brand/700 hex bumped in', n, 'files');

// rebind only the .stat-card__value rule (the big number); leave .stat-card__icon--brand dark
const stat = [
  path.join(ROOT, 'components', 'card-stat', 'index.html'),
  path.join(ROOT, 'ds-bundle', 'components', 'Molecules', 'CardStat', 'CardStat.html'),
];
for (const fp of stat) {
  let s = fs.readFileSync(fp, 'utf8');
  const re = /(\.stat-card__value\s*\{[^}]*?)--color-text-brand/;
  if (re.test(s)) { fs.writeFileSync(fp, s.replace(re, '$1--color-text-accent')); console.log('rebound value ->', path.basename(fp)); }
  else console.log('NO .stat-card__value match in', path.basename(fp));
}
