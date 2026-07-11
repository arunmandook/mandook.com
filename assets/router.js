(function () {
  'use strict';

  var ROOT_ID = 'page-root';
  var STYLES_ID = 'page-styles';
  var REVEAL_SEL = '.reveal,.reveal-left,.reveal-right,.reveal-scale';

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

  function forceReveal(container) {
    // Give IntersectionObserver scripts a tick to set up, then force all
    // reveal elements visible so nothing stays hidden after navigation.
    setTimeout(function () {
      (container || document).querySelectorAll(REVEAL_SEL).forEach(function (el) {
        el.classList.add('visible');
      });
    }, 120);
  }

  function runScripts(container) {
    container.querySelectorAll('script').forEach(function (old) {
      // Skip re-injecting router.js itself to avoid duplicate listeners
      if (old.src && old.src.indexOf('router.js') !== -1) return;
      var s = document.createElement('script');
      if (old.src) { s.src = old.src; s.async = false; }
      else { s.textContent = old.textContent; }
      old.parentNode.replaceChild(s, old);
    });
  }

  function swapStyles(doc) {
    // Swap all <style> blocks that exist in the new page's <head>
    var newStyles = doc.querySelectorAll('head style');
    var curStyles = document.querySelectorAll('head style');
    // Replace matched by index; append extras
    newStyles.forEach(function (ns, i) {
      if (curStyles[i]) {
        curStyles[i].textContent = ns.textContent;
      } else {
        var s = document.createElement('style');
        s.textContent = ns.textContent;
        document.head.appendChild(s);
      }
    });
    // Remove any leftover old styles beyond what the new page has
    for (var i = newStyles.length; i < curStyles.length; i++) {
      curStyles[i].remove();
    }
  }

  function navigate(href, push) {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;

    // Signal animation layer to play exit
    if (typeof window.mAnimExit === 'function') window.mAnimExit();
    else { root.style.transition = 'opacity 0.12s ease'; root.style.opacity = '0'; }

    fetch(href)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');

        // Swap title
        document.title = doc.title;

        // Swap all head styles
        swapStyles(doc);

        // Swap page root content
        var newRoot = doc.getElementById(ROOT_ID);
        if (!newRoot) { location.href = href; return; }

        root.innerHTML = newRoot.innerHTML;

        // Update URL
        if (push !== false) history.pushState({ href: href }, '', href);

        // Update nav active state
        updateActiveLinks(href);

        // Scroll to top
        window.scrollTo(0, 0);

        // Re-run page scripts (excluding router)
        runScripts(root);

        // Ensure body.loaded is set
        document.body.classList.add('loaded');

        // Force reveal elements visible (fallback for IntersectionObserver)
        forceReveal(root);

        // Page enter animation + re-init counters / image fades
        if (typeof window.mAnimEnter === 'function') window.mAnimEnter();
        else root.style.opacity = '1';
      })
      .catch(function () {
        location.href = href;
      });
  }

  // Intercept internal link clicks
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
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

  // Force reveal on initial page load too (in case IntersectionObserver misses elements)
  forceReveal(document);

  history.replaceState({ href: location.href }, '', location.href);

})();
