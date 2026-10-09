/* =========================================================
   UNIDOS POR PASEOS — Interacciones base
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Año en footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menú móvil ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });

    // Cierra el menú al hacer click en un enlace
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Filtros de anuncios ---------- */
  const chips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('#cards .card');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      const filter = chip.dataset.filter;

      cards.forEach(card => {
        const type = card.dataset.type;
        const show = filter === 'todos' || type === filter;

        card.style.display = show ? '' : 'none';
        if (show) {
          card.style.animation = 'none';
          // forzar reflow para reiniciar animación
          void card.offsetWidth;
          card.style.animation = 'fadeIn 0.35s ease';
        }
      });
    });
  });

  /* ---------- Fade-in on scroll ---------- */
  const animatedSelectors = [
    '.card',
    '.service',
    '.mini-card',
    '.featured-card',
    '.about-inner > *',
    '.contact-inner > *'
  ];

  const animated = document.querySelectorAll(animatedSelectors.join(','));
  animated.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animated.forEach(el => observer.observe(el));

  /* ---------- Smooth scroll con offset del header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerH = document.querySelector('.site-header')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});