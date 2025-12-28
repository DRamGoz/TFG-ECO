// ==========================
// ESTADO GLOBAL
// ==========================

let gotas = [];
let idsExistentes = new Set();

let estado = {
  fondoA4: "blanco",
  mostrarTexto: false,
  orientacion: "vertical",
  monocromo: false,
  modo: "modo1" // "modo1" | "editorial"
};

// ==========================
// LIENZO / MARCO A4
// ==========================

let marcoX, marcoY, marcoW, marcoH;
const A4_RATIO = 210 / 297;

function recalcularMarco() {
  let margen = 40;
  let w = width - margen * 2;
  let h = height - margen * 2;

  if (estado.orientacion === "vertical") {
    h = w / A4_RATIO;
    if (h > height - margen * 2) {
      h = height - margen * 2;
      w = h * A4_RATIO;
    }
  } else {
    w = h / A4_RATIO;
    if (w > width - margen * 2) {
      w = width - margen * 2;
      h = w * A4_RATIO;
    }
  }

  marcoW = w;
  marcoH = h;
  marcoX = (width - w) / 2;
  marcoY = (height - h) / 2;
}

// ==========================
// SETUP / DRAW
// ==========================

function setup() {
  createCanvas(windowWidth, windowHeight);
  noiseSeed(floor(random(10000)));
  recalcularMarco();
  refrescarLienzo();
}

function draw() {
  background(estado.fondoA4 === "blanco" ? 240 : 20);

  // Marco A4
  noFill();
  stroke(estado.fondoA4 === "blanco" ? 0 : 255);
  rect(marcoX, marcoY, marcoW, marcoH);

  // Dibujar gotas
  for (let g of gotas) {
    g.update();
    g.draw();
  }

  // Texto (AHORA FUNCIONA EN TODOS LOS MODOS)
  if (estado.mostrarTexto) {
    drawTexto();
  }
}

// ==========================
// TEXTO
// ==========================

function drawTexto() {
  noStroke();
  fill(estado.fondoA4 === "blanco" ? 0 : 255);
  textAlign(CENTER);

  textSize(28);
  text("TÍTULO", width / 2, marcoY - 20);

  textSize(14);
  text("Subtítulo o descripción", width / 2, marcoY + marcoH + 30);
}

// ==========================
// CLASE GOTA — MODO 1
// ==========================

class GotaModo1 {
  constructor() {
    this.cx = random(marcoX + 80, marcoX + marcoW - 80);
    this.cy = random(marcoY + 80, marcoY + marcoH - 80);

    this.radio = 5;
    this.radioMax = random(35, 65);
    this.vel = random(0.15, 0.35);

    this.ruidoOffset = random(1000);
    this.finalizada = false;

    this.color = randomColorSistema();
  }

  update() {
    if (!this.finalizada) {
      this.radio += this.vel;
      this.ruidoOffset += 0.01;

      if (this.radio >= this.radioMax) {
        this.radio = this.radioMax;
        this.finalizada = true; // 👈 se queda quieta
      }
    }
  }

  draw() {
    fill(this.color);
    noStroke();

    beginShape();
    let pasos = 120;

    for (let i = 0; i <= pasos; i++) {
      let a = map(i, 0, pasos, 0, TWO_PI);
      let nx = cos(a) + 1.5;
      let ny = sin(a) + 1.5;

      let n = noise(nx * 1.2, ny * 1.2, this.ruidoOffset);
      let r = this.radio * map(n, 0, 1, 0.6, 1.6);

      let x = this.cx + cos(a) * r;
      let y = this.cy + sin(a) * r;

      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

// ==========================
// GENERADORES
// ==========================

function generarModo1() {
  gotas = [];
  for (let i = 0; i < 18; i++) {
    gotas.push(new GotaModo1());
  }
}

// ==========================
// COLORES
// ==========================

function randomColorSistema() {
  if (estado.monocromo) {
    let g = random(60, 220);
    return color(g, g, g, 220);
  }

  let paleta = [
    color(220, 40, 40, 220),
    color(40, 180, 60, 220),
    color(40, 80, 220, 220)
  ];
  return random(paleta);
}

// ==========================
// BOTONES
// ==========================

function refrescarLienzo() {
  gotas = [];
  idsExistentes.clear();

  if (estado.modo === "modo1") {
    generarModo1();
  }
}

function alternarFondo() {
  estado.fondoA4 = estado.fondoA4 === "blanco" ? "negro" : "blanco";
}

function alternarTexto() {
  estado.mostrarTexto = !estado.mostrarTexto;
}

function rotarLienzo() {
  estado.orientacion =
    estado.orientacion === "vertical" ? "horizontal" : "vertical";
  recalcularMarco();
}

function alternarMonocromo() {
  estado.monocromo = !estado.monocromo;
}

// ==========================
// EXPORTAR A4 COMO IMAGEN
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
  pg.pixelDensity(1);

  // Fondo
  pg.background(estado.fondoA4 === "blanco" ? 255 : 0);

  // Escala marco
  let escala = w / marcoW;
  pg.push();
  pg.translate((w - marcoW * escala) / 2, (h - marcoH * escala) / 2);
  pg.scale(escala);

  // Dibujar gotas en graphics
  for (let g of gotas) {
    pg.fill(g.color);
    pg.noStroke();

    pg.beginShape();
    let pasos = 120;

    for (let i = 0; i <= pasos; i++) {
      let a = map(i, 0, pasos, 0, TWO_PI);
      let nx = cos(a) + 1.5;
      let ny = sin(a) + 1.5;
      let n = noise(nx * 1.2, ny * 1.2, g.ruidoOffset);
      let r = g.radio * map(n, 0, 1, 0.6, 1.6);
      pg.vertex(g.cx + cos(a) * r, g.cy + sin(a) * r);
    }
    pg.endShape(CLOSE);
  }

  pg.pop();
  save(pg, "ECO_A4.png");
}

  

















































