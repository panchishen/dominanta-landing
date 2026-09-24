/* Swap action/text var() names after the Primary↔Neutral / Accent→Primary rename.
   Ordered, so the consistent global rename never collides:
     1) --color-action-primary       -> --color-action-neutral   (covers -hover/-pressed)
     2) --color-text-on-primary       -> --color-text-on-neutral
     3) --color-action-accent         -> --color-action-primary   (covers -hover)
     4) --color-text-on-accent        -> --color-text-on-primary
   Untouched on purpose: --color-text-primary, --color-text-accent*, --color-bg-accent-subtle,
   --color-border-accent (these are not part of the button rename). */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');          // claude-design-tokens
const LANDING = path.join(ROOT, '..', 'landing');

function swap(s) {
  return s
    .split('--color-action-primary').join('--color-action-neutral')
    .split('--color-text-on-primary').join('--color-text-on-neutral')
    .split('--color-action-accent').join('--color-action-primary')
    .split('--color-text-on-accent').join('--color-text-on-primary');
}

const files = [];
// component cards (bodies; heads get rebaked by refresh-heads next) — skip foundations (regenerated)
const cdir = path.join(ROOT, 'components');
for (const d of fs.readdirSync(cdir)) {
  const fp = path.join(cdir, d, 'index.html');
  if (d !== 'foundations' && fs.existsSync(fp)) files.push(fp);
}
// ds-bundle component cards (head + body both swapped — bundle is not rebaked)
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp);
    else if (/\.(html|css|json|md)$/.test(e.name)) files.push(fp);
  }
})(path.join(ROOT, 'ds-bundle'));
// hand-written docs + landing
[path.join(ROOT, '.design-sync', 'conventions.md'), path.join(LANDING, 'styles.css')]
  .forEach(f => { if (fs.existsSync(f)) files.push(f); });

let changed = 0;
for (const fp of files) {
  const before = fs.readFileSync(fp, 'utf8');
  const after = swap(before);
  if (after !== before) { fs.writeFileSync(fp, after); changed++; }
}
console.log(JSON.stringify({ scanned: files.length, changed }));
