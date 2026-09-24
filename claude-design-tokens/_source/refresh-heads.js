/* Re-inject the freshly built _cardhead.css (tokens) into every component card's <head>,
   preserving each card's body (incl. the patched real logo). Run AFTER build-tokens.js. */
const fs = require('fs');
const path = require('path');
const SRC = __dirname;
const ROOT = path.join(__dirname, '..');
const HEAD = fs.readFileSync(path.join(SRC, '_cardhead.css'), 'utf8');
const re = /(<head><meta charset="utf-8"><style>\n)[\s\S]*?(\n<\/style><\/head>)/;
const dirs = fs.readdirSync(path.join(ROOT, 'components'))
  .filter(d => d !== 'foundations' && fs.existsSync(path.join(ROOT, 'components', d, 'index.html')));
let n = 0; const missed = [];
for (const d of dirs) {
  const fp = path.join(ROOT, 'components', d, 'index.html');
  let s = fs.readFileSync(fp, 'utf8');
  if (re.test(s)) { fs.writeFileSync(fp, s.replace(re, (m, a, b) => a + HEAD + b)); n++; }
  else missed.push(d);
}
console.log(JSON.stringify({ refreshed: n, missed }));
