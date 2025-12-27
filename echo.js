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

const A4_RATIO = 210 / 297;

// ==========================
// ESTADO GLOBAL
// ==========================
let titulo = "ECO — Generación de Arte Digital";
let subtitulo = "Interacción de usuarios en tiempo real";

window.estado = {
  modo: "editorial", // "editorial" | "modo1"
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
// EXPORTAR A4 COMO IMAGEN (ARREGLADO)
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

  // Fondo
  pg.background(estado.fondoA4 === "blanco" ? 255 : 0);

  // Marco
  pg.noFill();
  pg.stroke(estado.fondoA4 === "blanco" ? 0 : 255);
  pg.strokeWeight(12);
  pg.rect(0, 0, w, h);

  // Escalado del contenido
  const scaleX = w / marcoW;
  const scaleY = h / marcoH;

  pg.push();
  pg.scale(scaleX, scaleY);
  pg.translate(-marcoX, -marcoY);
  gotas.forEach(g => dibujarGotaEnGraphics(pg, g));
  pg.pop();

  // Texto 
  if (estado.mostrarTexto && estado.modo === "editorial") {
    pg.textAlign(CENTER, TOP);
    pg.noStroke();
    pg.fill(estado.fondoA4 === "blanco" ? 0 : 255);
    pg.textSize(72);
    pg.text(titulo, w / 2, 60);
    pg.fill(estado.fondoA4 === "blanco" ? 60 : 200);
    pg.textSize(42);
    pg.text(subtitulo, w / 2, 140);
  }

  saveCanvas(pg, g, "ECO_A4", "png");
}

// Dibujo gotas en graphics

function dibujarGotaEnGraphics(pg, g) {
  pg.noStroke();
  pg.fill(g.color);
  pg.beginShape();
  for (let i = 0; i < g.pasos; i++) {
    let ang = map(i, 0, g.pasos, 0, TWO_PI);
    let r = g.radio * map(
      noise(cos(ang) + g.offset, sin(ang) + g.offset),
      0, 1, 0.7, 1.3
    );
    pg.vertex(g.x + cos(ang) * r, g.y + sin(ang) * r);
  }
  pg.endShape(CLOSE);
}


// ==========================
// BOTONES IZQUIERDA (YA EXISTENTES)
// ==========================
function refrescarLienzo() {
  gotas = [];
  idsExistentes.clear();

  const btnMonocromo = document.querySelector("#botones-izquierda button:nth-child(6)");
  const btnRefrescar = document.querySelector("#botones-izquierda button:nth-child(2)");

  if (btnMonocromo) btnMonocromo.style.backgroundColor = estado.monocromo ? "#ff0000" : "#333";
  if (btnRefrescar) btnRefrescar.style.backgroundColor = "#333";

  const info = document.getElementById("info-monocromo");
  if (info) info.innerText = "";
}

function alternarFondo() {
  estado.fondoA4 = estado.fondoA4 === "blanco" ? "negro" : "blanco";
}

function alternarTexto() {
  estado.mostrarTexto = !estado.mostrarTexto;
}

function rotarLienzo() {
  estado.orientacion = estado.orientacion === "vertical" ? "horizontal" : "vertical";
  recalcularMarco();
}

function alternarMonocromo() {
  estado.monocromo = !estado.monocromo;

  const btn = document.querySelector("#botones-izquierda button:nth-child(6)");
  const btnRefrescar = document.querySelector("#botones-izquierda button:nth-child(2)");
  if (!btn || !btnRefrescar) return;

  btn.style.backgroundColor = estado.monocromo ? "#ff0000" : "#333";

  let info = document.getElementById("info-monocromo");
  if (!info) {
    info = document.createElement("div");
    info.id = "info-monocromo";
    info.style.fontSize = "12px";
    info.style.color = "#A9A9A9";
    info.style.marginTop = "1px";
    btn.parentNode.insertBefore(info, btn.nextSibling);
  }
  info.innerText = estado.monocromo ? "Refrescar Lienzo para activar modo" : "";

  btnRefrescar.style.backgroundColor = estado.monocromo ? "#00aa00" : "#333";
}

// ==========================
// BOTÓN DERECHO — MODO 1
// ==========================
function activarModo1() {
  estado.modo = "modo1";
  refrescarLienzo();
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
          if (estado.modo === "modo1") {
            gotas.push(new GotaPinturaModo1());
          } else {
            gotas.push(new GotaPintura());
          }
          idsExistentes.add(d.timestamp);
        }
      });
    })
    .catch(() => {});
}

// ==========================
// CLASE GOTA EDITORIAL (ORIGINAL)
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

  mostrar() {
    if (this.creciendo) {
      this.radio += CRECIMIENTO;
      if (this.radio >= this.radioFinal) {
        this.radio = this.radioFinal;
        this.creciendo = false;
      }
    }

    let x = this.x + noise(this.noiseX) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;
    let y = this.y + noise(this.noiseY) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;

    noStroke();
    fill(this.color);
    beginShape();
    for (let i = 0; i < this.pasos; i++) {
      let ang = map(i, 0, this.pasos, 0, TWO_PI);
      let r = this.radio * map(noise(cos(ang) + this.offset, sin(ang) + this.offset), 0, 1, 0.7, 1.3);
      vertex(x + cos(ang) * r, y + sin(ang) * r);
    }
    endShape(CLOSE);

    this.noiseX += 0.005;
    this.noiseY += 0.005;
  }
}

// ==========================
// CLASE GOTA — MODO 1 (SALVAJE)
// ==========================
class GotaPinturaModo1 {
  constructor() {
    this.x = random(marcoX + RADIO_MAX, marcoX + marcoW - RADIO_MAX);
    this.y = random(marcoY + RADIO_MAX, marcoY + marcoH - RADIO_MAX);

    this.radio = 5;
    this.radioFinal = random(40, 120);
    this.velocidad = 0.08;

    this.ruidoOffset = random(1000);
    this.finalizada = false;

    this.pasos = 120;
    this.vertices = [];

    if (estado.monocromo) {
      let g = random(80, 200);
      this.color = color(g, g, g, ALPHA_COLOR);
    } else {
      this.color = color(random(255), random(255), random(255), ALPHA_COLOR);
    }
  }

  calcularForma() {
    this.vertices = [];
    for (let i = 0; i <= this.pasos; i++) {
      let ang = map(i, 0, this.pasos, 0, TWO_PI);

      let nx = cos(ang) + 1.5;
      let ny = sin(ang) + 1.5;

      let deformacion =
        noise(nx * 100.8, ny * 200.8, this.ruidoOffset);

      let r = this.radio * map(deformacion, 0, 1, 0.6, 1.6);

      this.vertices.push({
        x: this.x + cos(ang) * r,
        y: this.y + sin(ang) * r
      });
    }
  }
  
  mostrar() {
    if (!this.finalizada) {
      this.radio += this.velocidad;

      if (this.radio >= this.radioFinal) {
        this.radio = this.radioFinal;
        this.finalizada = true;
      }

      this.calcularForma();
      this.ruidoOffset += 0.03;
    }

    noStroke();
    fill(this.color);
    beginShape();
    this.vertices.forEach(v => vertex(v.x, v.y));
    endShape(CLOSE);
  }
}

  













































