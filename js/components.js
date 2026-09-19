/**
 * Shared layout components injected into every page.
 * Set data-page on <body> for active nav highlighting (e.g. data-page="home").
 */
(function () {
  const currentPage = document.body.dataset.page || '';

  const navLinks = [
    { label: 'Home', href: 'index.html', page: 'home' },
    { label: 'About', href: 'about.html', page: 'about' },
    // { label: 'Our Process', href: 'process.html', page: 'process' },
    { label: 'Services', href: 'services.html', page: 'services' },
    { label: 'Case Studies', href: 'blog.html', page: 'blog' },
    // { label: 'Technology', href: 'technology.html', page: 'technology' },
    { label: 'Contact Us', href: 'contact.html', page: 'contact' },
  ];

  function isActive(page) {
    return currentPage === page;
  }

  function desktopNavItem(link) {
    const activeClass = isActive(link.page)
      ? 'underline underline-offset-8 decoration-1'
      : 'hover:text-[#2fce65]';

    if (link.children) {
      return `
        <li class="nav-dropdown relative">
          <a href="${link.href}" class="inline-flex items-center gap-1.5 ${activeClass}">
            ${link.label}
            <svg class="w-3.5 h-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </a>
          <div class="nav-dropdown-panel absolute top-full left-1/2 -translate-x-1/2 pt-4 min-w-[200px]">
            <ul class="bg-black/95 border border-white/10 rounded-lg py-2 shadow-xl">
              ${link.children
                .map(
                  (child) => `
                <li>
                  <a href="${child.href}" class="block px-5 py-2.5 text-sm text-white/90 hover:bg-white/10 hover:text-white transition-colors">
                    ${child.label}
                  </a>
                </li>`
                )
                .join('')}
            </ul>
          </div>
        </li>`;
    }

    return `
      <li>
        <a href="${link.href}" class="${activeClass}">${link.label}</a>
      </li>`;
  }

  function mobileNavItem(link) {
    if (link.children) {
      return `
        <li class="mobile-nav-dropdown border-b border-white/10">
          <button type="button" class="mobile-nav-dropdown-toggle w-full flex items-center justify-between py-4 text-left text-lg font-medium" aria-expanded="false">
            ${link.label}
            <svg class="w-5 h-5 transition-transform mobile-nav-dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <ul class="mobile-nav-dropdown-panel hidden pb-3 pl-4 space-y-2">
            ${link.children
              .map(
                (child) => `
              <li>
                <a href="${child.href}" class="block py-2 text-white/70 hover:text-white">${child.label}</a>
              </li>`
              )
              .join('')}
          </ul>
        </li>`;
    }

    const activeClass = isActive(link.page) ? 'text-white' : 'text-white/70';
    return `
      <li class="border-b border-white/10">
        <a href="${link.href}" class="block py-4 text-lg font-medium ${activeClass} hover:text-white">${link.label}</a>
      </li>`;
  }

  const headerHTML = `
    <header id="site-header" class="site-header fixed top-0 left-0 right-0 z-50 text-white">
      <div class="site-header-inner">
        <div class="site-header-bar flex items-center w-full min-w-0 h-[65px] md:h-[70px] gap-3">
          <!-- Logo -->
          <a href="index.html" class="site-header-brand shrink-0 min-w-0 group">
            <img src="assets/images/glaubark_logo.png" alt="Glaubark" class="site-header-logo-img" />
          </a>

          <!-- Desktop Nav -->
          <nav class="site-header-nav" aria-label="Main navigation">
            <ul class="flex items-center gap-8 xl:gap-10 text-[15px] font-normal">
              ${navLinks.map(desktopNavItem).join('')}
            </ul>
          </nav>

          <!-- Mobile menu button -->
          <button
            id="mobile-menu-btn"
            type="button"
            class="site-header-menu-btn relative z-10 ml-auto shrink-0 flex items-center justify-center w-10 h-10"
            aria-label="Open menu"
            aria-expanded="false"
            aria-controls="mobile-drawer"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-width="1.5" d="M4 7h16M4 12h16M4 17h16"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile overlay -->
    <div id="mobile-overlay" class="mobile-overlay fixed inset-0 z-[60] bg-black/60 lg:hidden" aria-hidden="true"></div>

    <!-- Mobile drawer -->
    <aside
      id="mobile-drawer"
      class="mobile-drawer fixed top-0 right-0 z-[70] h-full w-[min(100%,320px)] bg-black text-white lg:hidden flex flex-col"
      aria-label="Mobile navigation"
      aria-hidden="true"
    >
      <div class="flex items-center justify-between px-5 h-[72px] border-b border-white/10">
        <a href="index.html" class="site-drawer-brand">
          <img src="assets/images/glaubark_logo.png" alt="Glaubark" class="site-drawer-logo-img" />
        </a>
        <button id="mobile-menu-close" type="button" class="w-10 h-10 flex items-center justify-center -mr-2" aria-label="Close menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <nav class="flex-1 overflow-y-auto px-5 py-2">
        <ul>
          ${navLinks.map(mobileNavItem).join('')}
        </ul>
      </nav>
    </aside>
  `;

  const footerColumns = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: 'about.html' },
        { label: 'Our Team', href: 'about.html#team' },
        { label: 'Careers', href: 'about.html#careers' },
        { label: 'Contact', href: 'contact.html' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { label: 'Our Services', href: 'services.html' },
        { label: 'Regenerative Farming', href: 'services.html#regenerative-farming' },
        { label: 'Carbon Credits', href: 'services.html#carbon-project' },
        { label: 'MRV Systems', href: 'services.html#mrv-systems' },
        { label: 'VCS Project Support', href: 'services.html#vcs-support' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', href: 'blog.html' },
        { label: 'Case Studies', href: 'blog.html#cases' },
        { label: 'News & Updates', href: 'blog.html#news' },
        { label: 'FAQs', href: 'contact.html#faq' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: 'privacy.html' },
        { label: 'Terms of Service', href: 'terms.html' },
      ],
    },
  ];

  const newsletterHTML = `
    <section class="site-newsletter-section" aria-labelledby="site-newsletter-heading">
      <div class="site-newsletter-inner">
        <div class="site-newsletter-grid">
          <div>
            <p class="site-newsletter-eyebrow">Newsletter</p>
            <h2 id="site-newsletter-heading" class="site-newsletter-title">Stay connected with Glaubark</h2>
            <p class="site-newsletter-desc">
              Farmer programs, carbon project updates, and field stories from across India — a few times a year, never more.
            </p>
          </div>

          <div>
            <form id="newsletter-form" class="site-newsletter-form" data-newsletter-form novalidate>
              <label for="newsletter-email" class="sr-only">Email address</label>
              <input
                type="email"
                id="newsletter-email"
                name="email"
                autocomplete="email"
                placeholder="Enter your email address"
                required
                class="site-newsletter-input"
              />
              <button type="submit" class="site-newsletter-submit" data-newsletter-submit>
                <span class="btn-label">Subscribe</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
                <span class="btn-spinner" aria-hidden="true"></span>
              </button>
            </form>
            <p class="site-newsletter-note">No spam. Unsubscribe any time.</p>
          </div>
        </div>
      </div>
    </section>
  `;

  const footerHTML = `
    <footer class="site-footer">
      <div class="site-footer-inner">
        <div class="site-footer-grid">
          <div class="site-footer-col site-footer-brand">
            <a href="index.html" class="site-footer-logo">
              <img src="assets/images/glaubark_logo.png" alt="Glaubark" class="site-footer-logo-img" />
            </a>
            <p class="site-footer-tagline">
              Regenerative farming &amp; carbon credits for India&rsquo;s farmers.
            </p>
            <div class="site-footer-socials">
              <a href="https://www.linkedin.com/company/glaubark/" class="site-footer-social" aria-label="Glaubark on LinkedIn" target="_blank" rel="noopener noreferrer" data-magnetic data-magnetic-strength="0.5">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="mailto:hello@glaubarksolutions.com" class="site-footer-social" aria-label="Email Glaubark" data-magnetic data-magnetic-strength="0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </a>
            </div>
          </div>

          <div class="site-footer-links">
            <div class="site-footer-link-grid">
              ${footerColumns
                .map(
                  (col, i) => `
                <div class="footer-accordion-item site-footer-col" data-footer-accordion>
                  <button
                    type="button"
                    class="footer-accordion-toggle"
                    aria-expanded="false"
                    aria-controls="footer-panel-${i}"
                  >
                    <span class="site-footer-col-title">${col.title}</span>
                    <svg class="footer-accordion-icon w-4 h-4 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  <div id="footer-panel-${i}" class="footer-accordion-content md:!max-h-none md:overflow-visible">
                    <ul class="site-footer-list">
                      ${col.links
                        .map(
                          (link) => `
                        <li>
                          <a href="${link.href}" class="footer-link">${link.label}</a>
                        </li>`
                        )
                        .join('')}
                    </ul>
                  </div>
                </div>`
                )
                .join('')}
            </div>
          </div>

          <div class="site-footer-col site-footer-signup">
            <p class="site-footer-col-title">Field notes</p>
            <p class="site-footer-signup-lead">Program updates and farmer stories, a few times a year.</p>
            <form id="footer-newsletter-form" class="footer-newsletter-form" data-newsletter-form novalidate>
              <label for="footer-newsletter-email" class="sr-only">Email address</label>
              <div class="site-footer-signup-row">
                <input
                  type="email"
                  id="footer-newsletter-email"
                  name="email"
                  autocomplete="email"
                  placeholder="Your email"
                  required
                  class="site-footer-signup-input"
                />
                <button type="submit" class="site-footer-signup-btn" data-newsletter-submit>
                  <span class="btn-label">Subscribe</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                  <span class="btn-spinner" aria-hidden="true"></span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="site-footer-bar">
          <p>&copy; ${new Date().getFullYear()} Glaubark Solutions. All rights reserved.</p>
        </div>
      </div>

      <div class="site-footer-mark-band" aria-hidden="true">
        <span class="site-footer-mark">glaubark</span>
      </div>
    </footer>
  `;

  window.GlaubarkComponents = {
    headerHTML,
    newsletterHTML,
    footerHTML,
  };
})();
