// Función para convertir el texto del mes y día a un objeto Date real
function getRealDate(day, monthStr) {
  // Diccionario de meses
  const months = { ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5, JUL: 6, AGO: 7, SEP: 8, OCT: 9, NOV: 10, DIC: 11 };
  
  // Si no hay mes o el mes no es válido, lo mandamos al final de la lista (fecha máxima)
  if (!monthStr || months[monthStr.toUpperCase()] === undefined) {
    return new Date(8640000000000000); 
  }
  
  // Extraemos solo el primer número en caso de que el usuario haya escrito "19 y 20"
  const dayNum = parseInt(day.replace(/[^0-9]/g, ''));
  if (isNaN(dayNum)) {
    return new Date(8640000000000000); // Si no hay día, también va al final
  }

  const month = months[monthStr.toUpperCase()];
  const year = new Date().getFullYear();
  let eventDate = new Date(year, month, dayNum);
  
  // Si la fecha ya pasó este año, asumimos que es para el próximo año
  const today = new Date();
  today.setHours(0,0,0,0); // Normalizamos la hora de hoy
  if (eventDate < today) {
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

    // ORDENAR LOS EVENTOS POR FECHA (Del más próximo al más lejano)
    const sortedEvents = events.map(e => ({
      ...e,
      realDate: getRealDate(e.dateDay, e.dateMonth)
    })).sort((a, b) => a.realDate - b.realDate);

    // ==========================================
    // 1. PINTAR LA TARJETA DEL HERO (El más cercano)
    // ==========================================
    const heroTitle = document.getElementById('hero-event-title');
    const heroDate = document.getElementById('hero-event-date');
    const heroDesc = document.getElementById('hero-event-desc');

    // Verificamos si el primer evento de la lista tiene una fecha válida (no es la fecha máxima)
    const nextEvent = sortedEvents.length > 0 ? sortedEvents[0] : null;
    const hasValidNextEvent = nextEvent && nextEvent.realDate.getTime() !== 8640000000000000;

    if (hasValidNextEvent) {
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
    // 2. PINTAR LA SECCIÓN DE ACTIVIDADES (Ordenadas)
    // ==========================================
    container.innerHTML = ''; 

    if (events.length === 0) {
      container.innerHTML = '<p style="text-align:center; width:100%;">Próximamente habrá nuevas actividades.</p>';
      return;
    }

    // Iteramos sobre los eventos YA ORDENADOS
    sortedEvents.forEach(event => {
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