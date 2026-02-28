// ══════ PASSWORD & LOGIN ══════
var DEFAULT_PW = 'Jesus247';
var PW = (function() {
  try { var s = localStorage.getItem('nx_pw'); if (s && s.length > 0) return s; } catch(e) {}
  return DEFAULT_PW;
})();

function resetPassword() {
  try { localStorage.removeItem('nx_pw'); } catch(e) {}
  PW = DEFAULT_PW;
  var ok = document.getElementById('resetOk');
  if (ok) { ok.style.display = 'block'; setTimeout(function(){ ok.style.display='none'; }, 4000); }
}

function toggleEye() {
  var inp = document.getElementById('coverPass');
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
}

function showHint() {
  var h = document.getElementById('coverHint');
  if (h) { h.style.display = h.style.display === 'none' ? 'block' : 'none'; }
  // Also show reset link
  var r = document.getElementById('coverReset');
  if (r) r.style.display = 'block';
}

window.addEventListener('DOMContentLoaded', function() {
  var inp = document.getElementById('coverPass');
  if (inp) setTimeout(function(){ try { inp.focus(); } catch(e) {} }, 100);
  try { var sp = localStorage.getItem('nx_panic'); if (sp) panicMode = sp; } catch(e) {}
});

function tryLogin() {
  var inp = document.getElementById('coverPass');
  var err = document.getElementById('coverError');
  if (!inp) return;
  var val = (inp.value || '').trim();
  if (!val) return;

  // Read the correct password fresh — never trust the cached PW variable
  var correctPw = DEFAULT_PW;
  try {
    var saved = localStorage.getItem('nx_pw');
    if (saved && saved.length > 0) correctPw = saved;
  } catch(e) {}

  if (val === correctPw || val === DEFAULT_PW) {
    err.style.display = 'none';
    inp.style.borderColor = '#34a853';
    inp.style.boxShadow = '0 0 0 2px rgba(52,168,83,.2)';
    var btn = document.getElementById('coverNext');
    if (btn) { btn.textContent = '✓'; btn.style.background = '#34a853'; }
    setTimeout(showCinematic, 350);
  } else {
    err.style.display = 'block';
    inp.style.borderColor = '#d93025';
    inp.style.boxShadow = '0 0 0 2px rgba(217,48,37,.2)';
    inp.value = '';
    var resetHint = document.getElementById('coverReset');
    if (resetHint) resetHint.style.display = 'block';
    setTimeout(function() { inp.style.borderColor = '#dadce0'; inp.style.boxShadow = 'none'; }, 2200);
  }
}

function hardResetPw() {
  try { localStorage.removeItem('nx_pw'); } catch(e) {}
  PW = DEFAULT_PW;
  var err = document.getElementById('coverError');
  var resetHint = document.getElementById('coverReset');
  var inp = document.getElementById('coverPass');
  if (err) { err.style.display='none'; err.textContent='Wrong password. Try again.'; }
  if (resetHint) resetHint.style.display='none';
  if (inp) { inp.value=''; inp.placeholder='Password reset — try again'; inp.style.borderColor='#34a853'; }
  setTimeout(function(){ if(inp){ inp.style.borderColor='#dadce0'; inp.placeholder='Enter password'; } }, 2000);
}

function showCinematic() {
  var cover = document.getElementById('cover');
  if (cover) cover.style.display = 'none';
  var uc = document.getElementById('uc');
  if (uc) uc.classList.add('show');
  setTimeout(function() { if (uc) uc.classList.remove('show'); unlock(); }, 2000);
}

function unlock() {
  var app = document.getElementById('app');
  if (app) app.style.display = 'flex';
  initSplash(); initMatrix(); initFloatingOrbs(); renderGames(); buildApps();
  aiMsg('ai', "Hey! I\u2019m StudyBot \uD83D\uDCDA Ask me anything \u2014 homework help, essays, math, or just chat!");
  setTimeout(function() { fireworks(); toast('\uD83D\uDD13 UNLOCKED', 'Welcome to StudyHub Pro!'); }, 600);
  loadSettings();
  setTimeout(initTabLine, 100);
  setTimeout(function() { updateAIBanner(); buildBgPicker(); renderHwHist(); }, 400);
}

// ══════ NAVIGATION ══════
function switchPage(id, btn) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('on'); });
  document.querySelectorAll('.tab').forEach(function(b) { b.classList.remove('on'); });
  var pg = document.getElementById(id + 'Page');
  if (pg) pg.classList.add('on');
  if (id === 'browser') { setTimeout(brRenderRecent, 50); }
  if (btn) { btn.classList.add('on'); updateTabLine(btn); }
  runLoader();
}

function initTabLine() {
  var activeTab = document.querySelector('.tab.on');
  if (activeTab) updateTabLine(activeTab);
}

function updateTabLine(btn) {
  var line = document.getElementById('tabLine');
  if (!line || !btn) return;
  var tabs = document.getElementById('tabs');
  if (!tabs) return;
  var tabsRect = tabs.getBoundingClientRect();
  var btnRect = btn.getBoundingClientRect();
  line.style.left = (btnRect.left - tabsRect.left + tabs.scrollLeft) + 'px';
  line.style.width = btnRect.width + 'px';
}

// ══════ SPLASH ══════
function initSplash() {
  var bar = document.getElementById('spBar'), msg = document.getElementById('spMsg');
  if (!bar || !msg) return;
  var msgs = ['INITIALIZING MATRIX...','LOADING 50+ GAMES...','SPINNING UP AI...','CHARGING LASERS...','ALL SYSTEMS GO \u2713'];
  var w = 0, mi = 0;
  var iv = setInterval(function() {
    w += Math.random() * 14 + 6;
    if (w >= 100) { w = 100; clearInterval(iv); }
    bar.style.width = w + '%';
    var newMi = Math.min(Math.floor(w / 22), msgs.length - 1);
    if (newMi !== mi) { mi = newMi; typeWriter(msg, msgs[mi]); }
  }, 100);
  setTimeout(function() {
    var s = document.getElementById('splash');
    if (s) { s.style.opacity = '0'; setTimeout(function() { s.style.display = 'none'; }, 500); }
  }, 1700);
}

function typeWriter(el, text) {
  if (!el) return;
  el.textContent = '';
  var i = 0;
  var iv = setInterval(function() { el.textContent += text[i++]; if (i >= text.length) clearInterval(iv); }, 28);
}

// ══════ MATRIX ══════
function initMatrix() {
  var canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');
  var chars = 'ABCDEF0123456789', fs = 13, drops = [];
  for (var i = 0; i < Math.floor(canvas.width / fs); i++) drops.push(1);
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    drops = []; for(var j=0;j<Math.floor(canvas.width/fs);j++) drops.push(1);
  });
  setInterval(function() {
    ctx.fillStyle = 'rgba(6,9,16,.055)'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#00ff88'; ctx.font = fs + 'px monospace';
    for (var i = 0; i < drops.length; i++) {
      ctx.globalAlpha = Math.random() * 0.5 + 0.5;
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fs, drops[i] * fs);
      if (drops[i] * fs > canvas.height && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    }
    ctx.globalAlpha = 1;
  }, 48);
}

// ══════ ORBS ══════
function initFloatingOrbs() {
  var colors = ['rgba(0,255,136,.35)','rgba(0,207,255,.35)','rgba(255,0,170,.3)','rgba(255,204,0,.28)','rgba(168,85,247,.3)'];
  function spawnOrb() {
    var app = document.getElementById('app'); if (!app) return;
    var orb = document.createElement('div'); orb.className = 'forb';
    var size = Math.random() * 12 + 4, col = colors[Math.floor(Math.random() * colors.length)], dur = Math.random() * 12 + 10;
    orb.style.cssText = 'width:'+size+'px;height:'+size+'px;background:'+col+';box-shadow:0 0 '+(size*3)+'px '+col+';left:'+(Math.random()*100)+'vw;animation-duration:'+dur+'s;animation-delay:'+(Math.random()*2)+'s;filter:blur('+(Math.random()*2)+'px);';
    app.appendChild(orb);
    setTimeout(function() { if(orb.parentNode) orb.parentNode.removeChild(orb); }, (dur + 4) * 1000);
  }
  for (var i = 0; i < 8; i++) setTimeout(spawnOrb, i * 700);
  setInterval(spawnOrb, 3500);
}

// ══════ LOADER ══════
function runLoader() {
  var bar = document.getElementById('neonBar'); if (!bar) return;
  bar.style.width = '0'; bar.style.opacity = '1';
  var w = 0;
  var iv = setInterval(function() {
    w += Math.random() * 20 + 8;
    if (w >= 100) { w = 100; clearInterval(iv); setTimeout(function(){bar.style.opacity='0';},200); }
    bar.style.width = w + '%';
  }, 55);
}

// ══════ TOAST ══════
function toast(title, msg, color) {
  var c = document.getElementById('toasts'); if (!c) return;
  var t = document.createElement('div'); t.className = 'toast';
  t.style.borderLeftColor = color || 'var(--g)';
  t.innerHTML = '<div class="toast-title" style="color:' + (color||'var(--g)') + '">' + title + '</div>' + msg;
  t.onclick = function() { if(t.parentNode) t.parentNode.removeChild(t); };
  c.appendChild(t);
  setTimeout(function() { t.style.transition='opacity .3s'; t.style.opacity='0'; }, 3200);
  setTimeout(function() { if(t.parentNode) t.parentNode.removeChild(t); }, 3500);
}

// ══════ FIREWORKS ══════
function fireworks() {
  var c = document.createElement('canvas');
  c.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9994;';
  c.width = window.innerWidth; c.height = window.innerHeight;
  document.body.appendChild(c);
  var ctx = c.getContext('2d'), parts = [];
  var cols = ['#00ff88','#00cfff','#ff00aa','#ffcc00','#ff6600','#a855f7','#fff'];
  function burst(x, y) {
    for (var i = 0; i < 70; i++) {
      var a = (Math.PI * 2 / 70) * i + Math.random() * .2, sp = Math.random() * 7 + 2;
      parts.push({x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,col:cols[Math.floor(Math.random()*cols.length)],life:1,size:Math.random()*3+1});
    }
  }
  var pts = [[.25,.35],[.75,.3],[.5,.55],[.15,.6],[.85,.55],[.4,.25],[.6,.65]], bi = 0;
  var biv = setInterval(function() { if(bi >= pts.length) { clearInterval(biv); return; } burst(c.width*pts[bi][0], c.height*pts[bi][1]); bi++; }, 160);
  function anim() {
    ctx.clearRect(0,0,c.width,c.height);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i]; p.x += p.vx; p.y += p.vy; p.vy += .1; p.life -= .016;
      ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.col; ctx.shadowColor = p.col; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    for (var i = parts.length-1; i >= 0; i--) if (parts[i].life <= 0) parts.splice(i,1);
    if (bi <= pts.length || parts.length > 0) requestAnimationFrame(anim);
    else if(c.parentNode) c.parentNode.removeChild(c);
  }
  requestAnimationFrame(anim);
}

// ══════ GAMES ══════
function makeBlob(html) {
  try { return URL.createObjectURL(new Blob([html], {type:'text/html'})); } catch(e) { return ''; }
}

var SNAKE_HTML = ['<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#060910;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:#00ff88}#info{margin-bottom:12px;font-size:14px;letter-spacing:3px;display:flex;gap:28px}canvas{border:2px solid #00ff88;box-shadow:0 0 30px #00ff8840}#hint{margin-top:12px;font-size:12px;color:#446688;letter-spacing:2px}</style></head><body><div id="info"><span>SCORE <b id="sc">0</b></span><span>BEST <b id="bs">0</b></span></div><canvas id="c" width="400" height="400"></canvas><div id="hint">ARROW KEYS / WASD</div><','script>const c=document.getElementById("c"),ctx=c.getContext("2d"),S=20,W=20,H=20;let sn=[{x:10,y:10}],d={x:1,y:0},food={x:5,y:5},sc=0,best=0,alive=true,spd=150,last=0;function rf(){food={x:Math.floor(Math.random()*W),y:Math.floor(Math.random()*H)};}function draw(ts){if(!alive)return;if(ts-last<spd){requestAnimationFrame(draw);return;}last=ts;let h={x:sn[0].x+d.x,y:sn[0].y+d.y};if(h.x<0||h.x>=W||h.y<0||h.y>=H||sn.some(s=>s.x===h.x&&s.y===h.y)){alive=false;ctx.fillStyle="rgba(0,0,0,.75)";ctx.fillRect(0,0,400,400);ctx.fillStyle="#ff00aa";ctx.font="bold 28px monospace";ctx.textAlign="center";ctx.fillText("GAME OVER",200,185);ctx.fillStyle="#00ff88";ctx.font="14px monospace";ctx.fillText("SCORE: "+sc,200,215);ctx.fillText("SPACE TO RESTART",200,242);return;}sn.unshift(h);if(h.x===food.x&&h.y===food.y){sc++;spd=Math.max(60,spd-2);document.getElementById("sc").textContent=sc;if(sc>best){best=sc;document.getElementById("bs").textContent=best;}rf();}else sn.pop();ctx.fillStyle="#060910";ctx.fillRect(0,0,400,400);sn.forEach((s,i)=>{ctx.fillStyle=i===0?"#00ff88":"#00aa55";ctx.shadowColor="#00ff88";ctx.shadowBlur=i===0?12:0;ctx.fillRect(s.x*S+1,s.y*S+1,S-2,S-2);});ctx.fillStyle="#ff3366";ctx.shadowColor="#ff3366";ctx.shadowBlur=10;ctx.fillRect(food.x*S+2,food.y*S+2,S-4,S-4);ctx.shadowBlur=0;requestAnimationFrame(draw);}function reset(){sn=[{x:10,y:10}];d={x:1,y:0};sc=0;spd=150;alive=true;document.getElementById("sc").textContent=0;rf();requestAnimationFrame(draw);}document.addEventListener("keydown",e=>{if(!alive&&e.code==="Space"){reset();return;}const m={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},KeyW:{x:0,y:-1},KeyS:{x:0,y:1},KeyA:{x:-1,y:0},KeyD:{x:1,y:0}};const nd=m[e.code];if(nd&&!(nd.x===-d.x&&nd.y===-d.y)){d=nd;e.preventDefault();}});reset();</',
'script></body></html>'];
var TETRIS_HTML = ['<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#060910;display:flex;align-items:center;justify-content:center;height:100vh;font-family:monospace;gap:18px}canvas{border:2px solid #00cfff;box-shadow:0 0 30px #00cfff30}#side{color:#fff;display:flex;flex-direction:column;gap:12px;min-width:105px}.panel{background:#0a1525;border:1px solid #00cfff18;padding:9px;border-radius:5px}.panel label{display:block;font-size:10px;color:#446688;letter-spacing:2px;margin-bottom:4px}.panel span{font-size:1.3rem;color:#00cfff;font-weight:bold}#next{display:grid;grid-template-columns:repeat(4,17px);gap:2px;margin-top:5px}.nc{width:17px;height:17px;border-radius:2px}p{font-size:10px;color:#334455;letter-spacing:1px;line-height:1.9}</style></head><body><canvas id="c" width="200" height="400"></canvas><div id="side"><div class="panel"><label>SCORE</label><span id="sc">0</span></div><div class="panel"><label>LINES</label><span id="ln">0</span></div><div class="panel"><label>LEVEL</label><span id="lv">1</span></div><div class="panel"><label>NEXT</label><div id="next"></div></div><div class="panel"><p>&#8592;&#8594; MOVE<br>&#8593; ROTATE<br>&#8595; SOFT<br>SPACE HARD</p></div></div><','script>const C=document.getElementById("c"),ctx=C.getContext("2d"),B=20,W=10,H=20;const PS=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[1,1,0],[0,1,1]],[[0,1,1],[1,1,0]]];const CL=["#00cfff","#ffcc00","#ff00aa","#ff6600","#00ff88","#ff3366","#a855f7"];let board,piece,px,py,nxt,score,lines,level,alive,timer;function nb(){return Array(H).fill(0).map(()=>Array(W).fill(0));}function rn(){return Math.floor(Math.random()*PS.length);}function spawn(){let t=nxt??rn();nxt=rn();piece=PS[t].map(r=>[...r]);px=Math.floor(W/2)-Math.floor(piece[0].length/2);py=0;if(col(piece,px,py)){alive=false;clearInterval(timer);}rNext();}function rNext(){let d=document.getElementById("next");d.innerHTML="";let p=PS[nxt];for(let r=0;r<4;r++)for(let c=0;c<4;c++){let el=document.createElement("div");el.className="nc";el.style.background=(p[r]&&p[r][c])?CL[nxt]:"#0d1b2a";d.appendChild(el);}}function col(p,ox,oy){for(let r=0;r<p.length;r++)for(let c=0;c<p[r].length;c++)if(p[r][c]&&(oy+r>=H||ox+c<0||ox+c>=W||board[oy+r][ox+c]))return true;return false;}function place(){piece.forEach((r,ri)=>r.forEach((v,ci)=>{if(v)board[py+ri][px+ci]=PS.indexOf(piece)+1;}));let cl=0;for(let r=H-1;r>=0;r--)if(board[r].every(c=>c)){board.splice(r,1);board.unshift(Array(W).fill(0));cl++;r++;}if(cl){lines+=cl;score+=[0,100,300,500,800][cl]*level;level=Math.floor(lines/10)+1;clearInterval(timer);timer=setInterval(drop,Math.max(50,500-level*38));document.getElementById("sc").textContent=score;document.getElementById("ln").textContent=lines;document.getElementById("lv").textContent=level;}spawn();}function drop(){if(col(piece,px,py+1))place();else py++;render();}function render(){ctx.fillStyle="#060910";ctx.fillRect(0,0,200,400);board.forEach((row,r)=>row.forEach((v,c)=>{if(v){ctx.fillStyle=CL[v-1];ctx.fillRect(c*B+1,r*B+1,B-2,B-2);}}));let ci=PS.indexOf(piece);piece.forEach((row,r)=>row.forEach((v,c)=>{if(v){ctx.fillStyle=CL[ci];ctx.fillRect((px+c)*B+1,(py+r)*B+1,B-2,B-2);}}));}function rot(p){return p[0].map((_,i)=>p.map(r=>r[i]).reverse());}document.addEventListener("keydown",e=>{if(!alive)return;if(e.key==="ArrowLeft"&&!col(piece,px-1,py))px--;else if(e.key==="ArrowRight"&&!col(piece,px+1,py))px++;else if(e.key==="ArrowDown"&&!col(piece,px,py+1))py++;else if(e.key==="ArrowUp"){let r=rot(piece);if(!col(r,px,py))piece=r;}else if(e.key===" "){while(!col(piece,px,py+1))py++;place();}else return;e.preventDefault();render();});function go(){board=nb();score=0;lines=0;level=1;alive=true;nxt=null;spawn();render();timer=setInterval(drop,500);}go();</',
'script></body></html>'];
var FLAPPY_HTML = ['<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:#060910;display:flex;align-items:center;justify-content:center;height:100vh}canvas{cursor:pointer;display:block;}</style></head><body><canvas id="c"></canvas><','script>const c=document.getElementById("c"),ctx=c.getContext("2d");c.width=340;c.height=500;let bird,pipes,score,best=0,state,fr;const BX=75,BR=17,G=0.46,JMP=-9,PW=50,GAP=140,PS=2.1;function reset(){bird={y:220,v:0};pipes=[];score=0;state="wait";fr=0;}function addPipe(){pipes.push({x:340,top:75+Math.random()*180,scored:false});}function update(){if(state!=="play")return;bird.v+=G;bird.y+=bird.v;fr++;if(fr%90===0)addPipe();pipes.forEach(p=>p.x-=PS);pipes=pipes.filter(p=>p.x>-PW);pipes.forEach(p=>{if(!p.scored&&p.x+PW<BX){p.scored=true;score++;if(score>best)best=score;}if(BX+BR>p.x&&BX-BR<p.x+PW&&(bird.y-BR<p.top||bird.y+BR>p.top+GAP))state="dead";});if(bird.y+BR>500||bird.y-BR<0)state="dead";}function draw(){ctx.fillStyle="#060910";ctx.fillRect(0,0,340,500);pipes.forEach(p=>{ctx.strokeStyle="#00ff88";ctx.lineWidth=2;ctx.fillStyle="#00ff8815";ctx.fillRect(p.x,0,PW,p.top);ctx.fillRect(p.x,p.top+GAP,PW,500);ctx.strokeRect(p.x,0,PW,p.top);ctx.strokeRect(p.x,p.top+GAP,PW,500);});ctx.save();ctx.translate(BX,bird.y);ctx.rotate(Math.min(Math.max(bird.v*.07,-.48),.48));ctx.fillStyle="#ffcc00";ctx.shadowColor="#ffcc00";ctx.shadowBlur=12;ctx.beginPath();ctx.arc(0,0,BR,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.restore();ctx.fillStyle="#fff";ctx.font="bold 24px monospace";ctx.textAlign="center";ctx.fillText(score,170,44);ctx.font="10px monospace";ctx.fillStyle="#446688";ctx.fillText("BEST: "+best,170,60);if(state==="wait"){ctx.fillStyle="#00ff88";ctx.font="14px monospace";ctx.fillText("CLICK OR SPACE TO START",170,260);}if(state==="dead"){ctx.fillStyle="rgba(0,0,0,.65)";ctx.fillRect(0,0,340,500);ctx.fillStyle="#ff00aa";ctx.font="bold 24px monospace";ctx.fillText("GAME OVER",170,215);ctx.fillStyle="#fff";ctx.font="14px monospace";ctx.fillText("SCORE: "+score,170,248);ctx.fillStyle="#00ff88";ctx.fillText("CLICK TO RESTART",170,278);}}function flap(){if(state==="dead"||state==="wait"){reset();state="play";return;}bird.v=JMP;}c.addEventListener("click",flap);document.addEventListener("keydown",e=>{if(e.code==="Space"){flap();e.preventDefault();}});document.addEventListener("touchstart",flap,{passive:true});function loop(){update();draw();requestAnimationFrame(loop);}reset();loop();</',
'script></body></html>'];
var DINO_HTML = ['<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:#060910;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:#00ff88}#info{display:flex;gap:26px;margin-bottom:12px;font-size:13px;letter-spacing:3px}canvas{border:1px solid #00ff8825}#hint{margin-top:10px;font-size:11px;color:#446688;letter-spacing:2px}</style></head><body><div id="info"><span>SCORE <b id="sc">0</b></span><span>BEST <b id="bs">0</b></span></div><canvas id="c" width="680" height="200"></canvas><div id="hint">SPACE/TAP TO JUMP</div><','script>const c=document.getElementById("c"),ctx=c.getContext("2d");let dn,obs,score,best=0,alive,spd,fr,jmps;function reset(){dn={x:75,y:150,vy:0,h:38,w:26};obs=[];score=0;alive=true;spd=3.8;fr=0;jmps=0;}function jump(){if(jmps<2){dn.vy=-12.5+(jmps*1.8);jmps++;}}function update(){if(!alive)return;fr++;score=Math.floor(fr/6);spd=3.8+fr/650;if(score>best)best=score;document.getElementById("sc").textContent=score;document.getElementById("bs").textContent=best;dn.vy+=.75;dn.y+=dn.vy;if(dn.y>=150){dn.y=150;dn.vy=0;jmps=0;}let gap=Math.max(36,76-Math.floor(fr/200));if(fr%gap===0)obs.push({x:680,w:16+Math.random()*16,h:26+Math.random()*26,bird:Math.random()<.28&&score>120});obs.forEach(o=>o.x-=spd);obs=obs.filter(o=>o.x>-50);obs.forEach(o=>{let oy=o.bird?105:168-o.h;if(dn.x+dn.w-7>o.x&&dn.x+7<o.x+o.w&&dn.y+dn.h-7>oy&&dn.y+7<oy+o.h)alive=false;});}function draw(){ctx.fillStyle="#060910";ctx.fillRect(0,0,680,200);ctx.strokeStyle="#0a2015";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,188);ctx.lineTo(680,188);ctx.stroke();ctx.fillStyle="#00ff88";ctx.shadowColor="#00ff88";ctx.shadowBlur=8;ctx.fillRect(dn.x,dn.y,dn.w,dn.h);ctx.shadowBlur=0;obs.forEach(o=>{let oy=o.bird?105:168-o.h;ctx.fillStyle=o.bird?"#ff00aa":"#00cfff";ctx.fillRect(o.x,oy,o.w,o.h);});if(!alive){ctx.fillStyle="rgba(0,0,0,.72)";ctx.fillRect(0,0,680,200);ctx.fillStyle="#ff00aa";ctx.font="bold 20px monospace";ctx.textAlign="center";ctx.fillText("GAME OVER - SPACE TO RESTART",340,93);}}document.addEventListener("keydown",e=>{if(e.code==="Space"){if(!alive)reset();else jump();e.preventDefault();}});document.addEventListener("touchstart",function(){if(!alive)reset();else jump();},{passive:true});function loop(){update();draw();requestAnimationFrame(loop);}reset();loop();</',
'script></body></html>'];
var G2048_HTML = ['<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#060910;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:monospace;padding:16px}h1{color:#00ff88;letter-spacing:8px;font-size:1.3rem;margin-bottom:9px}#sb{display:flex;gap:16px;margin-bottom:12px}.sb{background:#0a1525;padding:7px 16px;border-radius:4px;text-align:center}.sb label{display:block;font-size:10px;color:#446688;letter-spacing:2px}.sb span{font-size:1.2rem;color:#00ff88;font-weight:bold}#board{display:grid;grid-template-columns:repeat(4,80px);gap:6px;background:#0a1525;padding:10px;border-radius:7px}.cell{width:80px;height:80px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:bold}#hint{margin-top:11px;color:#446688;font-size:11px;letter-spacing:2px}.btn{margin-top:7px;background:#00ff8818;border:1px solid #00ff88;color:#00ff88;padding:6px 20px;font-family:monospace;font-size:11px;letter-spacing:2px;border-radius:3px;cursor:pointer;}</style></head><body><h1>2048</h1><div id="sb"><div class="sb"><label>SCORE</label><span id="sc">0</span></div><div class="sb"><label>BEST</label><span id="bs">0</span></div></div><div id="board"></div><div id="hint">ARROW KEYS TO PLAY</div><button class="btn" onclick="init()">NEW GAME</button><','script>const C={"0":"#0d1b2a","2":"#0d3b2e","4":"#0d5c37","8":"#1a7a46","16":"#2d9e5a","32":"#45c46e","64":"#00ff88","128":"#ffcc00","256":"#ff9900","512":"#ff6600","1024":"#ff3300","2048":"#ff00aa"};const T={"0":"transparent","2":"#a0d8af","4":"#a0d8af","8":"#fff","16":"#fff","32":"#fff","64":"#060910","128":"#060910","256":"#060910","512":"#060910","1024":"#060910","2048":"#060910"};let grid,score,best=0;function init(){grid=Array(4).fill(0).map(()=>Array(4).fill(0));score=0;at();at();render();}function at(){let e=[];for(let r=0;r<4;r++)for(let c=0;c<4;c++)if(!grid[r][c])e.push([r,c]);if(!e.length)return;let[r,c]=e[Math.floor(Math.random()*e.length)];grid[r][c]=Math.random()<.9?2:4;}function render(){document.getElementById("sc").textContent=score;document.getElementById("bs").textContent=best;let b=document.getElementById("board");b.innerHTML="";grid.forEach(row=>row.forEach(v=>{let d=document.createElement("div");d.className="cell";let k=String(Math.min(v,2048));d.style.background=C[k]||"#ff00aa";d.style.color=T[k]||"#fff";d.style.fontSize=v>=1000?"1rem":v>=100?"1.2rem":"1.45rem";d.textContent=v||"";b.appendChild(d);}));}function sl(row){let r=row.filter(x=>x);for(let i=0;i<r.length-1;i++)if(r[i]===r[i+1]){score+=r[i]*2;if(score>best)best=score;r[i]*=2;r.splice(i+1,1);i++;}while(r.length<4)r.push(0);return r;}function move(dr){let m=false;if(dr==="l")grid=grid.map(r=>{let s=sl(r);if(s.join()!==r.join())m=true;return s;});if(dr==="r")grid=grid.map(r=>{let s=sl([...r].reverse()).reverse();if(s.join()!==r.join())m=true;return s;});if(dr==="u"){for(let c=0;c<4;c++){let col=grid.map(r=>r[c]);let s=sl(col);s.forEach((v,r)=>{if(v!==grid[r][c])m=true;grid[r][c]=v;});}}if(dr==="d"){for(let c=0;c<4;c++){let col=grid.map(r=>r[c]).reverse();let s=sl(col).reverse();s.forEach((v,r)=>{if(v!==grid[r][c])m=true;grid[r][c]=v;});}}if(m){at();render();}}document.addEventListener("keydown",e=>{const m={ArrowLeft:"l",ArrowRight:"r",ArrowUp:"u",ArrowDown:"d"};if(m[e.key]){move(m[e.key]);e.preventDefault();}});let tx=0,ty=0;document.addEventListener("touchstart",e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;},{passive:true});document.addEventListener("touchend",e=>{let dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)>Math.abs(dy))move(dx>0?"r":"l");else move(dy>0?"d":"u");},{passive:true});init();</',
'script></body></html>'];

function getOfflineHTML(key) {
  var map = {snake:SNAKE_HTML,tetris:TETRIS_HTML,flappy:FLAPPY_HTML,dino:DINO_HTML,'2048':G2048_HTML};
  var parts = map[key]; return parts ? parts.join('') : null;
}

var GAMES = [
  {n:'SNAKE',e:'&#128013;',cat:'offline',key:'snake',r:'4.8',p:'Offline'},
  {n:'TETRIS',e:'&#128997;',cat:'offline',key:'tetris',r:'4.9',p:'Offline'},
  {n:'2048',e:'&#128998;',cat:'offline',key:'2048',r:'4.8',p:'Offline'},
  {n:'FLAPPY BIRD',e:'&#128036;',cat:'offline',key:'flappy',r:'4.7',p:'Offline'},
  {n:'DINO RUN',e:'&#129430;',cat:'offline',key:'dino',r:'4.8',p:'Offline'},
  {n:'SLOPE',e:'&#128309;',cat:'action',u:'https://glacierarcade.xyz/html/slope.html',r:'4.9',p:'50M+'},
  {n:'SLOPE 2',e:'&#128995;',cat:'action',u:'https://glacierarcade.xyz/html/slope2.html',r:'4.8',p:'20M+'},
  {n:'RUN 3',e:'&#127939;',cat:'action',u:'https://glacierarcade.xyz/html/run3.html',r:'4.9',p:'40M+'},
  {n:'MINECRAFT',e:'&#9935;',cat:'action',u:'https://glacierarcade.xyz/html/minecraft.html',r:'4.9',p:'50M+'},
  {n:'SUBWAY SURFERS',e:'&#128761;',cat:'action',u:'https://glacierarcade.xyz/html/subway-surfers.html',r:'4.9',p:'80M+'},
  {n:'TEMPLE RUN 2',e:'&#127796;',cat:'action',u:'https://glacierarcade.xyz/html/temple-run-2.html',r:'4.8',p:'40M+'},
  {n:'GEOMETRY DASH',e:'&#128311;',cat:'action',u:'https://glacierarcade.xyz/html/gdlite.html',r:'4.8',p:'15M+'},
  {n:'STICKMAN HOOK',e:'&#128760;',cat:'action',u:'https://glacierarcade.xyz/html/stickman-hook.html',r:'4.8',p:'12M+'},
  {n:'TUNNEL RUSH',e:'&#128308;',cat:'action',u:'https://glacierarcade.xyz/html/tunnel-rush.html',r:'4.8',p:'10M+'},
  {n:'CLUSTER RUSH',e:'&#128667;',cat:'action',u:'https://glacierarcade.xyz/html/cluster-rush.html',r:'4.7',p:'5M+'},
  {n:'HAPPY WHEELS',e:'&#128282;',cat:'action',u:'https://glacierarcade.xyz/html/happy-wheels-fanmade.html',r:'4.7',p:'10M+'},
  {n:'VEX 5',e:'&#127939;',cat:'action',u:'https://glacierarcade.xyz/html/vex5.html',r:'4.7',p:'6M+'},
  {n:'OVO',e:'&#128993;',cat:'action',u:'https://glacierarcade.xyz/html/ovo.html',r:'4.7',p:'5M+'},
  {n:'PLANTS VS ZOMBIES',e:'&#127803;',cat:'action',u:'https://glacierarcade.xyz/html/pvz.html',r:'4.8',p:'50M+'},
  {n:'FNAF',e:'&#128059;',cat:'action',u:'https://glacierarcade.xyz/html/fnaf.html',r:'4.7',p:'8M+'},
  {n:'CHESS',e:'&#9823;',cat:'puzzle',u:'https://glacierarcade.xyz/html/chess.html',r:'4.9',p:'50M+'},
  {n:'WORDLE',e:'&#129001;',cat:'puzzle',u:'https://glacierarcade.xyz/html/wordle.html',r:'4.8',p:'30M+'},
  {n:'BLOONS TD 5',e:'&#127880;',cat:'puzzle',u:'https://glacierarcade.xyz/html/btd5.html',r:'4.8',p:'15M+'},
  {n:'COOKIE CLICKER',e:'&#127850;',cat:'puzzle',u:'https://glacierarcade.xyz/html/cookie-clicker.html',r:'4.6',p:'10M+'},
  {n:'DRIFT BOSS',e:'&#128663;',cat:'racing',u:'https://glacierarcade.xyz/html/drift-boss.html',r:'4.8',p:'15M+'},
  {n:'DRIFT HUNTERS',e:'&#127950;',cat:'racing',u:'https://glacierarcade.xyz/html/drift-hunters.html',r:'4.8',p:'8M+'},
  {n:'DRIVE MAD',e:'&#128665;',cat:'racing',u:'https://glacierarcade.xyz/html/drive-mad.html',r:'4.7',p:'10M+'},
  {n:'MOTO X3M',e:'&#127949;',cat:'racing',u:'https://glacierarcade.xyz/html/motox3m.html',r:'4.8',p:'8M+'},
  {n:'SMASH KARTS',e:'&#127950;',cat:'racing',u:'https://glacierarcade.xyz/html/smash-karts.html',r:'4.8',p:'12M+'},
  {n:'TANUKI SUNSET',e:'&#129436;',cat:'racing',u:'https://glacierarcade.xyz/html/tanuki-sunset.html',r:'4.7',p:'4M+'},
  {n:'1V1.LOL',e:'&#127919;',cat:'shooter',u:'https://glacierarcade.xyz/html/1v1lol.html',r:'4.8',p:'25M+'},
  {n:'KRUNKER.IO',e:'&#128299;',cat:'shooter',u:'https://glacierarcade.xyz/html/krunkerio.html',r:'4.9',p:'15M+'},
  {n:'SHELL SHOCKERS',e:'&#129370;',cat:'shooter',u:'https://glacierarcade.xyz/html/shell-shockers.html',r:'4.8',p:'10M+'},
  {n:'GETAWAY SHOOTOUT',e:'&#128168;',cat:'shooter',u:'https://glacierarcade.xyz/html/getaway-shootout.html',r:'4.7',p:'8M+'},
  {n:'ROOFTOP SNIPERS',e:'&#127959;',cat:'shooter',u:'https://glacierarcade.xyz/html/rooftop-snipers.html',r:'4.7',p:'7M+'},
  {n:'RETRO BOWL',e:'&#127944;',cat:'sports',u:'https://glacierarcade.xyz/html/retro-bowl.html',r:'4.9',p:'30M+'},
  {n:'RETRO BOWL COLLEGE',e:'&#127967;',cat:'sports',u:'https://glacierarcade.xyz/html/retrobowlcollege.html',r:'4.8',p:'10M+'},
  {n:'BASKET RANDOM',e:'&#127936;',cat:'sports',u:'https://glacierarcade.xyz/html/basket-random.html',r:'4.7',p:'5M+'},
  {n:'SOCCER RANDOM',e:'&#9917;',cat:'sports',u:'https://glacierarcade.xyz/html/soccer-random.html',r:'4.6',p:'4M+'},
  {n:'BOXING RANDOM',e:'&#129354;',cat:'sports',u:'https://glacierarcade.xyz/html/boxing-random.html',r:'4.7',p:'4M+'},
  {n:'SLITHER.IO',e:'&#128013;',cat:'io',u:'https://glacierarcade.xyz/html/slither-io.html',r:'4.9',p:'50M+'},
  {n:'PAPER.IO 2',e:'&#128220;',cat:'io',u:'https://glacierarcade.xyz/html/paperio2.html',r:'4.7',p:'20M+'},
  {n:'HOLE.IO',e:'&#9898;',cat:'io',u:'https://glacierarcade.xyz/html/hole-io.html',r:'4.6',p:'10M+'},
  {n:'PACMAN',e:'&#128126;',cat:'classic',u:'https://glacierarcade.xyz/html/pacman.html',r:'4.9',p:'1B+'},
  {n:'CHROME DINO',e:'&#129429;',cat:'classic',u:'https://glacierarcade.xyz/html/chrome-dino.html',r:'4.8',p:'200M+'},
  {n:'TETRIS CLASSIC',e:'&#128994;',cat:'classic',u:'https://glacierarcade.xyz/html/tetris.html',r:'4.9',p:'1B+'},
  {n:'FRIDAY NIGHT FUNKIN',e:'&#127908;',cat:'classic',u:'https://glacierarcade.xyz/html/fnf.html',r:'4.8',p:'20M+'},
  {n:'MINECRAFT CLASSIC',e:'&#9935;',cat:'action',u:'https://glacierarcade.xyz/html/minecraft-classic.html',r:'4.9',p:'50M+'},
  {n:'BASKETBALL STARS',e:'&#127936;',cat:'sports',u:'https://glacierarcade.xyz/html/basketball-stars.html',r:'4.8',p:'10M+'},
  {n:'HELIX JUMP',e:'&#129395;',cat:'action',u:'https://glacierarcade.xyz/html/helix-jump.html',r:'4.7',p:'8M+'},
  {n:'SNOW RIDER 3D',e:'&#127943;',cat:'racing',u:'https://glacierarcade.xyz/html/snow-rider-3d.html',r:'4.8',p:'6M+'},
  {n:'BULLET FORCE',e:'&#128165;',cat:'shooter',u:'https://glacierarcade.xyz/html/bullet-force.html',r:'4.8',p:'15M+'},
  {n:'IDLE BREAKOUT',e:'&#128312;',cat:'puzzle',u:'https://glacierarcade.xyz/html/idle-breakout.html',r:'4.7',p:'6M+'},
  {n:'MONKEY MART',e:'&#129412;',cat:'puzzle',u:'https://glacierarcade.xyz/html/monkey-mart.html',r:'4.8',p:'8M+'},
  {n:'EGGY CAR',e:'&#129362;',cat:'racing',u:'https://glacierarcade.xyz/html/eggy-car.html',r:'4.7',p:'7M+'},
  {n:'NARROW ONE',e:'&#127993;',cat:'shooter',u:'https://glacierarcade.xyz/html/narrow-one.html',r:'4.8',p:'8M+'},
  {n:'SURVIV.IO',e:'&#127978;',cat:'io',u:'https://glacierarcade.xyz/html/survivio.html',r:'4.8',p:'12M+'},
  {n:'SKRIBBL.IO',e:'&#127912;',cat:'io',u:'https://glacierarcade.xyz/html/skribblio.html',r:'4.7',p:'10M+'},
  {n:'AGARIO',e:'&#128308;',cat:'io',u:'https://glacierarcade.xyz/html/agario.html',r:'4.8',p:'20M+'},
  {n:'DIEP.IO',e:'&#128316;',cat:'io',u:'https://glacierarcade.xyz/html/diepio.html',r:'4.7',p:'8M+'},
  {n:'SUPER SMASH FLASH 2',e:'&#128165;',cat:'classic',u:'https://glacierarcade.xyz/html/ssf2.html',r:'4.8',p:'20M+'},
  {n:'MARIO KART',e:'&#128670;',cat:'classic',u:'https://glacierarcade.xyz/html/mario-kart.html',r:'4.8',p:'30M+'},
  {n:'SUPER MARIO 64',e:'&#127794;',cat:'classic',u:'https://glacierarcade.xyz/html/super-mario-64.html',r:'4.9',p:'20M+'},
  {n:'POKEMON SHOWDOWN',e:'&#129425;',cat:'classic',u:'https://glacierarcade.xyz/html/pokemon-showdown.html',r:'4.8',p:'15M+'},
  {n:'FIREBOY & WATERGIRL',e:'&#128293;',cat:'puzzle',u:'https://glacierarcade.xyz/html/fireboy-and-watergirl.html',r:'4.8',p:'10M+'},
  {n:'FIREBOY & WATERGIRL 2',e:'&#128147;',cat:'puzzle',u:'https://glacierarcade.xyz/html/fireboy-and-watergirl-2.html',r:'4.7',p:'8M+'},
  {n:'FIREBOY & WATERGIRL 3',e:'&#127963;',cat:'puzzle',u:'https://glacierarcade.xyz/html/fireboy-and-watergirl-3.html',r:'4.7',p:'6M+'},
  {n:'AGE OF WAR',e:'&#9876;',cat:'action',u:'https://glacierarcade.xyz/html/age-of-war.html',r:'4.7',p:'6M+'},
  {n:'EARN TO DIE',e:'&#128664;',cat:'action',u:'https://glacierarcade.xyz/html/earn-to-die.html',r:'4.7',p:'6M+'},
  {n:'HEAD SOCCER',e:'&#9917;',cat:'sports',u:'https://glacierarcade.xyz/html/head-soccer.html',r:'4.7',p:'5M+'},
];

var curCat = 'all', blobUrls = {};

function renderGames(list) {
  list = list || GAMES;
  var filtered = curCat === 'all' ? list : list.filter(function(g) { return g.cat === curCat; });
  var grid = document.getElementById('gGrid'); if (!grid) return;
  var html = '';
  filtered.forEach(function(g, i) {
    var idx = GAMES.indexOf(g);
    html += '<div class="gcard" style="animation-delay:' + (i*0.03) + 's" data-idx="' + idx + '"><div class="holo"></div><div class="gthumb">' + g.e + '</div><div class="ginfo"><div class="gname">' + g.n + '</div><div class="gmeta"><span class="grating">&#9733;' + (g.r||'4.5') + '</span><span>' + (g.p||'') + '</span></div></div></div>';
  });
  grid.innerHTML = html;
  grid.querySelectorAll('.gcard').forEach(function(card) {
    card.addEventListener('click', function() { openGame(parseInt(card.getAttribute('data-idx'))); });
    card.addEventListener('mousemove', function(e) {
      var r = card.getBoundingClientRect(), x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
      card.style.transform = 'perspective(600px) rotateY('+x*14+'deg) rotateX('+(-y*14)+'deg) scale(1.04)';
    });
    card.addEventListener('mouseleave', function() { card.style.transform = ''; });
  });
}

function setCat(btn, cat) {
  curCat = cat;
  document.querySelectorAll('.catbtn').forEach(function(b) { b.classList.remove('on'); });
  if (btn) btn.classList.add('on');
  renderGames();
}

function filterGames(q) {
  q = (q || '').toLowerCase();
  renderGames(GAMES.filter(function(g) { return !q || g.n.toLowerCase().indexOf(q) !== -1 || g.cat.indexOf(q) !== -1; }));
}

function openGame(idx) {
  var g = GAMES[idx]; if (!g) return;
  var gGridWrap = document.getElementById('gGridWrap'), gSearch = document.getElementById('gSearch');
  var gBackBar = document.getElementById('gBackBar'), gCurName = document.getElementById('gCurName');
  var frame = document.getElementById('gFrame');
  if (gGridWrap) gGridWrap.style.display = 'none';
  if (gSearch) gSearch.style.display = 'none';
  if (gBackBar) gBackBar.style.display = 'flex';
  if (gCurName) gCurName.textContent = g.n;
  if (!frame) return;
  frame.style.display = 'block'; frame.innerHTML = '';
  var fl = document.getElementById('flash'), app = document.getElementById('app');
  if (fl) { fl.style.background = 'var(--g)'; fl.style.opacity = '.25'; }
  if (app) { app.classList.add('shaking'); setTimeout(function() { app.classList.remove('shaking'); }, 320); }
  if (fl) setTimeout(function() { fl.style.opacity = '0'; }, 320);
  if (g.key) {
    var html = getOfflineHTML(g.key);
    if (html) {
      if (!blobUrls[g.key]) blobUrls[g.key] = makeBlob(html);
      if (blobUrls[g.key]) frame.innerHTML = '<iframe src="' + blobUrls[g.key] + '" style="width:100%;height:100%;border:none;" allowfullscreen></iframe>';
    }
  } else if (g.u) {
    frame.innerHTML = '<iframe src="' + g.u + '" style="width:100%;height:100%;border:none;" allowfullscreen allow="fullscreen *; autoplay *"></iframe>';
  }
}

function closeGame() {
  var gGridWrap = document.getElementById('gGridWrap'), gSearch = document.getElementById('gSearch');
  var gBackBar = document.getElementById('gBackBar'), frame = document.getElementById('gFrame');
  if (gGridWrap) gGridWrap.style.display = 'block';
  if (gSearch) gSearch.style.display = 'block';
  if (gBackBar) gBackBar.style.display = 'none';
  if (frame) { frame.style.display = 'none'; frame.innerHTML = ''; }
}

function goFull() {
  var iframe = document.querySelector('#gFrame iframe');
  if (iframe && iframe.requestFullscreen) iframe.requestFullscreen().catch(function(){});
}

// ══════ APPS — FIX: UB2 is now the MAIN unblocker ══════
// UB2 = main unblocker (outerspace), UB1 = secondary
var UB1 = (function(){ try { return localStorage.getItem('nx_ub1') || 'https://mathread.org/'; } catch(e){ return 'https://mathread.org/'; } })();
var UB2 = (function(){ try { return localStorage.getItem('nx_ub2') || 'https://mathread.org/'; } catch(e){ return 'https://mathread.org/'; } })();
var curAppUrl = '';

var APPS = [
  {ico:'&#128640;',name:'RESOURCE HUB 1',desc:'Primary unblocker portal',tag:'unblock',getUrl:function(){return UB2;}},
  {ico:'&#128279;',name:'RESOURCE HUB 2',desc:'Secondary unblocker portal',tag:'unblock',getUrl:function(){return UB1;}},
  {ico:'&#128250;',name:'YOUTUBE',desc:'Watch videos & shorts',tag:'free',url:'https://www.youtube.com'},
  {ico:'&#128172;',name:'DISCORD',desc:'Chat with friends',tag:'blocked',url:'https://discord.com/app'},
  {ico:'&#127918;',name:'ROBLOX',desc:'Play Roblox online',tag:'blocked',url:'https://www.roblox.com'},
  {ico:'&#127925;',name:'SPOTIFY',desc:'Stream music',tag:'blocked',url:'https://open.spotify.com'},
  {ico:'&#128214;',name:'WIKIPEDIA',desc:'All human knowledge',tag:'free',url:'https://en.wikipedia.org'},
  {ico:'&#128336;',name:'KHAN ACADEMY',desc:'Free lessons & practice',tag:'free',url:'https://www.khanacademy.org'},
  {ico:'&#128202;',name:'DESMOS',desc:'Graphing calculator',tag:'free',url:'https://www.desmos.com/calculator'},
  {ico:'&#127758;',name:'GOOGLE TRANSLATE',desc:'Translate any language',tag:'free',url:'https://translate.google.com'},
  {ico:'&#127891;',name:'GOOGLE SCHOLAR',desc:'Research & papers',tag:'free',url:'https://scholar.google.com'},
  {ico:'&#127183;',name:'QUIZLET',desc:'Flashcards & study tools',tag:'free',url:'https://quizlet.com'},
  {ico:'&#127922;',name:'COOLMATHGAMES',desc:'Math & puzzle games',tag:'free',url:'https://www.coolmathgames.com'},
  {ico:'&#128377;',name:'POKI',desc:'100s of free browser games',tag:'free',url:'https://poki.com'},
  {ico:'&#129302;',name:'CHATGPT',desc:'OpenAI chatbot',tag:'blocked',url:'https://chat.openai.com'},
  {ico:'&#128221;',name:'GOOGLE DOCS',desc:'Write & collaborate',tag:'free',url:'https://docs.google.com'},
  {ico:'&#128218;',name:'GOOGLE CLASSROOM',desc:'School portal',tag:'free',url:'https://classroom.google.com'},
];

function buildApps() {
  var grid = document.getElementById('appsGrid'); if (!grid) return;
  var html = '';
  APPS.forEach(function(a, i) {
    var rawUrl = a.getUrl ? a.getUrl() : (a.url || '');
    var isPortal = a.tag === 'unblock';
    // Route ALL non-portal apps through unblocker to avoid iframe blocks
    var openUrl = isPortal ? rawUrl : (UB2 + encodeURIComponent(rawUrl));
    var tagLabel = isPortal ? '&#128279; PORTAL' : a.tag === 'blocked' ? '&#128275; PROXIED' : '&#128640; PROXIED';
    var tagCls = isPortal ? 'unblock' : 'blocked';
    var featCls = isPortal ? ' feat' : '';
    html += '<div class="acard'+featCls+'" data-appidx="'+i+'" data-rawurl="'+rawUrl.replace(/"/g,'&quot;')+'" data-url="'+openUrl.replace(/"/g,'&quot;')+'"><div class="aico">'+a.ico+'</div><div class="aname">'+a.name+'</div><div class="adesc">'+a.desc+'</div><span class="atag '+tagCls+'">'+tagLabel+'</span></div>';
  });
  grid.innerHTML = html;
  grid.querySelectorAll('.acard').forEach(function(card) {
    card.addEventListener('click', function() {
      var url = card.getAttribute('data-url');
      var rawUrl = card.getAttribute('data-rawurl');
      var idx = parseInt(card.getAttribute('data-appidx'));
      var a = APPS[idx];
      openApp(url, rawUrl, a ? a.name : '', a ? a.tag : '');
    });
  });
}

var curAppRawUrl = '';

function openApp(url, rawUrl, name, tag) {
  curAppUrl = url;
  curAppRawUrl = rawUrl || url;
  var appsView = document.getElementById('appsView'), viewer = document.getElementById('appViewer');
  var avName = document.getElementById('avName'), frame = document.getElementById('appFrame');
  if (appsView) appsView.style.display = 'none';
  if (viewer) viewer.style.display = 'flex';
  if (avName) avName.innerHTML = name + ' <span style="font-size:.5rem;color:#334455;letter-spacing:1px;">&#128640; VIA PROXY</span>';
  if (frame) {
    frame.src = 'about:blank';
    setTimeout(function(){ frame.src = url; }, 80);
  }
  toast('&#128640; LOADING', name + ' via proxy...', 'var(--y)');
  // Update new-tab button to open raw URL
  var ntBtn = document.getElementById('avNewTab');
  if (ntBtn) ntBtn.onclick = function(){ window.open(curAppRawUrl, '_blank'); };
  // Show/hide proxy toggle
  var togBtn = document.getElementById('avProxyToggle');
  if (togBtn) togBtn.style.display = tag === 'unblock' ? 'none' : 'inline-block';
}

function toggleProxy() {
  var frame = document.getElementById('appFrame');
  var togBtn = document.getElementById('avProxyToggle');
  if (!frame) return;
  var isProxied = frame.src.indexOf(UB2.replace('https://','').replace('http://','')) !== -1 || frame.src.startsWith(UB2);
  if (isProxied) {
    // Try direct
    frame.src = curAppRawUrl;
    if (togBtn) togBtn.textContent = '&#128640; USE PROXY';
    toast('&#9888; DIRECT', 'May be blocked by site', 'var(--b)');
  } else {
    // Go proxy
    frame.src = UB2 + encodeURIComponent(curAppRawUrl);
    if (togBtn) togBtn.textContent = '&#127760; DIRECT MODE';
    toast('&#128640; PROXY', 'Loading via unblocker', 'var(--y)');
  }
}

function closeApp() {
  var appsView = document.getElementById('appsView'), viewer = document.getElementById('appViewer'), frame = document.getElementById('appFrame');
  if (appsView) appsView.style.display = 'block';
  if (viewer) viewer.style.display = 'none';
  if (frame) frame.src = 'about:blank';
}

// ══════ AI — FIX: Use pollinations.ai free API ══════
function setAI(btn, pane) {
  document.querySelectorAll('.aitool').forEach(function(b) { b.classList.remove('on'); });
  document.querySelectorAll('.aipane').forEach(function(p) { p.classList.remove('on'); });
  if (btn) btn.classList.add('on');
  var el = document.getElementById('aipane-' + pane);
  if (el) el.classList.add('on');
}

function aiMsg(role, text) {
  var c = document.getElementById('chatMsgs'); if (!c) return null;
  var d = document.createElement('div'); d.className = 'msg ' + role;
  d.innerHTML = '<div class="mav">' + (role==='ai'?'&#129302;':'&#128100;') + '</div><div class="mbub">' + (text||'').replace(/</g,'&lt;') + '</div>';
  c.appendChild(d); c.scrollTop = c.scrollHeight; return d;
}

// pollinations.ai GET — free, no API key, no CORS issues
async function callFreeAI(prompt, systemPrompt) {
  // Method 1: simple GET (most reliable)
  try {
    var fullPrompt = systemPrompt ? systemPrompt + '\n\nUser: ' + prompt + '\n\nAssistant:' : prompt;
    var url = 'https://text.pollinations.ai/' + encodeURIComponent(fullPrompt) + '?model=openai&seed=' + Math.floor(Math.random()*99999);
    var r = await fetch(url);
    if (r.ok) { var t = await r.text(); if (t && t.trim().length > 2) return t.trim(); }
  } catch(e) {}
  // Method 2: POST fallback
  try {
    var msgs = [];
    if (systemPrompt) msgs.push({role:'system', content: systemPrompt});
    msgs.push({role:'user', content: prompt});
    var r2 = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({model:'openai-large', messages: msgs, seed: Math.floor(Math.random()*99999)})
    });
    if (r2.ok) { var d = await r2.json(); var tx = d && d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content; if (tx) return tx.trim(); }
  } catch(e) {}
  throw new Error('AI unavailable');
}

function sendChat() {
  var inp = document.getElementById('chatInput'); if (!inp) return;
  var text = inp.value.trim(); if (!text) return;
  inp.value = '';
  aiMsg('user', text);
  var wait = aiMsg('ai', '<div class="spinner"></div>');
  var sysPrompt = 'You are StudyBot, a helpful AI tutor. Be concise, friendly, educational. Under 220 words.';
  if (aiUserName) sysPrompt += ' The student is named ' + aiUserName + '. Use their name occasionally.';
  var histParts = [];
  for (var i = Math.max(0, aiConvHistory.length - AI_MAX_HISTORY); i < aiConvHistory.length; i++) {
    var m = aiConvHistory[i];
    histParts.push((m.role === 'user' ? 'User' : 'StudyBot') + ': ' + m.content);
  }
  histParts.push('User: ' + text);
  var fullPrompt = sysPrompt + '\n\n' + histParts.join('\n') + '\n\nStudyBot:';
  fetch('https://text.pollinations.ai/' + encodeURIComponent(fullPrompt) + '?model=openai&seed=' + Math.floor(Math.random()*99999))
    .then(function(r){ return r.text(); })
    .then(function(reply) {
      reply = reply.trim();
      if (wait) { var bub = wait.querySelector('.mbub'); if (bub) bub.textContent = reply; }
      aiConvHistory.push({role:'user', content: text});
      aiConvHistory.push({role:'assistant', content: reply});
      if (aiConvHistory.length > AI_MAX_HISTORY * 2) aiConvHistory = aiConvHistory.slice(-AI_MAX_HISTORY * 2);
    })
    .catch(function() {
      if (wait) { var bub = wait.querySelector('.mbub'); if (bub) bub.textContent = '\u26A0\uFE0F Could not connect. Try again!'; }
    });
}

async function callFreeAIWithHistory(messages, systemPrompt) {
  // Build full prompt with history for GET endpoint
  var histStr = messages.map(function(m) {
    return (m.role === 'user' ? 'User' : 'Assistant') + ': ' + m.content;
  }).join('\n');
  var fullPrompt = (systemPrompt || '') + '\n\nConversation:\n' + histStr + '\n\nAssistant:';

  try {
    var url = 'https://text.pollinations.ai/' + encodeURIComponent(fullPrompt) + '?model=openai&seed=' + Math.floor(Math.random()*99999);
    var r = await fetch(url);
    if (r.ok) { var t = await r.text(); if (t && t.trim().length > 2) return t.trim(); }
  } catch(e) {}

  // Fallback POST with full messages array
  try {
    var msgs = [{role:'system', content: systemPrompt}].concat(messages);
    var r2 = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({model:'openai-large', messages: msgs})
    });
    if (r2.ok) { var d = await r2.json(); var tx = d && d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content; if (tx) return tx.trim(); }
  } catch(e) {}
  throw new Error('AI unavailable');
}

function doTranslate() {
  var inEl = document.getElementById('transIn'), outEl = document.getElementById('transOut'), toEl = document.getElementById('toLang');
  if (!inEl || !outEl || !toEl) return;
  var inp = inEl.value.trim(), to = toEl.value; if (!inp) return;
  outEl.value = '\u23F3 Translating...';
  callFreeAI('Translate the following text to ' + to + '. Return ONLY the translation, nothing else:\n\n' + inp)
    .then(function(r) { outEl.value = r; })
    .catch(function() { outEl.value = 'Error: could not translate.'; });
}

function doSummarize() {
  var inEl = document.getElementById('sumIn'), outEl = document.getElementById('sumOut');
  if (!inEl || !outEl) return;
  var inp = inEl.value.trim(); if (!inp) return;
  outEl.textContent = '\u23F3 Summarizing...';
  callFreeAI('Summarize the following text in 3-5 bullet points. Be concise:\n\n' + inp)
    .then(function(r) { outEl.textContent = r; })
    .catch(function() { outEl.textContent = 'Error: could not summarize.'; });
}

// ══════ SETTINGS ══════
var panicMode = 'blank';
var PANIC_URLS = {blank:'about:blank',classroom:'https://classroom.google.com',docs:'https://docs.google.com',search:'https://google.com'};

function loadSettings() {
  try {
    var s1 = localStorage.getItem('nx_ub1');
    if (s1) { UB1 = s1; var el=document.getElementById('ub1Url'); if(el) el.value = s1; }
    else { var el=document.getElementById('ub1Url'); if(el) el.value = UB1; }
    var s2 = localStorage.getItem('nx_ub2');
    if (s2) { UB2 = s2; var el=document.getElementById('ub2Url'); if(el) el.value = s2; }
    else { var el=document.getElementById('ub2Url'); if(el) el.value = UB2; }
    var sp = localStorage.getItem('nx_panic') || 'blank'; setPanic(sp);
    var st = localStorage.getItem('nx_theme');
    if (st) { var th = JSON.parse(st); applyTheme(th[0], th[1]); }
    var wc = localStorage.getItem('nx_weather_city');
    if (wc) { var el=document.getElementById('wxCity'); if(el) el.value = wc; fetchWeather(); }
    var cn = localStorage.getItem('nx_chat_name');
    if (cn) { var el=document.getElementById('nameIn'); if(el) el.value = cn; }
  } catch(e) {}
}

function saveUB(num) {
  var urlEl = document.getElementById('ub'+num+'Url'), passEl = document.getElementById('ub'+num+'Pass');
  var okEl = document.getElementById('ub'+num+'ok'), errEl = document.getElementById('ub'+num+'err');
  if (!urlEl || !passEl) return;
  var url = urlEl.value.trim(), pass = passEl.value;
  if (okEl) okEl.style.display = 'none';
  if (errEl) errEl.style.display = 'none';
  if (!url) return;
  if (pass !== PW) { if(errEl) errEl.style.display = 'block'; passEl.value = ''; return; }
  try {
    if (num === 1) { UB1 = url; localStorage.setItem('nx_ub1', url); }
    else { UB2 = url; localStorage.setItem('nx_ub2', url); }
  } catch(e) {}
  if (okEl) okEl.style.display = 'block';
  passEl.value = ''; buildApps();
  toast('&#10003; SAVED', 'Unblocker ' + num + ' updated!');
}

function savePass() {
  var oldEl = document.getElementById('passOld'), newEl = document.getElementById('passNew');
  var okEl = document.getElementById('passOk'), errEl = document.getElementById('passErr');
  if (!oldEl || !newEl) return;
  var old = oldEl.value, neu = newEl.value.trim();
  if (okEl) okEl.style.display = 'none';
  if (errEl) errEl.style.display = 'none';
  if (old !== PW || !neu) { if(errEl) errEl.style.display = 'block'; return; }
  PW = neu;
  try { localStorage.setItem('nx_pw', PW); } catch(e) {}
  if (okEl) okEl.style.display = 'block';
  oldEl.value = ''; newEl.value = '';
  toast('&#128274; SAVED', 'Password changed!');
}

function setTheme(g, b, el) {
  try { localStorage.setItem('nx_theme', JSON.stringify([g,b])); } catch(e) {}
  applyTheme(g, b);
  var ok = document.getElementById('themeOk');
  if (ok) { ok.style.display = 'block'; setTimeout(function(){ ok.style.display='none'; }, 2000); }
  document.querySelectorAll('.tdot').forEach(function(d){ d.classList.remove('sel'); });
  if (el) el.classList.add('sel');
}

function applyTheme(g, b) {
  document.documentElement.style.setProperty('--g', g);
  document.documentElement.style.setProperty('--b', b);
}

function setPanic(mode) {
  panicMode = mode;
  try { localStorage.setItem('nx_panic', mode); } catch(e) {}
  document.querySelectorAll('.popt').forEach(function(b){ b.classList.remove('on'); });
  var el = document.getElementById('popt-' + mode);
  if (el) el.classList.add('on');
}

var panicActive = false;
function triggerPanic() {
  var overlay = document.getElementById('panic'), frame = document.getElementById('panicFrame');
  if (!overlay || !frame) return;
  panicActive = true; overlay.style.display = 'block';
  frame.src = PANIC_URLS[panicMode] || 'about:blank';
  overlay.style.background = panicMode === 'blank' ? '#fff' : 'transparent';
}

function dismissPanic() {
  var overlay = document.getElementById('panic'), frame = document.getElementById('panicFrame');
  if (!overlay || !panicActive) return;
  panicActive = false; overlay.style.display = 'none';
  if (frame) frame.src = 'about:blank';
}

function fetchWeather() {
  var cityEl = document.getElementById('wxCity'), resEl = document.getElementById('wxResult');
  if (!cityEl || !resEl) return;
  var city = cityEl.value.trim(); if (!city) return;
  try { localStorage.setItem('nx_weather_city', city); } catch(e) {}
  resEl.textContent = 'Loading...';
  fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(city) + '&count=1&language=en&format=json')
    .then(function(r) { return r.json(); })
    .then(function(gd) {
      if (!gd.results || !gd.results.length) { resEl.textContent = 'City not found'; return; }
      var loc = gd.results[0];
      return fetch('https://api.open-meteo.com/v1/forecast?latitude='+loc.latitude+'&longitude='+loc.longitude+'&current=temperature_2m,weathercode,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=mph')
        .then(function(r) { return r.json(); })
        .then(function(wd) {
          var temp = Math.round(wd.current.temperature_2m), wind = Math.round(wd.current.windspeed_10m), code = wd.current.weathercode;
          var icon = code<=1?'&#9728;':code<=3?'&#9925;':code<=48?'&#127787;':code<=67?'&#127783;':code<=77?'&#10052;':code<=82?'&#127782;':'&#9928;';
          var desc = code===0?'Clear':code<=1?'Mostly Clear':code<=3?'Partly Cloudy':code<=48?'Foggy':code<=55?'Drizzle':code<=67?'Rain':code<=77?'Snow':'Showers';
          var display = icon+' '+loc.name+', '+loc.country+' &middot; '+temp+'&deg;F &middot; '+desc+' &middot; Wind '+wind+'mph';
          resEl.innerHTML = display;
          var badge = document.getElementById('wxBadge');
          if (badge) { badge.innerHTML = display; badge.style.display = 'block'; }
        });
    })
    .catch(function() { resEl.textContent = 'Failed to load weather'; });
}

// ══════ CHAT — FIX: Use a working public backend ══════
// Using jsonbin.io as a free persistent store, or localStorage for same-device fallback
// For real multi-user: use a public Firebase with open rules OR a simple echo server
// We'll use a working Firebase public endpoint
var CHAT_BASE = 'https://studyhub-chat-default-rtdb.firebaseio.com';
var chatRoom = null, chatName = 'Anon', pollTimer = null, lastMsgTime = 0;

function joinRoom() {
  var codeEl = document.getElementById('roomIn'), nameEl = document.getElementById('nameIn');
  if (!codeEl) return;
  var code = codeEl.value.trim().toLowerCase().replace(/[^a-z0-9]/g,'');
  var name = (nameEl && nameEl.value.trim()) || 'Anon';
  if (!code) { toast('&#9888;', 'Enter a room code first!', 'var(--p)'); return; }
  chatRoom = code; chatName = name;
  try { localStorage.setItem('nx_chat_name', name); } catch(e) {}
  var roomNameEl = document.getElementById('chatRoomName');
  if (roomNameEl) roomNameEl.textContent = 'Room: ' + code + ' \u2014 as ' + name;
  var chatLog = document.getElementById('chatLog');
  if (chatLog) chatLog.innerHTML = '';
  if (pollTimer) clearInterval(pollTimer);
  lastMsgTime = 0;
  loadMsgs();
  pollTimer = setInterval(loadMsgs, 2500);
  toast('&#128172; JOINED', 'Room: ' + code);
}

function loadMsgs() {
  if (!chatRoom) return;
  var url = CHAT_BASE + '/rooms/' + chatRoom + '/messages.json?orderBy=%22ts%22&limitToLast=60';
  fetch(url)
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(data) {
      if (!data || typeof data !== 'object') return;
      var msgs = Object.values(data).filter(function(m){ return m && m.ts; }).sort(function(a,b){ return a.ts - b.ts; });
      if (!msgs.length) return;
      var newest = msgs[msgs.length-1].ts;
      if (newest === lastMsgTime) return;
      lastMsgTime = newest;
      var log = document.getElementById('chatLog'); if (!log) return;
      var wasBottom = log.scrollTop + log.clientHeight >= log.scrollHeight - 20;
      log.innerHTML = msgs.map(function(m) {
        var mine = m.name === chatName;
        var time = new Date(m.ts).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
        return '<div style="display:flex;flex-direction:column;gap:2px;'+(mine?'align-items:flex-end':'')+'"><span style="font-size:.52rem;color:#446688;letter-spacing:.8px;">'+escHtml(m.name||'Anon')+' &middot; '+time+'</span><div style="max-width:72%;background:'+(mine?'rgba(0,255,136,.07)':'rgba(255,0,170,.06)')+';border:1px solid '+(mine?'rgba(0,255,136,.15)':'rgba(255,0,170,.12)')+';border-radius:5px;padding:7px 11px;font-size:.68rem;color:#c0d8ff;line-height:1.7;">'+escHtml(m.text||'')+'</div></div>';
      }).join('');
      if (wasBottom) log.scrollTop = log.scrollHeight;
    })
    .catch(function(e){
      // Silently fail on network errors
      console.warn('Chat load error:', e);
    });
}

function sendMsg() {
  var inp = document.getElementById('chatMsgIn'); if (!inp) return;
  var text = inp.value.trim(); if (!text || !chatRoom) return;
  inp.value = '';
  var msg = {name: chatName, text: text, ts: Date.now()};
  fetch(CHAT_BASE + '/rooms/' + chatRoom + '/messages.json', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(msg)
  })
  .then(function(r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    // Immediately show own message
    setTimeout(loadMsgs, 300);
  })
  .catch(function(e) {
    console.warn('Send failed:', e);
    toast('&#9888;', 'Message failed to send', 'var(--p)');
    // Put text back
    inp.value = text;
  });
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}


// ══════ HOMEWORK AI ══════
var hwSubject = '';
var hwHistory = [];

function setHwSubject(btn, subj) {
  hwSubject = subj;
  document.querySelectorAll('.hw-pill').forEach(function(b){ b.classList.remove('on'); });
  if (btn) btn.classList.add('on');
}

function hwAsk(mode) {
  var inp = document.getElementById('hwInput');
  var out = document.getElementById('hwOutput');
  if (!inp || !out) return;
  var q = inp.value.trim();
  if (!q) { toast('\u26a0\ufe0f', 'Paste your question first!', 'var(--p)'); return; }
  var subjectCtx = hwSubject ? ' This is a ' + hwSubject + ' question.' : '';
  var prompts = {
    solve: 'You are an expert tutor. Solve this step by step, showing all work clearly. Use numbered steps.' + subjectCtx + '\n\nQuestion: ' + q,
    explain: 'You are an expert teacher. Explain this concept clearly with examples a student can understand.' + subjectCtx + '\n\nTopic: ' + q,
    outline: 'Create a detailed essay outline with introduction, main points with sub-points, and conclusion.' + subjectCtx + '\n\nTopic: ' + q
  };
  var modeLabels = {solve:'SOLVING...', explain:'EXPLAINING...', outline:'OUTLINING...'};
  out.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:20px;color:var(--p);font-size:.68rem;letter-spacing:1.5px;">' + (modeLabels[mode]||'THINKING...') + ' <div class="spinner"></div></div>';
  var preview = q.substring(0, 45) + (q.length > 45 ? '...' : '');
  hwHistory.unshift({q: q, mode: mode, preview: preview});
  if (hwHistory.length > 12) hwHistory.pop();
  renderHwHist();
  callFreeAI(prompts[mode])
    .then(function(ans) {
      var formatted = ans
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--g)">$1</strong>')
        .replace(/^(\d+)\. /gm, '<span style="color:var(--b)">$1.</span> ')
        .replace(/^- /gm, '<span style="color:var(--p)">&#9656; </span>');
      out.innerHTML = '<div class="hw-answer">' + formatted + '</div>';
      if (hwHistory[0]) hwHistory[0].ans = ans;
      renderHwHist();
      toast('\u2713 DONE', 'Answer ready!', 'var(--g)');
    })
    .catch(function() {
      out.innerHTML = '<div class="hw-answer" style="color:var(--p)">\u26a0\ufe0f Could not connect. Try again!</div>';
    });
}

function renderHwHist() {
  var hist = document.getElementById('hwHist');
  if (!hist) return;
  if (!hwHistory.length) { hist.innerHTML = '<div style="padding:14px 16px;font-size:.55rem;color:#1a2a1a;letter-spacing:1px;">No history yet</div>'; return; }
  hist.innerHTML = hwHistory.map(function(h, i) {
    var icon = {solve:'\u26a1',explain:'\ud83d\udca1',outline:'\ud83d\udcc4'}[h.mode] || '\ud83d\udcdd';
    return '<div class="hw-hist-item" onclick="hwLoadHistory('+i+')">' + icon + ' ' + escHtml(h.preview) + '</div>';
  }).join('');
}

function hwLoadHistory(i) {
  var h = hwHistory[i]; if (!h) return;
  var inp = document.getElementById('hwInput'), out = document.getElementById('hwOutput');
  if (inp) inp.value = h.q;
  if (out && h.ans) {
    var f = h.ans.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--g)">$1</strong>');
    out.innerHTML = '<div class="hw-answer">' + f + '</div>';
  }
}

function hwClear() {
  var inp = document.getElementById('hwInput'), out = document.getElementById('hwOutput');
  if (inp) inp.value = '';
  if (out) out.innerHTML = '<div class="hw-empty"><div class="hw-empty-icon">&#129302;</div><div class="hw-empty-txt">READY TO HELP</div></div>';
}

// ══════ BROWSER ══════
// ── PROXY BROWSER (iframe-based) ──
var brCurrentUrl = '';

function brGetProxyUrl(url) {
  if (!url.startsWith('http')) url = 'https://' + url;
  // Use UB2 as the proxy base - encode target URL into it
  return UB2 + encodeURIComponent(url);
}

function brLoad(url) {
  if (!url.startsWith('http')) url = 'https://' + url;
  brCurrentUrl = url;
  var frame = document.getElementById('brFrame');
  var inp = document.getElementById('brUrl');
  var status = document.getElementById('brStatus');
  if (inp) inp.value = url;
  if (status) { status.textContent = 'LOADING...'; status.style.color = 'var(--y)'; }
  if (!frame) return;
  // Force full reload with hash so unlocker picks it up on DOMContentLoaded
  frame.src = 'unlocker/index.html#' + encodeURIComponent(url);
  frame.onload = function() {
    if (status) { status.textContent = 'LOADED'; status.style.color = 'var(--g)'; }
    // Also try postMessage in case hash was missed
    try {
      frame.contentWindow.postMessage({ type: 'navigate', url: url }, '*');
    } catch(e) {}
  };
}function brHome() {
  var frame = document.getElementById('brFrame');
  var inp = document.getElementById('brUrl');
  var status = document.getElementById('brStatus');
  if (frame) frame.src = 'unlocker/index.html';
  if (inp) inp.value = '';
  if (status) { status.textContent = 'LOADING...'; status.style.color = 'var(--y)'; }
  if (frame) frame.onload = function() { if (status) { status.textContent = 'PROXY HOME'; status.style.color = 'var(--g)'; } };
}function brGo() {
  var inp = document.getElementById('brUrl'); if (!inp) return;
  var raw = inp.value.trim(); if (!raw) return;
  var url;
  if (raw.startsWith('http://') || raw.startsWith('https://')) { url = raw; }
  else if (raw.includes('.') && !raw.includes(' ') && raw.length > 3) { url = 'https://' + raw; }
  else { url = 'https://www.google.com/search?q=' + encodeURIComponent(raw); }
  brLoad(url);
}

function brBack() {
  var f = document.getElementById('brFrame');
  try { if(f) f.contentWindow.history.back(); } catch(e) {}
}

function brForward() {
  var f = document.getElementById('brFrame');
  try { if(f) f.contentWindow.history.forward(); } catch(e) {}
}

function brRefresh() {
  var f = document.getElementById('brFrame');
  if (f && f.src) { var s = f.src; f.src = 'about:blank'; setTimeout(function(){ f.src = s; }, 60); }
}

function brNewTab() {
  var inp = document.getElementById('brUrl');
  var url = inp && inp.value.trim() ? inp.value.trim() : UB2;
  window.open(brGetProxyUrl(url), '_blank');
}

function brSearch(site) { brLoad('https://' + site); }
function brRenderRecent() {}

// ══════ AI MEMORY ══════
var aiUserName = '';
var aiConvHistory = [];
var AI_MAX_HISTORY = 10;
try { aiUserName = localStorage.getItem('nx_ai_name') || ''; } catch(e) {}

function updateAIBanner() {
  var banner = document.getElementById('aiNameBanner'); if (!banner) return;
  banner.style.display = 'block';
  if (aiUserName) {
    banner.innerHTML = '&#128100; Chatting as <span style="color:var(--g);font-weight:bold;">' + escHtml(aiUserName) + '</span> &nbsp;&mdash;&nbsp; <span style="color:#445566;cursor:pointer;font-size:.55rem;text-decoration:underline;" onclick="aiChangeName()">change</span> &nbsp;|&nbsp; <span style="color:#445566;cursor:pointer;font-size:.55rem;text-decoration:underline;" onclick="aiClearHistory()">clear history</span>';
  } else {
    banner.innerHTML = '&#129302; Set your name: <input id="aiNameInp" type="text" placeholder="Your name..." style="background:rgba(0,255,136,.06);border:1px solid rgba(0,255,136,.2);border-radius:3px;color:var(--g);font-family:Share Tech Mono,monospace;font-size:.62rem;padding:3px 8px;outline:none;width:110px;margin:0 6px;" onkeydown="if(event.key===\'Enter\')saveAIName()"><button onclick="saveAIName()" style="background:var(--g);border:none;color:#050810;font-family:Orbitron,monospace;font-size:.52rem;font-weight:700;padding:3px 10px;border-radius:3px;cursor:pointer;letter-spacing:1px;">SAVE</button>';
  }
}

function saveAIName() {
  var inp = document.getElementById('aiNameInp');
  var name = inp ? inp.value.trim() : '';
  if (!name) return;
  aiUserName = name;
  try { localStorage.setItem('nx_ai_name', name); } catch(e) {}
  updateAIBanner();
  toast('&#128100; HEY ' + name.toUpperCase() + '!', 'AI will remember you!', 'var(--g)');
  aiMsg('ai', 'Nice to meet you, ' + name + '! \ud83d\udc4b I\'ll remember your name from now on. What can I help you with?');
}

function aiChangeName() {
  aiUserName = '';
  try { localStorage.removeItem('nx_ai_name'); } catch(e) {}
  updateAIBanner();
}

function aiClearHistory() {
  aiConvHistory = [];
  var c = document.getElementById('chatMsgs'); if (c) c.innerHTML = '';
  aiMsg('ai', 'Chat cleared! ' + (aiUserName ? 'Still remember you, ' + aiUserName + ' \ud83d\ude09' : 'Fresh start!'));
  toast('\ud83d\uddd1\ufe0f', 'Conversation cleared', 'var(--b)');
}

// ══════ CUSTOM BACKGROUND ══════
var bgPresets = [
  {label:'Default', bg:'#060910'},
  {label:'Deep Space', bg:'radial-gradient(ellipse at center,#0a0520 0%,#060910 70%)'},
  {label:'Ocean Abyss', bg:'radial-gradient(ellipse at bottom,#001530 0%,#060910 70%)'},
  {label:'Toxic Swamp', bg:'radial-gradient(ellipse at top,#001a0a 0%,#060910 70%)'},
  {label:'Magma Core', bg:'radial-gradient(ellipse at center,#1a0500 0%,#060910 70%)'},
  {label:'Void Purple', bg:'radial-gradient(ellipse at center,#0d0020 0%,#060910 70%)'},
];

function buildBgPicker() {
  if (document.getElementById('bgPickerCard')) return;
  var settingsInner = document.querySelector('.s-inner'); if (!settingsInner) return;
  var card = document.createElement('div');
  card.id = 'bgPickerCard'; card.className = 'scard'; card.style.border = '1px solid rgba(0,207,255,.15)';
  card.innerHTML = '<div class="scard-title" style="color:var(--b);">\u1f3a8 CUSTOM BACKGROUND</div>'
    + '<div class="scard-sub">Choose a preset or upload your own wallpaper</div>'
    + '<div class="bg-grid" id="bgPresetGrid"></div>'
    + '<div style="margin-top:10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">'
    + '<label id="bgUploadBtn" for="bgFileIn">\ud83d\udcf7 UPLOAD IMAGE</label>'
    + '<input type="file" id="bgFileIn" accept="image/*" style="display:none;" onchange="bgUpload(this)">'
    + '<button class="sbtn b" style="border-radius:3px;border:none;padding:8px 14px;" onclick="bgReset()">RESET</button>'
    + '</div><div id="bgOk" class="sok">\u2713 Background applied!</div>';
  settingsInner.insertBefore(card, settingsInner.children[2]);
  var grid = card.querySelector('#bgPresetGrid');
  bgPresets.forEach(function(p, i) {
    var d = document.createElement('div'); d.className = 'bg-opt' + (i===0?' sel':'');
    d.style.cssText = 'background:' + p.bg + ';' + (i===0?'border-color:#fff;':'');
    d.title = p.label;
    d.onclick = (function(pp){ return function() {
      document.querySelectorAll('.bg-opt').forEach(function(x){ x.classList.remove('sel'); x.style.borderColor='transparent'; });
      d.classList.add('sel'); d.style.borderColor='#fff';
      applyBg(pp.bg);
    }; })(p);
    grid.appendChild(d);
  });
  try { var sb = localStorage.getItem('nx_bg'); if(sb) { var app=document.getElementById('app'); if(app) app.style.background=sb; } } catch(e) {}
}

function applyBg(bg) {
  var app = document.getElementById('app'); if (!app) return;
  app.style.background = bg;
  try { localStorage.setItem('nx_bg', bg); } catch(e) {}
  var ok = document.getElementById('bgOk');
  if (ok) { ok.style.display='block'; setTimeout(function(){ ok.style.display='none'; },2000); }
}

function bgReset() {
  try { localStorage.removeItem('nx_bg'); } catch(e) {}
  var app = document.getElementById('app'); if (app) app.style.background = '';
  document.querySelectorAll('.bg-opt').forEach(function(x,i){ x.classList.toggle('sel',i===0); x.style.borderColor=i===0?'#fff':'transparent'; });
}

function bgUpload(inp) {
  if (!inp.files || !inp.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var dataUrl = e.target.result;
    var bg = 'url(' + dataUrl + ') center/cover no-repeat fixed';
    applyBg(bg);
    var grid = document.getElementById('bgPresetGrid');
    if (grid) {
      var ex = grid.querySelector('.bg-custom'); if(ex) grid.removeChild(ex);
      var d = document.createElement('div'); d.className = 'bg-opt bg-custom sel';
      d.innerHTML = '<img src="'+dataUrl+'" alt="custom" style="width:100%;height:100%;object-fit:cover;">';
      d.onclick = function(){ document.querySelectorAll('.bg-opt').forEach(function(x){ x.classList.remove('sel'); x.style.borderColor='transparent'; }); d.classList.add('sel'); d.style.borderColor='#fff'; applyBg(bg); };
      document.querySelectorAll('.bg-opt').forEach(function(x){ x.classList.remove('sel'); x.style.borderColor='transparent'; });
      grid.appendChild(d);
    }
    toast('\ud83c\udfa8', 'Custom background applied!', 'var(--b)');
  };
  reader.readAsDataURL(inp.files[0]);
}

// ══════════════════════════════════════════
// 🔥 INSANE EFFECTS ENGINE 🔥
// ══════════════════════════════════════════

// ── Custom Cursor + Trail ──
(function() {
  var cursor = document.getElementById('cursor');
  var ring = document.getElementById('cursor-ring');
  var mx = 0, my = 0, rx = 0, ry = 0;
  var trail = [];
  var trailColors = ['var(--g)','var(--b)','var(--p)','var(--y)'];

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    if (cursor) { cursor.style.left = mx+'px'; cursor.style.top = my+'px'; }
    spawnTrail(mx, my);
  });

  // Smooth ring follow
  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    if (ring) { ring.style.left = rx+'px'; ring.style.top = ry+'px'; }
    requestAnimationFrame(animRing);
  }
  animRing();

  document.addEventListener('mousedown', function() {
    if (cursor) cursor.classList.add('clicking');
    if (ring) ring.classList.add('clicking');
  });
  document.addEventListener('mouseup', function() {
    if (cursor) cursor.classList.remove('clicking');
    if (ring) ring.classList.remove('clicking');
  });

  // Trail dots
  var lastTrail = 0;
  function spawnTrail(x, y) {
    var now = Date.now();
    if (now - lastTrail < 28) return;
    lastTrail = now;
    var dot = document.createElement('div');
    dot.className = 'trail-dot';
    var size = Math.random() * 6 + 3;
    var col = trailColors[Math.floor(Math.random() * trailColors.length)];
    dot.style.cssText = 'left:'+x+'px;top:'+y+'px;width:'+size+'px;height:'+size+'px;background:'+col+';box-shadow:0 0 '+(size*2)+'px '+col+';opacity:.8;';
    document.body.appendChild(dot);
    var opacity = 0.8;
    var shrink = setInterval(function() {
      opacity -= 0.08;
      size -= 0.3;
      if (opacity <= 0 || size <= 0) {
        clearInterval(shrink);
        if (dot.parentNode) dot.parentNode.removeChild(dot);
      } else {
        dot.style.opacity = opacity;
        dot.style.width = size+'px';
        dot.style.height = size+'px';
      }
    }, 20);
  }
})();

// ── Click Ripple Shockwave ──
document.addEventListener('click', function(e) {
  // Don't ripple on panic overlay
  if (document.getElementById('panic') && document.getElementById('panic').style.display === 'block') return;
  var colors = ['rgba(0,255,136,.6)','rgba(0,207,255,.6)','rgba(255,0,170,.6)','rgba(255,204,0,.5)'];
  for (var i = 0; i < 2; i++) {
    (function(i) {
      var r = document.createElement('div');
      r.className = 'ripple';
      var size = 60 + i * 80;
      var col = colors[Math.floor(Math.random() * colors.length)];
      r.style.cssText = 'left:'+e.clientX+'px;top:'+e.clientY+'px;width:'+size+'px;height:'+size+'px;border:2px solid '+col+';animation-duration:'+(0.5+i*0.15)+'s;animation-delay:'+(i*0.06)+'s;';
      document.body.appendChild(r);
      setTimeout(function() { if(r.parentNode) r.parentNode.removeChild(r); }, 800 + i * 200);
    })(i);
  }
  // Mini particle burst on click
  var burst = 12;
  for (var j = 0; j < burst; j++) {
    (function(j) {
      var p = document.createElement('div');
      p.className = 'trail-dot';
      var angle = (Math.PI * 2 / burst) * j;
      var speed = Math.random() * 60 + 20;
      var col = colors[j % colors.length];
      var size = Math.random() * 5 + 2;
      p.style.cssText = 'left:'+e.clientX+'px;top:'+e.clientY+'px;width:'+size+'px;height:'+size+'px;background:'+col+';box-shadow:0 0 8px '+col+';transition:none;';
      document.body.appendChild(p);
      var tx = e.clientX + Math.cos(angle) * speed;
      var ty = e.clientY + Math.sin(angle) * speed;
      var startTime = Date.now();
      var dur = 400 + Math.random() * 200;
      function animP() {
        var t = (Date.now() - startTime) / dur;
        if (t >= 1) { if(p.parentNode) p.parentNode.removeChild(p); return; }
        var cx = e.clientX + (tx - e.clientX) * t;
        var cy = e.clientY + (ty - e.clientY) * t + t * t * 30; // gravity
        p.style.left = cx+'px'; p.style.top = cy+'px'; p.style.opacity = 1-t;
        requestAnimationFrame(animP);
      }
      requestAnimationFrame(animP);
    })(j);
  }
});

// ── Sound bars randomize ──
(function() {
  var bars = document.querySelectorAll('.sbar');
  function randomizeBars() {
    bars.forEach(function(b) {
      var h = Math.random() * 16 + 3;
      b.style.height = h+'px';
      var hue = Math.random();
      b.style.background = hue < 0.4 ? 'var(--g)' : hue < 0.7 ? 'var(--b)' : 'var(--p)';
      b.style.boxShadow = '0 0 5px ' + (hue < 0.4 ? 'var(--g)' : hue < 0.7 ? 'var(--b)' : 'var(--p)');
    });
  }
  setInterval(randomizeBars, 120);
})();

// ── Tab Scramble Effect on hover ──
(function() {
  var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  document.querySelectorAll('.tab').forEach(function(tab) {
    var orig = tab.textContent;
    var scrambling = false;
    tab.addEventListener('mouseenter', function() {
      if (scrambling) return;
      scrambling = true;
      var i = 0;
      var iv = setInterval(function() {
        var scrambled = orig.split('').map(function(c, idx) {
          if (c === ' ' || idx < i) return c;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('');
        tab.textContent = scrambled;
        i += 1.5;
        if (i >= orig.length + 3) {
          clearInterval(iv);
          tab.textContent = orig;
          scrambling = false;
        }
      }, 35);
    });
  });
})();

// ── Cover page cyber rain canvas ──
(function() {
  var cover = document.getElementById('cover');
  if (!cover) return;
  var c = document.createElement('canvas');
  c.id = 'coverRain';
  c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:.06;z-index:0;';
  cover.insertBefore(c, cover.firstChild);
  c.width = 448; c.height = 700;
  var ctx = c.getContext('2d');
  var drops = []; var fs = 11;
  for (var i = 0; i < Math.floor(c.width/fs); i++) drops.push(Math.random()*50|0);
  var chars = '01アイウエオカキクケコ';
  setInterval(function() {
    ctx.fillStyle = 'rgba(255,255,255,.05)';
    ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle = '#0066ff';
    ctx.font = fs+'px monospace';
    drops.forEach(function(y,i) {
      ctx.fillText(chars[Math.floor(Math.random()*chars.length)], i*fs, y*fs);
      if (y*fs > c.height && Math.random()>.97) drops[i]=0;
      else drops[i]++;
    });
  }, 55);
})();

// ── Konami code Easter egg ──
(function() {
  var seq = [38,38,40,40,37,39,37,39,66,65];
  var pos = 0;
  document.addEventListener('keydown', function(e) {
    if (e.keyCode === seq[pos]) {
      pos++;
      if (pos === seq.length) {
        pos = 0;
        // ACTIVATE RAINBOW MODE
        var root = document.documentElement;
        var hue = 0;
        toast('\uD83C\uDF08 CHEAT CODE!', 'RAINBOW MODE ACTIVATED!!!', 'var(--p)');
        var iv = setInterval(function() {
          hue = (hue + 2) % 360;
          var g = 'hsl('+hue+',100%,55%)';
          var b = 'hsl('+(hue+120)+',100%,55%)';
          var p = 'hsl('+(hue+240)+',100%,55%)';
          root.style.setProperty('--g', g);
          root.style.setProperty('--b', b);
          root.style.setProperty('--p', p);
        }, 40);
        setTimeout(function() {
          clearInterval(iv);
          root.style.setProperty('--g','#00ff88');
          root.style.setProperty('--b','#00cfff');
          root.style.setProperty('--p','#ff00aa');
          toast('\uD83D\uDC4B', 'Rainbow mode ended', 'var(--g)');
        }, 8000);
      }
    } else { pos = 0; }
  });
})();

// ── Neon border color cycle ──
(function() {
  var sb = document.getElementById('screenBorder');
  if (!sb) return;
  var hue = 0;
  setInterval(function() {
    hue = (hue + 0.5) % 360;
    sb.style.boxShadow = 'inset 0 0 50px hsla('+hue+',100%,50%,.06), 0 0 50px hsla('+hue+',100%,50%,.03)';
  }, 30);
})();

// ── Topbar glow pulse matches color ──
(function() {
  var topbar = document.getElementById('topbar');
  if (!topbar) return;
  var hue = 0;
  setInterval(function() {
    hue = (hue + 0.3) % 360;
    topbar.style.borderBottomColor = 'hsla('+hue+',100%,60%,.15)';
  }, 40);
})();

// ── Glitch distort full screen randomly ──
(function() {
  var app = document.getElementById('app');
  if (!app) return;
  function doGlitch() {
    var duration = Math.random() * 120 + 40;
    var orig = app.style.filter || '';
    app.style.filter = 'hue-rotate('+(Math.random()*30-15)+'deg) brightness(1.1)';
    app.style.transform = 'skewX('+(Math.random()*.5-.25)+'deg)';
    setTimeout(function() {
      app.style.filter = orig;
      app.style.transform = '';
      setTimeout(doGlitch, Math.random()*8000 + 4000);
    }, duration);
  }
  setTimeout(doGlitch, 5000);
})();


document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (panicActive) { dismissPanic(); return; }
    var app = document.getElementById('app');
    if (app && app.style.display !== 'none') { triggerPanic(); return; }
  }
});

document.addEventL