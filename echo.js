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
  modo: "editorial",
  fondoA4: "blanco",
  mostrarTexto: true,
  monocromo: false,
  orientacion: "vertical"
};

const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

let gotas = [];
let idsExistentes = new Set();
let marcoX, marcoY, marcoW, marcoH;
let canvas;

// ==========================
// SETUP
// ==========================
function setup() {
  canvas = createCanvas(2100, 2970); // Canvas grande para alta resolución
  canvas.parent("a4-container");
  recalcularMarco();

  cargarDatos();
  setInterval(cargarDatos, 2000);
}

// ==========================
// DRAW
// ==========================
function draw() {
  background(0, 40);

  // Marco A4
  if (estado.fondoA4 === "blanco") {
    fill(255, 255, 255, 220);
    stroke(0);
  } else {
    fill(0, 0, 0, 220);
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

  // TÍTULO / SUBTÍTULO
  if (estado.mostrarTexto && estado.modo === "editorial") {
    textAlign(CENTER, TOP);
    noStroke();

    fill(estado.fondoA4 === "blanco" ? 0 : 255);
    textSize(24);
    text(titulo, marcoX + marcoW / 2, marcoY + 20);

    fill(estado.fondoA4 === "blanco" ? 50 : 200);
    textSize(16);
    text(subtitulo, marcoX + marcoW / 2, marcoY + 60);

    // CONTADOR
    let contador = "Nº Interacción Usuarios: " + gotas.length;
    textSize(13);
    textAlign(CENTER, CENTER);
    fill(estado.fondoA4 === "blanco" ? 0 : 255);
    text(contador, marcoX + marcoW / 2, marcoY + marcoH - 50);
  }
}

// ==========================
// EXPORTACIÓN A4
// ==========================
function exportar(tipo) {
  // tipo = 'png' o 'pdf'
  const canvasEl = document.querySelector("#a4-container canvas");
  const dataURL = canvasEl.toDataURL("image/png");

  if (tipo === "png") {
    const link = document.createElement("a");
    link.download = "ECO_A4.png";
    link.href = dataURL;
    link.click();
  } else if (tipo === "pdf") {
    if (typeof jsPDF === "undefined") {
      alert("jsPDF no está cargado. Incluye https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      return;
    }

    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF({
      orientation: estado.orientacion === "vertical" ? "portrait" : "landscape",
      unit: "mm",
      format: "a4"
    });

    pdf.addImage(dataURL, "PNG", 0, 0, 210, 297);
    pdf.save("ECO_A4.pdf");
  }
}

// ==========================
// BOTONES
// ==========================
function refrescarLienzo() { gotas = []; idsExistentes.clear(); }
function alternarFondo() { estado.fondoA4 = estado.fondoA4 === "blanco" ? "negro" : "blanco"; }
function alternarTexto() { estado.mostrarTexto = !estado.mostrarTexto; }
function rotarLienzo() { estado.orientacion = estado.orientacion === "vertical" ? "horizontal" : "vertical"; recalcularMarco(); }
function alternarMonocromo() { estado.monocromo = !estado.monocromo; }

// ==========================
// AUXILIARES
// ==========================
function recalcularMarco() {
  let ratio = estado.orientacion === "vertical" ? 210 / 297 : 297 / 210;
  if (canvas.width / canvas.height > ratio) {
    marcoH = canvas.height - 40;
    marcoW = marcoH * ratio;
  } else {
    marcoW = canvas.width - 40;
    marcoH = marcoW / ratio;
  }
  marcoX = (canvas.width - marcoW) / 2;
  marcoY = (canvas.height - marcoH) / 2;
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
// CLASE GOTA
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
      if (this.radio >= this.radioFinal) { this.radio = this.radioFinal; this.creciendo = false; }
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











