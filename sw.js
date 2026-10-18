const C='att-v2';
const PRE=['./','./index.html','https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>Promise.all(PRE.map(u=>c.add(u).catch(()=>{})))))});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
// يرجّع النسخة المحفوظة فورًا (شغّال بدون نت) ويحدّثها في الخلفية لو فيه نت
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(hit=>{
    const net=fetch(e.request).then(res=>{
      if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp))}
      return res}).catch(()=>hit);
    return hit||net}))});
