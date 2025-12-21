const API_URL = "https://script.google.com/macros/s/AKfycbwnHiB9It1VjVa0WMqrehaJCEnBNOyNJaGwxuXJKnBw32aWi0vyF1KY66RTtITA7xqEOA/exec";

let entidades = [];
let totalDatos = 0;

function setup() {
  createCanvas(600, 400);
  cargarDatos();
  setInterval(cargarDatos, 2000);
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
      reconstruirEntidades(datos);
      totalDatos = datos.length;
    });
}


function reconstruirEntidades(datos) {
  console.log("DATOS RECIBIDOS:", datos);

  entidades = [];
  datos.forEach(d => {
    entidades.push(new EventoVisual(d));
  });

  console.log("ENTIDADES CREADAS:", entidades.length);
}


// ===== CLASE VISUAL =====

class EventoVisual {
  constructor(data) {
    this.x = random(50, width - 50);
    this.y = random(80, height - 50);
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
