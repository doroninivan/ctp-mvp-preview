'use strict';
(() => {
 // Expected text comes from the versioned content bank, independently of the audio manifest.
 const lesson=typeof CONTENT==='undefined'?null:CONTENT.lessons.find(q=>q.lessonId==='BE3');
 const transcript=document.querySelector('.frame-caption blockquote');
 if(lesson){
  if(transcript)transcript.textContent='«'+lesson.line+'»';
  window.CaseVoice?.mount(document.getElementById('heroVoice'),{id:lesson.lessonId,ru:lesson.line,en:lesson.enLine,version:CONTENT.version,transcript});
 }
 document.querySelectorAll('[data-open-demo]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();const demo=document.getElementById('try-scene');demo.open=true;
  const field=document.getElementById('firstmove');(field||demo).scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});field?.focus({preventScroll:true});
 }));
 const previews=[['Нора · владелец продукта','../media/nora-2026-10-29.webp','73% center'],['Марк · ИТ-директор','../media/cast/s4.webp','35% center'],['Лена · управление данными','../media/cast/s1.webp','73% center'],['Майя · продуктовый аналитик','../media/maya-analyst.webp','center'],['Марк · ИТ-директор','../media/be5-risk-response.webp','35% center'],['Сергей · технический лидер','../media/be6-improvement.webp','36% center'],['Амир · руководитель внедрения','../media/amir-editor.webp','center'],['Ричард · генеральный директор','../media/cast/s5.webp','72% center']];
 const image=document.getElementById('chapterImage'),caption=document.getElementById('chapterCaption');
 document.querySelectorAll('.chapter-row a').forEach((a,i)=>{const show=()=>{const [who,src,pos]=previews[i];image.src=src;image.style.objectPosition=pos;image.alt=who;caption.textContent=String(i+1).padStart(2,'0')+' / '+who;};a.addEventListener('pointerenter',show);a.addEventListener('focus',show);});
 let pending=false;const nav=document.querySelector('.landing-nav');
 addEventListener('scroll',()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{const height=document.documentElement.scrollHeight-innerHeight;nav.style.setProperty('--page-progress',(height>0?scrollY/height*100:0)+'%');pending=false;});},{passive:true});
})();
