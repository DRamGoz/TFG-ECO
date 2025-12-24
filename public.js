const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

let stars = [];        // fondo de estrellas
let userStar = null;   // estrella única del usuario
let showUserText = false; // controlar el texto
let textTimer = 0;     // temporizador del texto
const numStars = 100;  // cantidad de estrellas de fondo

function setup() {
  createCanvas(windowWidth, windowHeight).parent("app");

  // generar estrellas de fondo
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      alpha: random(50, 150)
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
        baseSize: random(6, 10),
        size: 0,
        alpha: 0,
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

  // dibujar estrella del usuario
  if (userStar) {
    // fade-in
    if (userStar.alpha < userStar.maxAlpha) userStar.alpha += 5;

    // pulso (oscila tamaño)
    let pulse = sin(frameCount * 0.1) * 1;
    userStar.size = userStar.baseSize + pulse;

    // brillo azul
    fill(0, 200, 255, userStar.alpha);
    ellipse(userStar.x, userStar.y, userStar.size * 2);
  }

  // dibujar texto junto a la estrella
  if (showUserText && userStar) {
    fill(255, 255, 255, 220);
    textAlign(LEFT, CENTER);
    textSize(10);
    text("Gracias", userStar.x + 15, userStar.y);

    // desaparecer texto tras 2 segundos
    if (millis() - textTimer > 2000) {
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

  fetch(API_URL, {
    method: "POST",
    body: data
  })
    .then(r => r.text())
    .then(console.log)
    .catch(console.error);
}





