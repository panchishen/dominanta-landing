/* Replace the placeholder diamond logo with the real «кристалис» lockup (exported from Figma).
   header (4) + logo card (2) -> full lockup; footer -> white lockup; card-review -> mark-only accent. */
const fs = require('fs');
const path = require('path');
const SRC = __dirname;
const ROOT = path.join(__dirname, '..');
const rawDef = fs.readFileSync(path.join(SRC, 'logo-default.svg'), 'utf8');
const rawInv = fs.readFileSync(path.join(SRC, 'logo-inverse.svg'), 'utf8');

// full lockup, scaled to height h, plate-less, clip stripped (avoids duplicate ids), single line
function lock(raw, h) {
  return raw
    .replace('width="162" height="32"', `height="${h}"`)
    .replace(/ clip-path="url\(#[^)]*\)"/g, '')
    .replace(/<defs>[\s\S]*?<\/defs>/g, '')
    .replace(/\n/g, '').trim();
}
const P1 = 'M10.709 1.74609C10.8986 1.68844 11.1014 1.68844 11.291 1.74609C11.3428 1.76185 11.435 1.80124 11.6309 1.95312C11.8366 2.11269 12.0878 2.3412 12.4795 2.69726L19.5332 9.10937C20.2425 9.75421 20.3725 9.89667 20.4365 10.0312C20.5112 10.1882 20.5442 10.3618 20.5312 10.5352C20.5201 10.6837 20.4501 10.8635 20.0215 11.7207L11.8232 28.1182C11.538 28.6887 11.3534 29.0542 11.1982 29.3047C11.1241 29.4243 11.0757 29.4828 11.0537 29.5078C11.018 29.5178 10.981 29.518 10.9453 29.5078C10.9231 29.4825 10.8754 29.4235 10.8018 29.3047C10.6466 29.0542 10.462 28.6887 10.1768 28.1182L1.97852 11.7207C1.54992 10.8635 1.47986 10.6837 1.46875 10.5352C1.45582 10.3618 1.48883 10.1882 1.56348 10.0312C1.62749 9.89667 1.75747 9.75421 2.4668 9.10937L9.52051 2.69726C9.91218 2.3412 10.1634 2.11269 10.3691 1.95312C10.565 1.80124 10.6572 1.76185 10.709 1.74609Z';
const P2 = 'M20.709 1.74609C20.8986 1.68845 21.1014 1.68845 21.291 1.74609C21.3428 1.76186 21.435 1.80125 21.6309 1.95312C21.8366 2.11269 22.0878 2.3412 22.4795 2.69727L29.5332 9.10938C30.2425 9.75422 30.3725 9.89668 30.4365 10.0312C30.5112 10.1882 30.5442 10.3619 30.5312 10.5352C30.5201 10.6837 30.4501 10.8635 30.0215 11.7207L21.8232 28.1182C21.538 28.6887 21.3534 29.0542 21.1982 29.3047C21.1241 29.4243 21.0757 29.4828 21.0537 29.5078C21.018 29.5178 20.981 29.518 20.9453 29.5078C20.9231 29.4825 20.8754 29.4235 20.8018 29.3047C20.6466 29.0542 20.462 28.6887 20.1768 28.1182L11.9785 11.7207C11.5499 10.8635 11.4799 10.6837 11.4688 10.5352C11.4558 10.3619 11.4888 10.1882 11.5635 10.0312C11.6275 9.89668 11.7575 9.75422 12.4668 9.10938L19.5205 2.69727C19.9122 2.3412 20.1634 2.11269 20.3691 1.95312C20.565 1.80125 20.6572 1.76186 20.709 1.74609Z';
const markOnly = h => `<svg viewBox="0 0 32 32" width="${h}" height="${h}" fill="none" aria-hidden="true"><path d="${P1}" stroke="currentColor" stroke-width="2"/><path d="${P2}" stroke="currentColor" stroke-width="2"/></svg>`;
const wrap = (svg) => `<span class="kr-logo" role="img" aria-label="кристалис" style="display:inline-flex;align-items:center">${svg}</span>`;

const file = p => path.join(ROOT, 'components', p, 'index.html');
const PH = '<svg[^>]*><path d="M12 3l6 5-6 13L6 8z" fill="currentColor"\\/><\\/svg>';
const out = [];

function patch(slug, rules) {
  let s = fs.readFileSync(file(slug), 'utf8');
  let n = 0;
  for (const [re, rep] of rules) s = s.replace(re, () => { n++; return rep; });
  fs.writeFileSync(file(slug), s);
  out.push({ slug, replaced: n, leftover: /M12 3l6 5-6 13L6 8z/.test(s) });
}

patch('header', [
  [new RegExp(`<span class="hdr-mark">\\s*${PH}\\s*<\\/span>\\s*<span class="hdr-word hdr-word--light text-h5">кристалис<\\/span>`, 'g'), wrap(lock(rawDef, 28))],
  [new RegExp(`<span class="hdr-mark">\\s*${PH}\\s*<\\/span>\\s*<span class="hdr-word hdr-word--dark text-h5">кристалис<\\/span>`, 'g'), wrap(lock(rawInv, 28))],
]);
patch('logo', [
  [new RegExp(`<span class="logo-mark logo-mark--default">\\s*${PH}\\s*<\\/span>\\s*<span class="logo-word logo-word--default text-h4">кристалис<\\/span>`, 'g'), wrap(lock(rawDef, 40))],
  [new RegExp(`<span class="logo-mark logo-mark--inverse">\\s*${PH}\\s*<\\/span>\\s*<span class="logo-word logo-word--inverse text-h4">кристалис<\\/span>`, 'g'), wrap(lock(rawInv, 40))],
]);
patch('footer', [
  [new RegExp(`${PH}\\s*<span class="text-h4">Кристалис<\\/span>`, 'g'), wrap(lock(rawInv, 30))],
]);
patch('card-review', [
  [new RegExp(PH, 'g'), markOnly(14)],
]);

console.log(JSON.stringify(out, null, 2));
