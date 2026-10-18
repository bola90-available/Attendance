// =====================================================================
// sw.js : Service Worker، هو اللي بيخلّي الموقع يشتغل بدون نت.
// بيحفظ نسخة من index.html ومن dates.json ومكتبة ExcelJS في ذاكرة المتصفح،
// وبعدها بيجاوب منها فورًا.
// لازم يترفع في نفس فولدر index.html.
// لو عايز تجبر كل الموبايلات تنسى النسخ القديمة، غيّر رقم الإصدار في C (att-v2 ← att-v3).
// =====================================================================
const C='att-v2';
// الملفات اللي بتتحفظ أول ما الموقع يتفتح بنت. لو أضفت ملف تاني للموقع حطه هنا.
const PRE=['./','./index.html','https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js'];
// أول تثبيت: بيحمّل الملفات اللي في PRE ويحفظها (وأي ملف فشل بيتخطاه).
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
