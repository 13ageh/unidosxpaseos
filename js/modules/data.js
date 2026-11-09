// Datos por defecto (los que ve todo el mundo al entrar por primera vez)
const defaultEvents = [
  {
    id: "1",
    featured: true,
    tag: "Evento Especial",
    title: "Bazar de Otoño",
    dateDay: "28",
    dateMonth: "NOV",
    location: "Parque Marlla Arzate, Paseos del Sol 2a Sección",
    time: "11:00 AM a 9:00 PM",
    desc: "Emprendedores locales, productos únicos, regalos y detalles, ropa y accesorios, ¡y muchas cosas más! ¡Ven con tu familia y disfruta de un espacio de convivencia, consume local y apoya a nuestra comunidad!",
    image: "assets/img/bazar-otono.jpg"
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

// Función para obtener los eventos
export function getEvents() {
  const saved = localStorage.getItem('paseos_events');
  if (saved) {
    return JSON.parse(saved);
  } else {
    // Si el navegador del usuario no tiene datos guardados, le mostramos los de Otoño
    localStorage.setItem('paseos_events', JSON.stringify(defaultEvents));
    return defaultEvents;
  }
}

// Función para guardar cambios (desde el admin)
export function saveEvents(events) {
  localStorage.setItem('paseos_events', JSON.stringify(events));
}

// Función para borrar (desde el admin)
export function deleteEvent(id) {
  let events = getEvents();
  events = events.filter(e => e.id !== id);
  saveEvents(events);
}

// Función para agregar (desde el admin)
export function addEvent(event) {
  let events = getEvents();
  events.push(event);
  saveEvents(events);
}

// Función para editar (desde el admin)
export function updateEvent(updatedEvent) {
  let events = getEvents();
  const index = events.findIndex(e => e.id === updatedEvent.id);
  if (index !== -1) {
    events[index] = updatedEvent;
    saveEvents(events);
  }
}