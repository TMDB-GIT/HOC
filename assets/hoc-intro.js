/* ==========================================================================
   House of Clarence — intro reveal (prd.md §7)
   The wordmark draws on left-to-right over a deep-sage field, holds, then the
   overlay fades to reveal the site. Shows once per browser session; never under
   prefers-reduced-motion (gated by the .hoc-intro-active class, set in <head>).
   Click or Escape skips. A fail-safe always clears the overlay.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  if (!root.classList.contains('hoc-intro-active')) return;

  var overlay = document.getElementById('hoc-intro');
  if (!overlay) {
    root.classList.remove('hoc-intro-active');
    return;
  }

  var DRAW_DELAY = 120; // let the field paint before the wordmark draws on
  var HOLD = 750; // pause on the fully-drawn wordmark
  var FADE = 600; // matches the CSS opacity transition
  var done = false;

  function finish() {
    if (done) return;
    done = true;
    try { sessionStorage.setItem('hoc-intro-seen', '1'); } catch (e) {}
    root.classList.remove('hoc-intro-active');
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    document.removeEventListener('keydown', onKey);
  }

  function hide() {
    if (done || overlay.classList.contains('is-hiding')) return;
    overlay.classList.add('is-hiding');
    setTimeout(finish, FADE + 50); // fallback if transitionend never fires
  }

  function onKey(e) {
    if (e.key === 'Escape') hide();
  }

  overlay.addEventListener('transitionend', function (e) {
    if (e.propertyName === 'opacity') finish();
  });
  overlay.addEventListener('click', hide);
  document.addEventListener('keydown', onKey);

  // Draw the wordmark on, hold, then fade the overlay away.
  setTimeout(function () { overlay.classList.add('is-drawn'); }, DRAW_DELAY);
  setTimeout(hide, DRAW_DELAY + 950 + HOLD); // 950ms = CSS clip-path duration

  // Fail-safe: never trap the user behind the overlay.
  setTimeout(finish, 6000);
})();
