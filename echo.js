

console.log("ECHO — Gotas de pintura activas");

const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

let gotas = [];
let idsExistentes = new Set();

function setup() {
  createCanvas(800, 600);

  cargarDatos();
  setInterval(cargarDatos, 2000);
}

function draw() {
  background(245, 40); // fondo semi-transparente

  // Contador de eventos
  fill(0);
  noStroke();
  textSize(16);
  text("ECHO — eventos registrados: " + gotas.length, 20, 20);

  // Dibujar todas las gotas
  gotas.forEach(g => g.mostrar());
}

function cargarDatos() {
  fetch(API_URL)
    .then(r => r.json())
    .then(datos => {
      datos.forEach(d => {
        if (!idsExistentes.has(d.timestamp)) {
          let g = new GotaPintura();
          gotas.push(g);
          idsExistentes.add(d.timestamp);
        }
      });
    })
    .catch(err => console.error("Error al cargar datos:", err));
}

// ==========================
// Clase GotaPintura
// ==========================
class GotaPintura {
  constructor() {
    this.x = random(80, width - 80);
    this.y = random(80, height - 80);

    this.radio = 0;
    this.radioFinal = random(20, 50); // tamaño máximo de la gota

    this.pasos = int(random(12, 20)); // número de vértices de la forma
    this.offset = random(1000);

    this.creciendo = true;

    // Color aleatorio con alpha
    this.color = color(random(255), random(255), random(255), 180);

    // Para movimiento tipo ruido
    this.noiseX = random(1000);
    this.noiseY = random(1000);
  }

  mostrar() {
    // Crecimiento gradual
    if (this.creciendo) {
      this.radio += 0.5;
      if (this.radio >= this.radioFinal) {
        this.radio = this.radioFinal;
        this.creciendo = false;
      }
    }

    // Movimiento suave tipo Perlin
    let nx = noise(this.noiseX) * 10 - 5;
    let ny = noise(this.noiseY) * 10 - 5;
    let x = this.x + nx;
    let y = this.y + ny;

    // Dibujar la forma irregular
    noStroke();
    fill(this.color);
    beginShape();
    for (let i = 0; i < this.pasos; i++) {
      let ang = map(i, 0, this.pasos, 0, TWO_PI);
      let ruido = noise(cos(ang) + this.offset, sin(ang) + this.offset);
      let r = this.radio * map(ruido, 0, 1, 0.7, 1.3);
      let px = x + cos(ang) * r;
      let py = y + sin(ang) * r;
      vertex(px, py);
    }
    endShape(CLOSE);

    this.noiseX += 0.005;
    this.noiseY += 0.005;
  }
}










