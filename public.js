const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

let stars = [];        // fondo de estrellas
let userStar = null;   // estrella única del usuario
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

      // generar estrella única de usuario
      userStar = {
        x: random(width),
        y: random(height),
        size: random(6, 10),
        alpha: 0,
        maxAlpha: 255
      };

      // desaparecer botón y texto simultáneamente
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

  // dibujar estrella del usuario si existe
  if (userStar) {
    if (userStar.alpha < userStar.maxAlpha) {
      userStar.alpha += 5; // fade-in
    }
    fill(255, userStar.alpha);
    ellipse(userStar.x, userStar.y, userStar.size);
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


