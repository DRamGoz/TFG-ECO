
const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

let entidades = [];
let idsExistentes = new Set(); // para evitar duplicados

function setup() {
  createCanvas(600, 400);
  cargarDatos();
  setInterval(cargarDatos, 2000); // cada 2 segundos
}

function draw() {
  background(245);

  fill(0);
  textSize(14);
  text("ECHO — eventos registrados: " + entidades.length, 20, 20);

  entidades.forEach(e => e.mostrar());
}

function cargarDatos() {
  fetch(API_URL)
    .then(r => r.json())
    .then(datos => {
      datos.forEach(d => {
        if (!idsExistentes.has(d.timestamp)) { // si no está ya
          entidades.push(new EventoVisual(d));
          idsExistentes.add(d.timestamp);
        }
      });
    });
}

class EventoVisual {
  constructor(data) {
    // posición base fija
    this.baseX = random(50, width - 50);
    this.baseY = random(50, height - 50);

    // radio inicial y máximo
    this.r = 0;
    this.maxR = random(12, 50);

    // offsets para ruido de Perlin
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
  }

  mostrar() {
    // crecer suavemente
    this.r = lerp(this.r, this.maxR, 0.05);

    // movimiento suave usando Perlin noise
    let nx = noise(this.noiseOffsetX) * 10 - 5; // -5 a +5
    let ny = noise(this.noiseOffsetY) * 10 - 5;

    let x = this.baseX + nx;
    let y = this.baseY + ny;

    // verificar que no sea NaN
    if (!isNaN(x) && !isNaN(y) && !isNaN(this.r)) {
      noStroke();
      fill(0, 180);
      ellipse(x, y, this.r);
    }

    // actualizar offsets para el siguiente frame
    this.noiseOffsetX += 0.005;
    this.noiseOffsetY += 0.005;
  }
}










