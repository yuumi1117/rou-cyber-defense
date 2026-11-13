/* ROU CYBER DEFENSE v1.6 — mobile safe guided tour */
(()=>{'use strict';
const style=document.createElement('style');style.textContent=`
#ctShade{position:fixed;inset:0;z-index:8000;pointer-events:none;background:rgba(2,8,18,.68)}
#ctFocus{position:fixed;z-index:8001;pointer-events:none;border:3px solid #56f1d1;border-radius:12px;box-shadow:0 0 0 9999px rgba(2,8,18,.72),0 0 25px #36d6b388;transition:none;animation:ctGlow 1.4s ease-in-out infinite alternate}@keyframes ctGlow{to{box-shadow:0 0 0 9999px rgba(2,8,18,.72),0 0 34px #56f1d1}}}
#ctPointer{position:fixed;z-index:8003;pointer-events:none;font-size:27px;filter:drop-shadow(0 2px 3px #000);transform:translate(-50%,-50%);animation:none;line-height:1}
#ctPanel{position:fixed;z-index:8004;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));margin:auto;max-width:460px;background:#11233b;color:#e9f5ff;border:1px solid #4d8c9a;border-radius:16px;padding:15px;box-shadow:0 12px 42px #000b;font:14px/1.65 system-ui,sans-serif}
#ctPanel.ctTop{top:calc(12px + env(safe-area-inset-top));bottom:auto}#ctPanel.ctBottom{top:auto;bottom:calc(12px + env(safe-area-inset-bottom))}#ctPanel strong{display:block;font-size:16px;margin-bottom:4px}#ctPanel p{margin:4px 0 12px;color:#c8d8e8}#ctPanel .ctButtons{display:flex;align-items:center;justify-content:space-between;gap:8px}#ctPanel button{border:1px solid #56718a;background:#203750;color:white;padding:8px 13px;border-radius:9px;min-height:42px}#ctPanel .ctCount{font-size:12px;color:#77e7cb}#ctPanel[hidden],#ctFocus[hidden],#ctPointer[hidden]{display:none!important}
body.ctTour #operationGuideBtn{outline:0}
`;document.head.appendChild(style);
const $=s=>document.querySelector(s);const launch=document.createElement('button');launch.className='secondary';launch.id='cursorTourBtn';launch.textContent='👆 画面をタップして覚える';$('.hero-actions')?.append(launch);
const focus=document.createElement('div');focus.id='ctFocus';focus.hidden=true;const pointer=document.createElement('div');pointer.id='ctPointer';pointer.hidden=true;pointer.textContent='👆';const panel=document.createElement('div');panel.id='ctPanel';panel.hidden=true;panel.setAttribute('role','status');panel.innerHTML='<span class="ctCount" id="ctCount"></span><strong id="ctTitle"></strong><p id="ctText"></p><div class="ctButtons"><button id="ctStop">✕ 終了</button><span style="font-size:12px;color:#8be6cf">光っている場所をタップ！</span><button id="ctSkip">次へ ›</button></div>';document.body.append(focus,pointer,panel);
let step=0,active=false,startedByTour=false,restorePage='overview';
const steps=[
{selector:'#startBtn',page:'overview',title:'① 演習を始めよう',text:'光っている「インシデントを開始」をタップ。事件が始まるよ。',action:'start'},
{selector:'.nav[data-page="alerts"]',page:'alerts',title:'② アラート画面',text:'ここで検知された事件を確認できるよ。タップしてみよう。',action:'nav'},
{selector:'#alertsList .alert-item',page:'alerts',title:'③ アラートの詳細',text:'通知をタップすると、右側（スマホでは下側）に詳細が出るよ。',action:'alert'},
{selector:'.nav[data-page="logs"]',page:'logs',title:'④ ログ検索へ',text:'怪しい操作の記録を調べよう。ここをタップ！',action:'nav'},
{selector:'#logQuery',page:'logs',title:'⑤ 検索語を入力',text:'ここをタップして「sato」と入力してみよう。入力できたら「次へ」を押してね。',action:'input'},
{selector:'#searchBtn',page:'logs',title:'⑥ ログを検索',text:'検索ボタンを押して記録を表示しよう。',action:'search'},
{selector:'.nav[data-page="response"]',page:'response',title:'⑦ 対応画面へ',text:'ここから封じ込めなどの対応を選ぶよ。',action:'nav'},
{selector:'#actionGrid .action:not(:disabled)',page:'response',title:'⑧ 対応を選ぶ',text:'対応ボタンの位置を確認しよう。練習中は押しても実行されず、減点もないよ。',action:'mock'},
{selector:'.nav[data-page="report"]',page:'report',title:'⑨ 最終報告へ',text:'調査が終わったら、ここから報告を提出するよ。',action:'nav'},
{selector:'#submitBtn',page:'report',title:'⑩ 報告を提出',text:'ここが採点ボタン。練習中は提出されないから安心して押してね。',action:'mock'}
];
function navigate(page){const nav=$(`.nav[data-page="${page}"]`);if(nav)nav.click()}
let frame=0,scrollTimer=0,layoutTimer=0;
function viewHeight(){return window.visualViewport?.height||window.innerHeight}
function positionPanel(){
 const t=$(steps[step].selector);if(!t)return;
 const rect=t.getBoundingClientRect(),vh=viewHeight();
 // Put instructions opposite the control so the search field remains usable.
 const preferTop=steps[step].action==='input'||steps[step].action==='search'||rect.top>vh*.50;
 panel.classList.toggle('ctTop',preferTop);panel.classList.toggle('ctBottom',!preferTop);
}
function ensureTargetVisible(){
 const t=$(steps[step].selector);if(!t)return;
 const vh=viewHeight(),r=t.getBoundingClientRect();
 const ph=panel.getBoundingClientRect().height;
 const margin=20, topEdge=margin+(panel.classList.contains('ctTop')?ph+margin:0);
 const bottomEdge=vh-margin-(panel.classList.contains('ctBottom')?ph+margin:0);
 let delta=0;
 if(r.top<topEdge)delta=r.top-topEdge;
 else if(r.bottom>bottomEdge)delta=r.bottom-bottomEdge;
 if(delta)window.scrollBy({top:delta,behavior:'instant'});
}
function settle(){if(!active)return;positionPanel();ensureTargetVisible();queuePlace()}

function place(){
 if(!active)return;
 const target=$(steps[step].selector);
 if(!target||target.disabled){focus.hidden=pointer.hidden=true;return}
 const r=target.getBoundingClientRect();
 const panelRect=panel.getBoundingClientRect();
 const vh=viewHeight();const visible=r.width>0&&r.height>0&&r.bottom>8&&r.top<vh-8;
 const covered=visible&&r.bottom>panelRect.top&&r.top<panelRect.bottom&&r.right>panelRect.left&&r.left<panelRect.right;
 if(!visible||covered){focus.hidden=pointer.hidden=true;return}
 focus.hidden=pointer.hidden=false;
 focus.style.left=Math.max(3,r.left-5)+'px';
 focus.style.top=Math.max(3,r.top-5)+'px';
 focus.style.width=r.width+10+'px';focus.style.height=r.height+10+'px';
 pointer.style.left=Math.max(24,Math.min(innerWidth-24,r.left+r.width/2))+'px';
 pointer.style.top=Math.max(24,Math.min(vh-24,r.top+r.height/2))+'px';
}
function queuePlace(){if(frame)cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{frame=0;place()})}
function onScroll(){
 if(!active)return;
 // While the user scrolls, hide the pointer instead of letting it drift over unrelated controls.
 pointer.hidden=true;focus.hidden=true;
 clearTimeout(scrollTimer);
 scrollTimer=setTimeout(()=>{if(active)settle()},180);
}
function render(){if(!active)return;if(step>=steps.length){end(true);return}const s=steps[step];navigate(s.page);$('#ctCount').textContent=`STEP ${step+1} / ${steps.length}`;$('#ctTitle').textContent=s.title;$('#ctText').textContent=s.text;$('#ctSkip').textContent=step===steps.length-1?'完了 ✓':'次へ ›';const t=$(s.selector);if(t){t.scrollIntoView({block:'center',behavior:'instant'});}requestAnimationFrame(()=>requestAnimationFrame(settle))}
function next(){if(steps[step]?.action==='input'&&$('#logQuery')?.value.trim().toLowerCase()!=='sato'){ $('#ctText').textContent='まず検索欄に「sato」と入力してね。入力したら次へ進めるよ。';$('#logQuery')?.focus();return;}step++;render()}
function end(done){active=false;focus.hidden=pointer.hidden=panel.hidden=true;clearTimeout(scrollTimer);document.body.classList.remove('ctTour');if(startedByTour){/* only reset the scenario created for this tour */$('#resetBtn')?.click()}else navigate(restorePage);if(done){const toast=$('#toast');if(toast){toast.textContent='✓ 操作ガイド完了！ 次は本番に挑戦しよう。';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)}}}
function open(){if(active)return;restorePage=$('.nav.active')?.dataset.page||'overview';startedByTour=false;step=$('#startBtn')?.disabled?1:0;active=true;focus.hidden=pointer.hidden=panel.hidden=false;document.body.classList.add('ctTour');render()}
launch.addEventListener('click',open);$('#ctStop').addEventListener('click',()=>end(false));$('#ctSkip').addEventListener('click',()=>{const s=steps[step];if(s.action==='start'&&!$('#startBtn').disabled){startedByTour=true;$('#startBtn').click()}next()});
document.addEventListener('click',e=>{if(!active)return;const s=steps[step],t=$(s.selector);if(!t)return;const hit=e.target.closest(s.selector);if(!hit)return;if(s.action==='input')return;if(s.action==='mock'){e.preventDefault();e.stopImmediatePropagation();next();return}if(s.action==='start'){startedByTour=true;setTimeout(next,30);return}if(s.action==='search'){setTimeout(next,30);return}setTimeout(next,30)},true);
window.addEventListener('resize',()=>{if(active)settle()});window.visualViewport?.addEventListener('resize',()=>{if(active)settle()});window.addEventListener('scroll',onScroll,true);
})();
