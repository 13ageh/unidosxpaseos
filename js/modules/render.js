import { getEvents } from './data.js';

export function renderEvents() {
  const container = document.getElementById('activities-container');
  if (!container) return;

  const events = getEvents();
  container.innerHTML = ''; // Limpiamos el contenedor

  events.forEach(event => {
    let cardHTML = '';

    if (event.featured) {
      // Diseño para el evento destacado (grande)
      cardHTML = `
        <article class="event-card event-featured">
          ${event.image ? `<div class="event-image">
            <img src="${event.image}" alt="${event.title}" />
            <span class="event-date-badge"><strong>${event.dateDay}</strong> ${event.dateMonth}</span>
          </div>` : ''}
          <div class="event-content">
            <span class="event-tag">${event.tag}</span>
            <h3>${event.title}</h3>
            <div class="event-details">
              <p>📍 <strong>Ubicación:</strong> ${event.location}</p>
              <p>⏰ <strong>Horario:</strong> ${event.time}</p>
            </div>
            <p class="event-desc">${event.desc}</p>
            <a href="#" class="btn btn-primary btn-sm" style="align-self: flex-start;">Ver detalles del evento</a>
          </div>
        </article>
      `;
    } else {
      // Diseño para eventos normales (pequeños)
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
            <p class="event-desc">${event.desc}</p>
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
}