const $=s=>document.querySelector(s),app=$('#app'),mem={};
const st={get(k){try{return localStorage.getItem(k)}catch(e){return mem[k]??null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){mem[k]=v}},del(k){try{localStorage.removeItem(k)}catch(e){}delete mem[k]}};
let E={},R={},sel,view=new Date(),mood=0;
const pad=n=>String(n).padStart(2,'0'),key=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()),mkey=d=>d.getFullYear()+'-'+pad(d.getMonth()+1);
let U=[],me=null;
const sfx=()=>me.id==='u1'?'':':'+me.id;
const load=()=>{try{E=JSON.parse(st.get('diario:e'+sfx())||'{}');R=JSON.parse(st.get('diario:r'+sfx())||'{}')}catch(e){E={};R={}}};
const save=()=>{st.set('diario:e'+sfx(),JSON.stringify(E));st.set('diario:r'+sfx(),JSON.stringify(R))};
const loadUsers=()=>{try{U=JSON.parse(st.get('diario:users')||'[]')}catch(e){U=[]}
  if(!U.length&&st.get('diario:pin')){U=[{id:'u1',name:st.get('diario:name')||'',pin:st.get('diario:pin')}];st.set('diario:users',JSON.stringify(U))}};
const txtOf=e=>e.txt!=null?e.txt:[e.day,e.emo,e.sat,e.ach].filter(Boolean).join('\n\n');
const IC={lock:'<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
book:'<svg viewBox="0 0 24 24"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/></svg>'};
const MOUTH=['M8 16.5q4-4 8 0','M8 15.5q4-2 8 0','M8 15h8','M8 14q4 3 8 0','M7 13.5q5 5 10 0'],MN=['Péssimo','Ruim','Neutro','Bom','Ótimo'],COL=['#ff453a','#ff9f0a','#ffd60a','#a4d65e','#30d158'];
const face=i=>`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r=".5"/><circle cx="15" cy="10" r=".5"/><path d="${MOUTH[i]}"/></svg>`;
function el(t,p,x){const e=document.createElement(t);if(p)Object.assign(e,p);if(x!=null)e.textContent=x;return e}
async function hash(p){try{const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('diario:'+p));return[...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){let h=5381;for(const c of 'diario:'+p)h=(h*33+c.charCodeAt(0))|0;return 'f'+h}}

function enter(u){me=u;st.set('diario:last',u.id);sel=null;view=new Date();load();home()}
function lockScreen(mode,tu){
  loadUsers();
  const cu=U.find(u=>u.id===st.get('diario:last'))||U[0];
  mode=mode||(U.length?'login':'new');
  if(mode==='pick'){
    app.innerHTML='<div class="lock"><div class="ic">'+IC.book+'</div><h1>Quem está entrando?</h1><div id="ul" style="display:flex;flex-direction:column;gap:10px;max-width:260px;width:100%;margin:0 auto"></div></div>';
    U.forEach(u=>{
      const w=el('div'),r=el('div',{style:'display:flex;gap:8px;align-items:center'}),b=el('button',{className:'btn o',style:'margin:0;flex:1'},u.name||'Sem nome'),m=el('button',{className:'ic',title:'Opções'}),x=el('button',{className:'btn o',style:'margin:8px 0 0;display:none'},'Excluir usuário');
      m.innerHTML='<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/></svg>';
      b.onclick=()=>{st.set('diario:last',u.id);lockScreen('login')};
      m.onclick=()=>{x.style.display=x.style.display==='none'?'block':'none'};
      x.onclick=()=>lockScreen('del',u);
      r.append(b,m);w.append(r,x);$('#ul').append(w)});
    const n=el('button',{className:'btn',style:'margin:0'},'Novo usuário');n.onclick=()=>lockScreen('new');$('#ul').append(n);
    return;
  }
  if(mode==='del'){
    app.innerHTML=`<div class="lock"><div class="ic">${IC.lock}</div><h1>Excluir usuário</h1><p class="mut" id="hi" style="text-align:justify;max-width:260px;margin:0 auto"></p><input id="p1" type="password" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="Senha deste usuário"><div class="err" id="err"></div><button class="btn" id="go">Excluir definitivamente</button><button class="mut" id="sw" style="text-decoration:underline">Cancelar</button></div>`;
    $('#hi').textContent='Isso apaga para sempre o nome, a senha e todo o diário de '+(tu.name||'este usuário')+' neste aparelho. Digite a senha dele(a) para confirmar.';
    $('#sw').onclick=()=>lockScreen('pick');
    $('#go').onclick=async()=>{
      if(await hash($('#p1').value)!==tu.pin){$('#err').textContent='Senha incorreta.';$('#p1').value='';return}
      const q=tu.id==='u1'?'':':'+tu.id;
      ['diario:e','diario:r'].forEach(k=>st.del(k+q));
      if(tu.id==='u1'){st.del('diario:pin');st.del('diario:name')}
      U=U.filter(u=>u.id!==tu.id);st.set('diario:users',JSON.stringify(U));
      if(st.get('diario:last')===tu.id)st.del('diario:last');
      lockScreen(U.length?'pick':'new');
    };
    return;
  }
  const nw=mode==='new';
  app.innerHTML=`<div class="lock"><div class="ic">${IC.book}</div><h1>Diário Terapia</h1><p class="mut" id="hi"></p>
  ${nw?'<input id="nm" type="text" maxlength="30" autocomplete="off" placeholder="Seu nome">':''}
  <input id="p1" type="password" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="Senha de 6 dígitos">
  ${nw?'<input id="p2" type="password" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="Repita a senha">':''}
  <div class="err" id="err"></div><button class="btn" id="go">${nw?'Criar acesso':'Entrar'}</button>
  <button class="mut" id="sw" style="text-decoration:underline;${nw&&!U.length?'display:none':''}">${nw?'Voltar':'Trocar de usuário'}</button>
  <p class="mut">Seu diário fica salvo apenas neste aparelho. A senha bloqueia o acesso.</p></div>`;
  $('#hi').textContent=nw?'Crie um acesso com nome e senha de 6 números.':(cu.name?'Olá, '+cu.name+'.':'Bem-vindo(a) de volta.');
  $('#sw').onclick=()=>lockScreen(nw?'login':'pick');
  const go=async()=>{
    const a=$('#p1').value,err=$('#err');
    if(!/^\d{4,6}$/.test(a)){err.textContent='Use somente números.';return}
    if(!nw){if(await hash(a)===cu.pin)enter(cu);else{err.textContent='Senha incorreta.';$('#p1').value=''}return}
    const n=$('#nm').value.trim();
    if(!n){err.textContent='Digite seu nome.';return}
    if(!/^\d{6}$/.test(a)){err.textContent='A senha precisa ter exatamente 6 números.';return}
    if(a!==$('#p2').value){err.textContent='As senhas não coincidem.';return}
    const u={id:'u'+Date.now(),name:n,pin:await hash(a)};U.push(u);st.set('diario:users',JSON.stringify(U));enter(u);
  };
  $('#go').onclick=go;$('#p1').onkeydown=e=>{if(e.key==='Enter'&&!nw)go()};
}

function home(){
  sel=sel||key(new Date());
  app.innerHTML=`<div class="row"><h1>Diário Terapia</h1><button class="ic" id="lk" aria-label="Bloquear">${IC.lock}</button></div>
  <div class="sec"><div class="row"><button id="pv" class="ic" aria-label="Mês anterior"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><h2 id="mt" style="text-transform:capitalize"></h2><button id="nx" class="ic" aria-label="Próximo mês"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button></div><div class="cal" id="cal"></div></div>
  <hr><div class="sec" id="ed"></div><div id="an"></div><div id="mr"></div><div id="bk"></div><div id="ak"></div>
  <p class="mut" style="margin-top:32px;text-align:justify">Este app oferece reflexões de apoio e não substitui um psicólogo ou psiquiatra. Em crise, ligue 188 (CVV, 24 h).</p>`;
  $('#lk').onclick=()=>lockScreen('login');
  $('#pv').onclick=()=>{view=new Date(view.getFullYear(),view.getMonth()-1,1);cal();monthly()};
  $('#nx').onclick=()=>{view=new Date(view.getFullYear(),view.getMonth()+1,1);cal();monthly()};
  cal();editor();showAn();monthly();backup();apiCard();
}
function cal(){
  const y=view.getFullYear(),m=view.getMonth(),c=$('#cal'),tk=key(new Date());
  $('#mt').textContent=view.toLocaleDateString('pt-BR',{month:'long',year:'numeric'});c.innerHTML='';
  ['D','S','T','Q','Q','S','S'].forEach(d=>c.append(el('div',{className:'h'},d)));
  for(let i=0;i<new Date(y,m,1).getDay();i++)c.append(el('div',{className:'d x'}));
  for(let d=1,n=new Date(y,m+1,0).getDate();d<=n;d++){
    const k=y+'-'+pad(m+1)+'-'+pad(d),b=el('button',{className:'d'+(k===sel?' sel':'')+(k===tk?' t':'')},d);
    if(E[k])b.append(el('i'));
    b.onclick=()=>{sel=k;cal();editor();showAn()};c.append(b);
  }
}

function editor(){
  const e=E[sel]||{},box=$('#ed');mood=e.mood||0;
  const dt=new Date(sel+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
  box.innerHTML='';
  const h=el('h2',{style:'text-transform:capitalize'},dt),mv=el('div',{className:'moods'});
  MN.forEach((n,i)=>{const b=el('button',{title:n,className:mood===i+1?'on':''});b.innerHTML=face(i);b.style.setProperty('--c',COL[i]);
    b.onclick=()=>{mood=mood===i+1?0:i+1;[...mv.children].forEach((c,j)=>c.className=mood===j+1?'on':'')};mv.append(b)});
  const ta=el('textarea',{placeholder:'Como foi o seu dia? Escreva tudo: o que aconteceu, o que sentiu, o que te deixou satisfeito(a) e suas conquistas.',value:txtOf(e)});
  const sv=el('button',{className:'btn'},'Salvar o dia'),msg=el('p',{className:'mut',style:'min-height:1.3em;margin:8px 0 0'});
  box.append(h,mv,ta,sv,msg);
  sv.onclick=async()=>{
    const t=ta.value.trim();if(!t){msg.textContent='Escreva sobre o seu dia primeiro.';return}
    const o={mood,txt:t,an:(E[sel]||{}).an};E[sel]=o;save();cal();
    sv.disabled=true;msg.textContent='Dia salvo. Analisando…';
    try{o.an=await analyze(o,dt);E[sel]=o;save();msg.textContent='Dia salvo ✓'}
    catch(x){msg.textContent=x.message==='nokey'?'Dia salvo. Para ativar a análise, adicione sua chave da API no fim da página.':'Dia salvo. Não foi possível analisar agora; toque em Salvar para tentar de novo.'}
    sv.disabled=false;showAn();
  };
}
const SYS='Você é um(a) assistente de apoio emocional com base em psicologia (TCC, psicologia positiva, mindfulness): acolhedor(a), honesto(a) e direto(a), sem julgamento e sem bajular. Escreva em português do Brasil, falando com a pessoa em "você". Não faça diagnósticos; você não substitui terapia. Se houver sinais de risco (autolesão, desesperança grave), acolha e recomende ajuda profissional e o CVV (188). Responda SOMENTE com JSON válido, sem markdown.';
const MODEL='claude-sonnet-5-5';
async function ask(p){
  const k=st.get('diario:apikey');if(!k)throw new Error('nokey');
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':k,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:MODEL,max_tokens:1500,system:SYS,messages:[{role:'user',content:p}]})});
  if(!r.ok)throw new Error('api'+r.status);
  const d=await r.json();
  return JSON.parse(d.content.map(c=>c.text||'').join('').replace(/```json|```/g,'').trim());
}
const analyze=(o,dt)=>ask(`Analise este dia de diário (${dt}). Humor (1-5): ${o.mood||'não informado'}.\n\n${o.txt}\n\nSeja breve. Avalie com honestidade se as atitudes da pessoa ajudaram ou não.\nJSON: {"analise":"análise crítica curta, no máximo 3 frases","dicas":["3 dicas práticas e curtas de como o dia poderia ter sido melhor"]}`);
function list(t,a){const f=document.createDocumentFragment();if(!a||!a.length)return f;f.append(el('h3',0,t));const u=el('ul');a.forEach(x=>u.append(el('li',0,x)));f.append(u);return f}
function para(t,x){const f=document.createDocumentFragment();if(!x)return f;f.append(el('h3',0,t),el('p',0,x));return f}
function showAn(){
  const b=$('#an'),a=(E[sel]||{}).an;b.innerHTML='';if(!a)return;
  const c=el('div',{className:'sec rep'});c.append(el('h2',0,'Análise do dia'));
  c.append(para('Análise',a.analise||a.resumo),list('Dicas',a.dicas||a.conselhos));
  b.append(el('hr'),c);
}

function monthly(){
  const mk=mkey(view),box=$('#mr');box.innerHTML='';
  const days=Object.keys(E).filter(k=>k.startsWith(mk)).sort();if(!days.length)return;
  const c=el('div',{className:'sec rep'}),out=el('div'),ms=days.map(k=>E[k].mood).filter(Boolean);
  c.append(el('h2',0,'Relatório do mês'));
  c.append(el('p',{className:'mut'},days.length+' dias registrados'+(ms.length?' · humor médio '+(ms.reduce((a,b)=>a+b,0)/ms.length).toFixed(1)+' de 5':'')));
  const btn=el('button',{className:'btn o'},R[mk]?'Gerar novamente':'Gerar relatório do mês');
  const draw=r=>{out.innerHTML='';if(r)out.append(para('Visão geral',r.resumo),list('Padrões',r.padroes),list('Destaques',r.destaques),list('Pontos de atenção',r.atencao),list('Conselhos para o próximo mês',r.conselhos),para('Meta sugerida',r.meta))};
  draw(R[mk]);
  btn.onclick=async()=>{
    btn.disabled=true;btn.textContent='Gerando…';
    const txt=days.map(k=>`${k} | humor ${E[k].mood||'?'} | ${txtOf(E[k])}`).join('\n').slice(0,14000);
    try{const x=await ask(`Faça o relatório mensal (${mk}) com estas entradas:\n${txt}\n\nJSON: {"resumo":"3-4 frases","padroes":["padrões emocionais e de comportamento, gatilhos, evolução"],"destaques":["conquistas e bons momentos"],"atencao":["pontos que, na psicologia, merecem cuidado"],"conselhos":["4 conselhos práticos"],"meta":"uma meta simples para o próximo mês"}`);R[mk]=x;save();draw(x);btn.textContent='Gerar novamente'}
    catch(e){out.innerHTML='';out.append(el('p',{className:'err'},e.message==='nokey'?'Adicione sua chave da API no fim da página.':'Não foi possível gerar agora.'));btn.textContent='Tentar de novo'}
    btn.disabled=false;
  };
  c.append(btn,out);box.append(el('hr'),c);
}

const b64=u=>{let s='';for(const x of u)s+=String.fromCharCode(x);return btoa(s)},ub=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function kdf(pw,salt){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:250000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function enc(obj,pw){const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),k=await kdf(pw,salt),ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},k,new TextEncoder().encode(JSON.stringify(obj)));return JSON.stringify({app:'diario-terapia',v:1,salt:b64(salt),iv:b64(iv),data:b64(new Uint8Array(ct))})}
async function dec(txt,pw){const o=JSON.parse(txt);if(o.app!=='diario-terapia')throw 0;const k=await kdf(pw,ub(o.salt)),pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:ub(o.iv)},k,ub(o.data));return JSON.parse(new TextDecoder().decode(pt))}
function backup(){
  const box=$('#bk');box.innerHTML='';
  const c=el('div',{className:'sec'}),msg=el('p',{className:'mut',style:'margin:8px 0 0'});
  c.append(el('h2',0,'Backup criptografado'),el('p',{className:'mut'},'Crie uma senha de backup com pelo menos 8 caracteres. Sem ela o arquivo não abre, e não há como recuperá-la.'));
  const pw=el('input',{type:'password',placeholder:'Senha do backup',autocomplete:'off'});
  const ex=el('button',{className:'btn'},'Exportar'),im=el('button',{className:'btn o'},'Importar'),fi=el('input',{type:'file',accept:'.json,application/json'});fi.style.display='none';
  const ok=()=>{if(pw.value.length<8){msg.textContent='A senha do backup precisa ter pelo menos 8 caracteres.';return false}return true};
  ex.onclick=async()=>{
    if(!ok())return;msg.textContent='Criptografando…';
    try{const txt=await enc({E,R,name:me.name},pw.value),a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([txt],{type:'application/json'}));a.download='diario-terapia-backup-'+key(new Date())+'.json';
      document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);msg.textContent='Backup exportado ✓'}
    catch(e){msg.textContent='Não foi possível exportar.'}
  };
  im.onclick=()=>{if(ok())fi.click()};
  fi.onchange=async()=>{
    const f=fi.files[0];if(!f)return;msg.textContent='Descriptografando…';
    try{const o=await dec(await f.text(),pw.value);Object.assign(E,o.E||{});Object.assign(R,o.R||{});
      save();cal();editor();showAn();monthly();msg.textContent='Backup importado ✓ ('+Object.keys(o.E||{}).length+' dias)'}
    catch(e){msg.textContent='Senha incorreta ou arquivo inválido.'}
    fi.value='';
  };
  c.append(pw,ex,im,fi,msg);box.append(el('hr'),c);
}
function apiCard(){
  const box=$('#ak');box.innerHTML='';
  const c=el('div',{className:'sec'}),msg=el('p',{className:'mut',style:'margin:8px 0 0'}),has=()=>st.get('diario:apikey')?'Chave salva ✓ (cole outra para trocar)':'sk-ant-...';
  c.append(el('h2',0,'Análise por IA'),el('p',{className:'mut',style:'text-align:justify'},'Para ativar a análise, cole sua chave da API da Anthropic. Ela fica salva só neste aparelho e é enviada apenas à Anthropic.'));
  const k=el('input',{type:'password',placeholder:has(),autocomplete:'off'}),sv=el('button',{className:'btn'},'Salvar chave'),rm=el('button',{className:'btn o'},'Remover chave');
  sv.onclick=()=>{const v=k.value.trim();if(!v.startsWith('sk-ant-')){msg.textContent='Chave inválida.';return}st.set('diario:apikey',v);k.value='';k.placeholder=has();msg.textContent='Chave salva ✓'};
  rm.onclick=()=>{st.del('diario:apikey');k.placeholder=has();msg.textContent='Chave removida.'};
  c.append(k,sv,rm,msg);box.append(el('hr'),c);
}
lockScreen();
