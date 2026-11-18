export async function renderEvents() {
  const container = document.getElementById('activities-container');
  if (!container) return;

  try {
    const response = await fetch('http://localhost:3000/api/events');
    const events = await response.json();

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
    container.innerHTML = '<p style="text-align:center; width:100%;">Error al conectar con el servidor.</p>';
  }
}