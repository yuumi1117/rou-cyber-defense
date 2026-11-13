(function(){'use strict';
const steps=[
{title:'ようこそ、分析官！',body:`<p>あなたは架空の会社のセキュリティ担当者。社員のアカウントが乗っ取られたかもしれない、という通報が届きました。</p><div class="tutorial-callout">任務は「怪しいものを全部止める」ことではありません。<strong>証拠を守り、必要な範囲で封じ込め、業務への影響を減らす</strong>ことです。</div><p>このチュートリアルではゲームの操作方法を6ステップで学びます。</p>`},
{title:'① アラートを確認する',body:`<p>「アラート」は監視システムが見つけた異常の通知です。<strong>重大度が高いものから確認</strong>しますが、通知が出ただけで攻撃が確定するわけではありません。</p><div class="tutorial-example">CRITICAL：機密フォルダへの大量アクセス<br>HIGH：未知の端末からのログイン<br>MEDIUM：夜間バックアップの大量読み取り</div><div class="tutorial-callout">ポイント：同じ「大量アクセス」でも、正常なバックアップと不正アクセスは区別しよう。</div>`},
{title:'② ログを突き合わせる',body:`<p>「ログ検索」では、ユーザー名・IP・端末・イベントで記録を絞り込めます。<strong>1件だけで判断せず、複数の記録を比較</strong>するのがコツ。</p><div class="tutorial-example">user=sato / login_success / unknown device<br>user=sato / token_refresh<br>user=backup_svc / nightly_backup</div><p>最初は <strong>sato</strong> と <strong>backup_svc</strong> を検索して、何が違うか調べてみよう。</p>`},
{title:'③ 証拠保全と封じ込め',body:`<p>証拠となるログは、あとから原因を調べるために大切です。削除せず保全しましょう。</p><p>不正セッションの失効は、盗まれた認証状態を使わせないための対応です。<strong>パスワード変更だけでは既存のセッションが残る場合</strong>があります。</p><div class="tutorial-callout">実際の現場では、証拠保全・緊急封じ込め・CSIRTへの報告を状況に応じて並行します。</div>`},
{title:'④ 止めすぎにも注意',body:`<p>全社員のアカウント停止や正常なバックアップ停止は、会社の業務に大きな影響を与えます。</p><div class="tutorial-example">⚠ 全社アカウント停止 → 大規模な業務停止<br>⚠ 正常なバックアップ停止 → 復旧能力に影響<br>⚠ ログ削除 → 調査証拠を失う</div><div class="tutorial-callout">端末隔離が必要なケースもあります。大事なのは、<strong>根拠と被害の大きさに応じて判断</strong>すること。</div>`},
{title:'⑤ 最終報告と採点',body:`<p>「最終報告」では、アカウント侵害の可能性と情報流出の評価を選びます。</p><p>外部へ420MBの通信があっても、<strong>通信内容が不明なら「情報流出が確定」とは言えません</strong>。</p><div class="tutorial-callout">覚える言葉：<strong>事実・疑い・未確認</strong>。この3つを分けて報告するのが分析官の基本！</div><p>準備ができたら閉じて「インシデントを開始」を押そう。健闘を祈る！</p>`}
];let i=0;const $=id=>document.getElementById(id);const overlay=$('tutorialOverlay');if(!overlay)return;
function render(){const x=steps[i];$('tutorialStepLabel').textContent='STEP '+(i+1)+' / '+steps.length;$('tutorialProgressFill').style.width=((i+1)/steps.length*100)+'%';$('tutorialBody').innerHTML='<h3>'+x.title+'</h3>'+x.body;$('tutorialPrev').disabled=i===0;$('tutorialNext').textContent=i===steps.length-1?'演習へ進む ✓':'次へ →';}
function open(){i=0;render();overlay.hidden=false;document.body.style.overflow='hidden';$('tutorialClose').focus()}
function close(){overlay.hidden=true;document.body.style.overflow=''}
$('tutorialBtn').addEventListener('click',open);$('tutorialClose').addEventListener('click',close);$('tutorialPrev').addEventListener('click',()=>{if(i>0){i--;render()}});$('tutorialNext').addEventListener('click',()=>{if(i<steps.length-1){i++;render()}else close()});overlay.addEventListener('click',e=>{if(e.target===overlay)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)close()});
})();
