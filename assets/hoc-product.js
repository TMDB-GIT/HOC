/* ==========================================================================
   House of Clarence — product page behaviour
   - Gallery: click a thumbnail to swap the main image.
   - Variants: when options change, find the matching variant, update the
     hidden id, the price, and the Add-to-bag button state.
   Vanilla JS, no dependencies. Cart-drawer AJAX is wired up in Phase 6;
   for now the form submits normally and adds to the cart.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- Gallery -------------------------------------------------------- */
  var gallery = document.querySelector('[data-hoc-gallery]');
  if (gallery) {
    var stage = gallery.querySelector('[data-hoc-stage-img]');
    var thumbs = gallery.querySelectorAll('[data-hoc-thumb]');
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        if (!stage) return;
        stage.src = thumb.getAttribute('data-full');
        if (thumb.getAttribute('data-srcset')) stage.srcset = thumb.getAttribute('data-srcset');
        stage.alt = thumb.getAttribute('data-alt') || stage.alt;
        thumbs.forEach(function (t) { t.classList.remove('is-active'); });
        thumb.classList.add('is-active');
      });
    });
  }

  /* ---- Variants ------------------------------------------------------- */
  var form = document.querySelector('[data-hoc-product-form]');
  if (!form) return;

  var dataEl = document.querySelector('[data-hoc-variant-json]');
  var variants = [];
  try {
    variants = JSON.parse(dataEl.textContent);
  } catch (e) {
    return;
  }

  var idInput = form.querySelector('[data-hoc-variant-id]');
  var priceEl = document.querySelector('[data-hoc-price]');
  var addBtn = form.querySelector('[data-hoc-add]');
  var addText = form.querySelector('[data-hoc-add-text]');
  var gallery2 = document.querySelector('[data-hoc-gallery]');
  var stageImg = gallery2 ? gallery2.querySelector('[data-hoc-stage-img]') : null;

  function selectedOptions() {
    var fieldsets = form.querySelectorAll('[data-hoc-option-index]');
    var opts = [];
    fieldsets.forEach(function (fs) {
      var checked = fs.querySelector('input[data-hoc-option-value]:checked');
      if (checked) opts.push(checked.value);
    });
    return opts;
  }

  function formatMoney(cents) {
    // Light client-side formatter for £ with thousands separators, no .00.
    var pounds = cents / 100;
    var hasPence = cents % 100 !== 0;
    return '£' + pounds.toLocaleString('en-GB', {
      minimumFractionDigits: hasPence ? 2 : 0,
      maximumFractionDigits: 2
    });
  }

  function matchVariant(opts) {
    return variants.find(function (v) {
      return v.options.length === opts.length &&
        v.options.every(function (o, i) { return o === opts[i]; });
    });
  }

  function update() {
    var opts = selectedOptions();
    var v = matchVariant(opts);
    if (!v) {
      if (addBtn) addBtn.disabled = true;
      if (addText) addText.textContent = 'Unavailable';
      return;
    }
    if (idInput) idInput.value = v.id;

    // Price
    if (priceEl) {
      if (!v.price || v.price === 0) {
        priceEl.querySelector('.hoc-specimen__price') &&
          (priceEl.querySelector('.hoc-specimen__price').textContent = 'Price on application');
      } else {
        var priceSpan = priceEl.querySelector('.hoc-specimen__price');
        if (priceSpan) priceSpan.textContent = formatMoney(v.price);
      }
    }

    // Button state
    if (addBtn && addText) {
      addBtn.disabled = !v.available;
      addText.textContent = v.available ? 'Add to bag' : 'Sold out';
    }

    // Swap to the variant's image if it has one
    if (stageImg && v.featured_image && v.featured_image.src) {
      stageImg.src = v.featured_image.src;
    }

    // Reflect in URL (so refresh/share keeps the variant) without reload
    if (history.replaceState) {
      var url = new URL(window.location.href);
      url.searchParams.set('variant', v.id);
      history.replaceState({}, '', url.toString());
    }
  }

  form.querySelectorAll('input[data-hoc-option-value]').forEach(function (input) {
    input.addEventListener('change', update);
  });
})();
