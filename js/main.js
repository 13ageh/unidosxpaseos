import { initModals } from './modules/modals.js';
import { initMobileMenu } from './modules/mobileMenu.js';
import { initScrollAnimations } from './modules/animations.js';

document.addEventListener("DOMContentLoaded", () => {
  // Ejecutamos todas las funciones modulares
  initModals();
  initMobileMenu();
  initScrollAnimations();
});