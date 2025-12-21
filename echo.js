console.log("ECHO — Gotas de pintura dentro de marco A4");

// ==========================
// CONFIGURACIÓN
// ==========================
const NUM_VERTICES_MIN = 3;
const NUM_VERTICES_MAX = 50;
const RADIO_MIN = 10;
const RADIO_MAX = 150;
const ALPHA_COLOR = 100;
const RUEDO_MOVIMIENTO = 20;
const CRECIMIENTO = 0.3;

// Proporción A4: 210 / 297 ≈ 0.707
const A4_RATIO = 210 / 297;

const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

let gotas = [];
let idsExistentes = new Set();

// Marco A4 en pixels
let marcoX, marcoY, marcoW, marcoH;

function setup() {
  createCanvas(800, 600);

  // Calcular marco A4 centrado
  if (width / height > A4_RATIO) {
    marcoH = height - 40;
    marcoW = marcoH * A4_RATIO;
  } else {
    marcoW = width - 40;
    marcoH = marcoW / A4_RATIO;
  }
  marcoX = (width - marcoW) / 2;
  marcoY = (height - marcoH) / 2;

  cargarDatos();
  setInterval(cargarDatos, 2000);
}

function draw() {
  background(245, 40);

  // Dibujar marco A4
  noFill();
  stroke(0);
  strokeWeight(2);
  rect(marcoX, marcoY, marcoW, marcoH);

  // Contador
  fill(0);
  noStroke();
  textSize(16);
  text("ECHO — eventos registrados: " + gotas.length, 20, 20);

  // Dibujar gotas
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
    // Posición inicial dentro del marco A4
    this.x = random(marcoX + RADIO_MAX, marcoX + marcoW - RADIO_MAX);
    this.y = random(marcoY + RADIO_MAX, marcoY + marcoH / 3); // empiezan arriba del marco

    this.radio = 0;
    this.radioFinal = random(RADIO_MIN, RADIO_MAX);

    this.pasos = int(random(20, 30));
    this.offset = random(1000);

    this.creciendo = true;

    this.color = color(random(255), random(255), random(255), ALPHA_COLOR);

    this.noiseX = random(1000);
    this.noiseY = random(1000);

    // Velocidad de "chorreo"
    this.velaY = random(0.2, 1.0);
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

    // Movimiento tipo Perlin horizontal suave
    let nx = noise(this.noiseX) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;
    let x = this.x + nx;

    // "Chorreo" vertical descendente
    this.y += this.velaY;
    if (this.y + this.radio > marcoY + marcoH) {
      this.y = marcoY + marcoH - this.radio; // limitar al marco
    }

    let y = this.y;

    // Dibujar forma irregular suavizada
    noStroke();
    fill(this.color);
    beginShape();
    for (let i = 0; i < this.pasos; i++) {
      let ang = map(i, 0, this.pasos, 0, TWO_PI);
      let ruido = noise(cos(ang) + this.offset, sin(ang) + this.offset);
      let r = this.radio * map(ruido, 0, 1, 0.9, 1.1);
      let px = x + cos(ang) * r;
      let py = y + sin(ang) * r;
      curveVertex(px, py);
    }
    endShape(CLOSE);

    // Actualizar offsets
    this.noiseX += 0.005;
    this.noiseY += 0.005;
  }
}












