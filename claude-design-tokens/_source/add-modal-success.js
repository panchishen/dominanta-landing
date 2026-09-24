/* Add the "submitted/success" state to the Modal preview card (components + ds-bundle):
   a brand-tinted circle with the sparkling-2 (fill) icon, success heading + paragraph.
   Scrim is already semi-transparent (.mdl-scrim::before opacity .5). */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const files = [
  path.join(ROOT, 'components', 'modal', 'index.html'),
  path.join(ROOT, 'ds-bundle', 'components', 'Molecules', 'Modal', 'Modal.html'),
];

const CSS_ANCHOR = '  .mdl-btn--primary:hover { background: var(--color-action-neutral-hover); }';
const CSS_ADD = CSS_ANCHOR + `

  /* Состояние «отправлено» */
  .mdl--success { align-items: center; text-align: center; gap: var(--space-md); }
  .mdl-close--abs { position: absolute; top: var(--space-lg); right: var(--space-lg); margin: 0; }
  .mdl-badge {
    width: 96px; height: 96px;
    border-radius: var(--radius-full);
    background: var(--color-bg-accent-subtle);
    display: flex; align-items: center; justify-content: center;
    margin-top: var(--space-xs);
  }
  .mdl-badge svg { display: block; width: 48px; height: 48px; color: var(--color-text-accent); }
  .mdl-ok-title { color: var(--color-text-primary); }
  .mdl-ok-text { color: var(--color-text-secondary); max-width: 320px; }`;

const SPARK = 'M17.0007 1.20825 18.3195 3.68108 20.7923 4.99992 18.3195 6.31876 17.0007 8.79159 15.6818 6.31876 13.209 4.99992 15.6818 3.68108 17.0007 1.20825ZM8.00065 4.33325 10.6673 9.33325 15.6673 11.9999 10.6673 14.6666 8.00065 19.6666 5.33398 14.6666.333984 11.9999 5.33398 9.33325 8.00065 4.33325ZM19.6673 16.3333 18.0007 13.2083 16.334 16.3333 13.209 17.9999 16.334 19.6666 18.0007 22.7916 19.6673 19.6666 22.7923 17.9999 19.6673 16.3333Z';
const END_ANCHOR = '</div></body></html>';
const CELL = `<div class="mdl-cell">

  <div class="mdl-scrim">
    <div class="mdl mdl--success" role="dialog" aria-modal="true" aria-labelledby="mdl-ok-ttl">
      <button class="mdl-close mdl-close--abs" type="button" aria-label="Закрыть">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <div class="mdl-badge" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="${SPARK}"/></svg>
      </div>
      <div class="mdl-ok-title text-h4" id="mdl-ok-ttl">Ваша заявка отправлена!</div>
      <div class="mdl-ok-text text-body-md">Мы перезвоним в течение 15 минут и подберём удобное время.</div>
    </div>
  </div>
  <span class="ds-cap">Состояние «отправлено»</span>

</div>
` + END_ANCHOR;

let done = 0;
for (const fp of files) {
  let s = fs.readFileSync(fp, 'utf8');
  if (s.includes('mdl--success')) { console.log('already has success state:', path.basename(fp)); continue; }
  if (!s.includes(CSS_ANCHOR) || !s.includes(END_ANCHOR)) { console.log('ANCHOR MISSING in', path.basename(fp)); continue; }
  s = s.replace(CSS_ANCHOR, CSS_ADD);
  s = s.replace(END_ANCHOR, CELL);
  s = s.replace('viewport="900x660"', 'viewport="900x1120"');
  fs.writeFileSync(fp, s);
  done++;
  console.log('updated', path.basename(fp));
}
console.log('files updated:', done);
