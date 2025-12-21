console.log("ECHO NUEVO — GOTAS DE PINTURA ACTIVAS");

const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

let gotas = [];
let idsExistentes = new Set();

function setup() {
  createCanvas(800, 600);
  background(245);

  // Cargamos SOLO una vez al iniciar
  cargarDatosIniciales();
}

function draw() {
 background(240);

  // DIBUJO DE GOTAS
  for (let g of gotas) {
    g.mostrar();
  }

  // TEXTO AISLADO, fuera de la clase
  push();
  fill(0);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text("ECHO — eventos registrados: " + gotas.length, 20, 20);
  pop();
}

}

/* =========================
   CARGA DE DATOS (UNA VEZ)
   ========================= */
function cargarDatosIniciales() {
  fetch(API_URL)
    .then(r => r.json())
    .then(datos => {
      datos.forEach(d => {
        if (!idsExistentes.has(d.timestamp)) {
          gotas.push(new GotaPintura());
          idsExistentes.add(d.timestamp);
        }
      });
    });
}

/* =========================
   CLASE GOTA DE PINTURA
   ========================= */
class GotaPintura {
  constructor() {
    this.x = random(80, width - 80);
    this.y = random(80, height - 80);

    this.radio = 10;
    this.radioFinal = random(30, 55);

    this.pasos = int(random(12, 20));
    this.offset = random(1000);

    this.creciendo = true;
  }
 
  mostrar() {
    if (this.creciendo) {
      this.radio += 0.8;
      if (this.radio >= this.radioFinal) {
        this.radio = this.radioFinal;
        this.creciendo = false; // 🔒 se queda fija
      }
    }

    noStroke();
    fill(0, 180);

    beginShape();
    for (let i = 0; i < this.pasos; i++) {
      let ang = map(i, 0, this.pasos, 0, TWO_PI);

      let ruido = noise(
        cos(ang) + this.offset,
        sin(ang) + this.offset
      );

      let r = this.radio * map(ruido, 0, 1, 0.7, 1.3);

      let px = this.x + cos(ang) * r;
      let py = this.y + sin(ang) * r;

      vertex(px, py);
    }
    endShape(CLOSE);
  }
}





