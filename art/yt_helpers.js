(function(){
const sleep=ms=>new Promise(r=>setTimeout(r,ms)); const vis=e=>e&&e.getClientRects().length>0;
window.__sleep=sleep; window.__vis=vis;
window.__fetchR=async(u)=>{for(let i=0;i<8;i++){try{const r=await fetch(u); if(r.ok) return r;}catch(e){} await sleep(15000);} throw new Error('fetch failed '+u);};
window.__closePopups=async()=>{ for(const dl of [...document.querySelectorAll('tp-yt-paper-dialog, ytcp-dialog')].filter(e=>vis(e)&&/Проверка видео ещё продолжается/.test(e.innerText))){ dl.querySelector('#primary-action-button button, #primary-action-button')?.click(); await sleep(1200);} for(const b of [...document.querySelectorAll('button')].filter(b=>vis(b)&&/^(Закрыть|Не сейчас)$/.test(b.innerText.trim()))) { b.click(); await sleep(600);} };
window.__dlg=function(){ const b=[...document.querySelectorAll('#textbox[contenteditable], #done-button, #next-button')].find(vis); if(!b) return document.querySelector('ytcp-uploads-dialog'); let e=b; while(e&&e.parentElement&&!(e.querySelector('#next-button')&&e.querySelector('#done-button'))) e=e.parentElement; return e||document; };
window.__fill=async function(d,o){ d=document;
 let boxes=[]; for(let k=0;k<20;k++){ boxes=[...document.querySelectorAll('#textbox[contenteditable]')].filter(vis); if(boxes.length>=2) break; await sleep(1000);} if(boxes.length<2) return {err:'no textboxes'};
 async function setBox(el,txt){el.focus();const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);document.execCommand('insertText',false,txt);await sleep(400);}
 await setBox(boxes[0],o.title); await setBox(boxes[1],o.desc);
 if(o.thumb){const fl=d.querySelector('#file-loader'); if(fl){const t=new DataTransfer(); t.items.add(o.thumb); fl.files=t.files; fl.dispatchEvent(new Event('change',{bubbles:true})); await sleep(1500);}}
 d.querySelector('[name=VIDEO_MADE_FOR_KIDS_NOT_MFK]')?.click();
 d.querySelector('#toggle-button')?.click(); await sleep(2500);
 d.querySelector('[name=VIDEO_HAS_ALTERED_CONTENT_NO]')?.click(); d.querySelector('[name=VIDEO_PAID_PRODUCT_PLACEMENT_NO]')?.click();
 let ti; for(let k=0;k<8&&!(ti=d.querySelector('#tags-container input, ytcp-free-text-chip-bar input'));k++) await sleep(700);
 if(ti){ ti.focus(); ti.value=o.tags; ti.dispatchEvent(new Event('input',{bubbles:true})); await sleep(300); ti.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,bubbles:true})); await sleep(800);}
 async function pickIn(cont, optRe){ if(!cont) return 'no cont'; const trig=cont.querySelector('ytcp-dropdown-trigger')||cont.querySelector('[role=button]'); trig.click(); await sleep(1200);
  const op=[...document.querySelectorAll('tp-yt-paper-item, [role=option]')].find(e=>vis(e)&&optRe.test(e.innerText.trim())); if(!op){document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); await sleep(400); return 'no opt';} op.click(); await sleep(700); return op.innerText.trim();}
 const lang=await pickIn([...d.querySelectorAll('ytcp-form-language-input, #language-input, ytcp-form-select')].find(e=>/Язык видео/.test(e.innerText)), new RegExp(o.lang));
 const cat=await pickIn(d.querySelector('#category-container'), /^Развлечения$/);
 const title=boxes[0].innerText;
 for(let i=0;i<3;i++){d.querySelector('#next-button').click(); await sleep(2000);}
 return {title:title.slice(0,40), chips:d.querySelectorAll('ytcp-chip').length, lang, cat, link:d.innerText.match(/https:\/\/youtu\.be\/[\w-]+/)?.[0]};};
window.__upA=async function(o){
 const file=o.file || new File([await (await __fetchR(o.url)).blob()],o.fname,{type:'video/mp4'});
 let inp; for(let k=0;k<15&&!(inp=document.querySelector('ytcp-uploads-file-picker input[type=file]'));k++) await sleep(1000);
 if(!inp) return {err:'no file input'};
 const dt=new DataTransfer(); dt.items.add(file); inp.files=dt.files; inp.dispatchEvent(new Event('change',{bubbles:true}));
 for(let k=0;k<30;k++){ await sleep(1000); if(/Загрузка недоступна/.test(document.body.innerText)) return 'BLOCKED'; if([...document.querySelectorAll('#textbox[contenteditable]')].filter(vis).length>=2) break; }
 await sleep(1500); return await __fill(document,o);};
window.__sched=async function(dateStr,timeStr,go){ const d=__dlg();
 for(let k=0;k<3&&![...d.querySelectorAll('input')].some(i=>vis(i)&&/^\d\d:\d\d$/.test(i.value));k++){ (d.querySelector('#second-container-expand-button')||d.querySelector('#schedule-radio-button'))?.click(); await sleep(2500); }
 const dv=()=>[...document.querySelectorAll('input')].find(i=>vis(i)&&/\d{4}\sг/.test(i.value));
 const trig=d.querySelector('#datepicker-trigger'); const want=dateStr.split(' ').slice(0,2).join(' ');
 const norm=s=>s.replace(/\s+/g,' ').trim();
 if(!norm(trig.innerText).startsWith(want)){ if(!dv()){ trig.click(); for(let k=0;k<15&&!dv();k++) await sleep(400);} const di=dv(); if(!di) return {err:'no date input'};
  di.focus(); di.select(); document.execCommand('insertText',false,dateStr); di.dispatchEvent(new Event('change',{bubbles:true})); di.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,bubbles:true})); await sleep(1000);
  if(dv()) document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); await sleep(500); }
 const ti=[...d.querySelectorAll('input')].find(i=>vis(i)&&/^\d\d:\d\d$/.test(i.value)); if(!ti) return {err:'no time input'};
 if(ti.value!==timeStr){ ti.click(); ti.focus(); await sleep(900); const it=[...document.querySelectorAll('tp-yt-paper-item')].find(e=>vis(e)&&e.innerText.trim()===timeStr); if(!it) return {err:'no time item'}; it.scrollIntoView({block:'center'}); it.click(); await sleep(800); }
 const res={date:norm(trig.innerText), time:ti.value};
 if(!(go && res.date.startsWith(want) && res.time===timeStr)) return res;
 for(let k=0;k<20;k++){ const b=d.querySelector('#done-button'); if(b && !b.hasAttribute('disabled')){ b.click(); await sleep(3000); for(const dl of [...document.querySelectorAll('tp-yt-paper-dialog, ytcp-dialog')].filter(e=>vis(e)&&/Проверка видео ещё продолжается/.test(e.innerText))){ dl.querySelector('#primary-action-button button, #primary-action-button')?.click(); await sleep(2500);}
   const ok=[...document.querySelectorAll('tp-yt-paper-dialog, ytcp-dialog')].some(e=>vis(e)&&/Публикация видео запланирована|Обработка видео/.test(e.innerText)) || !vis(d) || !document.querySelector('#done-button') ; if(ok){ res.done=true; return res;} } await sleep(3000);} res.err='done not confirmed'; return res;};
window.__public=async function(){ const d=__dlg(); const pub=d.querySelector('tp-yt-paper-radio-button[name=PUBLIC]'); if(!vis(pub)){ (d.querySelector('#first-container-expand-button'))?.click(); await sleep(1500);} d.querySelector('tp-yt-paper-radio-button[name=PUBLIC]')?.click(); await sleep(800);
 for(let k=0;k<20;k++){ const b=d.querySelector('#done-button'); if(b&&!b.hasAttribute('disabled')){ b.click(); await sleep(3000); for(const dl of [...document.querySelectorAll('tp-yt-paper-dialog, ytcp-dialog')].filter(e=>vis(e)&&/Проверка видео ещё продолжается/.test(e.innerText))){ dl.querySelector('#primary-action-button button, #primary-action-button')?.click(); await sleep(2500);} return true;} await sleep(3000);} return false;};
// one item from a queue, after a fresh load of ...?d=ud
window.__doItem=async function(qurl,idx){ window.__item={idx,stage:'start'}; try{
 const q=await (await __fetchR(qurl)).json(); const o=q[idx]; if(!o){__item.stage='NOITEM'; return;}
 const a=await __upA(o); __item.a=a; if(a==='BLOCKED'){__item.stage='BLOCKED'; return;} if(a.err){__item.stage='ERR '+a.err; return;}
 let s; for(let r=0;r<3;r++){ await sleep(2500); s=await __sched(o.date,o.time,true); if(s.done) break; }
 __item.s=s; __item.stage=s.done?'SCHEDULED':'SCHEDFAIL';
 for(let k=0;k<100&&/Загружено: \d+ %/.test(document.body.innerText);k++) await sleep(3000);
 __item.stage+= ' +UPLOADED';
 }catch(e){__item.stage='EXC '+e;} };
window.__helpersLoaded=true;
})();
