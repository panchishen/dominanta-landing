/* Audit assembled cards: undefined tokens, stale values, structural sanity. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const tokensCss = fs.readFileSync(path.join(ROOT, 'tokens.css'), 'utf8');
const defined = new Set([...tokensCss.matchAll(/(--[a-z0-9-]+)\s*:/g)].map(m => m[1]));

const STALE = [/\bInter\b/, /#0f7c8c/i, /#14b8a6/i, /#0ea5a4/i, /#0d9488/i, /#0891b2/i, /#2dd4bf/i, /Дизайн-система\b/];
const cardDirs = fs.readdirSync(path.join(ROOT, 'components')).filter(d => fs.existsSync(path.join(ROOT, 'components', d, 'index.html')));
let problems = 0;
const report = [];
for (const d of cardDirs.sort()) {
  const file = path.join(ROOT, 'components', d, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const used = new Set([...html.matchAll(/var\((--[a-z0-9-]+)\)/g)].map(m => m[1]));
  const unknown = [...used].filter(u => !defined.has(u));
  const stale = STALE.filter(rx => rx.test(html)).map(rx => rx.source);
  const marker = /^<!--\s*@dsCard group="[^"]+" name="[^"]+"/.test(html);
  const wrapCount = (html.match(/<div class="ds-wrap">/g) || []).length;
  const doctypeCount = (html.match(/<!DOCTYPE/gi) || []).length;
  const issues = [];
  if (unknown.length) issues.push('undefined tokens: ' + unknown.join(', '));
  if (stale.length) issues.push('stale: ' + stale.join(', '));
  if (!marker) issues.push('missing/garbled @dsCard marker');
  if (wrapCount !== 1) issues.push('ds-wrap count=' + wrapCount);
  if (doctypeCount !== 1) issues.push('doctype count=' + doctypeCount);
  if (issues.length) { problems++; report.push(`✗ ${d}: ${issues.join(' | ')}`); }
}
console.log(`defined tokens: ${defined.size}; cards checked: ${cardDirs.length}; cards with issues: ${problems}`);
if (report.length) console.log(report.join('\n')); else console.log('ALL CLEAN ✓');
