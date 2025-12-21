console.log("ECHO — Gotas de pintura configurables");

// ==========================
// CONFIGURACIÓN DE PARÁMETROS
// ==========================
const NUM_VERTICES_MIN = 12;   // mínimo número de vértices por gota
const NUM_VERTICES_MAX = 20;   // máximo número de vértices por gota
const RADIO_MIN = 20;          // tamaño mínimo de la gota
const RADIO_MAX = 50;          // tamaño máximo de la gota
const ALPHA_COLOR = 180;       // transparencia (0-255)
const RUEDO_MOVIMIENTO = 10;   // rango de movimiento tipo Perlin
const CRECIMIENTO = 0.5;       // velocidad de crecimiento de la gota

// ==========================
// URL DE DATOS
// ==========================
const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

let gotas = [];
let idsExistentes = new Set();

function setup() {
  createCanvas(800, 600);

  cargarDatos();
  setInterval(cargarDatos, 2000);
}

function draw() {
  background(245, 40); // fondo semi-transparente para ver alpha

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
    this.radioFinal = random(RADIO_MIN, RADIO_MAX);

    this.pasos = int(random(NUM_VERTICES_MIN, NUM_VERTICES_MAX));
    this.offset = random(1000);

    this.creciendo = true;

    // Color aleatorio con alpha
    this.color = color(random(255), random(255), random(255), ALPHA_COLOR);

    // Para movimiento tipo ruido
    this.noiseX = random(1000);
    this.noiseY = random(1000);
  }

  mostrar() {
    // Crecimiento gradual
    if (this.creciendo) {
      this.radio += CRECIMIENTO;
      if (this.radio >= this.radioFinal) {
        this.radio = this.radioFinal;
        this.creciendo = false;
      }
    }

    // Movimiento tipo Perlin
    let nx = noise(this.noiseX) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;
    let ny = noise(this.noiseY) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;
    let x = this.x + nx;
    let y = this.y + ny;

    // Dibujar forma irregular
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

    // Actualizar offsets para movimiento
    this.noiseX += 0.005;
    this.noiseY += 0.005;
  }
}












