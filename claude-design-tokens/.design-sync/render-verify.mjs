/* Render-verify every preview card with headless Chrome.
   Screenshots each card HTML under ds-bundle/components at its @dsCard viewport into
   ds-bundle/_screenshots/, flags blanks (tiny PNG), and tiles contact sheets for review. */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '..', '..');
const OUT = path.join(ROOT, 'ds-bundle');
const SHOTS = path.join(OUT, '_screenshots');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
fs.rmSync(SHOTS, { recursive:true, force:true });
fs.mkdirSync(SHOTS, { recursive:true });

const cards = [];
function walk(d){ for (const e of fs.readdirSync(d,{withFileTypes:true})){ const p=path.join(d,e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.html')) cards.push(p); } }
walk(path.join(OUT,'components'));
cards.sort();

const results = [];
for (const c of cards){
  const raw = fs.readFileSync(c,'utf8');
  const first = raw.split('\n',1)[0];
  const vp = first.match(/viewport="(\d+)x(\d+)"/);
  const grp = first.match(/group="([^"]*)"/);
  const nm = first.match(/name="([^"]*)"/);
  let w = vp?+vp[1]:1000, h = vp?+vp[2]:600;
  w = Math.min(w, 1400); h = Math.min(h, 1500);
  const rel = path.relative(path.join(OUT,'components'), c).replace(/[\\/]/g,'__').replace(/\.html$/,'');
  const png = path.join(SHOTS, rel + '.png');
  try {
    execFileSync(CHROME, ['--headless=new','--disable-gpu','--hide-scrollbars',
      `--screenshot=${png}`, `--window-size=${w},${h}`, '--force-device-scale-factor=1',
      '--virtual-time-budget=2500', pathToFileURL(c)], { stdio:'ignore', timeout: 30000 });
  } catch(e){ /* chrome sometimes exits non-zero but still writes png */ }
  const bytes = fs.existsSync(png) ? fs.statSync(png).size : 0;
  results.push({ name: nm?nm[1]:rel, group: grp?grp[1]:'?', file: rel, w, h, bytes, ok: bytes > 3000 });
}

function pathToFileURL(p){ return 'file:///' + p.replace(/\\/g,'/'); }

fs.writeFileSync(path.join(SHOTS,'render-check.json'), JSON.stringify(results,null,2));
const bad = results.filter(r=>!r.ok);
console.log(`Rendered ${results.length} cards. Blank/failed (<3KB): ${bad.length}`);
for (const b of bad) console.log(`  BLANK: ${b.group}/${b.name} (${b.bytes} bytes)`);

// Contact sheets: montage HTML referencing the PNGs, ~6 cards per sheet
const perSheet = 6, sheets = [];
for (let i=0;i<results.length;i+=perSheet){
  const chunk = results.slice(i,i+perSheet);
  const imgs = chunk.map(r=>`<figure style="margin:0"><figcaption style="font:13px/1.4 monospace;padding:4px 0">${r.group} / ${r.name} (${r.bytes}B)</figcaption><img src="${SHOTS.replace(/\\/g,'/')}/${r.file}.png" style="max-width:560px;border:1px solid #ccc;display:block"></figure>`).join('\n');
  const html = `<!doctype html><meta charset=utf-8><body style="margin:16px;background:#fff;display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start">${imgs}</body>`;
  const shtHtml = path.join(SHOTS, `sheet-${sheets.length}.html`);
  fs.writeFileSync(shtHtml, html);
  const shtPng = path.join(SHOTS, `contact-sheet-${sheets.length}.png`);
  try { execFileSync(CHROME, ['--headless=new','--disable-gpu','--hide-scrollbars',`--screenshot=${shtPng}`,'--window-size=1240,2000','--virtual-time-budget=3000', pathToFileURL(shtHtml)], { stdio:'ignore', timeout:30000 }); } catch(e){}
  sheets.push(shtPng);
}
console.log(`Contact sheets: ${sheets.length}`);
