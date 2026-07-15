/**
 * Lightweight SPA router for mandook.com
 *
 * Intercepts same-origin link clicks, fetches the target page,
 * swaps only <main id="page-content"> so the nav and logo never
 * unmount or flicker. Updates the URL, <title>, active nav link,
 * and re-fires page-level JS (reveal animations, scroll handlers).
 */
(function () {
  'use strict';

  // ── Helpers ───────────────────────────────────────────────────────────────

  function pageKeyFromPath(pathname) {
    var file = pathname.split('/').pop() || 'index.html';
    if (file === '' || file === 'index.html') return 'index';
    return file.replace('.html', '').replace(/^blog-.*/, 'blog');
  }

  function setActiveLink(pageKey) {
    document.querySelectorAll('.nav__link').forEach(function (a) {
      a.classList.toggle('active', a.dataset.page === pageKey);
    });
  }

  function reExecScripts(container) {
    // Newly-inserted HTML from DOMParser has inert scripts; re-create each one
    container.querySelectorAll('script').forEach(function (oldScript) {
      var s = document.createElement('script');
      Array.from(oldScript.attributes).forEach(function (attr) {
        s.setAttribute(attr.name, attr.value);
      });
      s.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(s, oldScript);
    });
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function triggerReveals() {
    var sel = '.reveal,.reveal-left,.reveal-right,.reveal-scale';
    var prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var els = document.querySelectorAll(sel);
    if (!els.length) return;
    if (prm) {
      els.forEach(function(el) { el.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function(el) {
      if (!el.classList.contains('visible')) io.observe(el);
    });
  }

  // ── Core navigate ─────────────────────────────────────────────────────────

  var navigating = false;

  function navigate(url, pushState) {
    if (navigating) return;
    navigating = true;

    fetch(url, { credentials: 'same-origin' })
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc    = parser.parseFromString(html, 'text/html');

        var newMain  = doc.getElementById('page-content');
        var currMain = document.getElementById('page-content');

        if (!newMain || !currMain) {
          // Fallback: full navigation
          location.assign(url);
          return;
        }

        currMain.replaceWith(newMain);

        // Update <title>
        document.title = doc.title;

        // Update active nav link
        var pageKey = pageKeyFromPath(new URL(url).pathname);
        setActiveLink(pageKey);

        // Push history entry
        if (pushState !== false) {
          history.pushState({ url: url }, document.title, url);
        }

        scrollToTop();

        // Re-run page-level scripts embedded in the swapped content
        reExecScripts(newMain);

        // Re-trigger reveal animations — page scripts live outside <main>
        // so reExecScripts won't reach them; re-observe here instead.
        triggerReveals();
      })
      .catch(function () {
        // Network error — fall back to normal navigation
        location.assign(url);
      })
      .finally(function () {
        navigating = false;
      });
  }

  // ── Click interception ────────────────────────────────────────────────────

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;

    var href = a.getAttribute('href');
    if (!href) return;

    // Ignore: external, hash-only, mailto, tel, target="_blank"
    if (
      href.startsWith('http') ||
      href.startsWith('//') ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      a.target === '_blank' ||
      a.hasAttribute('download')
    ) return;

    // Resolve to absolute URL
    var url;
    try { url = new URL(href, location.href).href; } catch (_) { return; }

    // Only intercept same origin
    if (new URL(url).origin !== location.origin) return;

    // Don't re-navigate to the current page
    if (url === location.href) { e.preventDefault(); return; }

    e.preventDefault();
    navigate(url, true);
  }, true);

  // ── Back / Forward ────────────────────────────────────────────────────────

  window.addEventListener('popstate', function (e) {
    navigate(location.href, false);
  });

  // ── Logo preload ──────────────────────────────────────────────────────────
  // Eagerly load the logo so it's in the browser cache on first paint
  (function () {
    var img = new Image();
    img.src = 'assets/mandook-logo.png';
  })();

})();
