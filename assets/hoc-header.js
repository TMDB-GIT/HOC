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

  /* ---- Desktop nav dropdowns (e.g. Catalog → its rooms) ---------------
     CSS drives the reveal on hover and on keyboard focus (:focus-within); this
     only keeps aria-expanded honest, lets touch/no-hover devices tap the parent
     to open instead of navigating, and closes on Esc or an outside click. */
  var dropdowns = document.querySelectorAll('[data-hoc-dropdown]');

  dropdowns.forEach(function (item) {
    var toggle = item.querySelector('[data-hoc-dropdown-toggle]');
    if (!toggle) return;

    var setExpanded = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    var close = function () {
      item.classList.remove('is-open');
      setExpanded(false);
    };

    item.addEventListener('mouseenter', function () {
      setExpanded(true);
    });
    item.addEventListener('mouseleave', function () {
      item.classList.remove('is-open');
      if (!item.contains(document.activeElement)) setExpanded(false);
    });
    item.addEventListener('focusin', function () {
      setExpanded(true);
    });
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) close();
    });

    // First tap on a touch/pen pointer opens the panel rather than following the
    // parent link (there's no hover on that gesture to reveal it). Gate on the
    // actual pointer type, not (hover: none) — hybrid devices (iPad + pointer,
    // Windows touchscreens) report hover capability yet still get tapped. A mouse
    // click reports 'mouse' and falls through to navigate; a keyboard Enter fires
    // click with no preceding pointerdown ('') and also falls through.
    var pointerType = '';
    toggle.addEventListener('pointerdown', function (e) {
      pointerType = e.pointerType;
    });
    toggle.addEventListener('click', function (e) {
      if ((pointerType === 'touch' || pointerType === 'pen') && !item.classList.contains('is-open')) {
        e.preventDefault();
        item.classList.add('is-open');
        setExpanded(true);
      }
      pointerType = '';
    });

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        close();
        toggle.focus();
      }
    });
  });

  if (dropdowns.length) {
    document.addEventListener('click', function (e) {
      dropdowns.forEach(function (item) {
        if (item.classList.contains('is-open') && !item.contains(e.target)) {
          item.classList.remove('is-open');
          var t = item.querySelector('[data-hoc-dropdown-toggle]');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ---- Mobile drawer --------------------------------------------------- */
  var drawer = document.querySelector('[data-hoc-drawer]');
  if (!drawer) return;

  var openBtn = document.querySelector('[data-hoc-menu-open]');
  var closers = drawer.querySelectorAll('[data-hoc-menu-close]');
  var panel = drawer.querySelector('.hoc-drawer__panel');
  var lastFocused = null;

  function focusable() {
    // Include <summary> (the accordion toggles are real tab stops) and drop any
    // element that isn't currently visible — chiefly the sublinks inside a
    // collapsed <details>, which are in the DOM but not in the tab order. Keeping
    // them would make first/last detection disagree with the browser and let Tab
    // escape the open drawer. offsetParent is null for hidden (display:none
    // ancestor) elements.
    var nodes = panel.querySelectorAll(
      'a[href], button:not([disabled]), summary, input, [tabindex]:not([tabindex="-1"])',
    );
    return Array.prototype.filter.call(nodes, function (el) {
      return el.offsetParent !== null;
    });
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
