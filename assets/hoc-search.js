/* ==========================================================================
   House of Clarence — predictive search drawer
   Opens from the header search icon, fetches live product suggestions from
   Shopify's predictive search, and renders quiet specimen-style results.
   Falls back to the normal /search page without JS.
   ========================================================================== */
(function () {
  'use strict';

  var drawer = document.querySelector('[data-hoc-search]');
  if (!drawer) return;

  var input = drawer.querySelector('[data-hoc-search-input]');
  var results = drawer.querySelector('[data-hoc-search-results]');
  var form = drawer.querySelector('[data-hoc-search-form]');
  var lastFocused = null;
  var timer = null;

  function open() {
    lastFocused = document.activeElement;
    document.body.classList.add('hoc-search-open');
    document.addEventListener('keydown', onKeydown);
    setTimeout(function () { if (input) input.focus(); }, 60);
  }
  function close() {
    document.body.classList.remove('hoc-search-open');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  function onKeydown(e) {
    if (e.key === 'Escape') close();
  }

  function escapeHtml(s) {
    return (s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function render(products, query) {
    if (!products.length) {
      results.innerHTML =
        '<p class="hoc-eyebrow hoc-search__hint">No specimens found for “' + escapeHtml(query) + '”.</p>';
      return;
    }
    var items = products
      .map(function (p) {
        var img = p.featured_image && p.featured_image.url ? p.featured_image.url : '';
        var caption = p.product_type || (p.vendor || '');
        return (
          '<a class="hoc-search__result" href="' + p.url + '">' +
          (img ? '<span class="hoc-search__thumb"><img src="' + img + '&width=120" alt="" loading="lazy"></span>' : '<span class="hoc-search__thumb"></span>') +
          '<span class="hoc-search__meta">' +
          '<span class="hoc-search__title">' + escapeHtml(p.title) + '</span>' +
          '<span class="hoc-specimen">' + escapeHtml(caption.toUpperCase()) + '</span>' +
          '</span></a>'
        );
      })
      .join('');
    results.innerHTML =
      '<div class="hoc-search__list">' + items + '</div>' +
      '<a class="hoc-textlink hoc-search__all" href="/search?q=' + encodeURIComponent(query) + '">View all results</a>';
  }

  function search(query) {
    if (!query || query.length < 2) {
      results.innerHTML = '<p class="hoc-eyebrow hoc-search__hint">Start typing to search the catalogue.</p>';
      return;
    }
    var url =
      '/search/suggest.json?q=' + encodeURIComponent(query) +
      '&resources[type]=product&resources[limit]=6&resources[options][unavailable_products]=last';
    fetch(url, { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var products = (data.resources && data.resources.results && data.resources.results.products) || [];
        render(products, query);
      })
      .catch(function () { /* leave the hint in place */ });
  }

  if (input) {
    input.addEventListener('input', function () {
      clearTimeout(timer);
      var q = input.value.trim();
      timer = setTimeout(function () { search(q); }, 200);
    });
  }

  // Open / close via delegation (search icon may live anywhere in the header).
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-hoc-search-open]')) {
      e.preventDefault();
      open();
      return;
    }
    if (e.target.closest('[data-hoc-search-close]')) {
      close();
    }
  });
})();
