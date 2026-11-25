// Función para convertir "28" y "NOV" a un objeto Date real
function getRealDate(day, monthStr) {
  const months = { ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5, JUL: 6, AGO: 7, SEP: 8, OCT: 9, NOV: 10, DIC: 11 };
  const month = months[monthStr.toUpperCase()] !== undefined ? months[monthStr.toUpperCase()] : 0;
  const year = new Date().getFullYear();
  
  let eventDate = new Date(year, month, parseInt(day));
  
  // Si la fecha ya pasó este año, asumimos que es para el próximo año
  if (eventDate < new Date()) {
    eventDate.setFullYear(year + 1);
  }
  return eventDate;
}

export async function renderEvents() {
  const container = document.getElementById('activities-container');
  if (!container) return;

  try {
    const response = await fetch('https://api.unidosxpaseos.com.mx/api/events');
    const events = await response.json();

    // ==========================================
    // 1. PINTAR LA TARJETA DEL HERO (El evento más cercano)
    // ==========================================
    const heroTitle = document.getElementById('hero-event-title');
    const heroDate = document.getElementById('hero-event-date');
    const heroDesc = document.getElementById('hero-event-desc');

    if (events.length > 0) {
      // Ordenamos los eventos por fecha real (del más cercano al más lejano)
      const sortedEvents = events.map(e => ({
        ...e,
        realDate: getRealDate(e.dateDay, e.dateMonth)
      })).sort((a, b) => a.realDate - b.realDate);

      const nextEvent = sortedEvents[0]; // Tomamos el primero (el más cercano)

      if (heroTitle) {
        heroTitle.textContent = nextEvent.title;
        heroDate.textContent = `${nextEvent.dateDay} de ${nextEvent.dateMonth} · ${nextEvent.time}`;
        heroDesc.textContent = nextEvent.description;
      }
    } else {
      if (heroTitle) {
        heroTitle.textContent = "No hay eventos próximos";
        heroDate.textContent = "Mantente al pendiente";
        heroDesc.textContent = "Pronto publicaremos nuevas actividades para la comunidad.";
      }
    }

    // ==========================================
    // 2. PINTAR LA SECCIÓN DE ACTIVIDADES (La cuadrícula)
    // ==========================================
    container.innerHTML = ''; 

    if (events.length === 0) {
      container.innerHTML = '<p style="text-align:center; width:100%;">Próximamente habrá nuevas actividades.</p>';
      return;
    }

    events.forEach(event => {
      let cardHTML = '';
      const imgUrl = event.image_url ? event.image_url : '';

      if (event.is_featured) {
        cardHTML = `
          <article class="event-card event-featured">
            ${imgUrl ? `<div class="event-image">
              <img src="${imgUrl}" alt="${event.title}" />
              <span class="event-date-badge"><strong>${event.dateDay}</strong> ${event.dateMonth}</span>
            </div>` : ''}
            <div class="event-content">
              <span class="event-tag">${event.tag}</span>
              <h3>${event.title}</h3>
              <div class="event-details">
                <p>📍 <strong>Ubicación:</strong> ${event.location}</p>
                <p>⏰ <strong>Horario:</strong> ${event.time}</p>
              </div>
              <p class="event-desc">${event.description}</p>
              <a href="#" class="btn btn-primary btn-sm" style="align-self: flex-start;">Ver detalles del evento</a>
            </div>
          </article>
        `;
      } else {
        cardHTML = `
          <article class="event-card">
            <div class="event-content">
              <span class="event-tag">${event.tag}</span>
              <div class="event-header-row">
                <div class="event-date-small">
                  <strong>${event.dateDay}</strong><span>${event.dateMonth}</span>
                </div>
                <h3>${event.title}</h3>
              </div>
              <p class="event-desc">${event.description}</p>
              <div class="event-details">
                <p>📍 <strong>Ubicación:</strong> ${event.location}</p>
                <p>⏰ <strong>Horario:</strong> ${event.time}</p>
              </div>
            </div>
          </article>
        `;
      }
      container.innerHTML += cardHTML;
    });
  } catch (error) {
    console.error("Error cargando eventos:", error);
    if(container) container.innerHTML = '<p style="text-align:center; width:100%;">Error al conectar con el servidor.</p>';
  }
}