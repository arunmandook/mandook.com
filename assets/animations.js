(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll progress bar ── */
  function initProgress() {
    var bar = document.getElementById('m-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'm-progress';
      document.body.appendChild(bar);
    }
    function onScroll() {
      var el  = document.documentElement;
      var top = el.scrollTop || document.body.scrollTop;
      var h   = el.scrollHeight - el.clientHeight;
      bar.style.width = (h > 0 ? (top / h) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Image fade-in on load ── */
  function initImageFade() {
    if (reducedMotion) return;
    var imgs = document.querySelectorAll('#page-root img');
    imgs.forEach(function (img) {
      if (img.complete) {
        img.classList.add('m-loaded');
      } else {
        img.addEventListener('load', function () {
          img.classList.add('m-loaded');
        }, { once: true });
      }
    });
  }

  /* ── Counter animation ── */
  function animateCount(el) {
    if (reducedMotion) return;
    var raw    = el.getAttribute('data-count');
    var target = parseFloat(raw);
    var isInt  = Number.isInteger(target);
    var suffix = el.getAttribute('data-suffix') || '';
    var dur    = 1800;
    var start  = null;
    function tick(ts) {
      if (!start) start = ts;
      var p   = Math.min((ts - start) / dur, 1);
      var ease = 1 - Math.pow(1 - p, 4);
      var val  = target * ease;
      el.textContent = (isInt ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ── Page enter animation ── */
  function pageEnter() {
    if (reducedMotion) return;
    var root = document.getElementById('page-root');
    if (!root) return;
    root.classList.remove('m-visible', 'm-exit');
    root.classList.add('m-enter');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.classList.remove('m-enter');
        root.classList.add('m-visible');
      });
    });
  }

  /* ── Page exit animation (called by router before fetch) ── */
  window.mAnimExit = function () {
    if (reducedMotion) return;
    var root = document.getElementById('page-root');
    if (root) root.classList.add('m-exit');
  };

  /* ── Re-init after router swap ── */
  window.mAnimEnter = function () {
    pageEnter();
    initProgress();
    initImageFade();
    initCounters();
  };

  /* ── Init on first load ── */
  function init() {
    initProgress();
    initImageFade();
    initCounters();
    pageEnter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
