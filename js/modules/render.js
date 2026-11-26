// Convierte el texto del día y mes a un objeto Date real y válido
function getRealDate(day, monthStr) {
  const months = { ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5, JUL: 6, AGO: 7, SEP: 8, OCT: 9, NOV: 10, DIC: 11 };
  
  if (!monthStr || months[monthStr.toUpperCase()] === undefined) {
    return new Date(8640000000000000); // Si no hay mes, va al final
  }
  
  // Extraemos solo el PRIMER número que encuentre. De "19 y 20" saca "19".
  const match = String(day).match(/\d+/);
  if (!match) {
    return new Date(8640000000000000); // Si no hay ningún número, va al final
  }
  
  const dayNum = parseInt(match[0]);
  const month = months[monthStr.toUpperCase()];
  const year = new Date().getFullYear();
  
  let eventDate = new Date(year, month, dayNum);
  
  // Si la fecha ya pasó, asumimos que es el próximo año
  const today = new Date();
  today.setHours(0,0,0,0); 
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

    // ORDENAMIENTO
    const sortedEvents = events.map(e => {
      const realDate = getRealDate(e.dateDay, e.dateMonth);
      console.log(`Evento: ${e.title}, Fecha calculada: ${realDate}`); // Esto te ayudará a debuggear en consola
      return { ...e, realDate };
    }).sort((a, b) => a.realDate - b.realDate);

    // TARJETA DEL HERO
    const heroTitle = document.getElementById('hero-event-title');
    const heroDate = document.getElementById('hero-event-date');
    const heroDesc = document.getElementById('hero-event-desc');

    const nextEvent = sortedEvents.length > 0 ? sortedEvents[0] : null;
    
    // Verificamos que la fecha no sea la "fecha máxima" de relleno
    if (nextEvent && nextEvent.realDate.getTime() !== 8640000000000000) {
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

    // PINTAR TARJETAS
    container.innerHTML = ''; 

    if (sortedEvents.length === 0) {
      container.innerHTML = '<p style="text-align:center; width:100%;">Próximamente habrá nuevas actividades.</p>';
      return;
    }

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