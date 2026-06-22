/* ==========================================================================
   House of Clarence — Shop by room, pinned horizontal scroll (prd.md §7)
   --------------------------------------------------------------------------
   On desktop, when motion is allowed (<html class="hoc-anim">) and the section
   opts in (data-room-pinned), the section is pinned and the room track slides
   horizontally in step with the page's vertical scroll, with a hold (lead-in)
   before the travel begins and a hold (lead-out) after it ends. Each room is a
   full-width slot, so exactly one room is in view at a time on any screen size;
   the photo inside each slot is framed at its own 8:5 ratio (CSS) so it is
   never stretched or cropped. The extra scroll distance is created by setting
   the section's height to the viewport height plus the track's overflow width.

   Degrades gracefully: under reduced motion, no-JS, or below 1024px the markup
   is left untouched — CSS provides a native horizontal scroll row (desktop) or
   a simple stacked layout (mobile).
   ========================================================================== */
(function () {
  'use strict';

  var sections = document.querySelectorAll('[data-room-scroll][data-room-pinned]');
  if (!sections.length) return;
  if (!document.documentElement.classList.contains('hoc-anim')) return;
  if (!('requestAnimationFrame' in window)) return;

  var mq = window.matchMedia('(min-width: 1024px)');

  function ratio(value, fallback) {
    var n = parseFloat(value);
    if (isNaN(n)) n = fallback;
    return Math.min(1.5, Math.max(0, n / 100));
  }

  function RoomScroll(section) {
    this.section = section;
    this.track = section.querySelector('[data-room-track]');
    this.viewport = section.querySelector('[data-room-viewport]');
    this.bar = section.querySelector('[data-room-progress-bar]');
    // How long the section holds, pinned and static, before (lead-in) and after
    // (lead-out) the sideways scroll — expressed as a fraction of viewport height.
    this.leadInRatio = ratio(section.getAttribute('data-room-leadin'), 60);
    this.leadOutRatio = ratio(section.getAttribute('data-room-leadout'), 35);
    this.distance = 0; // horizontal scroll distance (one room per slot width)
    this.leadIn = 0;
    this.leadOut = 0;
    this.active = false;
    this.ticking = false;
    this.onScroll = this.onScroll.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  RoomScroll.prototype.sectionTop = function () {
    return this.section.getBoundingClientRect().top + window.pageYOffset;
  };

  RoomScroll.prototype.measure = function () {
    if (!this.active) return;
    // Each room is a full-width slot, so the hidden overflow width is exactly
    // the distance to travel through every room, one at a time.
    this.distance = Math.max(0, this.track.scrollWidth - this.viewport.clientWidth);
    if (this.distance <= 0) {
      // Single room (or unmeasurable) — nothing to scroll past.
      this.leadIn = 0;
      this.leadOut = 0;
      this.section.style.height = '';
      this.render();
      return;
    }
    this.leadIn = window.innerHeight * this.leadInRatio;
    this.leadOut = window.innerHeight * this.leadOutRatio;
    // Extra scroll distance = pause before + sideways travel + pause after.
    this.section.style.height = window.innerHeight + this.leadIn + this.distance + this.leadOut + 'px';
    this.render();
  };

  RoomScroll.prototype.render = function () {
    var progress = 0;
    if (this.distance > 0) {
      var scrolled = window.pageYOffset - this.sectionTop();
      // Hold at the start (lead-in), travel across the middle, hold at the end.
      progress = (scrolled - this.leadIn) / this.distance;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;
    }
    this.track.style.transform = 'translate3d(' + (-progress * this.distance).toFixed(2) + 'px,0,0)';
    if (this.bar) this.bar.style.width = (progress * 100).toFixed(2) + '%';
  };

  RoomScroll.prototype.onScroll = function () {
    if (!this.active) return;
    // Skip all work once the section has scrolled fully out of view — it stays
    // active for the whole desktop session, so don't keep rendering for nothing.
    var rect = this.section.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
    // Reveal the dim + titles while scrolling; hide shortly after it stops.
    var self = this;
    this.section.classList.add('is-scrolling');
    window.clearTimeout(this.scrollEndTimer);
    this.scrollEndTimer = window.setTimeout(function () {
      self.section.classList.remove('is-scrolling');
    }, 280);
    if (this.ticking) return;
    this.ticking = true;
    window.requestAnimationFrame(function () {
      self.render();
      self.ticking = false;
    });
  };

  /* Keep keyboard navigation usable while pinned: when a panel link is focused,
     scroll the page so that panel is the one on screen. */
  RoomScroll.prototype.onFocus = function (event) {
    if (!this.active || this.distance <= 0) return;
    var panel = event.target.closest('.hoc-roompanel');
    if (!panel) return;
    // Measure the panel relative to the track's own left edge (both share the
    // sticky pin as offsetParent, which carries the viewport inset) so this
    // matches the track's translate model.
    var offset = panel.offsetLeft - this.track.offsetLeft;
    var target = Math.min(this.distance, Math.max(0, offset));
    window.scrollTo({ top: this.sectionTop() + this.leadIn + target, behavior: 'auto' });
  };

  RoomScroll.prototype.enable = function () {
    if (this.active) return;
    this.active = true;
    this.section.classList.add('is-pinned');
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.viewport.addEventListener('focusin', this.onFocus);
    this.measure();
  };

  RoomScroll.prototype.disable = function () {
    if (!this.active) return;
    this.active = false;
    this.section.classList.remove('is-pinned');
    this.section.classList.remove('is-scrolling');
    window.clearTimeout(this.scrollEndTimer);
    window.removeEventListener('scroll', this.onScroll);
    this.viewport.removeEventListener('focusin', this.onFocus);
    this.section.style.height = '';
    this.track.style.transform = '';
    if (this.bar) this.bar.style.width = '';
  };

  RoomScroll.prototype.evaluate = function () {
    if (mq.matches) this.enable();
    else this.disable();
  };

  var instances = [];
  sections.forEach(function (section) {
    var rs = new RoomScroll(section);
    if (!rs.track || !rs.viewport) return;
    instances.push(rs);
    rs.evaluate();
  });

  function forEach(fn) {
    instances.forEach(fn);
  }

  // Re-evaluate on breakpoint change.
  var onMqChange = function () {
    forEach(function (rs) {
      rs.evaluate();
    });
  };
  if (mq.addEventListener) mq.addEventListener('change', onMqChange);
  else if (mq.addListener) mq.addListener(onMqChange);

  // Recompute distance/height after resize and once images/fonts settle.
  var resizeTimer;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      forEach(function (rs) {
        // If a breakpoint was crossed, evaluate()→enable() already re-measures;
        // only an already-active instance needs the extra measure() here.
        var wasActive = rs.active;
        rs.evaluate();
        if (wasActive && rs.active) rs.measure();
      });
    }, 150);
  });
  window.addEventListener('load', function () {
    forEach(function (rs) {
      rs.measure();
    });
  });
})();
