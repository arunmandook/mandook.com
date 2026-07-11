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
     WORD-SPLIT REVEAL
     Splits headings into per-word spans that
     stagger in — replaces the CSS fade-up animation
     on .page-hero__title and .hero__headline
  ═══════════════════════════════════════════════ */
  var WORD_SPLIT_SEL = '.page-hero__title, .hero__headline';

  function buildWordHTML(el) {
    // Walk child nodes: text → split into m-word spans,
    // BR → keep, element (span.grad etc.) → rewrap each word preserving attrs
    var html = '';
    el.childNodes.forEach(function (node) {
      if (node.nodeType === 3) { // text node
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (/^\s+$/.test(part)) {
            html += ' ';
          } else if (part) {
            html += '<span class="m-word">' + part + '</span>';
          }
        });
      } else if (node.nodeName === 'BR') {
        html += '<br>';
      } else if (node.nodeType === 1) {
        // Inline element (span.grad, span[style]) — preserve styling per word
        var cls   = node.className ? ' ' + node.className : '';
        var style = node.getAttribute('style') ? ' style="' + node.getAttribute('style') + '"' : '';
        node.textContent.trim().split(/\s+/).filter(Boolean).forEach(function (word) {
          html += '<span class="m-word' + cls + '"' + style + '>' + word + '</span> ';
        });
      }
    });
    return html;
  }

  function applyWordSplit(el) {
    if (reducedMotion || el.hasAttribute('data-m-split')) return;

    el.setAttribute('data-m-split', '1');
    // Cancel the CSS animation that page styles define, make el a transparent
    // container — words carry the animation instead
    el.classList.add('m-split-active');
    // Strip any IO-based classes that might have been added by autoTag first
    el.classList.remove('reveal', 'm-anim', 'm-reveal', 'm-reveal-up', 'm-reveal-left', 'm-reveal-scale');
    el.removeAttribute('data-m-anim');

    el.innerHTML = buildWordHTML(el);

    var words = el.querySelectorAll('.m-word');
    // Match the original CSS animation-delay so the first word appears at the
    // same time the old animation would have started
    var baseDelay = el.classList.contains('page-hero__title') ? 0.32 : 0.05;
    words.forEach(function (span, i) {
      span.style.transitionDelay = (baseDelay + i * 0.055) + 's';
    });

    // Two-frame delay so the browser has painted the initial hidden state
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        words.forEach(function (span) { span.classList.add('m-w-in'); });
      });
    });
  }

  function applyWordSplits(root) {
    var container = root || document;
    container.querySelectorAll(WORD_SPLIT_SEL + ':not([data-m-split])').forEach(applyWordSplit);
  }

  /* ═══════════════════════════════════════════════
     SCROLL REVEAL — auto-tags elements and
     fires IntersectionObserver once per element
  ═══════════════════════════════════════════════ */
  var revealIO = null;

  // Elements tagged by JS — no HTML change required.
  // Rules:
  //   • Never include elements in hidden tab panels (.svc-panel etc.)
  //   • Never include page-hero children — those use CSS animation: fade-up
  //   • Group by parent → siblings stagger together
  var AUTO_SELECTORS = [
    /* ── Section chrome ── */
    '.section__label',
    '.section__heading',
    '.section__sub',

    /* ── Homepage ── */
    '.problem-card',
    '.bp-card',
    '.hero__stat',

    /* ── Services tab buttons (always visible, not in hidden panels) ── */
    '.svc-tab',

    /* ── Process steps ── */
    '.ps-step',

    /* ── Why Choose cards ── */
    '.why-card',

    /* ── Blog cards ── */
    '.blog-card',

    /* ── About ── */
    '.mv-card',
    '.value-card',
    '.story-body',

    /* ── Contact / Expect ── */
    '.expect-card',
    '.contact-form-wrap',

    /* ── Work ── */
    '.case-card',
    '.ind-card',
    '.stat-item',

    /* ── CTA section ── */
    '.cta-section__heading',
    '.cta-section__sub',
    '.magnetic-wrap',        // CTA button wrapper

    /* ── FAQ ── */
    '.faq-item',

    /* ── Blog article body ── */
    '.article-body > p',
    '.article-body > h2',
    '.article-body > h3',
    '.article-body > ul',
    '.article-body > blockquote',
    '.article-body > .article-cta',

    /* ── Footer columns ── */
    '.footer__col',
  ];

  var DIRECTION = {
    '.section__label':              'm-reveal',
    '.section__heading':            'm-reveal',
    '.section__sub':                'm-reveal',
    '.problem-card':                'm-reveal-up',
    '.bp-card':                     'm-reveal-up',
    '.hero__stat':                  'm-reveal-scale',
    '.svc-tab':                     'm-reveal-up',
    '.ps-step':                     'm-reveal-up',
    '.why-card':                    'm-reveal-up',
    '.blog-card':                   'm-reveal-up',
    '.mv-card':                     'm-reveal-up',
    '.value-card':                  'm-reveal-up',
    '.story-body':                  'm-reveal',
    '.expect-card':                 'm-reveal-up',
    '.contact-form-wrap':           'm-reveal-up',
    '.case-card':                   'm-reveal-up',
    '.ind-card':                    'm-reveal-up',
    '.stat-item':                   'm-reveal-scale',
    '.cta-section__heading':        'm-reveal',
    '.cta-section__sub':            'm-reveal',
    '.magnetic-wrap':               'm-reveal-scale',
    '.faq-item':                    'm-reveal',
    '.article-body > p':            'm-reveal',
    '.article-body > h2':           'm-reveal',
    '.article-body > h3':           'm-reveal',
    '.article-body > ul':           'm-reveal',
    '.article-body > blockquote':   'm-reveal-left',
    '.article-body > .article-cta': 'm-reveal-up',
    '.footer__col':                 'm-reveal-up',
  };

  function tagElement(el, cls) {
    // Skip elements already tagged by IO system or by word-split
    if (el.hasAttribute('data-m-anim') || el.hasAttribute('data-m-split')) return;
    el.setAttribute('data-m-anim', cls);
    el.classList.add('m-anim', cls);
  }

  function autoTag(root) {
    var container = root || document;

    AUTO_SELECTORS.forEach(function (sel) {
      var cls = DIRECTION[sel] || 'm-reveal';
      var elements = Array.from(container.querySelectorAll(sel));

      // Group by parent — stagger runs within each visual grid
      var byParent = new Map();
      elements.forEach(function (el) {
        var p = el.parentElement || document.body;
        if (!byParent.has(p)) byParent.set(p, []);
        byParent.get(p).push(el);
      });

      byParent.forEach(function (group) {
        group.forEach(function (el, idx) {
          tagElement(el, cls);
          // Apply stagger only when there are siblings, and only when the
          // author hasn't already set a [data-delay] HTML attribute
          if (group.length > 1 && !el.hasAttribute('data-delay')) {
            el.style.transitionDelay = (idx * 0.08) + 's';
          }
        });
      });
    });

    // Ensure legacy .reveal elements are observed even if not in AUTO_SELECTORS
    container.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
      if (!el.hasAttribute('data-m-anim') && !el.hasAttribute('data-m-split')) {
        el.setAttribute('data-m-anim', 'legacy');
      }
    });
  }

  function safetyReveal(root) {
    setTimeout(function () {
      (root || document).querySelectorAll(
        '.m-anim:not(.m-visible), .reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)'
      ).forEach(function (el) {
        el.classList.add('m-visible', 'visible');
      });
      // Also unblock any word spans that didn't fire (e.g. offscreen on load)
      (root || document).querySelectorAll('.m-word:not(.m-w-in)').forEach(function (span) {
        span.classList.add('m-w-in');
      });
    }, 1500);
  }

  function buildIO(root) {
    if (revealIO) revealIO.disconnect();

    if (reducedMotion) {
      (root || document).querySelectorAll('.m-anim, .reveal, .reveal-left, .reveal-right').forEach(function (el) {
        el.classList.add('visible', 'm-visible');
      });
      (root || document).querySelectorAll('.m-word').forEach(function (span) {
        span.classList.add('m-w-in');
      });
      return;
    }

    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('m-visible', 'visible');
          revealIO.unobserve(entry.target); // one-shot: never re-hide
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -24px 0px'
    });

    (root || document).querySelectorAll('[data-m-anim], .reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
      revealIO.observe(el);
    });

    safetyReveal(root);
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
    // Word-split must run before autoTag so tagElement's guard sees data-m-split
    applyWordSplits(pageRoot);
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
    applyWordSplits(document); // must run before autoTag
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
