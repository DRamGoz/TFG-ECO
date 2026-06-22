// ==========================================
// CONFIGURACIÓN Y CONSTANTES
// ==========================================
const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

// ==========================================
// VARIABLES DE CONTROL - FONDO ARTÍSTICO (SISTEMA ECO)
// ==========================================
let splatsFondo = [];
let particulasFondo = [];
let userStar = null;      // Estrella única del usuario
let showUserText = false; // Controlar la visualización del texto de agradecimiento
let textTimer = 0;        // Temporizador para desvanecer el texto

// ==========================================
// CLASES DEL SISTEMA DE PARTÍCULAS Y FONDOS
// ==========================================

/**
 * Representa una mancha decorativa difuminada en el fondo.
 */
class SplatFondo {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(80, 800);
    this.alpha = random(1, 5); // Alpha bajo para mayor suavidad/difuminación
    this.color = this.colorNeonAleatorio();
    this.offset = random(1000);
  }
  
  colorNeonAleatorio() {
    const coloresNeon = [
      color(0, 229, 255, this.alpha),     // Cyan
      color(224, 64, 251, this.alpha),    // Magenta  
      color(255, 0, 128, this.alpha),     // Rosa
      color(128, 0, 255, this.alpha),     // Púrpura
      color(0, 255, 128, this.alpha)      // Verde menta
    ];
    return random(coloresNeon);
  }
  
  mostrar() {
    push();
    noStroke();
    fill(this.color);
    
    // Filtro de desenfoque nativo en canvas para efecto glassmorphism/glow
    drawingContext.filter = 'blur(12px)';
    
    let noiseScale = 0.01;
    let vertices = 8;
    beginShape();
    for (let i = 0; i < vertices; i++) {
      let angle = (TWO_PI / vertices) * i;
      let noiseOffset = noise(this.x * noiseScale + this.offset, this.y * noiseScale + this.offset, frameCount * 0.001);
      let radiusVariation = map(noiseOffset, 0, 1, this.size * 0.7, this.size * 1.3);
      let px = this.x + cos(angle) * radiusVariation;
      let py = this.y + sin(angle) * radiusVariation;
      vertex(px, py);
    }
    endShape(CLOSE);
    
    drawingContext.filter = 'none'; // Resetear filtro
    pop();
  }
}

/**
 * Representa una partícula pequeña en movimiento continuo por el fondo.
 */
class ParticulaFondo {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1, 4);
    this.alpha = random(50, 110);
    this.color = this.colorNeonAleatorio();
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
  }
  
  colorNeonAleatorio() {
    const coloresNeon = [
      color(0, 229, 255, this.alpha),     // Cyan
      color(224, 64, 251, this.alpha),    // Magenta
      color(255, 0, 128, this.alpha),     // Rosa
      color(128, 0, 255, this.alpha),     // Púrpura
      color(0, 255, 128, this.alpha)      // Verde menta
    ];
    return random(coloresNeon);
  }
  
  actualizar() {
    this.x += this.vx;
    this.y += this.vy;
    
    // Rebote en bordes de la pantalla
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
  
  mostrar() {
    push();
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
    pop();
  }
}

// ==========================================
// FUNCIONES DE INICIALIZACIÓN Y RENDERIZADO (p5.js)
// ==========================================

/**
 * Genera las manchas (splats) y partículas iniciales del fondo.
 */
function inicializarFondoArtistico() {
  splatsFondo = [];
  particulasFondo = [];

  // Crear 15 splats difuminados
  for (let i = 0; i < 15; i++) {
    splatsFondo.push(new SplatFondo());
  }
  
  // Crear 50 partículas cinéticas
  for (let i = 0; i < 50; i++) {
    particulasFondo.push(new ParticulaFondo());
  }
}

/**
 * Configuración inicial del canvas y eventos de la página.
 */
function setup() {
  createCanvas(windowWidth, windowHeight).parent("app");

  // Crear el fondo artístico animado
  inicializarFondoArtistico();

  const btn = document.getElementById("sendBtn");
  const infoText = document.getElementById("infoText");

  // Evento al pulsar "SKIP INTRO" o interactuar
  btn.addEventListener("click", () => {
    if (!userStar) {
      enviarDato();

      // Crear estrella en posición aleatoria en pantalla
      userStar = {
        x: random(width * 0.2, width * 0.8),
        y: random(height * 0.2, height * 0.8),
        size: random(10, 20),
        alpha: 50,
        maxAlpha: 255
      };

      showUserText = true;
      textTimer = millis();

      // Desvanecer el botón y textos principales
      [btn, infoText].filter(Boolean).forEach(el => {
        el.style.transition = "opacity 1s ease";
        el.style.opacity = 0;
        setTimeout(() => el.style.display = "none", 1000);
      });

      // Redirigir a la web principal de ECHO después de 2 segundos
      setTimeout(() => {
        window.location.href = "https://dramgoz.github.io/TFG-ECO/index_echo.html";
      }, 2000);
    }
  });
}

/**
 * Ciclo principal de dibujo de p5.js.
 */
function draw() {
  // 1. Dibujar el fondo oscuro y partículas animadas
  dibujarFondoArtisticoDeepDark();

  // 2. Si el usuario ha interactuado, dibujar su estrella y halo pulsante
  if (userStar) {
    if (userStar.alpha < userStar.maxAlpha) userStar.alpha += 5;

    let haloPulse = sin(frameCount * 0.03) * 5;

    // Halo difuso
    fill(0, 200, 255, 20);
    ellipse(userStar.x, userStar.y, (userStar.size + 20 + haloPulse) * 2);

    // Estrella central
    fill(220, 10, 10, userStar.alpha);
    ellipse(userStar.x, userStar.y, userStar.size * 2);
  }

  // 3. Dibujar el texto de agradecimiento al lado de la estrella
  if (showUserText && userStar) {
    fill(255, 255, 255, 120);
    textAlign(LEFT, CENTER);
    textSize(10);
    text("Gracias", userStar.x + 15, userStar.y);
    
    // Ocultar texto tras 5 segundos
    if (millis() - textTimer > 5000) {
      showUserText = false;
    }
  }
}

/**
 * Renderiza el color base del fondo y los splats/partículas animadas.
 */
function dibujarFondoArtisticoDeepDark() {
  background(20, 20, 30); // Fondo azul-gris oscuro profundo

  // Mostrar splats estáticos/animados en el canvas
  if (splatsFondo.length > 0) {
    splatsFondo.forEach(s => s.mostrar());
  }

  // Actualizar y mostrar partículas móviles
  if (particulasFondo.length > 0) {
    particulasFondo.forEach(p => {
      p.actualizar();
      p.mostrar();
    });
  }
}

// ==========================================
// CONEXIÓN CON EL SERVIDOR (Google Apps Script)
// ==========================================

/**
 * Envía la interacción y coordenadas del click del usuario a la base de datos de Google Sheets.
 */
function enviarDato() {
  const data = new URLSearchParams();
  data.append("valor", "click");
  data.append("x", mouseX);
  data.append("y", mouseY);

  fetch(API_URL, {
    method: "POST",
    body: data
  })
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
}

// ==========================================
// MANEJO DE EVENTOS DE PANTALLA
// ==========================================

/**
 * Ajusta el tamaño del canvas al cambiar la escala del navegador.
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
