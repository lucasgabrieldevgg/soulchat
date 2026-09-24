/* Suíte do SoulChat — smoke de carregamento + estrutura + identidade + segurança
   Padrão da casa: asserts no DOM renderizado (jsdom), contador no fim. */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
let ok = 0, fail = 0;
function t(nome, cond) {
  if (cond) { ok++; console.log('  ✓ ' + nome); }
  else { fail++; console.log('  ✗ ' + nome); }
}

// ─── mocks mínimos (o app pode tocar mídia/rede no load) ───
const MOCKS = [];
global.fetch = (...a) => { MOCKS.push(String(a[0])); return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}), text: () => Promise.resolve('') }); };
global.matchMedia = global.matchMedia || (() => ({ matches: false, addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){} }));
global.Audio = global.Audio || class { play(){ return Promise.resolve(); } pause(){} };
global.AudioContext = global.AudioContext || class { constructor(){ this.state='running'; } resume(){ return Promise.resolve(); } close(){ return Promise.resolve(); } createGain(){ return {gain:{value:0,setValueAtTime(){},linearRampToValueAtTime(){}},connect(){}} } createOscillator(){ return {connect(){},start(){},stop(){},frequency:{value:0,setValueAtTime(){}},type:''} } };
global.webkitAudioContext = global.AudioContext;
global.speechSynthesis = global.speechSynthesis || { speak(){}, cancel(){}, getVoices(){ return []; }, onvoiceschanged: null };
global.SpeechSynthesisUtterance = global.SpeechSynthesisUtterance || class {};

let dom = null, doc = null, win = null;
try {
  dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://lucasgabrieldevgg.github.io/soulchat/' });
  doc = dom.window.document; win = dom.window;
} catch (e) { console.log('CRASH no carregamento: ' + e.message); }

console.log('\n✦ suíte SoulChat\n');

// ─── 1. carregamento ───
t('index.html carrega no jsdom sem crash', !!dom);
t('document.title tem SoulChat', /SoulChat/i.test(doc ? doc.title : ''));

// ─── 2. estrutura essencial ───
t('header com .brand e .soulmark ✦', !!doc.querySelector('.brand .soulmark'));
t('3 modos da home: Nova história / Com personagem / Grupo', !!doc.querySelector('main') && /Nova história/.test(doc.body.textContent) && /Com personagem/.test(doc.body.textContent) && /Grupo/.test(doc.body.textContent));
t('botões do header: home, voz, mods, pesquisa', !!doc.querySelector('#b-home') && !!doc.querySelector('#b-voz') && !!doc.querySelector('#b-mods') && !!doc.querySelector('#b-pesq'));
t('#versao existe e o JS injeta a VERSAO', !!doc.querySelector('#versao') && /const VERSAO=/.test(html) && doc.querySelector('#versao').textContent.length > 4);

// ─── 3. fixes históricos não podem regredir ───
t('FIX #at-menu[hidden]{display:none!important} presente', /#at-menu\[hidden\]\{display:none!important\}/.test(html));
t('prefers-reduced-motion respeitado', /prefers-reduced-motion/.test(html));

// ─── 4. identidade visual (a casa mística — não pode virar AI slop) ───
t('serifada de identidade (--serif com Georgia)', /--serif:\s*Georgia/.test(html));
t('paleta mística própria (lavanda #a78bfa, não roxo-clichê puro)', /#a78bfa/.test(html));
t('favicon ✦ embutido (data URI SVG)', /rel="icon"[^>]*data:image\/svg\+xml/.test(html));
t('header mobile: marca vira só ✦ e versão some', /\.brand>span:not\(\.soulmark\)\{display:none\}/.test(html) && /\.brand #versao\{display:none\}/.test(html));
t('sem fonte genérica no corpo (system-ui só como fallback)', /font-family:\s*-apple-system/.test(html) === false || /var\(--serif\)/.test(html));

// ─── 5. segurança ───
t('proxy lê chave de process.env (NUNCA hardcoded)', /process\.env\.OR_KEY/.test(fs.readFileSync(path.join(__dirname, '..', 'proxy', 'api', 'proxy.js'), 'utf8')));
t('sem segredo no index.html', !/ghp_[A-Za-z0-9]{20,}|sk-or-v1-|sk-ant-|vcp_[A-Za-z0-9]{20,}/.test(html));

// ─── 6. IA é o produto: núcleo de pesquisa (RAG) e narrador presentes ───
t('pesquisa real: Wikipédia + Wikidata no código', /wikipedia\.org\/w\/api\.php/.test(html) && /wikidata\.org\/w\/api\.php/.test(html));
t('chatlog mestre (memória viva) presente', /chatlog/i.test(html));
t('modificadores de estilo (⚡) existem', /modificadores/i.test(html));

console.log('\n══════════════════════════');
console.log(`RESULTADO: ${ok} ✓ / ${fail} ✗ ${fail === 0 ? '— SOULCHAT ÍNTEGRA ✦' : '— HÁ REGRESSÕES!'}`);
process.exit(fail === 0 ? 0 : 1);
