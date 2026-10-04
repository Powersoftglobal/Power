/* ======================================================
   Power Soft – Inner Pages Shared JS
   ====================================================== */

(function () {
  'use strict';

  // ---- Theme ----
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('psg-theme') || 'light';
  root.setAttribute('data-theme', savedTheme);

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('psg-theme', next);
    });
  });

  // ---- Scroll Progress ----
  const bar = document.getElementById('scroll-progress');
  if (bar) {
    window.addEventListener('scroll', () => {
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // ---- Mobile Drawer ----
  const mobileBtn = document.getElementById('mobileNavToggle');
  const closeBtn  = document.getElementById('drawerCloseBtn');
  const drawer    = document.getElementById('mobileDrawer');
  const overlay   = document.getElementById('drawerOverlay');

  function openDrawer()  { drawer?.classList.add('open'); overlay?.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { drawer?.classList.remove('open'); overlay?.classList.remove('open'); document.body.style.overflow = ''; }

  mobileBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);
  document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', closeDrawer));

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ---- Highlight active nav link ----
  const currentPage = location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  // ---- Animate on scroll (simple IntersectionObserver) ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .step, .stat-box, .tech-pill, .testimonial-card').forEach(el => {
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
  });

  // ---- Counter animation for stat numbers ----
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target || el.textContent);
    if (isNaN(target)) return;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target * eased;
      el.textContent = prefix + (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

  // ---- Dynamic Copyright Year ----
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('#copyright-year, .copyright-year').forEach(el => {
    el.textContent = currentYear;
  });

})();
