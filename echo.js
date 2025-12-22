

// ==========================
// CONFIGURACIÓN
// ==========================
const NUM_VERTICES_MIN = 20;
const NUM_VERTICES_MAX = 200;
const RADIO_MIN = 10;
const RADIO_MAX = 120;
const ALPHA_COLOR = 70;
const RUEDO_MOVIMIENTO = 50;
const CRECIMIENTO = 1.1;

// Proporción A4: 210 / 297 ≈ 0.707
const A4_RATIO = 210 / 297;
// =========================
// ESTADO GLOBAL (UI AUTOR)
// =========================
let estado = {
  modo: "editorial",      // editorial | lienzo
  fondoA4: "blanco",      // blanco | negro
  mostrarTexto: true,
  monocromo: false,
  orientacion: "vertical"
};
const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

let gotas = [];
let idsExistentes = new Set();

// Marco A4 en pixels
let marcoX, marcoY, marcoW, marcoH;

function setup() {
  createCanvas(windowWidth, windowHeight);

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
  background(0, 40);

  // Dibujar marco A4
  fill(255,255,255,220);
  stroke(255);
  strokeWeight(4);
  rect(marcoX, marcoY, marcoW, marcoH);

  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(marcoX, marcoY, marcoW, marcoH);
  drawingContext.clip();

  // GOTAS (recortadas al A4)
  gotas.forEach(g => g.mostrar());

  // CERRAR CLIPPING
  drawingContext.restore();
  pop();

// TEXTO DEL CONTADOR (franja inferior)
let contador = "Nº Interacción Usuarios: " + gotas.length;

textSize(13);
textAlign(CENTER, CENTER);

// Ajustes
let franjaH = 26;
let offsetY = 30; // 👈 SUBE LA FRANJA

// Posición
let franjaY = marcoY + marcoH - franjaH - offsetY;
let tx = marcoX + marcoW / 2;
let ty = franjaY + franjaH / 2;

// Fondo blanco
noStroke();
fill(255, 240);
rect(marcoX, franjaY, marcoW, franjaH);

// Texto
fill(0);
text(contador, tx, ty);

}
// ==========================
// FUNCIONES UI (BOTONES)
// ==========================
function imprimirA4() {
  window.print();
}

function refrescarLienzo() {
  gotas = [];
  idsExistentes.clear();
}

function alternarFondo() {
  estado.fondoA4 = estado.fondoA4 === "blanco" ? "negro" : "blanco";
}

function alternarTexto() {
  estado.mostrarTexto = !estado.mostrarTexto;
}

function rotarLienzo() {
  estado.orientacion =
    estado.orientacion === "vertical" ? "horizontal" : "vertical";

  recalcularMarco();
}

function alternarMonocromo() {
  estado.monocromo = !estado.monocromo;
}

// 7. FUNCIONES AUXILIARES (A CONTINUACIÓN)
// ==========================
function recalcularMarco() {
  let ratio =
    estado.orientacion === "vertical"
      ? 210 / 297
      : 297 / 210;

  if (width / height > ratio) {
    marcoH = height - 40;
    marcoW = marcoH * ratio;
  } else {
    marcoW = width - 40;
    marcoH = marcoW / ratio;
  }

  marcoX = (width - marcoW) / 2;
  marcoY = (height - marcoH) / 2;
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
    // Generar posición aleatoria **dentro del marco**
    this.x = random(marcoX + RADIO_MAX, marcoX + marcoW - RADIO_MAX);
    this.y = random(marcoY + RADIO_MAX, marcoY + marcoH - RADIO_MAX);

    this.radio = 0;
    this.radioFinal = random(RADIO_MIN, RADIO_MAX);

    this.pasos = int(random(NUM_VERTICES_MIN, NUM_VERTICES_MAX));
    this.offset = random(1000);

    this.creciendo = true;

    this.color = color(random(255), random(255), random(255), ALPHA_COLOR);

    this.noiseX = random(1000);
    this.noiseY = random(1000);
  }


  mostrar() {
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

    this.noiseX += 0.005;
    this.noiseY += 0.005;
  }
}

