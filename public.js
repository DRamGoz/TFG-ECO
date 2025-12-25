const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

let stars = [];           // fondo de estrellas
let userStar = null;      // estrella única del usuario
let showUserText = false; // controlar el texto
let textTimer = 0;        // temporizador del texto
const numStars = 200;     // cantidad de estrellas de fondo

let mouseTrail = [];      // rastro del mouse
const maxTrail = 500;     // máximo de puntos en el rastro

function setup() {
  createCanvas(windowWidth, windowHeight).parent("app");

  // generar estrellas de fondo
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 5),
      alpha: random(50, 200)
    });
  }

  const btn = document.getElementById("sendBtn");
  const infoText = document.getElementById("infoText");

  btn.addEventListener("click", () => {
    if (!userStar) {
      enviarDato();

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

function draw() {
  background(0);

  // dibujar estrellas de fondo
  noStroke();
  for (let s of stars) {
    fill(255, s.alpha);
    ellipse(s.x, s.y, s.size);
  }

  // dibujar rastro del mouse
  fill(0, 200, 255, 150);
  noStroke();
  mouseTrail.forEach(p => circle(p.x, p.y, 6));

  // dibujar halo pulsante de la estrella del usuario
  if (userStar) {
    if (userStar.alpha < userStar.maxAlpha) userStar.alpha += 5;

    let haloPulse = sin(frameCount * 0.03) * 5;
    fill(0, 200, 255, 20);
    ellipse(userStar.x, userStar.y, (userStar.size + 20 + haloPulse) * 2);

    fill(220, 10, 10, userStar.alpha);
    ellipse(userStar.x, userStar.y, userStar.size * 2);
  }

  // dibujar texto junto a la estrella
  if (showUserText && userStar) {
    fill(255, 255, 255, 120);
    textAlign(LEFT, CENTER);
    textSize(10);
    text("Gracias", userStar.x + 15, userStar.y);

    if (millis() - textTimer > 5000) {
      showUserText = false;
    }
  }
}

function mouseMoved() {
  // agregar posición al rastro
  mouseTrail.push({ x: mouseX, y: mouseY });
  if (mouseTrail.length > maxTrail) mouseTrail.shift();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function enviarDato() {
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


function draw() {
  background(0);

  // dibujar estrellas de fondo
  noStroke();
  for (let s of stars) {
    fill(255, s.alpha);
    ellipse(s.x, s.y, s.size);
  }

  // dibujar halo pulsante de la estrella del usuario
  if (userStar) {
    // fade-in de la estrella
    if (userStar.alpha < userStar.maxAlpha) userStar.alpha += 5;

    // pulso del halo
    let haloPulse = sin(frameCount * 0.03) * 5; // oscila entre -10 y +10

    // halo difuso
    fill(0, 200, 255, 20);
    ellipse(userStar.x, userStar.y, (userStar.size + 20 + haloPulse) * 2);

    // dibujar estrella estática con brillo oscilante
    fill(220, 10, 10, userStar.alpha);
    ellipse(userStar.x, userStar.y, userStar.size * 2);
  }

  // dibujar texto junto a la estrella
  if (showUserText && userStar) {
    fill(255, 255, 255, 120);
    textAlign(LEFT, CENTER);
    textSize(10);
    text("Gracias", userStar.x + 15, userStar.y);

    // desaparecer texto tras 5 segundos
    if (millis() - textTimer > 5000) {
      showUserText = false;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function enviarDato() {
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

















