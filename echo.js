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
    this.x = random(50, width - 50);
    this.y = random(50, height - 50);
    this.r = 0;
    this.maxR = random(12, 24);
  }

  mostrar() {
    this.r = lerp(this.r, this.maxR, 0.05);
    noStroke();
    fill(0, 180);
    ellipse(this.x, this.y, this.r);
  }
}

