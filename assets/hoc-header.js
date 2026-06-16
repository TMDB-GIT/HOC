/* ==========================================================================
   House of Clarence — header behaviour
   - Adds a subtle shadow/border once the page is scrolled.
   - Opens/closes the mobile menu drawer with focus trapping and Esc-to-close
     (accessibility, prd.md §10).
   Vanilla JS, no dependencies.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- Sticky header shading + transparent-overlay solidify ----------- */
  var header = document.querySelector('[data-hoc-header]');
  if (header) {
    var isOverlay = header.hasAttribute('data-hoc-overlay');

    // Liquid turns the overlay on for the homepage, but it can't see what's
    // actually beneath the header (the header group renders before <main>).
    // Only stay transparent when a hero banner — which carries its own top
    // scrim for contrast — genuinely leads the page. If a merchant reorders
    // the homepage so a light section is first, drop the overlay so the header
    // never renders white-on-light and invisible.
    if (isOverlay) {
      var main = document.getElementById('MainContent');
      var firstSection = main && main.firstElementChild;
      var leadsWithHero = firstSection && firstSection.querySelector('.hoc-hero-banner');
      if (!leadsWithHero) {
        isOverlay = false;
        header.classList.remove('hoc-header--overlay');
      }
    }

    var onScroll = function () {
      var scrolled = window.scrollY > 8;
      header.classList.toggle('is-scrolled', scrolled);
      if (isOverlay) {
        // Transparent only at the very top; go solid the moment the user scrolls.
        header.classList.toggle('is-solid', scrolled);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /* ---- Mobile drawer --------------------------------------------------- */
  var drawer = document.querySelector('[data-hoc-drawer]');
  if (!drawer) return;

  var openBtn = document.querySelector('[data-hoc-menu-open]');
  var closers = drawer.querySelectorAll('[data-hoc-menu-close]');
  var panel = drawer.querySelector('.hoc-drawer__panel');
  var lastFocused = null;

  function focusable() {
    return panel.querySelectorAll(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
    );
  }

  function openDrawer() {
    lastFocused = document.activeElement;
    drawer.classList.add('is-open');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var f = focusable();
    if (f.length) f[0].focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      closeDrawer();
      return;
    }
    if (e.key !== 'Tab') return;
    // Trap focus inside the panel.
    var f = focusable();
    if (!f.length) return;
    var first = f[0];
    var last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  closers.forEach(function (el) {
    el.addEventListener('click', closeDrawer);
  });
})();
