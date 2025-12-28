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
  imgFondo = loadImage("https://www.pngegg.com/es/png-ddjex"); // Cambia por tu URL
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
  if (estado.fondoA4 === "imagen" && imgFondo) {
    background(255); // Limpia el canvas
    imageMode(CORNER);
    image(imgFondo, 0, 0, width, height); // Dibuja la imagen detrás de todo
  } else if (estado.fondoA4 === "blanco") {
    background(255);
  } else {
    background(0);
  }

  // --------------------------
  // Marco A4 (sin fill transparente para que se vea fondo)
  // --------------------------
  strokeWeight(4);
  stroke(0);          // Borde negro por defecto
  fill(estado.fondoA4 === "imagen" ? color(255, 0) : (estado.fondoA4 === "blanco" ? 255 : 0)); 
  rect(marcoX, marcoY, marcoW, marcoH);

  // --------------------------
  // Clipping de gotas dentro del marco
  // --------------------------
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(marcoX, marcoY, marcoW, marcoH);
  drawingContext.clip();
  gotas.forEach(g => g.mostrar());
  drawingContext.restore();
  pop();

  // --------------------------
  // Texto dentro del marco
  // --------------------------
  if (estado.mostrarTexto) {
    textAlign(CENTER, TOP);
    noStroke();
    fill(0);
    textSize(24);
    text(titulo, marcoX + marcoW / 2, marcoY + 20);
    fill(50);
    textSize(16);
    text(subtitulo, marcoX + marcoW / 2, marcoY + 60);
  }

  // --------------------------
  // Contador en el marco
  // --------------------------
  let franjaH = 26;
  let franjaY = marcoY + marcoH - franjaH - 30;
  noStroke();
  fill(0, 120);
  rect(marcoX, franjaY, marcoW, franjaH);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(13);
  text("Nº Interacción Usuarios: " + gotas.length,
       marcoX + marcoW / 2, franjaY + franjaH / 2);
}



































































































