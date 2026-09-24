/* Русская типографика: неразрывные пробелы (U+00A0).
   Канонический типограф — ту же функцию typografRu применяем и в Figma (макет + ДС). */
const fs = require('fs');
const path = process.argv[2];

const N = String.fromCharCode(0xA0); // U+00A0
const SP = '\\u0020';                // обычный пробел в регэкспах
// предлоги/союзы, которые НЕ должны висеть в конце строки -> клеим к следующему слову
const FWD = ['в','во','на','за','из','изо','к','ко','с','со','у','о','об','обо','от','ото','до','по','под','подо','над','надо','для','без','безо','при','про','не','ни','и','а','но','да','или','либо','то','что','как','чем','так'];

function typografRu(s) {
  // 1) неразрывный пробел перед тире (— –), чтобы тире не начинало строку
  s = s.replace(new RegExp(SP + '([\\u2014\\u2013])(?=\\s)', 'g'), N + '$1');
  // 2) числа: приклеиваем к следующему токену (разряды, единицы, валюта, %, слова)
  s = s.replace(new RegExp('(\\d)' + SP + '(?=\\S)', 'g'), '$1' + N);
  // 3) предлоги/союзы -> к следующему слову (в цикле, чтобы покрыть подряд идущие)
  const re = new RegExp('(^|[\\s\\u00A0(\\u00AB\\u201E\\u201C"\\u0027])(' + FWD.join('|') + ')' + SP, 'gi');
  let prev;
  do { prev = s; s = s.replace(re, '$1$2' + N); } while (s !== prev);
  // 4) частицы -> к предыдущему слову
  s = s.replace(new RegExp(SP + '(же|ли|бы|ль)(?=$|[\\s.,;:!?)\\u00BB\\u2026])', 'gi'), N + '$1');
  return s;
}

// ---- применение к HTML: только текст между тегами, пропускаем script/style ----
const html = fs.readFileSync(path, 'utf8');
const reTag = /<[^>]+>/g;
let out = '', last = 0, skip = false, m;
const diffs = [];
function apply(text) {
  if (!text.trim()) return text;
  const fixed = typografRu(text);
  if (fixed !== text) diffs.push([text.trim(), fixed.trim()]);
  return fixed.replace(new RegExp('\\u00A0', 'g'), '&nbsp;');
}
while ((m = reTag.exec(html)) !== null) {
  out += skip ? html.slice(last, m.index) : apply(html.slice(last, m.index));
  const tag = m[0];
  out += tag;
  if (/^<(script|style)[\s>]/i.test(tag)) skip = true;
  if (/^<\/(script|style)>/i.test(tag)) skip = false;
  last = reTag.lastIndex;
}
out += skip ? html.slice(last) : apply(html.slice(last));

fs.writeFileSync(path, out, 'utf8');
console.log('Изменено текстовых фрагментов:', diffs.length);
diffs.slice(0, 80).forEach(([a, b]) => console.log('-', a.slice(0, 92), '\n   ->', b.slice(0, 112)));
