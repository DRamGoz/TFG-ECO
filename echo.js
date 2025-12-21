

console.log("ECHO — Visualización de eventos activos");

const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

let entidades = [];
let idsExistentes = new Set();

function setup() {
  createCanvas(800, 600);
  background(245);

  // Cargar datos iniciales desde Google Sheets
  cargarDatos();

  // Cada 2 segundos actualizar nuevos datos
  setInterval(cargarDatos, 2000);
}

function draw() {
  background(245);

  // Contador de eventos
  fill(0);
  textSize(16);
  text("ECHO — eventos registrados: " + entidades.length, 20, 20);

  // Dibujar todas las entidades
  entidades.forEach(e => e.mostrar());
}

function cargarDatos() {
  fetch(API_URL)
    .then(r => r.json())
    .then(datos => {
      datos.forEach(d => {
        if (!idsExistentes.has(d.timestamp)) {
          let ev = new EventoVisual(d);      // crear entidad
          entidades.push(ev);
          idsExistentes.add(d.timestamp);
        }
      });
    })
    .catch(err => console.error("Error al cargar datos:", err));
}

// ==========================
// Clase EventoVisual
// ==========================
class EventoVisual {
  constructor(data) {
    this.baseX = random(50, width - 50);
    this.baseY = random(50, height - 50);

    this.r = 0;
    this.maxR = random(12, 50);

    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);

    // Color aleatorio para cada entidad
    this.color = color(random(255), random(255), random(255), 180);
  }

  mostrar() {
    // Crecimiento gradual
    this.r = lerp(this.r, this.maxR, 0.05);

    // Movimiento tipo ruido
    let nx = noise(this.noiseOffsetX) * 20 - 10;
    let ny = noise(this.noiseOffsetY) * 20 - 10;

    let x = this.baseX + nx;
    let y = this.baseY + ny;

    // Dibujar solo si no es NaN
    if (!isNaN(x) && !isNaN(y) && !isNaN(this.r)) {
      noStroke();
      fill(this.color);
      ellipse(x, y, this.r);
    }

    // Incrementar offsets para el siguiente frame
    this.noiseOffsetX += 0.005;
    this.noiseOffsetY += 0.005;
  }
}





