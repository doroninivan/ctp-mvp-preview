/* Pure attempt mechanics, shared by the browser and regression checks. */
(function(root){
'use strict';
function shuffle(values,rng=Math.random){const a=values.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function validOrder(a){return Array.isArray(a)&&a.length===4&&new Set(a).size===4&&a.every(n=>Number.isInteger(n)&&n>=0&&n<4);}
function examOrders(items,rng=Math.random){const slots=shuffle(items.map((_,i)=>i%4),rng);return items.map((q,i)=>{const a=shuffle([0,1,2,3].filter(n=>n!==q.key),rng);a.splice(slots[i],0,q.key);return a;});}
function choice(n){return n===null||(Number.isInteger(n)&&n>=0&&n<4);}
function confidence(v){return v===undefined||v===null||v==='sure'||v==='unsure';}
function withHistory(l,now=new Date().toISOString()){return [...(l.history||[]),{date:now,text:l.text,choice:l.choice,counterChoice:l.counterChoice,note:l.room?.reflection||'',confidence:l.confidence??null,counterConfidence:l.counterConfidence??null}];}
function historyValid(h){return h===undefined||(Array.isArray(h)&&h.every(x=>x&&typeof x.date==='string'&&Number.isFinite(Date.parse(x.date))&&typeof x.text==='string'&&choice(x.choice)&&choice(x.counterChoice)&&typeof x.note==='string'&&confidence(x.confidence)&&confidence(x.counterConfidence)));}
function validState(s,content){
 if(!s||s.version!==content.version||!['story','exam','journal'].includes(s.mode)||!Number.isInteger(s.lesson)||s.lesson<0||s.lesson>=content.lessons.length||!s.lessons||typeof s.lessons!=='object'||Array.isArray(s.lessons))return false;
 for(const [id,l] of Object.entries(s.lessons))if(!content.lessons.some(q=>q.lessonId===id)||!l||typeof l.text!=='string'||!Number.isInteger(l.stage)||l.stage<0||l.stage>3||!validOrder(l.order)||!validOrder(l.counterOrder)||!choice(l.choice)||!choice(l.counterChoice)||(l.stage>=2&&l.choice===null)||(l.stage>=3&&l.counterChoice===null)||typeof l.done!=='boolean'||!confidence(l.confidence)||!confidence(l.counterConfidence)||!historyValid(l.history))return false;
 const e=s.exam;if(e&&e.confidence!==undefined&&(!Array.isArray(e.confidence)||e.confidence.length!==content.exam.length||!e.confidence.every(confidence)))return false;if(e){if(!Array.isArray(e.answers)||e.answers.length!==content.exam.length||!e.answers.every(choice)||!Array.isArray(e.flags)||e.flags.length!==content.exam.length||!e.flags.every(x=>typeof x==='boolean')||!Array.isArray(e.orders)||e.orders.length!==content.exam.length||!e.orders.every(validOrder)||!Number.isInteger(e.index)||e.index<0||e.index>=content.exam.length||!Number.isFinite(e.start)||!Number.isFinite(e.deadline)||e.deadline<e.start||typeof e.finished!=='boolean'||(e.finished&&!Number.isFinite(e.finishedAt)))return false;}
 return true;
}
const api={withHistory,confidence,shuffle,validOrder,examOrders,validState};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.AttemptCore=api;
})(typeof window!=='undefined'?window:globalThis);
