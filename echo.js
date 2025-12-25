// ==========================
// CONFIGURACIÓN
// ==========================
const NUM_VERTICES_MIN = 280;
const NUM_VERTICES_MAX = 480;
const RADIO_MIN = 20;
const RADIO_MAX = 120;
const ALPHA_COLOR = 70;
const RUEDO_MOVIMIENTO = 50;
const CRECIMIENTO = 1.4;

// Proporción A4
const A4_RATIO = 210 / 297;

// =========================
// ESTADO GLOBAL
// =========================
let titulo = "ECO — Generación de Arte Digital";
let subtitulo = "Interacción de usuarios en tiempo real";

window.estado = {
  modo: "editorial",
  fondoA4: "blanco",
  mostrarTexto: true,
  monocromo: false,
  orientacion: "vertical"
};

const API_URL =
  "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

let gotas = [];
let idsExistentes = new Set();

let marcoX, marcoY, marcoW, marcoH;
let canvas;

// ==========================
// SETUP
// ==========================
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("a4-container");

  recalcularMarco();
  cargarDatos();
  setInterval(cargarDatos, 2000);
}

// ==========================
// DRAW
// ==========================
function draw() {
  background(0);

  // Marco A4
  if (estado.fondoA4 === "blanco") {
    fill(255, 255, 255, 220);
    stroke(0);
  } else {
    fill(0);
    stroke(255);
  }
  strokeWeight(4);
  rect(marcoX, marcoY, marcoW, marcoH);

  // Clipping gotas
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(marcoX, marcoY, marcoW, marcoH);
  drawingContext.clip();
  gotas.forEach(g => g.mostrar());
  drawingContext.restore();
  pop();

  // Texto editorial
  if (estado.mostrarTexto && estado.modo === "editorial") {
    textAlign(CENTER, TOP);
    noStroke();
    fill(estado.fondoA4 === "blanco" ? 0 : 255);
    textSize(24);
    text(titulo, marcoX + marcoW / 2, marcoY + 20);
    fill(estado.fondoA4 === "blanco" ? 50 : 200);
    textSize(16);
    text(subtitulo, marcoX + marcoW / 2, marcoY + 60);
  }

  // Contador
  let contador = "Nº Interacción Usuarios: " + gotas.length;
  let franjaH = 26;
  let franjaY = marcoY + marcoH - franjaH - 30;
  noStroke();
  fill(estado.fondoA4 === "blanco" ? 0 : 255, 120);
  rect(marcoX, franjaY, marcoW, franjaH);
  fill(estado.fondoA4 === "blanco" ? 255 : 0);
  textAlign(CENTER, CENTER);
  textSize(13);
  text(contador, marcoX + marcoW / 2, franjaY + franjaH / 2);
}

// ==========================
// EXPORTAR A4
// ==========================
function exportarA4() {
  const dpi = 300;
  let wMM = estado.orientacion === "vertical" ? 210 : 297;
  let hMM = estado.orientacion === "vertical" ? 297 : 210;
  const pxMM = dpi / 25.4;

  let pg = createGraphics(wMM * pxMM, hMM * pxMM);
  pg.background(estado.fondoA4 === "blanco" ? 255 : 0);
  pg.stroke(estado.fondoA4 === "blanco" ? 0 : 255);
  pg.strokeWeight(12);
  pg.noFill();
  pg.rect(0, 0, pg.width, pg.height);

  let sx = pg.width / marcoW;
  let sy = pg.height / marcoH;

  pg.push();
  pg.scale(sx, sy);
  pg.translate(-marcoX, -marcoY);
  gotas.forEach(g => g.dibujarEnGraphics(pg));
  pg.pop();

  saveCanvas(pg, "ECO_A4", "png");
}

// ==========================
// AUXILIARES
// ==========================
function recalcularMarco() {
  let ratio = estado.orientacion === "vertical" ? 210 / 297 : 297 / 210;
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
          gotas.push(new GotaPintura());
          idsExistentes.add(d.timestamp);
        }
      });
    })
    .catch(() => {});
}

// ==========================
// CLASE GOTA ORGÁNICA
// ==========================
class GotaPintura {
  constructor() {
    this.x = random(marcoX + RADIO_MAX, marcoX + marcoW - RADIO_MAX);
    this.y = random(marcoY + RADIO_MAX, marcoY + marcoH - RADIO_MAX);

    this.radio = 0;
    this.radioFinal = random(RADIO_MIN, RADIO_MAX);
    this.pasos = int(random(NUM_VERTICES_MIN, NUM_VERTICES_MAX));
    this.offset = random(1000);
    this.creciendo = true;

    this.puntos = [];
    this.generada = false;

    if (estado.monocromo) {
      let g = random(80, 200);
      this.color = color(g, g, g, ALPHA_COLOR);
    } else {
      this.color = color(random(255), random(255), random(255), ALPHA_COLOR);
    }

    this.noiseX = random(1000);
    this.noiseY = random(1000);
  }

  generarForma() {
    this.puntos = [];

    for (let i = 0; i < this.pasos; i++) {
      let a = map(i, 0, this.pasos, 0, TWO_PI);

      let x = cos(a) * this.radioFinal;
      let y = sin(a) * this.radioFinal;

      let n = noise(i * 0.15 + this.offset);
      let normalOffset = map(n, 0, 1, -65, 65);

      x += cos(a) * normalOffset;
      y += sin(a) * normalOffset;

      let lateral = random(-25, 25);
      x += -sin(a) * lateral;
      y += cos(a) * lateral;

      this.puntos.push(createVector(x, y));
    }

    this.generada = true;
  }

  mostrar() {
    if (!this.generada) {
      this.radio += CRECIMIENTO;
      if (this.radio >= this.radioFinal) {
        this.radio = this.radioFinal;
        this.generarForma();
      }
    }

    let dx = noise(this.noiseX) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;
    let dy = noise(this.noiseY) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;

    noStroke();
    fill(this.color);
    beginShape();
    this.puntos.forEach(p => {
      vertex(this.x + p.x + dx, this.y + p.y + dy);
    });
    endShape(CLOSE);

    this.noiseX += 0.005;
    this.noiseY += 0.005;
  }

  dibujarEnGraphics(pg) {
    pg.noStroke();
    pg.fill(this.color);
    pg.beginShape();
    this.puntos.forEach(p => {
      pg.vertex(this.x + p.x, this.y + p.y);
    });
    pg.endShape(CLOSE);
  }
}




























