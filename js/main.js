document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // 1. LÓGICA DEL MENÚ MÓVIL (HAMBURGUESA)
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');

  if (mobileMenuBtn && navMenu) {
    // Abrir/Cerrar al hacer clic en las 3 líneas
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('is-open');
    });

    // Cerrar el menú automáticamente si se da clic en un enlace
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
      });
    });
  }

  // ==========================================
  // 2. ANIMACIONES AL HACER SCROLL
  // ==========================================
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Elementos a animar
  const elementsToAnimate = document.querySelectorAll('.proj-card, .event-card, .hero-card, .section-title');
  
  elementsToAnimate.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// Inyectamos la clase visible para la animación
const style = document.createElement('style');
style.innerHTML = `
  .visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);