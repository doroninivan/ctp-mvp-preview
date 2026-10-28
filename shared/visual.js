'use strict';
// Decoration only. No input capture, network calls or storage.
(() => {
 const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
 if ('IntersectionObserver' in window && !reduce.matches) {
  const observer = new IntersectionObserver(entries => {
   for (const entry of entries) if (entry.isIntersecting) {
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
   }
  }, {threshold: .12});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
 }
 document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
   if (event.target !== dialog) return;
   const r = dialog.getBoundingClientRect();
   if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
 });
})();
