/* Rename action/text tokens in semantic.json: black=Neutral, green/brand=Primary. */
const fs = require('fs');
const sem = JSON.parse(fs.readFileSync('semantic.json', 'utf8'));
const R = {
  'color/action/primary':        ['color/action/neutral',        'var(--color-action-neutral)'],
  'color/action/primary-hover':  ['color/action/neutral-hover',  'var(--color-action-neutral-hover)'],
  'color/action/primary-pressed':['color/action/neutral-pressed','var(--color-action-neutral-pressed)'],
  'color/text/on-primary':       ['color/text/on-neutral',       'var(--color-text-on-neutral)'],
  'color/action/accent':         ['color/action/primary',        'var(--color-action-primary)'],
  'color/action/accent-hover':   ['color/action/primary-hover',  'var(--color-action-primary-hover)'],
  'color/text/on-accent':        ['color/text/on-primary',       'var(--color-text-on-primary)'],
};
for (const v of sem) if (R[v.name]) { const [nn, cc] = R[v.name]; v.name = nn; v.code = cc; }
fs.writeFileSync('semantic.json', JSON.stringify(sem));
console.log('semantic.json: 7 tokens renamed (primary↔neutral / accent→primary)');
