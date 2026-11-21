document.addEventListener("DOMContentLoaded", async () => {
  
  // ==========================================
  // 1. LÓGICA DE CERRAR SESIÓN
  // ==========================================
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('paseos_token');
      localStorage.removeItem('paseos_user');
      window.location.href = 'index.html';
    });
  }

  // ==========================================
  // 2. CONFIGURACIÓN DE LA API
  // ==========================================
  // AQUÍ ESTÁ LA MAGIA: Apuntamos al backend en la nube de Hostinger
  const API_URL = 'https://api.unidosxpaseos.com.mx/api/events';

  const form = document.getElementById('event-form');
  const tableBody = document.getElementById('events-table-body');
  const formTitle = document.getElementById('form-title');
  const btnCancel = document.getElementById('btn-cancel');

  // Cargar la tabla al iniciar
  await renderTable();

  // ==========================================
  // 3. MANEJAR EL ENVÍO (Crear o Editar)
  // ==========================================
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('event-id').value;
    const eventData = {
      id: id || Date.now().toString(), // Genera un ID si es nuevo
      title: document.getElementById('event-title').value,
      tag: document.getElementById('event-tag').value,
      dateDay: document.getElementById('event-day').value,
      dateMonth: document.getElementById('event-month').value,
      location: document.getElementById('event-location').value,
      time: document.getElementById('event-time').value,
      desc: document.getElementById('event-desc').value,
      image: document.getElementById('event-image').value,
      featured: document.getElementById('event-featured').checked
    };

    try {
      let response;
      if (id) {
        // Si hay ID, es una EDICIÓN (PUT)
        response = await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData)
        });
      } else {
        // Si no hay ID, es CREACIÓN (POST)
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData)
        });
      }

      if (response.ok) {
        alert(id ? 'Actividad actualizada' : 'Actividad creada con éxito');
        resetForm();
        await renderTable();
      } else {
        alert('Error al guardar en la base de datos');
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert('No se pudo conectar con el servidor de Hostinger.');
    }
  });

  // Cancelar edición
  btnCancel.addEventListener('click', resetForm);

  // ==========================================
  // 4. PINTAR LA TABLA (Leer de la API)
  // ==========================================
  async function renderTable() {
    try {
      // Hacemos un GET a la base de datos en la nube
      const response = await fetch(API_URL);
      const events = await response.json();
      
      tableBody.innerHTML = '';

      if(events.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay actividades registradas en la base de datos.</td></tr>';
        return;
      }

      events.forEach(event => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${event.dateDay} ${event.dateMonth}</td>
          <td><strong>${event.title}</strong></td>
          <td>${event.tag}</td>
          <td>${event.is_featured ? '✅ Sí' : '❌ No'}</td>
          <td>
            <button class="action-btn btn-edit" onclick="editEvent('${event.id}')">Editar</button>
            <button class="action-btn btn-delete" onclick="removeEvent('${event.id}')">Borrar</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    } catch (error) {
      console.error(error);
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Error de conexión con el servidor.</td></tr>';
    }
  }

  // ==========================================
  // 5. CARGAR DATOS EN EL FORMULARIO (Editar)
  // ==========================================
  window.editEvent = async function(id) {
    try {
      const response = await fetch(API_URL);
      const events = await response.json();
      const event = events.find(e => e.id === id);
      if (!event) return;

      document.getElementById('event-id').value = event.id;
      document.getElementById('event-title').value = event.title;
      document.getElementById('event-tag').value = event.tag;
      document.getElementById('event-day').value = event.dateDay;
      document.getElementById('event-month').value = event.dateMonth;
      document.getElementById('event-location').value = event.location;
      document.getElementById('event-time').value = event.time;
      document.getElementById('event-desc').value = event.description; // Ojo: en la BD se llama description
      document.getElementById('event-image').value = event.image_url || ''; // Ojo: en la BD se llama image_url
      document.getElementById('event-featured').checked = event.is_featured === 1 || event.is_featured === true;

      formTitle.textContent = 'Editar Actividad';
      btnCancel.style.display = 'inline-block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
    }
  }

  // ==========================================
  // 6. BORRAR (Delete a la API)
  // ==========================================
  window.removeEvent = async function(id) {
    if (confirm('¿Estás seguro de que quieres borrar esta actividad permanentemente?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { 
          method: 'DELETE' 
        });
        
        if (response.ok) {
          alert('Actividad borrada');
          await renderTable();
        }
      } catch (error) {
        console.error("Error al borrar:", error);
      }
    }
  }

  // ==========================================
  // 7. LIMPIAR FORMULARIO
  // ==========================================
  function resetForm() {
    form.reset();
    document.getElementById('event-id').value = '';
    formTitle.textContent = 'Crear Nueva Actividad';
    btnCancel.style.display = 'none';
  }
});