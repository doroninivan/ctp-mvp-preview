'use strict';
// Pre-generated ElevenLabs clips. No runtime API credentials or learner data leave the browser.
(() => {
 const data=window.CASE_VOICES;
 const base=new URL('../media/voices-v2/',document.currentScript.src);
 const players=new Set();
 const fmt=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const playIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z" fill="currentColor"/></svg>';
 const pauseIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zm7 0h4v14h-4z" fill="currentColor"/></svg>';
 function mount(host,{id,ru,en,transcript,version,quotes=true}){
  if(!host||!data||(version&&data.version!==version))return;
  const clips={ru:data.clips[id.toLowerCase()+'-ru'],en:data.clips[id.toLowerCase()+'-en']};
  if(clips.ru?.text!==ru||clips.en?.text!==en)return;
  let lang='ru',clip=clips.ru,frame=0,disposed=false;
  const audio=document.createElement('audio'); audio.preload='metadata';
  host.className+=' voice-player';
  host.innerHTML=`<div class="voice-label"><span>Голосовое сообщение</span><div class="voice-languages" aria-label="Язык озвучки"><button type="button" data-lang="ru" aria-pressed="true" aria-label="Озвучка на русском">RU</button><button type="button" data-lang="en" aria-pressed="false" aria-label="Озвучка на английском">EN</button></div></div><div class="voice-controls"><button type="button" class="voice-play" aria-label="Послушать сообщение">${playIcon}</button><div class="voice-track"><svg class="voice-wave" viewBox="0 0 256 36" preserveAspectRatio="none" aria-hidden="true"></svg><input class="voice-seek" type="range" min="0" max="1000" value="0" step="1" aria-label="Позиция в записи"></div><span class="voice-time" aria-hidden="true"></span></div><span class="voice-status" role="status"></span><span class="voice-credit">Синтез голоса · ElevenLabs</span>`;
  host.append(audio);
  const button=host.querySelector('.voice-play'),seek=host.querySelector('.voice-seek'),time=host.querySelector('.voice-time'),wave=host.querySelector('.voice-wave'),status=host.querySelector('.voice-status');
  function paint(){
   const t=audio.currentTime||0,ratio=Math.min(1,t/clip.duration);
   time.textContent=fmt(t)+' / '+fmt(clip.duration);
   seek.value=Math.round(ratio*1000);seek.setAttribute('aria-valuetext',`${fmt(t)} из ${fmt(clip.duration)}`);
   [...wave.children].forEach((bar,i)=>bar.classList.toggle('played',i/64<ratio));
   if(transcript)transcript.querySelectorAll('[data-word]').forEach((word,i)=>{const w=clip.words[i];if(!w){word.classList.remove('word-active','word-spoken');return;}word.classList.toggle('word-active',!audio.paused&&t>=w.start&&t<w.end);word.classList.toggle('word-spoken',t>=w.end&&t>0);});
  }
  function tick(){paint();if(!audio.paused&&!disposed)frame=requestAnimationFrame(tick);}
  function pause(){audio.pause();cancelAnimationFrame(frame);paint();}
  function load(){
   pause();audio.src=new URL(clip.file,base).href;button.innerHTML=playIcon;button.setAttribute('aria-label','Послушать сообщение');host.classList.remove('is-playing');
   wave.innerHTML=clip.peaks.map((p,i)=>`<rect x="${i*4}" y="${18-Math.max(3,p*32)/2}" width="2" height="${Math.max(3,p*32)}" rx="1"/>`).join('');
   if(transcript){transcript.lang=lang;transcript.setAttribute('aria-label',clip.text);transcript.innerHTML='<span aria-hidden="true">'+(quotes?'«':'')+clip.words.map((w,i)=>`<span data-word="${i}">${esc(w.text)}</span>`).join('')+(quotes?'»':'')+'</span>';}
   host.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));
   status.textContent='';paint();
  }
  async function play(){
   if(!audio.paused){pause();return;}
   players.forEach(p=>{if(p!==handle)p.pause();});
   if(audio.ended)audio.currentTime=0;
   status.textContent='';button.disabled=true;
   try{await audio.play();}catch(e){if(!disposed&&e.name!=='AbortError')status.textContent='Не удалось включить запись. Текст сообщения доступен выше.';}
   finally{button.disabled=false;}
  }
  const handle={pause,destroy(){disposed=true;pause();audio.removeAttribute('src');audio.load();players.delete(handle);}};
  players.add(handle);button.onclick=play;
  audio.onplay=()=>{host.classList.add('is-playing');button.innerHTML=pauseIcon;button.setAttribute('aria-label','Пауза');cancelAnimationFrame(frame);tick();};
  audio.onpause=audio.onended=()=>{host.classList.remove('is-playing');button.innerHTML=playIcon;button.setAttribute('aria-label',audio.ended?'Послушать ещё раз':'Послушать сообщение');cancelAnimationFrame(frame);paint();};
  audio.ontimeupdate=paint;
  audio.onerror=()=>{if(!disposed)status.textContent='Запись недоступна. Прочитайте сообщение выше.';};
  seek.oninput=()=>{if(audio.readyState>0){audio.currentTime=Number(seek.value)/1000*clip.duration;paint();}};
  host.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{if(lang===b.dataset.lang)return;lang=b.dataset.lang;clip=clips[lang];load();});
  load();return handle;
 }
 window.CaseVoice={mount,stopAll(){players.forEach(p=>p.pause());},destroyAll(){[...players].forEach(p=>p.destroy());}};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)window.CaseVoice.stopAll();});
 window.addEventListener('pagehide',()=>window.CaseVoice.stopAll());
})();
