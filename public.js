const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

// Variables de fondo artístico espectacular (sistema ECO)
let splatsFondo = [];
let particulasFondo = [];
let userStar = null;   // estrella única del usuario
let showUserText = false; // controlar el texto
let textTimer = 0;     // temporizador del texto

// Clases para el sistema de fondo artístico
class SplatFondo {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(80, 800);
    this.alpha = random(1, 5); // Reducido de 3-10 a 1-5 para más difuminación
    this.color = this.colorNeonAleatorio();
    this.offset = random(1000);
  }
  
  colorNeonAleatorio() {
    const coloresNeon = [
      color(0, 229, 255, this.alpha),     // Cyan
      color(224, 64, 251, this.alpha),    // Magenta  
      color(255, 0, 128, this.alpha),      // Rosa
      color(128, 0, 255, this.alpha),     // Púrpura
      color(0, 255, 128, this.alpha)       // Verde menta
    ];
    return random(coloresNeon);
  }
  
  mostrar() {
    push();
    noStroke();
    fill(this.color);
    
    // Aplicar blur al splat
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
    
    // Resetear el filtro para no afectar a otros elementos
    drawingContext.filter = 'none';
    pop();
  }
}

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
      color(255, 0, 128, this.alpha),      // Rosa
      color(128, 0, 255, this.alpha),     // Púrpura
      color(0, 255, 128, this.alpha)       // Verde menta
    ];
    return random(coloresNeon);
  }
  
  actualizar() {
    this.x += this.vx;
    this.y += this.vy;
    
    // Rebotar en bordes
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

function inicializarFondoArtistico() {
  splatsFondo = [];
  particulasFondo = [];

  // Crear splats grandes y espectaculares - 15 splats
  for (let i = 0; i < 15; i++) {
    let splat = new SplatFondo();
    splatsFondo.push(splat);
  }
  
  // Crear partículas cinéticas - 50 partículas
  for (let i = 0; i < 50; i++) {
    let particula = new ParticulaFondo();
    particulasFondo.push(particula);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight).parent("app");

  // Inicializar fondo artístico espectacular (sistema ECO)
  inicializarFondoArtistico();

  const btn = document.getElementById("sendBtn");
  const infoText = document.getElementById("infoText");

  btn.addEventListener("click", () => {
    if (!userStar) {
      enviarDato();

      // generar estrella única del usuario
      userStar = {
        x: random(width * 0.2, width * 0.8),
        y: random(height * 0.2, height * 0.8),
        size: random(10, 20),
        alpha: 50,
        maxAlpha: 255
      };

      // mostrar texto junto a la estrella
      showUserText = true;
      textTimer = millis();

      // desaparecer botón y texto principal
      [btn, infoText].filter(Boolean).forEach(el => {
        el.style.transition = "opacity 1s ease";
        el.style.opacity = 0;
        setTimeout(() => el.style.display = "none", 1000);
      });

      // Redirigir a la web de ECO después de 2 segundos
      setTimeout(() => {
        window.location.href = "https://dramgoz.github.io/TFG-ECO/index_echo.html"; // <-- REEMPLAZAR ESTA URL
      }, 2000);
    }
  });
}

function draw() {
  // Fondo artístico espectacular (sistema ECO)
  dibujarFondoArtisticoDeepDark();

  // dibujar halo pulsante de la estrella del usuario
  if (userStar) {
    // fade-in de la estrella
    if (userStar.alpha < userStar.maxAlpha) userStar.alpha += 5;

    // pulso del halo
    let haloPulse = sin(frameCount * 0.03) * 5; // oscila entre -10 y +10

    // halo difuso
    fill(0, 200, 255, 20);
    ellipse(userStar.x, userStar.y, (userStar.size + 20 + haloPulse) * 2);

    // dibujar estrella estática con brillo oscilante
    fill(220, 10, 10, userStar.alpha);
    ellipse(userStar.x, userStar.y, userStar.size * 2);
  }

  // dibujar texto junto a la estrella
  if (showUserText && userStar) {
    fill(255, 255, 255, 120);
    textAlign(LEFT, CENTER);
    textSize(10);
    text("Gracias", userStar.x + 15, userStar.y);
    
    // desaparecer texto tras 5 segundos
    if (millis() - textTimer > 5000) {
      showUserText = false;
    }
  }
}

function dibujarFondoArtisticoDeepDark() {
  // Fondo oscuro profundo como ECO
  background(20, 20, 30);

  // Dibujar splatters decorativos
  if (splatsFondo.length > 0) {
    splatsFondo.forEach(s => {
      s.mostrar();
    });
  }

  // Dibujar partículas cinéticas
  if (particulasFondo.length > 0) {
    particulasFondo.forEach(p => {
      p.actualizar();
      p.mostrar();
    });
  }
}



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

/*///////////////////////////////////////////////////////////////////////////////////////
let lastSent = 0;       // tiempo del último envío
const throttle = 500;   // tiempo mínimo entre envíos (ms)

window.addEventListener("mousemove", (e) => {
    const now = Date.now();

    // Limitar frecuencia de envío
    if (now - lastSent < throttle) return;
    lastSent = now;

    const x = e.clientX;
    const y = e.clientY;

    console.log(`Mouse move: X=${x}, Y=${y}`);

    // Enviar datos al Apps Script
    const data = new URLSearchParams();
    data.append("valor", "move");
    data.append("x", x);
    data.append("y", y);

    fetch(API_URL, {
        method: "POST",
        body: data
    })
    .then(r => r.text())
    .then(res => console.log("Enviado:", res))
    .catch(err => console.error("Error enviando:", err));
});
// ==========================
// RESIZE VENTANA
// ==========================*/
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

















