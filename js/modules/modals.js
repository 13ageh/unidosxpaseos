export function initModals() {
  // Funciones globales para que funcionen desde el HTML (onclick)
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

  // Cerrar modal al hacer clic en el fondo oscuro
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        cerrarModal(overlay.id);
      }
    });
  });
}