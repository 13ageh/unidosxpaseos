export function initModals() {
  // Funciones globales para abrir y cerrar
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

  // --- LÓGICA DE LOGIN REAL CONECTADO AL BACKEND ---
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const userEmail = document.getElementById('login-user').value;
      const userPass = document.getElementById('login-pass').value;
      const btnSubmit = loginForm.querySelector('button[type="submit"]');
      const originalText = btnSubmit.textContent;

      // Cambiamos el botón para que el usuario sepa que está cargando
      btnSubmit.textContent = 'Entrando...';
      btnSubmit.disabled = true;

      try {
        // Hacemos la petición a nuestro servidor Node.js local
        const response = await fetch('https://api.unidosxpaseos.com.mx/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            email: userEmail, 
            password: userPass 
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Login exitoso
          alert(`¡Bienvenido, ${data.user.name}!`);
          
          // Guardamos el token y los datos del usuario en el navegador
          localStorage.setItem('paseos_token', data.token);
          localStorage.setItem('paseos_user', JSON.stringify(data.user));
          
          // Redirigimos al panel de administración
          window.location.href = 'admin.html';
        } else {
          // Error (contraseña incorrecta, cuenta bloqueada, etc.)
          alert(data.error || 'Error al iniciar sesión');
        }

      } catch (error) {
        console.error('Error de conexión:', error);
        alert('No se pudo conectar con el servidor. Asegúrate de que el backend esté encendido.');
      } finally {
        // Restauramos el botón
        btnSubmit.textContent = originalText;
        btnSubmit.disabled = false;
      }
    });
  }
}