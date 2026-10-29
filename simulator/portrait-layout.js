/* UI-only crop points, measured against the existing source images. */
'use strict';
window.CasePortraits=(()=>{
 const layouts={
  BE3:{focus:'73% 25%',origin:'73% 25%',width:'100%',src:'../media/nora-2026-10-29.webp'},
  BE1:{focus:'23% 24%',choiceFocus:'19.5% 24%',origin:'23% 24%',width:'48%',src:'../media/cast/s4.webp'},
  BE2:{focus:'74% 24%',origin:'74% 24%',width:'100%',src:'../media/cast/s1.webp'},
  BE4:{focus:'50% 25%',origin:'50% 25%',width:'55%'},
  BE5:{focus:'35% 25%',origin:'35% 25%',width:'55%'},
  BE6:{focus:'44% 25%',origin:'44% 25%',width:'55%'},
  BE7:{focus:'58% 26%',origin:'58% 26%',width:'55%'},
  BE8:{focus:'72% 24%',origin:'72% 24%',width:'100%',src:'../media/cast/s5.webp'}
 };
 function image(q,esc,cls=''){const a=layouts[q.lessonId];return `<img class="${cls}" data-portrait="${esc(q.lessonId)}" src="${esc(a.src||q.img)}" alt="${esc(q.who)}" style="--portrait-focus:${a.focus};--portrait-origin:${a.origin};--choice-focus:${a.choiceFocus||a.focus};--poster-width:${a.width};object-position:${a.focus}">`;}
 return {layouts,image};
})();
