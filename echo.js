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

// Proporción A4
const A4_RATIO = 210 / 297;

// ==========================
// ESTADO GLOBAL
// ==========================
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
  renderEscena(this);
}

// ==========================
// RENDER ÚNICO (PANTALLA + EXPORT)
// ==========================
function renderEscena(pg) {
  pg.background(0);

  // Marco A4
  if (estado.fondoA4 === "blanco") {
    pg.fill(255, 255, 255, 220);
    pg.stroke(0);
  } else {
    pg.fill(0);
    pg.stroke(255);
  }
  pg.strokeWeight(4);
  pg.rect(marcoX, marcoY, marcoW, marcoH);

  // Clipping
  pg.push();
  pg.drawingContext.save();
  pg.drawingContext.beginPath();
  pg.drawingContext.rect(marcoX, marcoY, marcoW, marcoH);
  pg.drawingContext.clip();

  gotas.forEach(g => g.mostrar(pg));

  pg.drawingContext.restore();
  pg.pop();

  // Texto editorial
  if (estado.mostrarTexto && estado.modo === "editorial") {
    pg.textAlign(CENTER, TOP);
    pg.noStroke();
    pg.fill(estado.fondoA4 === "blanco" ? 0 : 255);
    pg.textSize(24);
    pg.text(titulo, marcoX + marcoW / 2, marcoY + 20);

    pg.fill(estado.fondoA4 === "blanco" ? 50 : 200);
    pg.textSize(16);
    pg.text(subtitulo, marcoX + marcoW / 2, marcoY + 60);
  }

  // Contador
  let contador = "Nº Interacción Usuarios: " + gotas.length;
  let franjaH = 26;
  let offsetY = 30;
  let franjaY = marcoY + marcoH - franjaH - offsetY;

  pg.noStroke();
  pg.fill(estado.fondoA4 === "blanco" ? 0 : 255, 120);
  pg.rect(marcoX, franjaY, marcoW, franjaH);

  pg.fill(estado.fondoA4 === "blanco" ? 255 : 0);
  pg.textAlign(CENTER, CENTER);
  pg.textSize(13);
  pg.text(contador, marcoX + marcoW / 2, franjaY + franjaH / 2);
}

// ==========================
// EXPORTAR A4
// ==========================
function exportarA4() {
  const dpi = 300;
  let anchoMM = 210;
  let altoMM = 297;

  if (estado.orientacion === "horizontal") {
    [anchoMM, altoMM] = [altoMM, anchoMM];
  }

  const pxPorMM = dpi / 25.4;
  const w = Math.round(anchoMM * pxPorMM);
  const h = Math.round(altoMM * pxPorMM);

  let pg = createGraphics(w, h);

  const scaleX = w / marcoW;
  const scaleY = h / marcoH;

  pg.push();
  pg.scale(scaleX, scaleY);
  pg.translate(-marcoX, -marcoY);

  renderEscena(pg);

  pg.pop();
  saveCanvas(pg, "ECO_A4", "png");
}

// ==========================
// BOTONES
// ==========================
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

// ==========================
// AUXILIARES
// ==========================
function recalcularMarco() {
  let ratio =
    estado.orientacion === "vertical" ? 210 / 297 : 297 / 210;

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
// CLASE GOTA EDITORIAL
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

    if (estado.monocromo) {
      let g = random(80, 200);
      this.color = color(g, g, g, ALPHA_COLOR);
    } else {
      this.color = color(random(255), random(255), random(255), ALPHA_COLOR);
    }

    this.noiseX = random(1000);
    this.noiseY = random(1000);
  }

  mostrar(pg = this) {
    if (this.creciendo) {
      this.radio += CRECIMIENTO;
      if (this.radio >= this.radioFinal) {
        this.radio = this.radioFinal;
        this.creciendo = false;
      }
    }

    let x = this.x + noise(this.noiseX) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;
    let y = this.y + noise(this.noiseY) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;

    pg.noStroke();
    pg.fill(this.color);
    pg.beginShape();

    for (let i = 0; i < this.pasos; i++) {
      let ang = map(i, 0, this.pasos, 0, TWO_PI);
      let r =
        this.radio *
        map(
          noise(cos(ang) + this.offset, sin(ang) + this.offset),
          0,
          1,
          0.7,
          1.3
        );
      pg.vertex(x + cos(ang) * r, y + sin(ang) * r);
    }

    pg.endShape(CLOSE);

    this.noiseX += 0.005;
    this.noiseY += 0.005;
  }
}




















































