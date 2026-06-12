/* ==========================================================================
   House of Clarence — collection page behaviour
   Progressive enhancement: auto-submit the sort and filter forms on change so
   no "Apply" button is needed. Without JS, the <noscript> Apply button works.
   ========================================================================== */
(function () {
  'use strict';

  // Sort: reload with the chosen sort_by.
  var sort = document.querySelector('[data-hoc-sort]');
  if (sort) {
    sort.addEventListener('change', function () {
      var url = new URL(window.location.href);
      url.searchParams.set('sort_by', sort.value);
      url.searchParams.delete('page');
      window.location.href = url.toString();
    });
  }

  // Filters: submit the filter form whenever a checkbox/price changes.
  var form = document.querySelector('[data-hoc-filter-form]');
  if (form) {
    form.addEventListener('change', function () {
      form.submit();
    });
  }
})();
