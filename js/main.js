// ==========================================
// LÓGICA GLOBAL DE MODALES
// ==========================================
window.abrirModal = function(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Bloquea el scroll de la página
  }
}

window.cerrarModal = function(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Reactiva el scroll
  }
}

document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // 1. CERRAR MODAL AL HACER CLIC EN EL FONDO
  // ==========================================
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      // Si el clic fue directamente en el fondo oscuro, cerramos el modal
      if (e.target === overlay) {
        cerrarModal(overlay.id);
      }
    });
  });

  // ==========================================
  // 2. LÓGICA DEL MENÚ MÓVIL (HAMBURGUESA)
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');

  if (mobileMenuBtn && navMenu) {
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
  // 3. ANIMACIONES AL HACER SCROLL
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

  const elementsToAnimate = document.querySelectorAll('.proj-card, .event-card, .hero-card, .section-title');
  
  elementsToAnimate.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// Inyectamos la clase visible para las animaciones
const style = document.createElement('style');
style.innerHTML = `
  .visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);