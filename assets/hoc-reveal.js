/* ==========================================================================
   House of Clarence — scroll reveal (prd.md §7)
   Gentle fade-up on section entry, runs once. Only active when the <html> has
   the `hoc-anim` class (set in the head only when motion is allowed). A
   fail-safe reveals everything after load so content can never stay hidden.
   ========================================================================== */
(function () {
  'use strict';
  if (!document.documentElement.classList.contains('hoc-anim')) return;

  var els = document.querySelectorAll('.hoc-section');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  );

  els.forEach(function (el) { io.observe(el); });

  // Fail-safe: never leave a section hidden.
  window.addEventListener('load', function () {
    setTimeout(function () {
      els.forEach(function (el) { el.classList.add('is-in'); });
    }, 2000);
  });
})();
