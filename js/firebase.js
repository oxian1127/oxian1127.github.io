/**
 * Inicialización centralizada de Firebase App, Firestore y Analytics
 * Proyecto: sistemagammy
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  runTransaction
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5-MLaDrfBEBf5YUuW0XwFjLGg9xAOqM0",
  authDomain: "sistemagammy.firebaseapp.com",
  projectId: "sistemagammy",
  storageBucket: "sistemagammy.firebasestorage.app",
  messagingSenderId: "637313755827",
  appId: "1:637313755827:web:3f43939ec301896f8a9ec6",
  measurementId: "G-JXWF74XHEE"
};

// Inicialización de la aplicación
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export let analytics = null;

// Intentar inicializar Analytics de forma no bloqueante
(async () => {
  try {
    if (await isSupported()) {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics inicializado correctamente.");
    }
  } catch (error) {
    console.warn("Analytics no está disponible en este entorno.", error);
  }
})();

// Re-exportar utilidades comunes de Firestore
export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  runTransaction
};
