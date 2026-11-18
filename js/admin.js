import { getEvents, addEvent, updateEvent, deleteEvent } from './modules/data.js';

document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // 1. LÓGICA DE CERRAR SESIÓN
  // ==========================================
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      // Destruimos la sesión
      localStorage.removeItem('paseos_token');
      localStorage.removeItem('paseos_user');
      // Redirigimos a la página principal
      window.location.href = 'index.html';
    });
  }

  // ==========================================
  // 2. LÓGICA DEL PANEL DE ADMINISTRACIÓN
  // ==========================================
  const form = document.getElementById('event-form');
  const tableBody = document.getElementById('events-table-body');
  const formTitle = document.getElementById('form-title');
  const btnCancel = document.getElementById('btn-cancel');

  // Cargar la tabla al iniciar
  renderTable();

  // Manejar el envío del formulario (Crear o Editar)
  form.addEventListener('submit', (e) => {
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

    if (id) {
      // Si hay ID, estamos editando
      updateEvent(eventData);
    } else {
      // Si no, estamos creando uno nuevo
      addEvent(eventData);
    }

    resetForm();
    renderTable();
  });

  // Cancelar edición
  btnCancel.addEventListener('click', resetForm);

  // Función para pintar la tabla
  function renderTable() {
    const events = getEvents();
    tableBody.innerHTML = '';

    if(events.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay actividades registradas.</td></tr>';
      return;
    }

    events.forEach(event => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${event.dateDay} ${event.dateMonth}</td>
        <td><strong>${event.title}</strong></td>
        <td>${event.tag}</td>
        <td>${event.featured ? '✅ Sí' : '❌ No'}</td>
        <td>
          <button class="action-btn btn-edit" onclick="editEvent('${event.id}')">Editar</button>
          <button class="action-btn btn-delete" onclick="removeEvent('${event.id}')">Borrar</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Función para cargar datos en el formulario (Editar)
  window.editEvent = function(id) {
    const events = getEvents();
    const event = events.find(e => e.id === id);
    if (!event) return;

    document.getElementById('event-id').value = event.id;
    document.getElementById('event-title').value = event.title;
    document.getElementById('event-tag').value = event.tag;
    document.getElementById('event-day').value = event.dateDay;
    document.getElementById('event-month').value = event.dateMonth;
    document.getElementById('event-location').value = event.location;
    document.getElementById('event-time').value = event.time;
    document.getElementById('event-desc').value = event.desc;
    document.getElementById('event-image').value = event.image || '';
    document.getElementById('event-featured').checked = event.featured;

    formTitle.textContent = 'Editar Actividad';
    btnCancel.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Función para borrar
  window.removeEvent = function(id) {
    if (confirm('¿Estás seguro de que quieres borrar esta actividad?')) {
      deleteEvent(id);
      renderTable();
    }
  }

  // Limpiar formulario
  function resetForm() {
    form.reset();
    document.getElementById('event-id').value = '';
    formTitle.textContent = 'Crear Nueva Actividad';
    btnCancel.style.display = 'none';
  }
});