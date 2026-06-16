/* ==========================================================================
   House of Clarence — intro reveal (prd.md §7)
   The wordmark draws on left-to-right over a deep-sage field, holds, then the
   overlay fades to reveal the site. Shows once per browser session; never under
   prefers-reduced-motion (gated by the .hoc-intro-active class, set in <head>).
   Click or Escape skips. Scroll-lock release / overlay removal also has an
   inline head-level fail-safe (window.__hocIntroDone) in case this file never
   runs — see layout/theme.liquid.
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

  var logo = document.getElementById('hoc-intro__logo');
  var DRAW_DELAY = 120; // let the field paint before the wordmark draws on
  var HOLD = 750; // pause on the fully-drawn wordmark
  var FADE = 600; // matches the CSS opacity transition

  // Read the draw-on duration from the CSS so the two never drift apart
  // (CSS: `transition: clip-path 0.95s` on #hoc-intro__logo).
  var DRAW = 950;
  try {
    var cssDur = parseFloat(getComputedStyle(logo).transitionDuration);
    if (cssDur > 0) DRAW = cssDur * 1000;
  } catch (e) {}

  var done = false;

  // Make the page behind the overlay inert during the intro: a keyboard user
  // pressing Tab can't move focus into content that's hidden behind the sage
  // screen (CLAUDE.md quality floor: focus trapping + visible focus on modals).
  var inerted = [];
  Array.prototype.forEach.call(document.body.children, function (el) {
    if (el !== overlay && !el.hasAttribute('inert')) {
      el.setAttribute('inert', '');
      el.setAttribute('data-hoc-inert', ''); // lets the head fail-safe undo this too
      inerted.push(el);
    }
  });

  function finish() {
    if (done) return;
    done = true;
    inerted.forEach(function (el) {
      el.removeAttribute('inert');
      el.removeAttribute('data-hoc-inert');
    });
    document.removeEventListener('keydown', onKey);
    // Reuse the head-level cleanup as the single source of truth for
    // sessionStorage + class + node removal (idempotent).
    if (typeof window.__hocIntroDone === 'function') {
      window.__hocIntroDone();
    } else {
      try { sessionStorage.setItem('hoc-intro-seen', '1'); } catch (e) {}
      root.classList.remove('hoc-intro-active');
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }
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
  setTimeout(hide, DRAW_DELAY + DRAW + HOLD);
})();
