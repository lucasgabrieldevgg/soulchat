/* SoulChat — atualização sem esperas: o HTML vem SEMPRE da rede
   (o cache só entra quando o usuário está offline). Acabou o
   "deploy não chega no user por causa do cache de 10 min". */
const CACHE='soulchat-v1';
self.addEventListener('install',()=>{ self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.pathname.endsWith('sw.js')) return;
  const ehPagina=e.request.mode==='navigate'||/\/(index\.html)?$/.test(u.pathname);
  if(!ehPagina) return;
  e.respondWith(
    fetch(e.request).then(r=>{
      const cp=r.clone();
      caches.open(CACHE).then(c=>c.put(e.request,cp));
      return r;
    }).catch(()=>caches.match(e.request))
  );
});
