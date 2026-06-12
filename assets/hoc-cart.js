/* ==========================================================================
   House of Clarence — bag (cart) behaviour
   - Intercepts the product form → adds via AJAX → opens the "Your bag" drawer.
   - Quantity steppers and Remove update the cart live.
   - Uses Shopify's Section Rendering API so prices/subtotal stay correctly
     formatted (server-rendered), then swaps the drawer HTML in.
   Vanilla JS. Open state is a `hoc-cart-open` class on <body>.
   ========================================================================== */
(function () {
  'use strict';

  var SECTION_ID = 'hoc-cart-drawer';
  var lastFocused = null;

  function sectionEl() {
    return document.getElementById('shopify-section-' + SECTION_ID);
  }
  function drawerEl() {
    return document.querySelector('[data-hoc-cart-drawer]');
  }

  /* ---- Open / close --------------------------------------------------- */
  function openCart() {
    lastFocused = document.activeElement;
    document.body.classList.add('hoc-cart-open');
    var d = drawerEl();
    if (d) {
      var close = d.querySelector('[data-hoc-cart-close]');
      if (close && close.focus) close.focus();
    }
    document.addEventListener('keydown', onKeydown);
  }
  function closeCart() {
    document.body.classList.remove('hoc-cart-open');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  function onKeydown(e) {
    if (e.key === 'Escape') closeCart();
  }

  /* ---- Update the header bag count after a change --------------------- */
  function syncCount() {
    var d = drawerEl();
    if (!d) return;
    var count = parseInt(d.getAttribute('data-cart-count') || '0', 10);
    document.querySelectorAll('[data-hoc-cart-count]').forEach(function (el) {
      el.textContent = count;
      if (count > 0) {
        el.removeAttribute('hidden');
      } else {
        el.setAttribute('hidden', '');
      }
    });
  }

  /* ---- Swap the drawer HTML from a Section Rendering response --------- */
  function renderDrawer(sectionsHtml) {
    var sec = sectionEl();
    if (sec && sectionsHtml) {
      sec.innerHTML = new DOMParser()
        .parseFromString(sectionsHtml, 'text/html')
        .querySelector('[data-hoc-cart-drawer]').outerHTML;
    }
    syncCount();
  }

  /* ---- Add to cart ---------------------------------------------------- */
  function addToCart(form) {
    var btn = form.querySelector('[data-hoc-add]');
    if (btn) btn.classList.add('is-loading');

    var formData = new FormData(form);
    formData.append('sections', SECTION_ID);
    formData.append('sections_url', window.location.pathname);

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { Accept: 'application/javascript' },
      body: formData
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.status) {
          // e.g. sold out / error — let the page handle it gracefully
          if (btn) btn.classList.remove('is-loading');
          return;
        }
        if (data.sections && data.sections[SECTION_ID]) {
          renderDrawer(data.sections[SECTION_ID]);
        }
        if (btn) btn.classList.remove('is-loading');
        openCart();
      })
      .catch(function () {
        if (btn) btn.classList.remove('is-loading');
        // Fall back to the normal cart page
        window.location.href = '/cart';
      });
  }

  /* ---- Change a line quantity ----------------------------------------- */
  function changeLine(line, quantity) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/javascript' },
      body: JSON.stringify({
        line: line,
        quantity: quantity,
        sections: SECTION_ID,
        sections_url: window.location.pathname
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.sections && data.sections[SECTION_ID]) {
          renderDrawer(data.sections[SECTION_ID]);
        }
      });
  }

  function currentQty(line) {
    var d = drawerEl();
    var li = d && d.querySelector('[data-hoc-line="' + line + '"]');
    var val = li && li.querySelector('.hoc-qty__val');
    return val ? parseInt(val.textContent.trim(), 10) || 0 : 0;
  }

  /* ---- Event delegation ----------------------------------------------- */
  document.addEventListener('click', function (e) {
    var open = e.target.closest('[data-hoc-cart-open]');
    if (open) {
      e.preventDefault();
      openCart();
      return;
    }
    if (e.target.closest('[data-hoc-cart-close]')) {
      closeCart();
      return;
    }
    var up = e.target.closest('[data-hoc-qty-up]');
    if (up) {
      var lu = up.getAttribute('data-line');
      changeLine(parseInt(lu, 10), currentQty(lu) + 1);
      return;
    }
    var down = e.target.closest('[data-hoc-qty-down]');
    if (down) {
      var ld = down.getAttribute('data-line');
      changeLine(parseInt(ld, 10), Math.max(0, currentQty(ld) - 1));
      return;
    }
    var rm = e.target.closest('[data-hoc-remove]');
    if (rm) {
      changeLine(parseInt(rm.getAttribute('data-line'), 10), 0);
      return;
    }
  });

  // Intercept the product form on the PDP.
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('[data-hoc-product-form]');
    if (!form) return;
    e.preventDefault();
    addToCart(form);
  });

  // Keep the count in sync on first load.
  syncCount();
})();
