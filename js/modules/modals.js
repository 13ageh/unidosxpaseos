export function initModals() {
  // Funciones globales
  window.abrirModal = function(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  window.cerrarModal = function(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        cerrarModal(overlay.id);
      }
    });
  });

  // --- LÓGICA DE LOGIN ADMIN ---
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('login-user').value;
      const pass = document.getElementById('login-pass').value;

      if (user === 'adminpaseos10' && pass === 'PaseosUnidos10') {
        // Credenciales correctas
        window.location.href = 'admin.html';
      } else {
        alert('Usuario o contraseña incorrectos. Intenta de nuevo.');
      }
    });
  }
}