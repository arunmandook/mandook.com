(function () {
  'use strict';

  /* ── Scroll progress bar ── */
  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'scroll-progress';
      document.body.prepend(bar);
    }
    function update() {
      var doc = document.documentElement;
      var scrolled = doc.scrollTop || document.body.scrollTop;
      var total = doc.scrollHeight - doc.clientHeight;
      bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── Counter animation ── */
  function animateCounter(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      var val = target * ease;
      el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCounter(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ── Stagger grid children ── */
  function initStagger() {
    var grids = document.querySelectorAll(
      '.why-grid, .expect-grid, .blog-grid, .services__grid, .tech-grid, .stats__grid, .problem__grid'
    );
    grids.forEach(function (grid) {
      grid.classList.add('stagger-children');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px 60px 0px' });

    document.querySelectorAll('.stagger-children').forEach(function (el) {
      io.observe(el);
    });
  }

  /* ── Subtle card tilt on mouse move ── */
  function initTilt() {
    document.querySelectorAll('.why-card, .expect-card, .blog-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'translateY(-5px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 6) + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ── Page enter animation (called by router after swap) ── */
  window.runPageEnter = function () {
    var root = document.getElementById('page-root');
    if (!root) return;
    root.classList.remove('page-visible');
    root.classList.add('page-entering');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.classList.remove('page-entering');
        root.classList.add('page-visible');
      });
    });
    // Re-init animations for new page content
    initScrollProgress();
    initCounters();
    initStagger();
    initTilt();
  };

  /* ── Init on first load ── */
  function init() {
    initScrollProgress();
    initCounters();
    initStagger();
    initTilt();

    // Trigger page enter on initial load
    var root = document.getElementById('page-root');
    if (root) {
      root.classList.add('page-entering');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          root.classList.remove('page-entering');
          root.classList.add('page-visible');
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
