/**
 * Shared layout components injected into every page.
 * Set data-page on <body> for active nav highlighting (e.g. data-page="home").
 */
(function () {
  const currentPage = document.body.dataset.page || '';

  const navLinks = [
    { label: 'Home', href: 'index.html', page: 'home' },
    {
      label: 'About',
      href: 'about.html',
      page: 'about',
      children: [
        { label: 'Our Story', href: 'about.html' },
        { label: 'Our Team', href: 'about.html#team' },
        { label: 'Mission & Vision', href: 'about.html#mission' },
      ],
    },
    { label: 'Our Process', href: 'process.html', page: 'process' },
    { label: 'Blog', href: 'blog.html', page: 'blog' },
    { label: 'Technology', href: 'technology.html', page: 'technology' },
    { label: 'Contact Us', href: 'contact.html', page: 'contact' },
  ];

  function isActive(page) {
    return currentPage === page;
  }

  function desktopNavItem(link) {
    const activeClass = isActive(link.page)
      ? 'underline underline-offset-8 decoration-1'
      : 'hover:opacity-80';

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
          <a href="index.html" class="flex items-center gap-3 shrink-0 min-w-0 group">
            <span class="w-9 h-9 md:w-10 md:h-10 text-white shrink-0">
              <img src="assets/images/logo.svg" alt="" class="w-full h-full" aria-hidden="true" />
            </span>
            <span class="text-xl md:text-2xl font-normal tracking-tight lowercase">glaubark</span>
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
        <a href="index.html" class="flex items-center gap-2.5">
          <img src="assets/images/logo.svg" alt="" class="w-8 h-8" aria-hidden="true" />
          <span class="text-lg lowercase">glaubark</span>
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
        { label: 'Regenerative Farming', href: 'technology.html' },
        { label: 'Carbon Credits', href: 'technology.html#carbon' },
        { label: 'Farmer Training', href: 'technology.html#training' },
        { label: 'Technology Platform', href: 'technology.html#platform' },
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
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
      ],
    },
  ];

  const newsletterHTML = `
    <section class="site-newsletter-section" aria-labelledby="site-newsletter-heading">
      <div class="site-newsletter-bg" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1920&q=80"
          alt=""
          class="site-newsletter-bg-img"
        />
      </div>
      <div class="site-newsletter-inner">
        <div class="site-newsletter-card">
          <div class="site-newsletter-grid">
            <h2 id="site-newsletter-heading" class="site-newsletter-title">Stay connected with Glaubark</h2>
            <div class="site-newsletter-graphic" aria-hidden="true">
              <svg class="site-newsletter-graphic-svg" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 120 80">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 58 C20 48 28 52 38 44 C48 36 58 40 68 34 C78 28 88 32 98 26"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 58 L18 46 L30 46 L30 58 Z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M52 58 L52 38 L72 38 L72 58 Z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M58 38 L65 28 L72 38"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M86 58 L86 50 L98 50 L98 58 Z"/>
                <circle cx="98" cy="22" r="7"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M95 22 L98 19 L101 22"/>
              </svg>
            </div>
            <p class="site-newsletter-desc">
              Be the first to know about farmer programs, carbon project updates, and field stories from across India.
            </p>
            <div class="site-newsletter-form-wrap">
              <form id="newsletter-form" class="site-newsletter-form" novalidate>
                <label for="newsletter-email" class="sr-only">Email address</label>
                <input
                  type="email"
                  id="newsletter-email"
                  name="email"
                  autocomplete="email"
                  placeholder="you@email.com"
                  required
                  class="site-newsletter-input"
                />
                <button type="submit" class="site-newsletter-submit group" data-newsletter-submit>
                  <span>Submit</span>
                  <span class="site-newsletter-submit-icon" aria-hidden="true">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </span>
                </button>
              </form>
              <p id="newsletter-form-status" class="form-status text-sm mt-3 hidden" role="status" aria-live="polite"></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  const footerHTML = `
    <footer class="bg-black text-white">
      <div class="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 pt-16 md:pt-20 pb-8">
        <!-- Top row -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 md:pb-16 border-b border-white/10">
          <!-- Brand -->
          <div class="lg:col-span-4">
            <a href="index.html" class="inline-flex items-center gap-3 mb-6">
              <img src="assets/images/logo.svg" alt="" class="w-10 h-10" aria-hidden="true" />
              <span class="text-2xl lowercase tracking-tight">glaubark</span>
            </a>
            <p class="text-white/60 text-sm leading-relaxed max-w-sm mb-8">
              Empowering farmers with regenerative farming solutions and carbon credits for a sustainable future.
            </p>
            <div class="flex items-center gap-4">
              <a href="#" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="LinkedIn" data-magnetic data-magnetic-strength="0.5">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Twitter" data-magnetic data-magnetic-strength="0.5">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Instagram" data-magnetic data-magnetic-strength="0.5">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          <!-- Link columns: accordion on mobile, grid on desktop -->
          <div class="lg:col-span-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-8">
              ${footerColumns
                .map(
                  (col, i) => `
                <div class="footer-accordion-item border-b border-white/10 md:border-0" data-footer-accordion>
                  <button
                    type="button"
                    class="footer-accordion-toggle w-full flex items-center justify-between py-5 md:py-0 md:pointer-events-none md:cursor-default"
                    aria-expanded="false"
                    aria-controls="footer-panel-${i}"
                  >
                    <span class="text-sm font-semibold uppercase tracking-wider">${col.title}</span>
                    <svg class="footer-accordion-icon w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  <div id="footer-panel-${i}" class="footer-accordion-content md:!max-h-none md:overflow-visible">
                    <ul class="pb-5 md:pb-0 space-y-3">
                      ${col.links
                        .map(
                          (link) => `
                        <li>
                          <a href="${link.href}" class="footer-link text-sm text-white/60 hover:text-white transition-colors">${link.label}</a>
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
        </div>

        <!-- Bottom bar -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8 text-sm text-white/50">
          <p>&copy; ${new Date().getFullYear()} Glaubark Solutions. All rights reserved.</p>
          <p>Offsetting carbon footprint for future generations.</p>
        </div>
      </div>
    </footer>
  `;

  window.GlaubarkComponents = {
    headerHTML,
    newsletterHTML,
    footerHTML,
  };
})();
