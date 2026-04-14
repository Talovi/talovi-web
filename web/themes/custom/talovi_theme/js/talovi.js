/**
 * @file
 * Talovi Theme JavaScript behaviors.
 */

(function (Drupal) {
  'use strict';

  /**
   * Mobile menu toggle behavior.
   */
  Drupal.behaviors.taloviMobileMenu = {
    attach: function (context) {
      const hamburger = context.querySelector('.hamburger');
      if (!hamburger || hamburger.dataset.taloviInit) return;
      hamburger.dataset.taloviInit = 'true';

      // Nav is a sibling of the hamburger inside .talovi-header.
      const header = hamburger.closest('.talovi-header');
      const menu = header ? header.querySelector('nav.talovi-nav ul') : null;

      if (!menu) return;

      hamburger.addEventListener('click', function () {
        const isOpen = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!isOpen));
        menu.classList.toggle('menu-open', !isOpen);
      });

      // Close menu on outside click.
      document.addEventListener('click', function (e) {
        if (!header.contains(e.target) && menu.classList.contains('menu-open')) {
          menu.classList.remove('menu-open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });

      // Close menu when a link is clicked
      menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          menu.classList.remove('menu-open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }
  };

  /**
   * Scrolled class on header behavior.
   */
  Drupal.behaviors.taloviHeaderScroll = {
    attach: function () {
      const header = document.querySelector('.talovi-header');
      if (!header || header.dataset.scrollInit) return;
      header.dataset.scrollInit = 'true';

      const SCROLL_THRESHOLD = 10;

      function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // Apply on initial load
    }
  };

  /**
   * Smooth scroll for anchor links.
   */
  Drupal.behaviors.taloviSmoothScroll = {
    attach: function (context) {
      const links = context.querySelectorAll('a[href^="#"]');

      links.forEach(function (link) {
        if (link.dataset.smoothInit) return;
        link.dataset.smoothInit = 'true';

        link.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href').slice(1);
          if (!targetId) return;

          const target = document.getElementById(targetId);
          if (!target) return;

          e.preventDefault();

          const headerHeight = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '64',
            10
          );

          const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });

          // Update URL without jumping
          history.pushState(null, '', '#' + targetId);
        });
      });
    }
  };

})(Drupal);
