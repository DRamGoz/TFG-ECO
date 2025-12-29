// ==========================
// CONFIGURACIÓN GLOBAL
// ==========================
const API_URL = "https://script.google.com/macros/s/TU_URL_AQUI/exec"; // Tu URL del Apps Script

let stars = [];              // fondo de estrellas
let userStar = null;         // estrella única del usuario
let showUserText = false;    // controlar el texto junto a la estrella
let textTimer = 0;           // temporizador del texto
const numStars = 200;        // cantidad de estrellas de fondo

// --------------------------
// Rastro del mouse
// --------------------------
let mouseTrail = [];         // array de puntos del rastro
const maxTrail = 500;        // máximo de puntos visibles
let rastroActivo = false;    // se activa tras el click
const trailSize = 6;         // tamaño de cada gota
let lastSend = 0;            // para throttling de envío
const sendInterval = 100;    // ms entre envíos al Sheet

// ==========================
// SETUP
// ==========================
function setup() {
  createCanvas(windowWidth, windowHeight).parent("app");

  // Generar estrellas de fondo
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 5),
      alpha: random(50, 200)
    });
  }

  // Botón y texto
  const btn = document.getElementById("sendBtn");
  const infoText = document.getElementById("infoText");

  btn.addEventListener("click", () => {
    if (!userStar) {
      enviarDato();       // primer click

      rastroActivo = true; // activar rastro de mouse

      // generar estrella única del usuario
      userStar = {
        x: random(width * 0.2, width * 0.8),
        y: random(height * 0.2, height * 0.8),
        size: random(10, 20),
        alpha: 50,
        maxAlpha: 255
      };

      // mostrar texto junto a la estrella
      showUserText = true;
      textTimer = millis();

      // desaparecer botón y texto principal
      [btn, infoText].forEach(el => {
        el.style.transition = "opacity 1s ease";
        el.style.opacity = 0;
        setTimeout(() => el.style.display = "none", 1000);
      });
    }
  });
}

// ==========================
// DRAW
// ==========================
function draw() {
  background(0);

  // Dibujar estrellas de fondo
  noStroke();
  for (let s of stars) {
    fill(255, s.alpha);
    ellipse(s.x, s.y, s.size);
  }

  // Dibujar halo pulsante de la estrella del usuario
  if (userStar) {
    // fade-in de la estrella
    if (userStar.alpha < userStar.maxAlpha) userStar.alpha += 5;

    // pulso del halo
    let haloPulse = sin(frameCount * 0.03) * 5;

    // halo difuso
    fill(0, 200, 255, 20);
    ellipse(userStar.x, userStar.y, (userStar.size + 20 + haloPulse) * 2);

    // estrella estática con brillo oscilante
    fill(0, 200, 255, userStar.alpha);
    ellipse(userStar.x, userStar.y, userStar.size * 2);
  }

  // Dibujar texto junto a la estrella
  if (showUserText && userStar) {
    fill(255, 255, 255, 120);
    textAlign(LEFT, CENTER);
    textSize(12);
    text("Aquí tu huella. Gracias", userStar.x + 15, userStar.y);

    // desaparecer texto tras 2 segundos
    if (millis() - textTimer > 2000) {
      showUserText = false;
    }
  }

  // --------------------------
  // Dibujar rastro de mouse
  // --------------------------
  if (rastroActivo) {
    noStroke();
    for (let p of mouseTrail) {
      let nx = p.x + random(-1.5, 1.5); // ruido orgánico
      let ny = p.y + random(-1.5, 1.5);
      fill(0, 200, 255, 150);
      ellipse(nx, ny, trailSize);
    }
  }
}

// ==========================
// EVENTOS
// ==========================
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseMoved() {
  if (!rastroActivo) return;

  // Guardar punto en el array
  mouseTrail.push({ x: mouseX, y: mouseY });
  if (mouseTrail.length > maxTrail) mouseTrail.shift();

  // Enviar al Sheet con throttling
  const now = millis();
  if (now - lastSend > sendInterval) {
    enviarDato(); // función que envía timestamp, valor, x, y
    lastSend = now;
  }
}

// ==========================
// FUNCIONES AUXILIARES
// ==========================
function enviarDato() {
  if (!rastroActivo) return;

  const data = new URLSearchParams();
  data.append("valor", "click");
  data.append("x", mouseX);
  data.append("y", mouseY);

  fetch(API_URL, {
    method: "POST",
    body: data
  })
    .then(r => r.text())
    .then(console.log)
    .catch(console.error);
}


