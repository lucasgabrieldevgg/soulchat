/* ═══════════════════════════════════════════════════════════
   SoulChat Proxy — Vercel Edge Function (plano grátis).
   Chaves ficam nas Environment Variables da Vercel (secretas).
   COTA DIÁRIA ALTA + DEGRADAÇÃO AUTOMÁTICA:
   - uso normal → até 30 req/min por IP
   - dia cheio (>50%) → aperta p/ 12/min · (>80%) → 6/min
   - cota esgotada (100%) → 429 "volta amanhã" pra todo mundo
   A cota zera à meia-noite UTC. Contagem por instância (best-
   effort; instâncias extras da Vercel têm cota própria).
   ═══════════════════════════════════════════════════════════ */
export const config = { runtime: 'edge' };

const SITE = 'https://lucasgabrieldevgg.github.io';
const ORIGENS_OK = [SITE, 'null', 'http://localhost', 'file://'];  /* 'null'/localhost = teste local do criador */
const MAX_BODY = 300000;
const CAP_DIA = 4000;   /* limite diário alto por instância */

const UPSTREAM = {
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
  nvidia: 'https://integrate.api.nvidia.com/v1/chat/completions'
};

/* contador do dia + anti-abuso por IP (memória da instância) */
let dia = '', usoDia = 0;
const hits = new Map();
function novoDia(){ const d = new Date().toISOString().slice(0,10); if (d !== dia){ dia = d; usoDia = 0; hits.clear(); } }
function limiteMinuto(){
  const p = usoDia / CAP_DIA;
  if (p >= 1) return 0;
  if (p > 0.8) return 6;
  if (p > 0.5) return 12;
  return 30;
}
function estourouMinuto(ip, lim){
  const agora = Date.now();
  const lista = (hits.get(ip) || []).filter(t => agora - t < 60000);
  lista.push(agora);
  hits.set(ip, lista);
  if (hits.size > 5000) hits.clear();
  return lista.length > lim;
}
function origemOk(o){
  if (!o) return false;
  if (o === 'null') return true;
  return ORIGENS_OK.some(b => o.startsWith(b));
}

export default async function handler(request) {
  const cors = {
    'Access-Control-Allow-Origin': SITE,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'X-Cota-Dia': ''
  };
  const comCota = (resp) => { resp.headers.set('X-Cota-Dia', usoDia + '/' + CAP_DIA); return resp; };
  const j = (o, s) => comCota(new Response(JSON.stringify(o), { status: s, headers: Object.assign({}, cors, { 'Content-Type': 'application/json' }) }));

  if (request.method === 'OPTIONS') return comCota(new Response(null, { status: 204, headers: cors }));
  if (request.method !== 'POST') return j({ erro: 'método não permitido' }, 405);

  novoDia();

  /* só o site do criador (e testes locais dele) usam o proxy */
  const origem = request.headers.get('Origin') || request.headers.get('Referer') || '';
  if (!origemOk(origem)) return j({ erro: 'origem não autorizada' }, 403);

  /* cota diária + degradação automática conforme o dia enche */
  if (usoDia >= CAP_DIA) return j({ erro: 'cota diária do proxy esgotada — volta amanhã (ou use sua própria chave no ⚙️)' }, 429);
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0] || request.headers.get('x-real-ip') || 'anon';
  const lim = limiteMinuto();
  if (estourouMinuto(ip, lim)) return j({ erro: 'muitas requisições — espera um pouco' }, 429);
  usoDia++;

  const len = +(request.headers.get('content-length') || 0);
  if (len > MAX_BODY) return j({ erro: 'pedido grande demais' }, 413);

  let body;
  try { body = await request.json(); } catch (e) { return j({ erro: 'json inválido' }, 400); }
  const { provider, model, messages } = body || {};
  if (!UPSTREAM[provider] || !Array.isArray(messages)) return j({ erro: 'pedido malformado' }, 400);

  /* a chave NUNCA vem do navegador — vem das env vars da Vercel */
  const key = provider === 'openrouter' ? process.env.OR_KEY : process.env.NV_KEY;
  if (!key) return j({ erro: 'chave do provedor não configurada no proxy' }, 500);

  const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key };
  if (provider === 'openrouter') { headers['HTTP-Referer'] = SITE; headers['X-Title'] = 'SoulChat'; }

  try{
    const r = await fetch(UPSTREAM[provider], { method: 'POST', headers, body: JSON.stringify({ model: model || undefined, messages }) });
    const texto = await r.text();
    return comCota(new Response(texto, { status: r.status, headers: Object.assign({}, cors, { 'Content-Type': 'application/json' }) }));
  }catch(e){
    return j({ erro: 'provedor indisponível' }, 502);
  }
}
