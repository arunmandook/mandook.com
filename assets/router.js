(function () {
  'use strict';

  var SELECTOR_NAV = '#mainNav';
  var SELECTOR_MOBILE = '#mobileMenu';
  var ROOT_ID = 'page-root';
  var STYLES_ID = 'page-styles';

  function isSameOriginHtml(href) {
    try {
      var url = new URL(href, location.href);
      return (
        url.origin === location.origin &&
        (url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/'))
      );
    } catch (e) { return false; }
  }

  function updateActiveLinks(href) {
    var path = new URL(href, location.href).pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(function (a) {
      var lp = (a.getAttribute('href') || '').split('/').pop();
      a.classList.toggle('active', lp === path);
    });
  }

  function runScripts(container) {
    container.querySelectorAll('script').forEach(function (old) {
      var s = document.createElement('script');
      if (old.src) { s.src = old.src; s.async = false; }
      else { s.textContent = old.textContent; }
      old.parentNode.replaceChild(s, old);
    });
  }

  function navigate(href, push) {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;

    root.style.opacity = '0';
    root.style.transition = 'opacity 0.15s ease';

    fetch(href)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');

        // Swap page title
        document.title = doc.title;

        // Swap page-specific styles
        var newStyle = doc.getElementById(STYLES_ID);
        var curStyle = document.getElementById(STYLES_ID);
        if (newStyle && curStyle) {
          curStyle.textContent = newStyle.textContent;
        }

        // Extract new page root content (strip nav elements from clone)
        var newRoot = doc.getElementById(ROOT_ID);
        if (!newRoot) return;

        root.innerHTML = newRoot.innerHTML;

        // Update URL
        if (push !== false) history.pushState({ href: href }, '', href);

        // Update nav active state
        updateActiveLinks(href);

        // Scroll top
        window.scrollTo(0, 0);

        // Re-run page scripts
        runScripts(root);

        // Re-add body.loaded so reveal classes fire
        document.body.classList.add('loaded');

        // Fade back in
        root.style.opacity = '1';
      })
      .catch(function () {
        location.href = href;
      });
  }

  // Intercept all internal link clicks
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var abs = new URL(href, location.href).href;
    if (!isSameOriginHtml(abs)) return;
    e.preventDefault();
    navigate(abs);
  });

  // Handle browser back/forward
  window.addEventListener('popstate', function () {
    navigate(location.href, false);
  });

  // Record initial state
  history.replaceState({ href: location.href }, '', location.href);

})();
