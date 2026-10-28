'use strict';
// Four learning steps; every assessed field comes from the same BE3 item as the lesson.
(() => {
 const flow=document.getElementById('flow');
 const q=typeof CONTENT==='undefined'?null:CONTENT.lessons.find(item=>item.lessonId==='BE3');
 if(!q||typeof AttemptCore==='undefined'){
  flow.textContent='Не удалось загрузить ситуацию. Откройте модуль по кнопке «Начать первый кейс».';
  return;
 }
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const next=CONTENT.lessons[CONTENT.lessons.indexOf(q)+1];
 let stage=0,first='',pick=null,counter=null;
 let order=AttemptCore.shuffle([0,1,2,3]),counterOrder=AttemptCore.shuffle([0,1,2,3]);
 const aside=document.querySelector('.sceneaside');
 aside.innerHTML=`<img src="${esc(q.img)}" alt="${esc(q.who)}" style="object-position:${esc(q.pos)}"><h3>${esc(q.title)}</h3><p>${esc(q.who)} · ${esc(q.role)}</p><p>«${esc(q.line)}»</p>`;
 function options(item,sequence,attr){return sequence.map((i,p)=>`<button type="button" class="choice" ${attr}="${i}"><span class="letter">${'ABCD'[p]}</span><span>${esc(item.options[i])}</span></button>`).join('');}
 function review(item,index,sequence){
  return `<h3>${index===item.key?'Ваш выбор совпал с авторским разбором':'Разберём ваш выбор'}</h3>
   ${item.reaction[index]!==item.why[index]?`<div class="reply"><span class="name">Реакция на выбранный вариант</span><p>${esc(item.reaction[index])}</p></div>`:''}
   <p><strong>Ваш вариант:</strong> <span data-source="selected-option">${esc(item.options[index])}</span></p><p data-source="selected-why">${esc(item.why[index])}</p>
   ${index!==item.key?`<p><strong>Ответ в авторском разборе:</strong> <span data-source="key-option">${esc(item.options[item.key])}</span></p><p data-source="key-why">${esc(item.why[item.key])}</p>`:''}
   <p class="fact"><b>Решающий факт</b><span data-source="fact">${esc(item.fact)}</span></p>
   <details class="demo-all-options"><summary>Разбор всех вариантов</summary>${sequence.map((i,p)=>`<p><strong>${'ABCD'[p]}. ${esc(item.options[i])}</strong><br>${esc(item.why[i])}</p>`).join('')}</details>
   <p class="quote" data-source="rule">${esc(item.rule)}</p><p class="hint" data-source="boundary">${esc(item.boundary)}</p>`;
 }
 function focus(){const h=flow.querySelector('h3');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}flow.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
 function advance(n){stage=n;render();focus();}
 function render(){
  flow.dataset.step=String(stage+1);
  document.querySelectorAll('.steps i').forEach((e,i)=>e.classList.toggle('on',i<=stage));
  document.querySelector('.steps').setAttribute('aria-label',`Шаг ${stage+1} из 4`);
  if(stage===0){
   flow.innerHTML=`<div class="eyebrow">01 / Ваше решение</div><h3>Как бы вы поступили?</h3><p class="quote">«${esc(q.line)}»</p><p data-source="stem">${esc(q.stem)}</p><label for="firstmove">Что вы сделаете первым и почему?</label><textarea id="firstmove" maxlength="700" placeholder="Сначала я… потому что…"></textarea><p class="hint">1–3 предложения. Ответ остаётся в этой вкладке. Варианты появятся после вашего хода.</p><button class="btn" id="commit" disabled>Сохранить мой ответ →</button>`;
   const field=document.getElementById('firstmove'),button=document.getElementById('commit');field.value=first;button.disabled=first.trim().length<10;
   field.oninput=()=>{first=field.value;button.disabled=first.trim().length<10;};
   button.onclick=()=>{if(first.trim().length<10)return;first=first.trim();advance(1);};
  }else if(stage===1){
   flow.innerHTML=`<div class="eyebrow">02 / Выбор ответа</div><h3>Выберите первый шаг</h3><p data-source="stem">${esc(q.stem)}</p>${options(q,order,'data-demo-choice')}<p class="hint">Ваш первый ответ сохранён до закрытия вкладки.</p>`;
   flow.querySelectorAll('[data-demo-choice]').forEach(b=>b.onclick=()=>{pick=Number(b.dataset.demoChoice);advance(2);});
  }else if(stage===2){
   flow.innerHTML=`<div class="eyebrow">03 / Разбор решения</div>${review(q,pick,order)}<details><summary>Сравнить с моим первым ответом</summary><p class="useranswer">${esc(first)}</p><p>Сравните свой ответ с разбором. Приложение не оценивает свободный текст.</p></details><button class="btn" id="openCounter">Перейти к другой ситуации →</button>`;
   document.getElementById('openCounter').onclick=()=>advance(3);
  }else{
   const c=q.counter;
   flow.innerHTML=`<div class="eyebrow">04 / Другие условия</div><h3>Что вы сделаете в другой ситуации?</h3><p data-source="counter-stem">${esc(c.stem)}</p>${counter===null?options(c,counterOrder,'data-demo-counter'):`<div class="demo-counter-review">${review(c,counter,counterOrder)}</div>
    ${next?`<div class="signal"><img src="${esc(next.img)}" alt="${esc(next.who)}" style="object-position:${esc(next.pos)}"><div><small>Следующая серия · ${esc(next.who)}</small><p>${esc(next.title)}</p></div></div><a class="btn" href="../simulator/#lesson=${encodeURIComponent(next.lessonId)}">Перейти к следующей серии →</a>`:''}<button class="btn secondary" id="restart">Пройти сцену заново</button>`}`;
   flow.querySelectorAll('[data-demo-counter]').forEach(b=>b.onclick=()=>{counter=Number(b.dataset.demoCounter);render();const h=flow.querySelector('.demo-counter-review h3');h.tabIndex=-1;h.focus({preventScroll:true});h.scrollIntoView({block:'nearest'});});
   const restart=document.getElementById('restart');if(restart)restart.onclick=()=>{first='';pick=null;counter=null;order=AttemptCore.shuffle([0,1,2,3]);counterOrder=AttemptCore.shuffle([0,1,2,3]);advance(0);};
  }
 }
 render();
})();
