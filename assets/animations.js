(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══════════════════════════════════════════════
     SCROLL PROGRESS BAR
  ═══════════════════════════════════════════════ */
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
    window.removeEventListener('scroll', window._mProgress);
    window._mProgress = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ═══════════════════════════════════════════════
     SCROLL REVEAL — fires every time element
     enters AND exits viewport
  ═══════════════════════════════════════════════ */
  var revealIO = null;

  // Elements auto-tagged by JS (no HTML change needed)
  var AUTO_SELECTORS = [
    /* section structure */
    '.section__label',
    '.section__heading',
    '.section__sub',
    /* cards */
    '.why-card',
    '.expect-card',
    '.problem-card',
    '.process-card',
    '.wc-card',
    '.blog-card',
    '.value-card',
    '.mv-card',
    '.faq-item',
    '.tech-tag',
    '.stat-item',
    '.bp-card',
    '.svc-panel',
    /* hero stats */
    '.hero__stat',
    /* article / blog content */
    '.article-body > p',
    '.article-body > h2',
    '.article-body > h3',
    '.article-body > ul',
    '.article-body > blockquote',
    /* contact */
    '.expect-card',
    '.contact-form-wrap',
    /* footer cols */
    '.footer__col',
    /* page hero elements not already animated */
    '.page-hero__breadcrumb',
    '.page-hero__label',
    '.page-hero__title',
    '.page-hero__sub',
  ];

  // Direction map: which animation variant to assign per selector
  var DIRECTION = {
    '.section__label':        'm-reveal',
    '.section__heading':      'm-reveal',
    '.section__sub':          'm-reveal',
    '.why-card':              'm-reveal-up',
    '.expect-card':           'm-reveal-up',
    '.problem-card':          'm-reveal-up',
    '.process-card':          'm-reveal-up',
    '.wc-card':               'm-reveal-up',
    '.blog-card':             'm-reveal-up',
    '.value-card':            'm-reveal-up',
    '.mv-card':               'm-reveal-up',
    '.faq-item':              'm-reveal',
    '.tech-tag':              'm-reveal-scale',
    '.stat-item':             'm-reveal-up',
    '.bp-card':               'm-reveal-up',
    '.svc-panel':             'm-reveal',
    '.hero__stat':            'm-reveal-scale',
    '.article-body > p':      'm-reveal',
    '.article-body > h2':     'm-reveal',
    '.article-body > h3':     'm-reveal',
    '.article-body > ul':     'm-reveal',
    '.article-body > blockquote': 'm-reveal-left',
    '.contact-form-wrap':     'm-reveal-up',
    '.footer__col':           'm-reveal-up',
    '.page-hero__breadcrumb': 'm-reveal',
    '.page-hero__label':      'm-reveal',
    '.page-hero__title':      'm-reveal',
    '.page-hero__sub':        'm-reveal',
  };

  function tagElement(el, cls) {
    if (!el.hasAttribute('data-m-anim')) {
      el.setAttribute('data-m-anim', cls);
      el.classList.add('m-anim', cls);
    }
  }

  function autoTag(root) {
    var container = root || document;
    AUTO_SELECTORS.forEach(function (sel) {
      var cls = DIRECTION[sel] || 'm-reveal';
      container.querySelectorAll(sel).forEach(function (el, i) {
        tagElement(el, cls);
        // Stagger siblings inside a grid
        var parent = el.parentElement;
        if (parent) {
          var siblings = Array.from(parent.children).filter(function (c) {
            return c.classList.contains(el.classList[0]);
          });
          if (siblings.length > 1) {
            var idx = siblings.indexOf(el);
            el.style.transitionDelay = (idx * 0.07) + 's';
          }
        }
      });
    });

    // Also tag existing reveal elements so they re-fire
    container.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
      if (!el.hasAttribute('data-m-anim')) {
        el.setAttribute('data-m-anim', 'legacy');
      }
    });
  }

  function buildIO(root) {
    if (revealIO) revealIO.disconnect();

    if (reducedMotion) {
      // Just show everything immediately
      (root || document).querySelectorAll('.m-anim, .reveal, .reveal-left, .reveal-right').forEach(function (el) {
        el.classList.add('visible', 'm-visible');
      });
      return;
    }

    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;
        if (entry.isIntersecting) {
          el.classList.add('m-visible');
          // Also add legacy visible class for existing reveal elements
          el.classList.add('visible');
        } else {
          // Remove so it re-animates next time
          el.classList.remove('m-visible', 'visible');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    (root || document).querySelectorAll('[data-m-anim], .reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
      revealIO.observe(el);
    });
  }

  /* ═══════════════════════════════════════════════
     IMAGE FADE-IN
  ═══════════════════════════════════════════════ */
  function initImageFade(root) {
    if (reducedMotion) return;
    (root || document).querySelectorAll('#page-root img:not([data-m-img])').forEach(function (img) {
      img.setAttribute('data-m-img', '1');
      if (img.complete && img.naturalWidth) {
        img.classList.add('m-loaded');
      } else {
        img.addEventListener('load', function () { img.classList.add('m-loaded'); }, { once: true });
      }
    });
  }

  /* ═══════════════════════════════════════════════
     COUNTER ANIMATION
  ═══════════════════════════════════════════════ */
  function animateCount(el) {
    if (reducedMotion) return;
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var isInt  = Number.isInteger(target);
    var dur = 1600, t0 = null;
    function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var ease = 1 - Math.pow(1 - p, 4);
      el.textContent = (isInt ? Math.round(target * ease) : (target * ease).toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initCounters(root) {
    var els = (root || document).querySelectorAll('[data-count]');
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ═══════════════════════════════════════════════
     PAGE ENTER / EXIT (router hooks)
  ═══════════════════════════════════════════════ */
  window.mAnimExit = function () {
    if (reducedMotion) return;
    var root = document.getElementById('page-root');
    if (root) { root.classList.remove('m-visible'); root.classList.add('m-exit'); }
  };

  window.mAnimEnter = function () {
    var pageRoot = document.getElementById('page-root');
    autoTag(pageRoot);
    buildIO(pageRoot);
    initImageFade(pageRoot);
    initCounters(pageRoot);
    pageEnter();
  };

  function pageEnter() {
    if (reducedMotion) return;
    var root = document.getElementById('page-root');
    if (!root) return;
    root.classList.remove('m-exit', 'm-visible');
    root.classList.add('m-enter');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.classList.remove('m-enter');
        root.classList.add('m-visible');
      });
    });
  }

  /* ═══════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════ */
  function init() {
    initProgress();
    autoTag(document);
    buildIO(document);
    initImageFade(document);
    initCounters(document);
    pageEnter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
