// Datos por defecto (los que ya tenías)
const defaultEvents = [
  {
    id: "1",
    featured: true,
    tag: "Evento Especial",
    title: "Bazar de Halloween",
    dateDay: "31",
    dateMonth: "OCT",
    location: "Parque en Felipe Zetter (entre Rafael Vaca y Marlla Arzate)",
    time: "12:00 PM a 8:00 PM",
    desc: "Comida típica, regalos, ropa, artículos para mascotas y más. ¡Asiste, consume local y celebremos nuestras raíces!",
    image: "assets/img/bazar-halloween.jpg"
  },
  {
    id: "2",
    featured: false,
    tag: "Comunidad",
    title: "Jornada de Limpieza",
    dateDay: "15",
    dateMonth: "NOV",
    location: "Casa de Colonos",
    time: "08:00 AM",
    desc: "Mantenimiento de áreas verdes y recolección de basura en los parques principales. Trae tus guantes.",
    image: ""
  },
  {
    id: "3",
    featured: false,
    tag: "Asamblea",
    title: "Asamblea Vecinal",
    dateDay: "25",
    dateMonth: "NOV",
    location: "Casa de Colonos",
    time: "10:00 AM",
    desc: "Presentación de avances del Plan Maestro y toma de decisiones sobre el presupuesto del próximo año.",
    image: ""
  }
];

export function getEvents() {
  const saved = localStorage.getItem('paseos_events');
  if (saved) {
    return JSON.parse(saved);
  } else {
    // Si no hay nada guardado, guardamos los por defecto
    localStorage.setItem('paseos_events', JSON.stringify(defaultEvents));
    return defaultEvents;
  }
}

export function saveEvents(events) {
  localStorage.setItem('paseos_events', JSON.stringify(events));
}

export function deleteEvent(id) {
  let events = getEvents();
  events = events.filter(e => e.id !== id);
  saveEvents(events);
}

export function addEvent(event) {
  let events = getEvents();
  events.push(event);
  saveEvents(events);
}

export function updateEvent(updatedEvent) {
  let events = getEvents();
  const index = events.findIndex(e => e.id === updatedEvent.id);
  if (index !== -1) {
    events[index] = updatedEvent;
    saveEvents(events);
  }
}