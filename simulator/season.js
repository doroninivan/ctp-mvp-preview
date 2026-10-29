'use strict';
window.SeriesStory=(()=>{
 let catalog=location.hash==='#season';
 const data=window.CASE_SEASON;
 const available=()=>data?.bankVersion===CONTENT.version;
 function openCatalog(){catalog=true;history.replaceState(null,'',location.pathname+location.search+'#season');}
 const photo=(q,esc,cls='')=>CasePortraits.image(q,esc,cls);
 function read(s){const old=s.serial?.edition===data.edition?s.serial:{};return s.serial={edition:data.edition,seen:typeof old.seen==='boolean'?old.seen:s.stage>0||!!s.text,beat:Number.isInteger(old.beat)&&old.beat>=0&&old.beat<=2?old.beat:0};}
 function focus(screen){const el=screen.querySelector('.serial-cold h1,.serial-catalog h1');if(el){el.tabIndex=-1;el.focus({preventScroll:true});el.scrollIntoView({block:'center',behavior:'instant'});}}
 function recap(ctx){const {q,state,esc}=ctx;const index=CONTENT.lessons.indexOf(q);const previous=CONTENT.lessons.slice(0,index).filter(l=>state.lessons[l.lessonId]?.done);if(!previous.length)return '';
  return `<details class="serial-recap"><summary>Ранее в ваших решениях <span>${previous.length}</span></summary><p class="serial-fine">Только пройденные основные ситуации. Новое задание имеет собственные условия.</p>${previous.slice(-3).map(l=>{const a=state.lessons[l.lessonId];return `<article><span>Серия ${l.episode} · ${esc(l.who)}</span><p><b>Вы выбрали:</b> ${esc(l.options[a.choice])}</p><blockquote>${esc(l.reaction[a.choice])}</blockquote></article>`;}).join('')}</details>`;
 }
 function before(ctx){
  if(!available())return false;
  const {q,s,screen,esc,save,render,episode,state}=ctx;
  if(catalog){showCatalog(ctx);return true;}
  const serial=read(s),script=data.episodes[q.lessonId];if(!script||serial.seen)return false;
  const b=serial.beat<2?script.beats[serial.beat]:null,actor=b?CONTENT.lessons.find(l=>l.lessonId===b.shot):q;
  screen.innerHTML=`<section class="serial-cold" data-serial-beat="${serial.beat}" aria-label="Вступление к серии ${q.episode}"><div class="serial-cold-image">${photo(actor,esc)}<div class="serial-image-grain" aria-hidden="true"></div><span class="serial-location">${esc((b?.location||script.place).slice(0,1)+(b?.location||script.place).slice(1).toLocaleLowerCase('ru'))}</span></div><div class="serial-cold-copy"><div class="serial-topline"><button class="textbtn" id="serialCatalog">← К сезону</button></div><div class="serial-wordmark">${esc(data.title)}</div><h1>${esc(q.title)}</h1>${b?`<p class="serial-stage-direction">${esc(b.action)}</p><div class="serial-dialogue"><span>${esc(b.speaker)}</span><blockquote>${esc(b.line)}</blockquote></div>`:`<p class="serial-stage-direction">${esc(q.who)} обращается к вам</p><div class="serial-dialogue scene"><span>${esc(q.who)} · ${esc(q.role)}</span><blockquote>${esc(q.line)}</blockquote></div><div id="sceneVoice" class="serial-voice"></div>`}<div class="serial-cold-bottom"><div class="serial-beats" aria-label="Фрагмент ${serial.beat+1} из 3">${[0,1,2].map(n=>`<i class="${n<=serial.beat?'on':''}"></i>`).join('')}<span>${serial.beat+1} / 3</span></div><div class="serial-cold-actions">${serial.beat>0?'<button class="textbtn" id="serialPrevious">Назад</button>':''}<button class="btn" id="serialNext">${serial.beat===2?'Перейти к решению':'Смотреть дальше'} <span aria-hidden="true">→</span></button></div><button class="textbtn serial-skip" id="serialSkip">Пропустить вступление</button></div><p class="serial-fine">${serial.beat===2?'Реплика из учебного задания · озвучка ElevenLabs':'Постановочная сцена · художественный текст'}</p></div></section>`;
  const finish=()=>{serial.seen=true;s.room={...s.room,edition:1,entered:true};save();render();const h=screen.querySelector('h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true});h.scrollIntoView({block:'start',behavior:'instant'});}};
  document.getElementById('serialNext').onclick=()=>{if(serial.beat===2)return finish();serial.beat++;save();render();focus(screen);};
  document.getElementById('serialSkip').onclick=finish;
  const back=document.getElementById('serialPrevious');if(back)back.onclick=()=>{serial.beat--;save();render();focus(screen);};
  document.getElementById('serialCatalog').onclick=()=>{openCatalog();render();focus(screen);};
  return true;
 }
 function showCatalog(ctx){if(window.CaseHybrid){CaseHybrid.cover(ctx);return;}const {screen,state,esc,episode,render}=ctx;const done=CONTENT.lessons.filter(q=>state.lessons[q.lessonId]?.done).length;const next=CONTENT.lessons.findIndex(q=>!state.lessons[q.lessonId]?.done);const target=next<0?0:next;
  screen.innerHTML=`<section class="serial-catalog"><div class="serial-season-cover">${photo(CONTENT.lessons[7],esc)}<div class="serial-season-cover-copy"><span class="serial-label">СЕЗОН 01 · NORTHLINE MEDIA</span><h1>${esc(data.title)}</h1><p>${esc(data.logline)}</p><button class="btn" id="serialResume">${done===8?'Вернуться к первой серии':done?'Продолжить сезон':'Начать смотреть'} <span aria-hidden="true">→</span></button><span class="serial-season-progress">${done} из 8 серий пройдено</span></div></div><div class="serial-season-premise"><p>${esc(data.premise)}</p><p class="serial-fine">${esc(data.boundary)}<br>Свободный ответ → выбор → разбор → другая ситуация. Учебные ключи ждут проверки PMP-экспертами.</p></div><div class="serial-episodes">${CONTENT.lessons.map((q,i)=>{const e=data.episodes[q.lessonId],a=state.lessons[q.lessonId];return `<button class="serial-episode-card" data-season-episode="${i}" aria-label="Серия ${q.episode}: ${esc(q.title)}"><div class="serial-card-image">${photo(q,esc)}<span>${String(q.episode).padStart(2,'0')}</span>${a?.done?'<b>Пройдено</b>':''}</div><div class="serial-card-copy"><small>${esc(q.who)} · ${esc(q.role)}</small><h2>${esc(q.title)}</h2><p>${esc(e.hook)}</p><span>Открыть серию <i aria-hidden="true">↗</i></span></div></button>`;}).join('')}</div></section>`;
  document.getElementById('serialResume').onclick=()=>{catalog=false;episode(target);};screen.querySelectorAll('[data-season-episode]').forEach(b=>b.onclick=()=>{catalog=false;episode(Number(b.dataset.seasonEpisode));});
 }
 function decorate(ctx){if(!available()||catalog||ctx.screen.querySelector('.serial-cold'))return;const {q,s,screen,esc,save,render,state}=ctx;const script=data.episodes[q.lessonId];if(!script)return;
  const toolbar=document.createElement('div');toolbar.className='serial-toolbar';toolbar.innerHTML=`<button class="textbtn" id="backToSeason">Сезон «До пятницы»</button><button class="textbtn" id="replaySerial">Пересмотреть вступление</button>`;screen.prepend(toolbar);
  document.getElementById('backToSeason').onclick=()=>{openCatalog();render();focus(screen);};document.getElementById('replaySerial').onclick=()=>{const r=read(s);r.seen=false;r.beat=0;save();render();focus(screen);};
  if(s.stage===0){const r=recap(ctx);if(r){const box=document.createElement('div');box.innerHTML=r;toolbar.after(box.firstElementChild);}}
  if(s.stage===3){const next=CONTENT.lessons[CONTENT.lessons.indexOf(q)+1];const coda=document.createElement('section');coda.className='serial-coda';coda.innerHTML=`<div class="serial-coda-number" aria-hidden="true">${String(q.episode).padStart(2,'0')}</div><div class="serial-coda-copy"><span class="serial-label">После серии · постановочная сцена</span><p class="serial-coda-text">${esc(script.outro)}</p>${next?`<div class="serial-next-shot">${photo(next,esc)}<div><span>В следующей серии · ${esc(next.who)}</span><h3>${esc(script.nextHook)}</h3><p>«${esc(next.line)}»</p></div></div>`:`<h3>${CONTENT.lessons.every(l=>state.lessons[l.lessonId]?.done)?'Сезон завершён':'Финальная серия завершена'}</h3><p class="serial-fine">Вы разобрали последнюю серию. В дневнике сохранены завершённые кейсы. Результат этой практики не определяет готовность ко всему экзамену.</p><button class="btn secondary" id="serialOpenJournal">Открыть мои решения</button>`}</div>`;
   const anchor=screen.querySelector('.room-outro,.workspace .actions');if(anchor)anchor.before(coda);else screen.append(coda);
   const j=document.getElementById('serialOpenJournal');if(j)j.onclick=()=>ctx.go('journal');
   const n=document.getElementById('nextEpisode');if(n)n.innerHTML='Смотреть следующую серию <span aria-hidden="true">→</span>';
  }
 }
 return {before,decorate,openCatalog,closeCatalog(){catalog=false;}};
})();
