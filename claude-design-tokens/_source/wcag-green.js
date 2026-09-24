// WCAG relative luminance + contrast — find the brightest "clean" green for text/brand.
function lin(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
function L(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);}
function contrast(a,b){const l1=L(a),l2=L(b),hi=Math.max(l1,l2),lo=Math.min(l1,l2);return (hi+0.05)/(lo+0.05);}
const WHITE="#FFFFFF", DARK="#141A1E";
function rep(label,hex){console.log(label.padEnd(20),hex,"  on white:",contrast(hex,WHITE).toFixed(2)+":1","  on #141A1E:",contrast(hex,DARK).toFixed(2)+":1");}

console.log("=== current brand ramp ===");
[["brand/400","#BFF44A"],["brand/500","#B4F03A"],["brand/600","#97D219"],["brand/700","#75A30F"],["brand/800","#4F6E0A"],["brand/on","#1F3304"]].forEach(([n,h])=>rep(n,h));

console.log("\n=== candidate greens for text/brand on WHITE ===");
[
 ["current 800","#4F6E0A"],["brand700","#75A30F"],
 ["cleaner A","#3C8C00"],["cleaner B","#458500"],["cleaner C","#4E7A00"],
 ["green A","#3F8A1E"],["green B","#2E8B2E"],["forest","#2E7D14"],
 ["grass","#4A8B0A"],["chartreuse","#5A9000"],["#2F8F00","#2F8F00"],
 ["#368A00","#368A00"],["#2D9000","#2D9000"],
].forEach(([n,h])=>rep(n,h));

console.log("\nthresholds: AA normal 4.5:1 -> max L =",(1.05/4.5-0.05).toFixed(4),
            "| AA large 3.0:1 -> max L =",(1.05/3.0-0.05).toFixed(4));

console.log("\n=== brightest, most-saturated green at each contrast on WHITE (hue/sat/light sweep) ===");
function hsl(h,s,l){s/=100;l/=100;const k=n=>(n+h/30)%12;const a=s*Math.min(l,1-l);const f=n=>l-a*Math.max(-1,Math.min(k(n)-3,9-k(n),1));const to=v=>Math.round(255*Math.max(0,Math.min(1,v))).toString(16).padStart(2,"0");return "#"+to(f(0))+to(f(8))+to(f(4));}
[4.5,4.0,3.5,3.0].forEach(T=>{
  let best=null;
  for(let h=70;h<=140;h+=2)for(let s=100;s>=55;s-=5)for(let l=60;l>=15;l-=1){
    const hex=hsl(h,s,l);
    if(contrast(hex,WHITE)>=T){ if(!best||L(hex)>best.L) best={hex,h,s,l,L:L(hex),c:contrast(hex,WHITE)}; break; }
  }
  if(best) console.log("contrast >= "+T+":", best.hex, "(H"+best.h+" S"+best.s+" L"+best.l+")  actual",best.c.toFixed(2)+":1");
});
