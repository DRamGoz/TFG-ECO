const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

let entidades = [];

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(245);

  fill(0);
  textSize(14);
  text("ECHO — eventos registrados: " + entidades.length, 20, 20);

  entidades.forEach(e => e.mostrar());
}

// Llamar manualmente solo cuando quieras añadir un nuevo click
function agregarEvento(data) {
  entidades.push(new EventoVisual(data));
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


