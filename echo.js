// ==========================
// CONFIGURACIÓN
// ==========================
const NUM_VERTICES_MIN = 20;
const NUM_VERTICES_MAX = 200;
const RADIO_MIN = 10;
const RADIO_MAX = 120;
const ALPHA_COLOR = 70;
const RUEDO_MOVIMIENTO = 50;
const CRECIMIENTO = 0.8;
const A4_RATIO = 210 / 297;

// ==========================
// ESTADO GLOBAL
// ==========================
let titulo = "ECO — Generación de Arte Digital";
let subtitulo = "Interacción de usuarios en tiempo real";
let gotasSolidas = [];
let imgFondo; // Imagen de fondo del canvas

window.estado = {
  modo: "modo1",            // "modo1" | "modo2"
  fondoA4: "blanco",        // "blanco" | "negro" | "imagen"
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
// PRELOAD
// ==========================
function preload() {
  // Cambia esta URL por la imagen que quieras usar de fondo
  imgFondo = loadImage("fondomadera.jpg");
}

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
  // --------------------------
  // FONDO DEL CANVAS
  // --------------------------
  if (imgFondo) {
    imageMode(CORNER);
    image(imgFondo, 0, 0, width, height); // solo el fondo
  } else {
    background(estado.fondoA4 === "blanco" ? 255 : 0);
  }

  // --------------------------
  // Marco A4
  // --------------------------
  strokeWeight(4);
  if (estado.fondoA4 === "blanco") {
    fill(255, 255);
    stroke(0);
  } else {
    fill(0);
    stroke(255);
  }
  rect(marcoX, marcoY, marcoW, marcoH);

  // --------------------------
  // Clipping de gotas
  // --------------------------
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(marcoX, marcoY, marcoW, marcoH);
  drawingContext.clip();
  gotas.forEach(g => g.mostrar());
  drawingContext.restore();
  pop();
  
// dibujar gotas sólidas (rastro de mouse)
gotasSolidas.forEach(g => g.mostrar());

  // --------------------------
  // Texto dentro del marco
  // --------------------------
  if (estado.mostrarTexto) {
    textAlign(CENTER, TOP);
    noStroke();
    fill(estado.fondoA4 === "blanco" ? 0 : 255);
    textSize(24);
    text(titulo, marcoX + marcoW / 2, marcoY + 20);
    fill(estado.fondoA4 === "blanco" ? 50 : 200);
    textSize(16);
    text(subtitulo, marcoX + marcoW / 2, marcoY + 60);
  }

  // --------------------------
  // Contador en el marco
  // --------------------------
  let franjaH = 26;
  let franjaY = marcoY + marcoH - franjaH - 30;
  noStroke();
  fill(estado.fondoA4 === "blanco" ? 0 : 255, 120);
  rect(marcoX, franjaY, marcoW, franjaH);
  fill(estado.fondoA4 === "blanco" ? 255 : 0);
  textAlign(CENTER, CENTER);
  textSize(13);
  text("Nº Interacción Usuarios: " + gotas.length,
       marcoX + marcoW / 2, franjaY + franjaH / 2);
}

// ==========================
// EXPORTAR A4
// ==========================
function exportarA4() {
  const dpi = 300;
  let wMM = 210, hMM = 297;

  if (estado.orientacion === "horizontal") [wMM, hMM] = [hMM, wMM];

  const pxMM = dpi / 25.4;
  const w = Math.round(wMM * pxMM);
  const h = Math.round(hMM * pxMM);

  let pg = createGraphics(w, h);

  // Fondo exportación
  if (estado.fondoA4 === "blanco") pg.background(255);
  else if (estado.fondoA4 === "negro") pg.background(0);
  else if (estado.fondoA4 === "imagen" && imgFondo) pg.image(imgFondo, 0, 0, w, h);

  const scaleFactor = min(w / marcoW, h / marcoH);
  pg.push();
  pg.translate((w - marcoW * scaleFactor) / 2, (h - marcoH * scaleFactor) / 2);
  pg.scale(scaleFactor);
  pg.translate(-marcoX, -marcoY);

  gotas.forEach(g => {
    if (g instanceof GotaPinturaModo1) dibujarGotaModo1(pg, g);
    if (g instanceof GotaPinturaModo2) dibujarGotaModo2(pg, g);
  });
  pg.pop();

  // Texto exportado
  if (estado.mostrarTexto) {
    pg.textAlign(CENTER, TOP);
    pg.noStroke();
    pg.fill(estado.fondoA4 === "blanco" ? 0 : 255);
    pg.textSize(72);
    pg.text(titulo, w / 2, 60);
    pg.fill(estado.fondoA4 === "blanco" ? 60 : 200);
    pg.textSize(42);
    pg.text(subtitulo, w / 2, 140);
  }

  saveCanvas(pg, "ECO_A4", "png");
}

// ==========================
// DIBUJO DE GOTAS
// ==========================
function dibujarGotaModo1(pg, g) {
  if (!g.vertices.length) return;
  pg.noStroke();
  pg.fill(g.color);
  pg.beginShape();
  g.vertices.forEach(v => pg.vertex(v.x, v.y));
  pg.endShape(CLOSE);
}

function dibujarGotaModo2(pg, g) {
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
// BOTONES / ESTADO
// ==========================
function activarModo1() { estado.modo = "modo1"; refrescarLienzo(); }
function activarModo2() { estado.modo = "modo2"; refrescarLienzo(); }
function refrescarLienzo() { gotas = []; idsExistentes.clear(); }

function alternarFondo() {
  if (estado.fondoA4 === "blanco") estado.fondoA4 = "negro";
  else if (estado.fondoA4 === "negro") estado.fondoA4 = "imagen";
  else estado.fondoA4 = "blanco";
}

function alternarTexto() { estado.mostrarTexto = !estado.mostrarTexto; }

function rotarLienzo() {
  estado.orientacion = estado.orientacion === "vertical" ? "horizontal" : "vertical";
  recalcularMarco();
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
        const idUnico = d.timestamp + "_" + d.valor;

if (!idsExistentes.has(idUnico)) {

  // CLICK → gotas grandes (modo 1 / modo 2)
  if (d.valor === "click") {
    if (estado.modo === "modo1") gotas.push(new GotaPinturaModo1());
    if (estado.modo === "modo2") gotas.push(new GotaPinturaModo2());
  }

  // MOVE → gotas sólidas pequeñas
  if (d.valor === "move" && d.x && d.y) {
    gotasSolidas.push(
      new GotaSolida(Number(d.x), Number(d.y))
    );
  }

  idsExistentes.add(idUnico);
}

      });
    })
    .catch(() => {});
}

// ==========================
// CLASES DE GOTAS
// ==========================
class GotaPinturaModo2 {
  constructor() {
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

class GotaPinturaModo1 {
  constructor() {
    this.x = random(marcoX + RADIO_MAX, marcoX + marcoW - RADIO_MAX);
    this.y = random(marcoY + RADIO_MAX, marcoY + marcoH - RADIO_MAX);
    this.radio = 5;
    this.radioFinal = random(40, 120);
    this.velocidad = 0.8;
    this.ruidoOffset = random(1000);
    this.finalizada = false;
    this.pasos = 120;
    this.vertices = [];
    this.noiseX = random(1000);
this.noiseY = random(1000);
this.movimiento = 50; // intensidad del desplazamiento

    this.color = color(random(255), random(255), random(255), ALPHA_COLOR);
  }

  calcularForma() {
    this.vertices = [];
    for (let i = 0; i <= this.pasos; i++) {
      let ang = map(i, 0, this.pasos, 0, TWO_PI);
      let deformacion = noise(cos(ang) * 120, sin(ang) * 240, this.ruidoOffset);
      let r = this.radio * map(deformacion, 0, 1, 0.4, 2.0);
      this.vertices.push({ x: this.x + cos(ang) * r, y: this.y + sin(ang) * r });
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
      this.ruidoOffset += 0.025;
    }

    let dx = noise(this.noiseX) * this.movimiento - this.movimiento / 2;
let dy = noise(this.noiseY) * this.movimiento - this.movimiento / 2;

noStroke();
fill(this.color);
beginShape();
this.vertices.forEach(v => vertex(v.x + dx, v.y + dy));
endShape(CLOSE);

this.noiseX += 0.004;
this.noiseY += 0.004;
  }
}
class GotaSolida {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radio = random(2, 5); // tamaño pequeño
    this.color = color(random(200, 255), random(50, 150), random(50, 150), 240); // colores brillantes
  }

  mostrar() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.radio * 2);
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}







