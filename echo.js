// ==========================
// CLASES DE GOTAS (DE GITHUB)
// ==========================
class GotaPinturaModo2 {
  constructor() {
    // Solo valores literales, sin funciones de p5.js
    this.x = 0;
    this.y = 0;
    this.radio = 0;
    this.radioFinal = 50; // Valor por defecto
    this.pasos = 50; // Valor por defecto
    this.offset = 500; // Valor por defecto
    this.creciendo = true;
    this.color = { r: 100, g: 100, b: 100, a: 70 }; // Objeto color por defecto
    this.noiseX = 500;
    this.noiseY = 600;

    // Marcar como no inicializado
    this.inicializado = false;
  }

  inicializar() {
    if (this.inicializado) return;

    // Ahora sí podemos usar funciones de p5.js
    this.radioFinal = random(RADIO_MIN, RADIO_MAX);
    this.pasos = int(random(NUM_VERTICES_MIN, NUM_VERTICES_MAX));
    this.velocidad = 9.0; // Velocidad del efecto de zoom
    this.offset = random(1000);
    this.color = estado.filtroColor ?
      color(random(255), random(255), random(255), ALPHA_COLOR) :
      color(random(100, 155), random(100, 155), random(100, 155), ALPHA_COLOR);
    this.noiseX = random(1000);
    this.noiseY = random(1000);

    // Inicializar posición
    if (typeof marcoX !== 'undefined') {
      this.x = random(marcoX + RADIO_MAX, marcoX + marcoW - RADIO_MAX);
      this.y = random(marcoY + RADIO_MAX, marcoY + marcoH - RADIO_MAX);
    }

    this.inicializado = true;
  }

  mostrar() {
    // Asegurar que esté inicializado antes de mostrar
    if (!this.inicializado) {
      this.inicializar();
      return; // Saltar este frame si recién se inicializó
    }

    if (this.creciendo) {
      this.radio += CRECIMIENTO;
      if (this.radio >= this.radioFinal) {
        this.radio = this.radioFinal;
        this.creciendo = false;
      }
    }
    let x = this.x + noise(this.noiseX) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;
    let y = this.y + noise(this.noiseY) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;

    noStroke();
    fill(this.color);
    beginShape();
    for (let i = 0; i < this.pasos; i++) {
      let ang = map(i, 0, this.pasos, 0, TWO_PI);
      let r = this.radio * map(noise(cos(ang) + this.offset, sin(ang) + this.offset), 0, 1, 0.7, 1.3);
      vertex(x + cos(ang) * r, y + sin(ang) * r);
    }
    endShape(CLOSE);

    this.noiseX += 0.005;
    this.noiseY += 0.005;
  }
}

class GotaPinturaModo3 {
  constructor() {
    // Propiedades para ondas con SimplexNoise
    this.x = 0;
    this.y = 0;
    this.color = null;
    this.amplitud = random(30, 80); // Amplitud más pequeña para múltiples ondas
    this.frecuencia = random(0.005, 0.015); // Frecuencia ajustada
    this.velocidad = random(0.002, 0.005); // Velocidad más lenta para mejor visualización
    this.offset = random(1000); // Offset para variación entre gotas
    this.pasos = 200; // Más puntos para ondas más suaves
    this.anchura = 0; // Se asignará en inicializar() cuando marcoW esté disponible

    // Marcar como no inicializado
    this.inicializado = false;
  }

  inicializar() {
    if (this.inicializado) return;

    // Ahora sí podemos usar funciones de p5.js
    this.color = estado.filtroColor ?
      color(random(255), random(255), random(255), ALPHA_COLOR) :
      color(random(100, 155), random(100, 155), random(100, 155), ALPHA_COLOR);

    // Asignar ancho completo del lienzo cuando marcoW esté disponible
    this.anchura = marcoW;

    // Posición aleatoria dentro del lienzo
    this.x = marcoX; // Siempre desde el borde izquierdo del marco
    this.y = random(marcoY + 50, marcoY + marcoH - 100); // Evitar bordes

    //console.log("🌊 Modo 3 inicializado: x=", this.x, "y=", this.y, "anchura=", this.anchura, "amplitud=", this.amplitud);

    this.inicializado = true;
  }

  actualizar() {
    // Las ondas se animan con el tiempo global (frameCount)
    // No necesitamos actualizar offset aquí, se usa frameCount directamente
  }

  mostrar() {
    // Asegurar que esté inicializado antes de mostrar
    if (!this.inicializado) {
      this.inicializar();
      return; // Saltar este frame si recién se inicializó
    }

    if (!this.color) return;

    push();
    fill(this.color);

    // Trazo contrastado según el fondo
    if (estado.fondoA4 === 'blanco') {
      stroke(0); // Trazo negro para fondo blanco
    } else {
      stroke(255); // Trazo blanco para fondo negro
    }
    strokeWeight(1); // Trazo más visible

    // Dibujar forma de onda usando SimplexNoise con frameCount para animación
    beginShape();
    for (let i = 0; i <= this.pasos; i++) {
      let x = this.x + (this.anchura * i / this.pasos);
      // Usar frameCount para animación continua y global
      let noise = simplex.noise2D(x * this.frecuencia, frameCount * this.velocidad + this.offset) * this.amplitud;
      vertex(x, this.y + noise);
    }

    // Cerrar la forma por abajo
    vertex(this.x + this.anchura, this.y + this.amplitud * 2);
    vertex(this.x, this.y + this.amplitud * 2);
    endShape(CLOSE);
    pop();
  }

  mostrarEnCanvas(pg, dpi = 72) {
    if (!this.color) return;

    pg.push();
    pg.fill(this.color);

    // Trazo contrastado según el fondo para exportación
    if (estado.fondoA4 === 'blanco') {
      pg.stroke(0); // Trazo negro para fondo blanco
    } else {
      pg.stroke(255); // Trazo blanco para fondo negro
    }
    pg.strokeWeight(1); // Trazo más visible

    // Dibujar forma de onda en canvas de exportación
    pg.beginShape();
    for (let i = 0; i <= this.pasos; i++) {
      let x = this.x + (this.anchura * i / this.pasos);
      // Para exportación, usar un tiempo fijo para congelar la animación
      let noise = simplex.noise2D(x * this.frecuencia, this.offset) * this.amplitud;
      pg.vertex(x, this.y + noise);
    }

    // Cerrar la forma por abajo
    pg.vertex(this.x + this.anchura, this.y + this.amplitud * 2);
    pg.vertex(this.x, this.y + this.amplitud * 2);
    pg.endShape(pg.CLOSE);
    pg.pop();
  }
}

class GotaPinturaModo0 {
  constructor() {
    console.log("🌟 Constructor GotaPinturaModo0 llamado");

    // Propiedades para partículas
    this.x = 0;
    this.y = 0;
    this.color = null;
    this.particles = [];
    this.TOTAL = 50; // Se asignará en inicializar() según contador real
    this.detenido = false; // Control global de detención

    // Marcar como no inicializado
    this.inicializado = false;

    console.log("🌟 GotaPinturaModo0 creada - inicializado:", this.inicializado);
  }

  inicializar() {
    if (this.inicializado) return;

    // Ahora sí podemos usar funciones de p5.js
    this.color = generarColorSegunFiltro();

    // Posición central dentro del lienzo
    this.x = marcoX + marcoW / 2;
    this.y = marcoY + marcoH / 2;

    // Usar siempre el contador real de usuarios cargados del sheet
    this.TOTAL = contadorRealUsuarios;

    // Crear partículas desde el centro (círculo central con partículas saliendo)
    this.particles = [];
    for (let i = 0; i < this.TOTAL; i++) {
      this.particles.push({
        pos: createVector(this.x, this.y), // Todas desde el centro
        dir: random(TWO_PI), // Dirección aleatoria para cada partícula
        velocidad: random(0.2, 1.5), // Velocidad aleatoria entre 0.2 y 1.5
        detenida: false, // Control individual de detención
        numero: i + 1 // Número secuencial
      });
    }

    // Reiniciar estado de detención
    this.detenido = false;

    this.inicializado = true;
  }

  actualizar() {
    if (!this.inicializado) return;

    // Si ya están todas detenidas, no hacer nada
    let todasDetenidas = this.particles.every(p => p.detenida);
    if (todasDetenidas) {
      if (!this.detenido) {
        this.detenido = true;
      }
      return;
    }

    // Mover cada partícula individualmente
    for (var i = 0; i < this.particles.length; i++) {
      var particle = this.particles[i];

      // Si esta partícula ya está detenida, saltarla
      if (particle.detenida) continue;

      // Calcular siguiente posición
      let nextX = particle.pos.x + cos(particle.dir) * particle.velocidad;
      let nextY = particle.pos.y + sin(particle.dir) * particle.velocidad;

      // Calcular distancia desde el centro del lienzo
      let centroX = marcoX + marcoW / 2;
      let centroY = marcoY + marcoH / 2;
      let distanciaDesdeCentro = dist(nextX, nextY, centroX, centroY);

      // Separación mínima del centro (150px)
      let separacionMinima = 150;

      // Verificar si esta partícula debe detenerse
      let margen = 80; // Margen de 80px del borde

      // Detener si alcanza el borde O si tiene suficiente separación del centro (aleatorio)
      let debeDetenersePorBorde = (nextX <= marcoX + margen ||
        nextX >= marcoX + marcoW - margen ||
        nextY <= marcoY + margen ||
        nextY >= marcoY + marcoH - margen);

      let debeDetenersePorDistancia = distanciaDesdeCentro >= separacionMinima;

      // Probabilidad aleatoria de detenerse cuando cumple condiciones
      let probabilidadDetencion = 0.02; // 2% de probabilidad por frame

      if ((debeDetenersePorBorde && debeDetenersePorDistancia) ||
        (debeDetenersePorDistancia && random() < probabilidadDetencion)) {
        // Detener solo esta partícula
        particle.detenida = true;
      } else {
        // Mover esta partícula
        particle.pos.x = nextX;
        particle.pos.y = nextY;
      }
    }
  }

  mostrar() {
    // Asegurar que esté inicializado antes de mostrar
    if (!this.inicializado) {
      this.inicializar();
      return; // Saltar este frame si recién se inicializó
    }

    if (!this.color) {
      return;
    }

    push();

    // Dibujar cada partícula con trazo (para crear el rastro) y número al lado
    for (var i = 0; i < this.particles.length; i++) {
      var particle = this.particles[i];

      // Dibujar línea desde el centro hasta la posición actual (rastro)
      stroke(red(this.color), green(this.color), blue(this.color), 50); // Trazo semitransparente
      strokeWeight(1);
      line(this.x, this.y, particle.pos.x, particle.pos.y);

      // Dibujar círculo más grande en la posición actual con su color
      fill(this.color); // Usar el color de la partícula
      noStroke();
      circle(particle.pos.x, particle.pos.y, 12); // Círculos de 12px

      // Dibujar número secuencial (i + 1) en blanco al lado del círculo
      fill(255); // Texto blanco
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(10); // Texto más grande para círculos más grandes

      // Posicionar el número a la derecha del círculo
      let numeroX = particle.pos.x + 15; // 15px a la derecha del centro
      let numeroY = particle.pos.y;
      text(i + 1, numeroX, numeroY);
    }
    pop();
  }

  mostrarEnCanvas(pg, dpi = 72) {
    if (!this.color) return;

    pg.push();

    // Dibujar cada partícula con trazo (para crear el rastro) y número al lado
    for (var i = 0; i < this.particles.length; i++) {
      var particle = this.particles[i];

      // Dibujar línea desde el centro hasta la posición actual (rastro)
      pg.stroke(red(this.color), green(this.color), blue(this.color), 50); // Trazo semitransparente
      pg.strokeWeight(1);
      pg.line(this.x, this.y, particle.pos.x, particle.pos.y);

      // Dibujar círculo más grande en la posición actual con su color
      pg.fill(this.color); // Usar el color de la partícula
      pg.noStroke();
      pg.circle(particle.pos.x, particle.pos.y, 12); // Círculos de 12px

      // Dibujar número secuencial (i + 1) en blanco al lado del círculo
      pg.fill(255); // Texto blanco
      pg.noStroke();
      pg.textAlign(CENTER, CENTER);
      pg.textSize(10); // Texto más grande para círculos más grandes

      // Posicionar el número a la derecha del círculo
      let numeroX = particle.pos.x + 15; // 15px a la derecha del centro
      let numeroY = particle.pos.y;
      pg.text(i + 1, numeroX, numeroY);
    }
    pg.pop();
  }
}

class GotaPinturaModo4 {
  constructor() {
    // Solo valores literales, sin funciones de p5.js
    this.x = 0;
    this.y = 0;
    this.radio = 0;
    this.radioFinal = 50; // Valor por defecto
    this.velocidad = 9.0; // Velocidad del efecto de zoom
    this.creciendo = true;
    this.color = { r: 100, g: 100, b: 100, a: 70 }; // Objeto color por defecto
    this.noiseX = 500; // Para movimiento sutil
    this.noiseY = 600; // Para movimiento sutil
    this.rotacion = 0; // Rotación angular aleatoria
    this.inicializado = false;
  }

  inicializar() {
    if (this.inicializado) return;

    // Ahora sí podemos usar funciones de p5.js
    this.radioFinal = random(RADIO_MIN, RADIO_MAX);
    this.color = generarColorSegunFiltro();

    // Posición aleatoria dentro del lienzo
    this.x = random(marcoX, marcoX + marcoW);
    this.y = random(marcoY, marcoY + marcoH);

    // Inicializar radio para animación
    this.radio = 0;

    // Inicializar noise para movimiento sutil
    this.noiseX = random(1000);
    this.noiseY = random(1000);

    // Rotación angular aleatoria para variedad visual
    this.rotacion = random(TWO_PI);

    this.inicializado = true;
  }

  actualizar() {
    if (!this.inicializado) return;

    // Animación de crecimiento suave
    if (this.creciendo && this.radio < this.radioFinal) {
      this.radio += (this.radioFinal - this.radio) * 0.1;
      if (this.radio >= this.radioFinal * 0.99) {
        this.creciendo = false;
      }
    }

    // SIN MOVIMIENTO DE POSICIÓN - las gotas quedan quietas después del zoom

    // Actualizar noise para siguiente frame (solo para posibles efectos visuales futuros)
    this.noiseX += 0.005;
    this.noiseY += 0.005;
  }

  dibujar() {
    if (!this.inicializado) return;

    push();
    noStroke();
    fill(this.color);
    // Aplicar rotación aleatoria y dibujar triángulo equilátero perfecto
    translate(this.x, this.y);
    rotate(this.rotacion);
    beginShape();
    for (let i = 0; i < 3; i++) {
      let ang = map(i, 0, 3, 0, TWO_PI);
      vertex(cos(ang) * this.radio, sin(ang) * this.radio);
    }
    endShape(CLOSE);
    pop();
  }

  mostrar() {
    // Asegurar que esté inicializado antes de mostrar
    if (!this.inicializado) {
      this.inicializar();
      return; // Saltar este frame si recién se inicializó
    }

    // Animación de crecimiento suave
    if (this.creciendo && this.radio < this.radioFinal) {
      this.radio += (this.radioFinal - this.radio) * 0.1;
      if (this.radio >= this.radioFinal * 0.99) {
        this.creciendo = false;
      }
    }

    // Movimiento sutil con noise (igual que los otros modos)
    let x = this.x + noise(this.noiseX) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;
    let y = this.y + noise(this.noiseY) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;

    // Actualizar noise para siguiente frame
    this.noiseX += 0.005;
    this.noiseY += 0.005;

    // Mantener dentro de los límites del marco
    x = constrain(x, marcoX, marcoX + marcoW);
    y = constrain(y, marcoY, marcoY + marcoH);

    // Dibujar el triángulo con rotación aleatoria
    push();
    noStroke();
    fill(this.color);
    translate(x, y);
    rotate(this.rotacion);
    beginShape();
    for (let i = 0; i < 3; i++) {
      let ang = map(i, 0, 3, 0, TWO_PI);
      vertex(cos(ang) * this.radio, sin(ang) * this.radio);
    }
    endShape(CLOSE);
    pop();
  }
}

class GotaPinturaModo6 {
  constructor() {
    // Solo valores literales, sin funciones de p5.js
    this.x = 0;
    this.y = 0;
    this.radio = 0;
    this.radioFinal = 50; // Valor por defecto
    this.velocidad = 0.5; // Velocidad adecuada para efecto de zoom
    this.creciendo = true;
    this.color = { r: 100, g: 100, b: 100, a: 70 }; // Objeto color por defecto
    this.noiseX = 500; // Para movimiento sutil
    this.noiseY = 600; // Para movimiento sutil
    this.rotacion = 0; // Rotación angular aleatoria
    this.inicializado = false;
  }

  inicializar() {
    if (this.inicializado) return;

    // Ahora sí podemos usar funciones de p5.js
    this.radioFinal = random(RADIO_MIN, RADIO_MAX);
    this.color = generarColorSegunFiltro();

    // Posición aleatoria dentro del lienzo
    this.x = random(marcoX, marcoX + marcoW);
    this.y = random(marcoY, marcoY + marcoH);

    // Inicializar radio para animación
    this.radio = 0;

    // Inicializar noise para movimiento sutil
    this.noiseX = random(1000);
    this.noiseY = random(1000);

    // Rotación angular aleatoria para variedad visual
    this.rotacion = random(TWO_PI);

    this.inicializado = true;
  }

  actualizar() {
    if (!this.inicializado) return;

    // Animación de crecimiento suave
    if (this.creciendo && this.radio < this.radioFinal) {
      this.radio += (this.radioFinal - this.radio) * 0.1;
      if (this.radio >= this.radioFinal * 0.99) {
        this.creciendo = false;
      }
    }

    // SIN MOVIMIENTO DE POSICIÓN - las gotas quedan quietas después del zoom

    // Actualizar noise para siguiente frame (solo para posibles efectos visuales futuros)
    this.noiseX += 0.005;
    this.noiseY += 0.005;
  }

  dibujar() {
    if (!this.inicializado) return;

    push();
    noStroke();
    fill(this.color);
    // Aplicar rotación aleatoria y dibujar cuadrado perfecto
    translate(this.x, this.y);
    rotate(this.rotacion);
    rectMode(CENTER);
    rect(0, 0, this.radio * 2, this.radio * 2);
    pop();
  }

  mostrar() {
    // Asegurar que esté inicializado antes de mostrar
    if (!this.inicializado) {
      this.inicializar();
      return; // Saltar este frame si recién se inicializó
    }

    // Animación de crecimiento suave
    if (this.creciendo && this.radio < this.radioFinal) {
      this.radio += (this.radioFinal - this.radio) * 0.1;
      if (this.radio >= this.radioFinal * 0.99) {
        this.creciendo = false;
      }
    }

    // Movimiento sutil con noise (igual que los otros modos)
    let x = this.x + noise(this.noiseX) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;
    let y = this.y + noise(this.noiseY) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;

    // Actualizar noise para siguiente frame
    this.noiseX += 0.005;
    this.noiseY += 0.005;

    // Mantener dentro de los límites del marco
    x = constrain(x, marcoX, marcoX + marcoW);
    y = constrain(y, marcoY, marcoY + marcoH);

    // Dibujar el cuadrado con rotación aleatoria
    push();
    noStroke();
    fill(this.color);
    translate(x, y);
    rotate(this.rotacion);
    rectMode(CENTER);
    rect(0, 0, this.radio * 2, this.radio * 2);
    pop();
  }
}

class GotaPinturaModo8 {
  constructor() {
    // Solo valores literales, sin funciones de p5.js
    this.x = 0;
    this.y = 0;
    this.radio = 0;
    this.radioFinal = 50; // Valor por defecto
    this.velocidad = 0.5; // Velocidad adecuada para efecto de zoom
    this.creciendo = true;
    this.color = { r: 100, g: 100, b: 100, a: 70 }; // Objeto color por defecto
    this.noiseX = 500; // Para movimiento sutil
    this.noiseY = 600; // Para movimiento sutil
    this.rotacion = 0; // Rotación angular aleatoria
    this.tipoForma = 0; // Tipo de forma: 0=cuadrado, 1=triángulo, 2=círculo
    this.inicializado = false;
  }

  inicializar() {
    if (this.inicializado) return;

    // Ahora sí podemos usar funciones de p5.js
    this.radioFinal = random(RADIO_MIN, RADIO_MAX);
    this.color = generarColorSegunFiltro();

    // Posición aleatoria dentro del lienzo
    this.x = random(marcoX, marcoX + marcoW);
    this.y = random(marcoY, marcoY + marcoH);

    // Inicializar radio para animación
    this.radio = 0;

    // Inicializar noise para movimiento sutil
    this.noiseX = random(1000);
    this.noiseY = random(1000);

    // Rotación angular aleatoria para variedad visual
    this.rotacion = random(TWO_PI);

    // Tipo de forma aleatorio: 0=cuadrado, 1=triángulo, 2=círculo
    this.tipoForma = int(random(3));

    this.inicializado = true;
  }

  actualizar() {
    if (!this.inicializado) return;

    // Animación de crecimiento suave
    if (this.creciendo && this.radio < this.radioFinal) {
      this.radio += (this.radioFinal - this.radio) * 0.1;
      if (this.radio >= this.radioFinal * 0.99) {
        this.creciendo = false;
      }
    }

    // SIN MOVIMIENTO DE POSICIÓN - las gotas quedan quietas después del zoom

    // Actualizar noise para siguiente frame (solo para posibles efectos visuales futuros)
    this.noiseX += 0.005;
    this.noiseY += 0.005;
  }

  dibujar() {
    if (!this.inicializado) return;

    push();
    stroke(0, 150); // Trazo negro con transparencia
    strokeWeight(2);
    fill(this.color);
    // Aplicar rotación aleatoria y dibujar forma geométrica
    translate(this.x, this.y);
    rotate(this.rotacion);

    // Dibujar según tipo de forma
    if (this.tipoForma === 0) {
      // Cuadrado
      rectMode(CENTER);
      rect(0, 0, this.radio * 2, this.radio * 2);
    } else if (this.tipoForma === 1) {
      // Triángulo
      beginShape();
      for (let i = 0; i < 3; i++) {
        let ang = map(i, 0, 3, 0, TWO_PI);
        vertex(cos(ang) * this.radio, sin(ang) * this.radio);
      }
      endShape(CLOSE);
    } else if (this.tipoForma === 2) {
      // Círculo
      ellipse(0, 0, this.radio * 2);
    }
    pop();
  }

  mostrar() {
    // Asegurar que esté inicializado antes de mostrar
    if (!this.inicializado) {
      this.inicializar();
      return; // Saltar este frame si recién se inicializó
    }

    // Animación de crecimiento suave
    if (this.creciendo && this.radio < this.radioFinal) {
      this.radio += (this.radioFinal - this.radio) * 0.1;
      if (this.radio >= this.radioFinal * 0.99) {
        this.creciendo = false;
      }
    }

    // Movimiento sutil con noise (igual que los otros modos)
    let x = this.x + noise(this.noiseX) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;
    let y = this.y + noise(this.noiseY) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;

    // Actualizar noise para siguiente frame
    this.noiseX += 0.005;
    this.noiseY += 0.005;

    // Mantener dentro de los límites del marco
    x = constrain(x, marcoX, marcoX + marcoW);
    y = constrain(y, marcoY, marcoY + marcoH);

    // Dibujar la forma geométrica con rotación aleatoria
    push();
    stroke(0, 150); // Trazo negro con transparencia
    strokeWeight(2);
    fill(this.color);
    translate(x, y);
    rotate(this.rotacion);

    // Dibujar según tipo de forma
    if (this.tipoForma === 0) {
      // Cuadrado
      rectMode(CENTER);
      rect(0, 0, this.radio * 2, this.radio * 2);
    } else if (this.tipoForma === 1) {
      // Triángulo
      beginShape();
      for (let i = 0; i < 3; i++) {
        let ang = map(i, 0, 3, 0, TWO_PI);
        vertex(cos(ang) * this.radio, sin(ang) * this.radio);
      }
      endShape(CLOSE);
    } else if (this.tipoForma === 2) {
      // Círculo
      ellipse(0, 0, this.radio * 2);
    }
    pop();
  }
}

class GotaPinturaModo7 {
  constructor() {
    // Solo valores literales, sin funciones de p5.js
    this.x = 0;
    this.y = 0;
    this.radio = 0;
    this.radioFinal = 50; // Valor por defecto
    this.velocidad = 0.5; // Velocidad adecuada para efecto de zoom
    this.creciendo = true;
    this.color = { r: 100, g: 100, b: 100, a: 70 }; // Objeto color por defecto
    this.noiseX = 500; // Para movimiento sutil
    this.noiseY = 600; // Para movimiento sutil
    this.rotacion = 0; // Rotación angular aleatoria
    this.letra = ""; // Letra aleatoria del abecedario
    this.inicializado = false;
  }

  inicializar() {
    if (this.inicializado) return;

    // Ahora sí podemos usar funciones de p5.js
    this.radioFinal = random(RADIO_MIN, RADIO_MAX);
    this.color = generarColorSegunFiltro();

    // Posición aleatoria dentro del lienzo
    this.x = random(marcoX, marcoX + marcoW);
    this.y = random(marcoY, marcoY + marcoH);

    // Inicializar radio para animación
    this.radio = 0;

    // Inicializar noise para movimiento sutil
    this.noiseX = random(1000);
    this.noiseY = random(1000);

    // Rotación angular aleatoria para variedad visual
    this.rotacion = random(TWO_PI);

    // Letra aleatoria del abecedario (mayúsculas y minúsculas)
    let abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let indice = int(random(abecedario.length));
    this.letra = abecedario.charAt(indice);

    this.inicializado = true;
  }

  actualizar() {
    if (!this.inicializado) return;

    // Animación de crecimiento suave
    if (this.creciendo && this.radio < this.radioFinal) {
      this.radio += (this.radioFinal - this.radio) * 0.1;
      if (this.radio >= this.radioFinal * 0.99) {
        this.creciendo = false;
      }
    }

    // SIN MOVIMIENTO DE POSICIÓN - las gotas quedan quietas después del zoom

    // Actualizar noise para siguiente frame (solo para posibles efectos visuales futuros)
    this.noiseX += 0.005;
    this.noiseY += 0.005;
  }

  dibujar() {
    if (!this.inicializado) return;

    push();
    noStroke();
    fill(this.color);
    // Aplicar rotación aleatoria y dibujar letra
    translate(this.x, this.y);
    rotate(this.rotacion);
    textAlign(CENTER, CENTER);
    textSize(this.radio);
    textStyle(BOLD);
    text(this.letra, 0, 0);
    pop();
  }

  mostrar() {
    // Asegurar que esté inicializado antes de mostrar
    if (!this.inicializado) {
      this.inicializar();
      return; // Saltar este frame si recién se inicializó
    }

    // Animación de crecimiento suave
    if (this.creciendo && this.radio < this.radioFinal) {
      this.radio += (this.radioFinal - this.radio) * 0.1;
      if (this.radio >= this.radioFinal * 0.99) {
        this.creciendo = false;
      }
    }

    // Movimiento sutil con noise (igual que los otros modos)
    let x = this.x + noise(this.noiseX) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;
    let y = this.y + noise(this.noiseY) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;

    // Actualizar noise para siguiente frame
    this.noiseX += 0.005;
    this.noiseY += 0.005;

    // Mantener dentro de los límites del marco
    x = constrain(x, marcoX, marcoX + marcoW);
    y = constrain(y, marcoY, marcoY + marcoH);

    // Dibujar la letra con rotación aleatoria
    push();
    noStroke();
    fill(this.color);
    translate(x, y);
    rotate(this.rotacion);
    textAlign(CENTER, CENTER);
    textSize(this.radio);
    textStyle(BOLD);
    text(this.letra, 0, 0);
    pop();
  }
}

class GotaPinturaModo9 {
  constructor() {
    // Solo valores literales, sin funciones de p5.js
    this.x = 0;
    this.y = 0;
    this.radio = 0;
    this.radioFinal = 50; // Valor por defecto
    this.velocidad = 0.5; // Velocidad adecuada para efecto de zoom
    this.creciendo = true;
    this.color = { r: 100, g: 100, b: 100, a: 70 }; // Objeto color por defecto
    this.noiseX = 500; // Para movimiento sutil
    this.noiseY = 600; // Para movimiento sutil
    this.rotacion = 0; // Rotación angular aleatoria
    this.numPuntas = 5; // Número aleatorio de puntas (3-8)
    this.inicializado = false;
  }

  inicializar() {
    if (this.inicializado) return;

    // Ahora sí podemos usar funciones de p5.js
    this.radioFinal = random(RADIO_MIN, RADIO_MAX);
    this.color = generarColorSegunFiltro();

    // Posición aleatoria dentro del lienzo
    this.x = random(marcoX, marcoX + marcoW);
    this.y = random(marcoY, marcoY + marcoH);

    // Inicializar radio para animación
    this.radio = 0;

    // Inicializar noise para movimiento sutil
    this.noiseX = random(1000);
    this.noiseY = random(1000);

    // Rotación angular aleatoria para variedad visual
    this.rotacion = random(TWO_PI);

    // Número aleatorio de puntas (4-8)
    this.numPuntas = int(random(4, 9)); // 4, 5, 6, 7, 8

    this.inicializado = true;
  }

  actualizar() {
    if (!this.inicializado) return;

    // Animación de crecimiento suave
    if (this.creciendo && this.radio < this.radioFinal) {
      this.radio += (this.radioFinal - this.radio) * 0.1;
      if (this.radio >= this.radioFinal * 0.99) {
        this.creciendo = false;
      }
    }

    // SIN MOVIMIENTO DE POSICIÓN - las gotas quedan quietas después del zoom

    // Actualizar noise para siguiente frame (solo para posibles efectos visuales futuros)
    this.noiseX += 0.005;
    this.noiseY += 0.005;
  }

  dibujar() {
    if (!this.inicializado) return;

    push();
    noStroke();
    fill(this.color);
    // Aplicar rotación aleatoria y dibujar estrella perfecta
    translate(this.x, this.y);
    rotate(this.rotacion);
    beginShape();
    for (let i = 0; i < this.numPuntas * 2; i++) {
      let ang = map(i, 0, this.numPuntas * 2, 0, TWO_PI);
      let radioActual = (i % 2 === 0) ? this.radio : this.radio * 0.5;
      vertex(cos(ang) * radioActual, sin(ang) * radioActual);
    }
    endShape(CLOSE);
    pop();
  }

  mostrar() {
    // Asegurar que esté inicializado antes de mostrar
    if (!this.inicializado) {
      this.inicializar();
      return; // Saltar este frame si recién se inicializó
    }

    // Animación de crecimiento suave
    if (this.creciendo && this.radio < this.radioFinal) {
      this.radio += (this.radioFinal - this.radio) * 0.1;
      if (this.radio >= this.radioFinal * 0.99) {
        this.creciendo = false;
      }
    }

    // Movimiento sutil con noise (igual que los otros modos)
    let x = this.x + noise(this.noiseX) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;
    let y = this.y + noise(this.noiseY) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;

    // Actualizar noise para siguiente frame
    this.noiseX += 0.005;
    this.noiseY += 0.005;

    // Mantener dentro de los límites del marco
    x = constrain(x, marcoX, marcoX + marcoW);
    y = constrain(y, marcoY, marcoY + marcoH);

    // Dibujar la estrella con rotación aleatoria
    push();
    noStroke();
    fill(this.color);
    translate(x, y);
    rotate(this.rotacion);
    beginShape();
    for (let i = 0; i < this.numPuntas * 2; i++) {
      let ang = map(i, 0, this.numPuntas * 2, 0, TWO_PI);
      let radioActual = (i % 2 === 0) ? this.radio : this.radio * 0.5;
      vertex(cos(ang) * radioActual, sin(ang) * radioActual);
    }
    endShape(CLOSE);
    pop();
  }
}

class GotaPinturaModo5 {
  constructor() {
    // Solo valores literales, sin funciones de p5.js
    this.x = 0;
    this.y = 0;
    this.radio = 0;
    this.radioFinal = 50; // Valor por defecto
    this.velocidad = 0.5; // Velocidad adecuada para efecto de zoom
    this.creciendo = true;
    this.color = { r: 100, g: 100, b: 100, a: 70 }; // Objeto color por defecto
    this.noiseX = 500; // Para movimiento sutil
    this.noiseY = 600; // Para movimiento sutil
    this.inicializado = false;
  }

  inicializar() {
    if (this.inicializado) return;

    // Ahora sí podemos usar funciones de p5.js
    this.radioFinal = random(RADIO_MIN, RADIO_MAX);
    this.color = generarColorSegunFiltro();

    // Posición aleatoria dentro del lienzo
    this.x = random(marcoX, marcoX + marcoW);
    this.y = random(marcoY, marcoY + marcoH);

    // Inicializar radio para animación
    this.radio = 0;

    // Inicializar noise para movimiento sutil
    this.noiseX = random(1000);
    this.noiseY = random(1000);

    this.inicializado = true;
  }

  actualizar() {
    if (!this.inicializado) return;

    // Animación de crecimiento suave
    if (this.creciendo && this.radio < this.radioFinal) {
      this.radio += (this.radioFinal - this.radio) * 0.1;
      if (this.radio >= this.radioFinal * 0.99) {
        this.creciendo = false;
      }
    }

    // SIN MOVIMIENTO DE POSICIÓN - las gotas quedan quietas después del zoom

    // Actualizar noise para siguiente frame (solo para posibles efectos visuales futuros)
    this.noiseX += 0.005;
    this.noiseY += 0.005;
  }

  dibujar() {
    if (!this.inicializado) return;

    push();
    noStroke();
    fill(this.color);
    // Dibujar círculo perfecto sin ruido
    ellipse(this.x, this.y, this.radio * 2);
    pop();
  }

  mostrar() {
    // Asegurar que esté inicializado antes de mostrar
    if (!this.inicializado) {
      this.inicializar();
      return; // Saltar este frame si recién se inicializó
    }

    // Animación de crecimiento suave
    if (this.creciendo && this.radio < this.radioFinal) {
      this.radio += (this.radioFinal - this.radio) * 0.1;
      if (this.radio >= this.radioFinal * 0.99) {
        this.creciendo = false;
      }
    }

    // Movimiento sutil con noise (igual que los otros modos)
    let x = this.x + noise(this.noiseX) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;
    let y = this.y + noise(this.noiseY) * RUEDO_MOVIMIENTO - RUEDO_MOVIMIENTO / 2;

    // Actualizar noise para siguiente frame
    this.noiseX += 0.005;
    this.noiseY += 0.005;

    // Mantener dentro de los límites del marco
    x = constrain(x, marcoX, marcoX + marcoW);
    y = constrain(y, marcoY, marcoY + marcoH);

    // Dibujar el círculo
    push();
    noStroke();
    fill(this.color);
    ellipse(x, y, this.radio * 2);
    pop();
  }
}

class GotaPinturaModo1 {
  constructor() {
    // Solo valores literales, sin funciones de p5.js
    this.x = 0;
    this.y = 0;
    this.radio = 5;
    this.radioFinal = 80; // Valor por defecto
    this.velocidad = 0.5; // Velocidad adecuada para efecto de zoom
    this.ruidoOffset = 500; // Valor por defecto
    this.finalizada = false;
    this.pasos = 120;
    this.vertices = [];
    this.noiseX = 500;
    this.noiseY = 600;
    this.movimiento = 50;
    this.color = { r: 100, g: 100, b: 100, a: 70 }; // Objeto color por defecto

    // Marcar como no inicializado
    this.inicializado = false;
  }

  inicializar() {
    if (this.inicializado) return;

    // Ahora sí podemos usar funciones de p5.js
    this.radioFinal = random(40, 120);
    this.velocidad = 9.0; // Velocidad del efecto de zoom
    this.ruidoOffset = random(1000);
    this.color = generarColorSegunFiltro();
    this.noiseX = random(1000);
    this.noiseY = random(1000);

    // Inicializar posición
    if (typeof marcoX !== 'undefined') {
      this.x = random(marcoX + RADIO_MAX, marcoX + marcoW - RADIO_MAX);
      this.y = random(marcoY + RADIO_MAX, marcoY + marcoH - RADIO_MAX);
    }

    this.inicializado = true;
  }

  calcularForma() {
    this.vertices = [];
    for (let i = 0; i <= this.pasos; i++) {
      let ang = map(i, 0, this.pasos, 0, TWO_PI);
      let deformacion = noise(cos(ang) * 120, sin(ang) * 240, this.ruidoOffset);
      let r = this.radio * map(deformacion, 0, 1, 0.4, 2.0);
      this.vertices.push({ x: this.x + cos(ang) * r, y: this.y + sin(ang) * r });
    }
  }

  mostrar() {
    // Asegurar que esté inicializado antes de mostrar
    if (!this.inicializado) {
      this.inicializar();
      return; // Saltar este frame si recién se inicializó
    }

    if (!this.finalizada) {
      this.radio += this.velocidad;
      if (this.radio >= this.radioFinal) {
        this.radio = this.radioFinal;
        this.finalizada = true;
      }
      this.calcularForma();
      this.ruidoOffset += 0.025;
    }

    let dx = noise(this.noiseX) * this.movimiento - this.movimiento / 2;
    let dy = noise(this.noiseY) * this.movimiento - this.movimiento / 2;

    noStroke();
    fill(this.color);
    beginShape();
    this.vertices.forEach(v => vertex(v.x + dx, v.y + dy));
    endShape(CLOSE);

    this.noiseX += 0.004;
    this.noiseY += 0.004;
  }
}

// ==========================
// CONFIGURACIÓN HÍBRIDA
// ==========================
const NUM_VERTICES_MIN = 20;
const NUM_VERTICES_MAX = 120;
const RADIO_MIN = 10;
const RADIO_MAX = 120;
const ALPHA_COLOR = 70;
const RUEDO_MOVIMIENTO = 50;
const CRECIMIENTO = 2.5;
const A4_RATIO = 210 / 297;

// ===================================
// ESTADO GLOBAL / VARIABLES GLOBALES
// ===================================
let titulo = "ECODIV - Creacion de Arte Digital";
let subtitulo = "Interaccion de usuarios en tiempo real";
let canvas;
let capaTexto;
let mensajeEstado = '';
let mensajeEstadoHasta = 0;

// Variables de fondo artístico espectacular
let splatsFondo = [];
let particulasFondo = [];

// Variables globales para máscara
let mascaraNecesitaRedibujo = false;
let mascaraAnchoOriginal = 0;
let mascaraAltoOriginal = 0;

window.estado = {
  fondoA4: 'blanco',
  mostrarTexto: true,
  mostrarContador: true,
  mostrarGotas: true,
  filtroColor: true,
  modoColor: 'rgb', // rgb, grises, blancoNegro, cmyk
  orientacion: "vertical",
  modo: "modo2" // MODO POR DEFECTO
};

const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";
const PASSWORD_MODO0 = "ecodiv0";
const TEST_EXPORTACION_URL = "https://script.google.com/macros/s/AKfycbxHOBb4ofglXhYDES8nGY_m-lEcdG6dzg1nQJIjDaETLLuYIYOZuQv0LhWkf7ljRqJoSw/exec";

let gotas = [];
let idsExistentes = new Set(); // Para evitar duplicados
let contadorRealUsuarios = 0; // Contador global de usuarios reales del sheet
let bloquearCargaDatos = false; // Control para evitar múltiples cargas simultáneas
let sincronizacionInicialDatos = false; // Control de sincronización inicial

// Sistema de actualización automática
let intervaloActualizacion = null;
let ultimaActualizacion = 0;
const INTERVALO_ACTUALIZACION = 3000; // 3 segundos
let testExportacionEnviado = false;
let exportacionPendiente = null;

// Variables globales para el marco del lienzo
let marcoX, marcoY, marcoW, marcoH; // Controla si las gotas se muestran o no
let modo3D = false; // Controla si estamos en modo 3D/WebGL
let texturaCanvas = null; // Textura del canvas 2D para mapear en 3D
let rotacionX = 0;
let rotacionY = 0;
let zoomLienzo = 1; // Zoom específico para formato lienzo
let mouseWheelDelta = 0; // Para detectar scroll del mouse
let logoLienzo = null; // Logo-lienzo como marca de agua en el canvas

// Variables para modo 3 (ondas con SimplexNoise)
let simplex;

// ==========================
// PRELOAD - Cargar assets
// ==========================
function preload() {
  // Cargar logo-lienzo (marca de agua)
  logoLienzo = loadImage('logotipo_ECODIV.png');
}

// ==========================
// SETUP
// ==========================
function setup() {
  // console.log('🚀 DEBUG: setup() híbrido iniciado');
  try {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('a4-container');
    // console.log('🚀 DEBUG: canvas híbrido creado');

    // Inicializar SimplexNoise para modo 3 (ondas)
    simplex = new SimplexNoise();

    // Cargar fuente para modo WebGL - Arial del sistema
    textFont('Arial'); // Fuente del sistema, disponible inmediatamente

    // Inicializar variables básicas
    gotas = [];
    idsExistentes.clear();

    // Calcular marco A4
    recalcularMarco();
    // console.log('🚀 DEBUG: marco híbrido calculado');

    // Inicializar fondo artístico espectacular
    inicializarFondoArtistico();

    restaurarEstadoTrasVista3D();

    // Forzar posicionamiento inmediato de paneles ANTES de cualquier renderizado
    setTimeout(() => {
      posicionarPanelesBotones();

      // OCULTAR botón 2D por defecto (estamos en modo 2D)
      let btn2D = document.getElementById('btn-vista-2d');
      if (btn2D) btn2D.style.display = 'none';
    }, 0);

    // NO cargar interacciones automáticamente - se cargarán con el botón
    // console.log("🔄 Las gotas se cargarán cuando el usuario pulse 'Cargar interacciones'");

    // console.log("🎯 ECHO.JS HÍBRIDO cargado correctamente");
  } catch (error) {
    console.error("❌ Error en setup():", error);
  }
}

// ==========================
// DRAW HÍBRIDO
// ==========================
let primerFrame = true;
let datosCargados = false;

function draw() {
  // Forzar posicionamiento en el primer frame
  if (primerFrame) {
    posicionarPanelesBotones();
    primerFrame = false;

    // NO cargar datos automáticamente - se cargarán con el botón "Cargar interacciones"
  }

  // MODO 3D/WEBGL
  if (modo3D) {
    dibujarModo3D();
    return;
  }

  // MODO 2D NORMAL
  // 1. Fondo artístico espectacular (negro con partículas CMYK)
  dibujarFondoArtisticoDeepDark();

  // 2. Marco A4 con efectos neon
  dibujarMarcoA4();

  // 3. Clipping de gotas dentro del marco
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(marcoX, marcoY, marcoW, marcoH);
  drawingContext.clip();

  // Dibujar gotas solo si mostrarGotas es true
  if (estado.mostrarGotas) {
    gotas.forEach((g, i) => {
      if (typeof g.actualizar === 'function') {
        g.actualizar(); // Actualizar posición (importante para Modo 0)
      }
      g.mostrar();
    });
  }

  drawingContext.restore();
  pop();

  // 4. Elementos UI
  // 5. Etiqueta de formato (solo pantalla, no en exportación)
  dibujarEtiquetaFormato();

  // 6. Etiqueta de color (solo pantalla, no en exportación)
  dibujarEtiquetaColor();

  // 7. Máscara cargada (si existe) - POR ENCIMA de todo excepto contador
  if (window.mascaraActual) {
    dibujarMascara();
  }

  // 8. Contador de usuarios - SIEMPRE ENCIMA de la máscara
  if (estado.mostrarContador) {
    dibujarContador();
  }

  // 9. Logo-lienzo (marca de agua) - SIEMPRE ENCIMA de todo
  dibujarLogoLienzo();

  // 10. Título y franja - SIEMPRE ENCIMA de todo
  if (estado.mostrarTexto) {
    dibujarTexto();
  }

  // Logo eliminado - se reemplazará con imagen mañana
}

// ==========================
// MODO 3D/WEBGL - MOCKUP
// ==========================
function dibujarModo3D() {
  // console.log("🧊 Dibujando modo 3D - formato:", estado.orientacion);

  // Fondo oscuro para modo 3D
  background(30, 30, 40);

  // DEBUG: Indicador visual de que estamos en modo 3D
  push();
  fill(estado.fondoA4 === 'blanco' ? 0 : 255); // Texto negro si fondo blanco, blanco si fondo negro
  textAlign(CENTER, CENTER);
  textSize(20);
  text("MODO 3D - " + estado.orientacion.toUpperCase(), 0, -height / 2 + 30);
  pop();

  // Iluminación mejorada
  ambientLight(80);
  directionalLight(255, 255, 255, 0.5, 0.5, -1);
  pointLight(255, 255, 255, 200, -200, 200);
  pointLight(150, 150, 255, -200, 200, 200);

  // Rotación automática desactivada
  // rotacionY += 0.005; // Eliminado

  push();

  // Rotación de cámara
  rotateX(rotacionX);
  rotateY(rotacionY);

  // Según el formato, dibujar el mockup correspondiente
  if (estado.orientacion === "vertical") {
    dibujarMockupLibro3D();
  } else if (estado.orientacion === "horizontal") {
    push();
    rotateY(-PI / 2); // Rotación adicional para que el lienzo se vea frontal (dirección contraria)
    dibujarMockupLienzo3D();
    pop();
  } else if (estado.orientacion === "cuadrado") {
    push();
    rotateY(-PI / 2); // Rotación adicional para que el cuadrado se vea frontal
    dibujarMockupCuadro3D();
    pop();
  }

  pop();

  // Controles con mouse
  if (mouseIsPressed) {
    rotacionX += (mouseY - pmouseY) * 0.01;
    rotacionY += (mouseX - pmouseX) * 0.01;
  }

  // Zoom con scroll del mouse (solo para formato lienzo)
  if (estado.orientacion === "horizontal") {
    if (mouseWheelDelta !== 0) {
      zoomLienzo += mouseWheelDelta * 0.001;
      zoomLienzo = constrain(zoomLienzo, 1.0, 1.3); // Limitar zoom entre 1.0x y 1.3x
      mouseWheelDelta = 0; // Resetear después de usar
    }
  }

  // DEBUG: Mostrar coordenadas del mouse
  push();
  fill(255);
  textAlign(LEFT, TOP);
  textSize(12);
  text("Mouse: " + mouseX + ", " + mouseY, -width / 2 + 10, -height / 2 + 10);
  text("Rotación: X=" + rotacionX.toFixed(2) + ", Y=" + rotacionY.toFixed(2), -width / 2 + 10, -height / 2 + 25);
  text("Textura: " + (texturaCanvas ? "SÍ" : "NO"), -width / 2 + 10, -height / 2 + 40);
  pop();
}

function dibujarMockupLibro3D() {
  // console.log("📖 Mockup libro 3D simplificado");

  // Dimensiones simples
  let libroAncho = 35;    // Grosor del libro
  let libroAlto = 400;    // Altura
  let libroGrosor = 280;  // Profundidad (ancho de la portada)

  // Escala
  let escala = min(width / (libroGrosor * 2), height / (libroAlto * 1.5));
  libroAncho *= escala;
  libroAlto *= escala;
  libroGrosor *= escala;

  push();

  // CUERPO Y LATERALES
  if (texturaCanvas) {
    // 1. CUERPO DEL LIBRO (base)
    push();
    fill(estado.fondoA4 === 'blanco' ? 250 : 50);
    box(libroAncho, libroAlto, libroGrosor);
    pop();

    // 2. LATERAL BLANCO (lado derecho) - volumen mínimo
    push();
    fill(255, 255, 255); // Blanco puro
    translate(0, 0, libroGrosor / 2); // Pegado al cuerpo principal
    box(libroAncho, libroAlto, 2); // Muy poco volumen (2 pixels)
    pop();

    // 3. LATERAL CORINTO (lado izquierdo) - volumen reducido
    push();
    fill(80, 20, 20); // Corinto/rojo apagado oscuro
    translate(0, 0, -libroGrosor / 2 - libroAncho / 4); // Más cerca del cuerpo
    box(libroAncho, libroAlto, libroAncho / 2); // Mitad de volumen
    pop();

    // 4. PORTADA FRONTAL CON TEXTURA (frente)
    push();
    translate(-libroAncho / 2 - 0.5, 0, 0);

    // Aplicar textura
    texture(texturaCanvas);
    textureMode(NORMAL);

    beginShape();
    // Portada frontal
    vertex(0, -libroAlto / 2, -libroGrosor / 2, 0, 0);
    vertex(0, -libroAlto / 2, libroGrosor / 2, 1, 0);
    vertex(0, libroAlto / 2, libroGrosor / 2, 1, 1);
    vertex(0, libroAlto / 2, -libroGrosor / 2, 0, 1);
    endShape(CLOSE);
    pop();

  } else {
    // Sin textura - cuerpo con laterales
    push();
    fill(estado.fondoA4 === 'blanco' ? 250 : 50);
    box(libroAncho, libroAlto, libroGrosor);
    pop();

    // Lateral blanco
    push();
    fill(255, 255, 255);
    translate(0, 0, libroGrosor / 2); // Pegado al cuerpo principal
    box(libroAncho, libroAlto, 2); // Muy poco volumen (2 pixels)
    pop();

    // Lateral corinto
    push();
    fill(80, 20, 20); // Corinto/rojo apagado oscuro
    translate(0, 0, -libroGrosor / 2 - libroAncho / 4);
    box(libroAncho, libroAlto, libroAncho / 2);
    pop();
  }

  pop();
}

function dibujarMockupLienzo3D() {
  // console.log("🖼️ Dibujando mockup lienzo 3D");

  push();

  // Aplicar zoom específico para lienzo
  scale(zoomLienzo);

  // Dimensiones del lienzo - tamaño masivo para presencia absoluta
  let lienzoAncho = 1800;
  let lienzoAlto = 1000; // Proporción A4 horizontal pero tamaño masivo
  let bastidorGrosor = 15;
  let bastidorProfundidad = 25;

  // Escala
  let escala = min(width / (lienzoAncho * 2.5), height / (lienzoAlto * 2.5));
  lienzoAncho *= escala;
  lienzoAlto *= escala;
  bastidorGrosor *= escala;
  bastidorProfundidad *= escala;

  push();

  // BASTIDOR TRASERO
  push();
  fill(80, 60, 40); // Color madera
  box(lienzoAncho + bastidorGrosor * 2, lienzoAlto + bastidorGrosor * 2, bastidorProfundidad);
  pop();

  // SUPERFICE DEL LIENZO (con textura)
  push();
  translate(0, 0, bastidorProfundidad / 2 + 2);

  if (texturaCanvas) {
    texture(texturaCanvas);
    beginShape();
    textureMode(NORMAL);
    vertex(-lienzoAncho / 2, -lienzoAlto / 2, 0, 0, 0);
    vertex(lienzoAncho / 2, -lienzoAlto / 2, 0, 1, 0);
    vertex(lienzoAncho / 2, lienzoAlto / 2, 0, 1, 1);
    vertex(-lienzoAncho / 2, lienzoAlto / 2, 0, 0, 1);
    endShape(CLOSE);
  } else {
    fill(estado.fondoA4 === 'blanco' ? 255 : 0);
    plane(lienzoAncho, lienzoAlto);
  }
  pop();

  // BORDES DEL BASTIDOR
  push();
  fill(60, 40, 20); // Color más oscuro para bordes

  // Borde superior
  push();
  translate(0, -lienzoAlto / 2 - bastidorGrosor / 2, 0);
  box(lienzoAncho, bastidorGrosor, bastidorProfundidad);
  pop();

  // Borde inferior
  push();
  translate(0, lienzoAlto / 2 + bastidorGrosor / 2, 0);
  box(lienzoAncho, bastidorGrosor, bastidorProfundidad);
  pop();

  // Borde izquierdo
  push();
  translate(-lienzoAncho / 2 - bastidorGrosor / 2, 0, 0);
  box(bastidorGrosor, lienzoAlto, bastidorProfundidad);
  pop();

  // Borde derecho
  push();
  translate(lienzoAncho / 2 + bastidorGrosor / 2, 0, 0);
  box(bastidorGrosor, lienzoAlto, bastidorProfundidad);
  pop();

  pop();

  pop();
}

function dibujarMockupCuadro3D() {
  // console.log("🖼️ Dibujando mockup cuadro 3D");

  // Dimensiones del cuadro
  let cuadroTamano = 350; // Cuadrado
  let marcoGrosor = 10; // Reducido a la mitad
  let marcoProfundidad = 15; // Reducido a la mitad

  // Escala
  let escala = min(width / (cuadroTamano * 2), height / (cuadroTamano * 2));
  cuadroTamano *= escala;
  marcoGrosor *= escala;
  marcoProfundidad *= escala;

  push();

  // MARCO
  push();
  fill(139, 69, 19); // Color madera caoba

  // Marco completo
  box(cuadroTamano + marcoGrosor * 2, cuadroTamano + marcoGrosor * 2, marcoProfundidad);

  // Centro hueco (donde va la imagen)
  push();
  fill(estado.fondoA4 === 'blanco' ? 255 : 0);
  translate(0, 0, marcoProfundidad / 2 + 2);

  if (texturaCanvas) {
    texture(texturaCanvas);
    beginShape();
    textureMode(NORMAL);
    vertex(-cuadroTamano / 2, -cuadroTamano / 2, 0, 0, 0);
    vertex(cuadroTamano / 2, -cuadroTamano / 2, 0, 1, 0);
    vertex(cuadroTamano / 2, cuadroTamano / 2, 0, 1, 1);
    vertex(-cuadroTamano / 2, cuadroTamano / 2, 0, 0, 1);
    endShape(CLOSE);
  } else {
    plane(cuadroTamano, cuadroTamano);
  }
  pop();

  pop();

  pop();
}

// ==========================
// FONDO ARTÍSTICO ESPECTACULAR
// ==========================
function inicializarFondoArtistico() {
  // console.log("DEBUG: inicializarFondoArtistico() iniciado");
  splatsFondo = [];
  particulasFondo = [];

  // Colores CMYK neón
  const coloresNeon = [
    color(0, 229, 255, 40),   // Cian
    color(224, 64, 251, 40),  // Magenta
    color(255, 255, 100, 40) // Amarillo
  ];

  // Crear splats de fondo con tamaños controlados
  for (let i = 0; i < 8; i++) {
    const splat = new SplatFondo(coloresNeon);
    // Splats grandes y espectaculares
    splat.size = random(80, 800); // Splats de 80-800px
    splat.alpha = random(3, 10); // MÁS TRANSPARENCIA para efecto sutil
    splatsFondo.push(splat);
  }
  // console.log("DEBUG: splats creados con tamaños controlados:", splatsFondo.length);

  // Crear partículas cinéticas con tamaños controlados - REDUCIDAS a 50
  for (let i = 0; i < 50; i++) { // REDUCIDO de 80 a 50 partículas
    const particula = new ParticulaFondo();
    // Forzar tamaños visibles
    particula.size = random(1, 4); // Partículas móviles de 1-4px
    particula.alpha = random(50, 110); // Alpha más visible - 0.4 en lugar de 0.3
    particulasFondo.push(particula);
  }
  // console.log("DEBUG: particulas creadas con tamaños controlados:", particulasFondo.length);
}

function dibujarFondoArtisticoDeepDark(dibujarSplats = true, dibujarParticulas = true) {
  // Fondo base negro profundo pero visible
  background(20, 20, 30);

  // Dibujar splatters decorativos a los lados del marco A4
  if (dibujarSplats && splatsFondo.length > 0) {
    try {
      // console.log("DEBUG: Dibujando", splatsFondo.length, "splats a los lados del marco");
      splatsFondo.forEach((s, index) => {
        // console.log(`DEBUG: Splat ${index}: x=${s.x}, y=${s.y}, size=${s.size}, alpha=${s.alpha}`);
        s.mostrar();
      });
    } catch (e) {
      console.error("Error en splats:", e);
    }
  }

  // Dibujar partículas cinéticas con control de tamaño
  if (dibujarParticulas && particulasFondo.length > 0) {
    try {
      // console.log("DEBUG: Dibujando", particulasFondo.length, "particulas");
      particulasFondo.forEach(p => {
        // Forzar tamaño máximo en tiempo real (más permisivo)
        if (p.size > 6) p.size = 6;
        if (p.alpha > 120) p.alpha = 120;
        p.actualizar();
        p.mostrar();
      });
    } catch (e) {
      console.error("Error en particulas:", e);
    }
  }
}

// ==========================
// LOGO-LIENZO (marca de agua en canvas)
// ==========================
function dibujarLogoLienzo() {
  // Dibujar logo-lienzo si está cargado (marca de agua en canvas)
  if (logoLienzo && logoLienzo.width > 0) {
    // Tamaño reducido como marca de agua
    let logoWidth = 60; // Tamaño pequeño como sello/marca de agua
    let logoHeight = (logoLienzo.height / logoLienzo.width) * logoWidth; // Mantener proporción

    // Posición: esquina inferior izquierda, completamente fuera de la franja del contador
    let logoX = marcoX + 20; // 20px desde el borde izquierdo del marco
    let logoY = marcoY + marcoH - logoHeight - 70; // 80px desde el borde inferior (completamente fuera de la franja)

    // Aplicar transparencia sutil como marca de agua
    push();
    tint(255, 100); // Transparencia del 40% (muy sutil)
    imageMode(CORNER);
    image(logoLienzo, logoX, logoY, logoWidth, logoHeight);
    pop();
  }
}

// ==========================
// MARCO A4 CON EFECTOS NEON
// ==========================
function dibujarMarcoA4() {
  // Calcular pulso neon basado en frameCount
  let pulso = sin(frameCount * 0.03) * 0.5 + 0.5; // Oscila entre 0 y 1

  strokeWeight(4);
  if (estado.fondoA4 === 'blanco') {
    fill(255);
    stroke(0);
  } else {
    fill(0);
    stroke(255);
  }

  // Marco con degradado neon y pulso
  push();
  if (estado.fondoA4 === 'blanco') {
    fill(255);
  } else {
    fill(0);
  }

  // Efecto de difuminado con pulso dinámico
  drawingContext.shadowColor = `rgba(0, 229, 255, ${0.4 + pulso * 0.4})`;
  drawingContext.shadowBlur = 15 + pulso * 10; // Pulso en el blur
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;

  // Crear degradado del logo para el marco con pulso
  const gradient = drawingContext.createLinearGradient(marcoX, marcoY, marcoX + marcoW, marcoY + marcoH);
  gradient.addColorStop(0, `rgba(0, 229, 255, ${0.6 + pulso * 0.4})`);    // Cyan con pulso
  gradient.addColorStop(0.5, `rgba(124, 77, 255, ${0.6 + pulso * 0.4})`);  // Púrpura con pulso
  gradient.addColorStop(1, `rgba(224, 64, 251, ${0.6 + pulso * 0.4})`);    // Magenta con pulso

  strokeWeight(5 + pulso * 2); // Grosor con pulso
  drawingContext.strokeStyle = gradient;
  rect(marcoX, marcoY, marcoW, marcoH);

  // Resetear sombra para no afectar otros elementos
  drawingContext.shadowColor = "transparent";
  drawingContext.shadowBlur = 0;
  pop();
}

// ==========================
// CLASES DE FONDO ESPECTACULAR
// ==========================
class SplatFondo {
  constructor(colores) {
    // Posicionar splats a los lados del marco A4 para que sean visibles
    const margenMarco = 50; // Margen del marco A4

    if (random() > 0.5) {
      // Posición horizontal - a los lados del marco
      this.x = random() > 0.5 ?
        random(marcoX - 400, marcoX - margenMarco) : // Izquierda del marco
        random(marcoX + marcoW + margenMarco, marcoX + marcoW + 400); // Derecha del marco
      this.y = random(marcoY - 200, marcoY + marcoH + 200); // Rango vertical del marco
    } else {
      // Posición vertical - arriba/abajo del marco
      this.x = random(marcoX - 200, marcoX + marcoW + 200); // Rango horizontal del marco
      this.y = random() > 0.5 ?
        random(marcoY - 400, marcoY - margenMarco) : // Arriba del marco
        random(marcoY + marcoH + margenMarco, marcoY + marcoH + 400); // Abajo del marco
    }

    this.size = random(80, 800); // Splats grandes hasta 800px

    // SOLO COLORES CYAN Y MAGENTA
    const coloresCyanMagenta = [
      color(0, 229, 255),    // Cyan brillante
      color(224, 64, 251),   // Magenta brillante  
      color(0, 255, 255),    // Cyan puro
      color(255, 0, 255),    // Magenta puro
      color(0, 200, 255),    // Cyan medio
      color(255, 0, 200)     // Magenta medio
    ];
    this.color = random(coloresCyanMagenta);
    this.degradadoColor = random(coloresCyanMagenta); // Color secundario CYAN/MAGENTA

    this.alpha = random(3, 10); // MÁS TRANSPARENCIA para efecto muy sutil
    this.seed = random(1000);
  }

  mostrar() {
    push();

    // Configurar sombra difuminada (box-shadow) con el mismo color del splat
    drawingContext.shadowColor = `rgba(${red(this.color)}, ${green(this.color)}, ${blue(this.color)}, 0.3)`;
    drawingContext.shadowBlur = 70; // MÁS GRANDE
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;

    // Crear efecto de MANCHA LIGERAMENTE FANTASMA
    for (let i = 9; i > 0; i--) { // UN PELÍN MENOS CAPAS
      let alphaActual = this.alpha * (i / 9) * 0.18; // Alpha ligeramente más visible
      let sizeActual = this.size * (1 + (9 - i) * 0.28); // Expansión ligeramente menor

      if (i % 2 === 0) {
        // SIN TRAZO para círculos pares - efecto ligero
        noStroke();
        fill(red(this.color), green(this.color), blue(this.color), alphaActual);
      } else {
        // SIN TRAZO para círculos impares - efecto ligero
        noStroke();
        fill(red(this.degradadoColor), green(this.degradadoColor), blue(this.degradadoColor), alphaActual);
      }

      // Movimiento DESACTIVADO - splats estáticos
      let xOffset = 0; // noise(this.seed + frameCount * 0.0005) * 28 - 14;
      let yOffset = 0; // noise(this.seed + 100 + frameCount * 0.0005) * 28 - 14;

      ellipse(this.x + xOffset, this.y + yOffset, sizeActual);
    }

    // Resetear sombra para no afectar otros elementos
    drawingContext.shadowColor = "transparent";
    drawingContext.shadowBlur = 0;

    pop();
  }
}

class ParticulaFondo {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.5, 0.5); // MÁS VELOCIDAD
    this.vy = random(-0.5, 0.5); // MÁS VELOCIDAD
    this.size = random(1, 4); // Partículas móviles de 1-4px
    this.alpha = random(40, 100); // Alpha visible

    // Colores CMYK aleatorios
    const coloresCMYK = [
      color(0, 229, 255),    // Cian
      color(224, 64, 251),   // Magenta  
      color(255, 255, 100),  // Amarillo
      color(0, 255, 255),    // Cyan puro
      color(255, 0, 255),    // Magenta puro
      color(255, 255, 0)     // Amarillo puro
    ];
    this.color = random(coloresCMYK);
  }

  actualizar() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.reset();
    }
  }

  mostrar() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);
    ellipse(0, 0, this.size);
    pop();
  }
}

// ==========================
// FUNCIONES DE DIBUJO
// ==========================
function dibujarTexto() {
  push();

  // Resetear cualquier sombra para texto limpio
  drawingContext.shadowColor = "transparent";
  drawingContext.shadowBlur = 0;
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;

  // SIN TRAZO - eliminar cualquier stroke del texto
  noStroke();

  // Detectar si es pantalla pequeña y estamos en modo 2D
  let esPantallaPequeña = windowWidth < 1920 && !modo3D;

  // Dibujar franja para título/subtítulo
  let franjaH = esPantallaPequeña ? 70 : 90; // Reducido en pantallas pequeñas
  let franjaY = marcoY; // Posicionada en la parte superior

  fill(100, 100, 100, 120); // Gris semitransparente como el contador
  rect(marcoX, franjaY, marcoW, franjaH);

  // Usar fuente por defecto del sistema sin especificar
  fill(estado.fondoA4 === 'blanco' ? 0 : 255); // Texto negro si fondo blanco, blanco si fondo negro
  textAlign(CENTER, TOP);

  // Tamaño de texto según pantalla y modo
  let tituloSize, subtituloSize;
  if (esPantallaPequeña) {
    // Pantallas pequeñas <1920px en modo 2D
    tituloSize = map(marcoW, 300, 800, 16, 22); // Más pequeño
    subtituloSize = map(marcoW, 300, 800, 10, 14); // Más pequeño
    tituloSize = constrain(tituloSize, 14, 22);
    subtituloSize = constrain(subtituloSize, 8, 14);
  } else {
    // Pantallas grandes o modo 3D (sin cambios)
    tituloSize = map(marcoW, 300, 800, 20, 28); // Base grande: 20-28px
    subtituloSize = map(marcoW, 300, 800, 12, 18); // Base grande: 12-18px
    tituloSize = constrain(tituloSize, 16, 28);
    subtituloSize = constrain(subtituloSize, 10, 18);
  }

  textSize(tituloSize);
  textStyle(BOLD); // Título en negrita

  const tituloFinal = window.tituloPersonalizado || titulo;
  const subtituloFinal = window.subtituloPersonalizado || subtitulo;

  // Ajustar posición según tamaño de franja
  let tituloY = esPantallaPequeña ? marcoY + 20 : marcoY + 25;
  let subtituloY = esPantallaPequeña ? marcoY + 45 : marcoY + 60;

  text(tituloFinal, marcoX + marcoW / 2, tituloY);

  textSize(subtituloSize);
  textStyle(NORMAL); // Subtítulo en peso normal
  text(subtituloFinal, marcoX + marcoW / 2, subtituloY);
  pop();
}

// ==========================
// ETIQUETA DE FORMATO (solo pantalla)
// ==========================
function dibujarEtiquetaFormato() {
  push();

  // Resetear sombras para texto limpio
  drawingContext.shadowColor = "transparent";
  drawingContext.shadowBlur = 0;

  noStroke();

  // Mapear estado a nombres personalizados
  let formatoTexto;
  if (estado.orientacion === "vertical") {
    formatoTexto = "LIBRO";
  } else if (estado.orientacion === "horizontal") {
    formatoTexto = "LIENZO";
  } else if (estado.orientacion === "cuadrado") {
    formatoTexto = "CUADRADO";
  } else {
    formatoTexto = "LIBRO"; // Por defecto
  }

  // Formato completo de la etiqueta
  let etiquetaCompleta = `FORMATO : ${formatoTexto}`;

  // Posición en la parte inferior izquierda del lienzo
  let etiquetaY = marcoY + marcoH - 15;
  let etiquetaX = marcoX + 20; // 20px desde el borde izquierdo

  // Estilo de la etiqueta
  fill(estado.fondoA4 === 'blanco' ? 100 : 200); // Gris sutil
  textAlign(LEFT, CENTER); // Alineación izquierda
  textSize(11);
  textStyle(NORMAL);

  // Dibujar etiqueta
  text(etiquetaCompleta, etiquetaX, etiquetaY);

  pop();
}

// ==========================
// ETIQUETA DE COLOR (solo pantalla)
// ==========================
function dibujarEtiquetaColor() {
  push();

  // Resetear sombras para texto limpio
  drawingContext.shadowColor = "transparent";
  drawingContext.shadowBlur = 0;

  noStroke();

  // Mapear modoColor a texto descriptivo
  let textoColor;
  switch (estado.modoColor) {
    case 'rgb':
      textoColor = 'RGB';
      break;
    case 'cmyk':
      textoColor = 'CMYK';
      break;
    case 'grises':
      textoColor = 'GRISES';
      break;
    case 'blancoNegro':
      textoColor = 'B/N';
      break;
    default:
      textoColor = 'RGB';
  }

  // Posición en el margen derecho inferior del lienzo
  let etiquetaY = marcoY + marcoH - 15;
  let etiquetaX = marcoX + marcoW - 20; // 20px desde el borde derecho (igual que formato)

  // Estilo de la etiqueta
  fill(estado.fondoA4 === 'blanco' ? 100 : 200); // Gris sutil
  textAlign(RIGHT, CENTER); // Justificación a la derecha
  textSize(11);
  textStyle(NORMAL);

  // Dibujar etiqueta
  text(`COLOR: ${textoColor}`, etiquetaX, etiquetaY);

  pop();
}

// ==========================
// FUNCIÓN DE MÁSCARA
// ==========================
function dibujarMascara() {
  if (!window.mascaraActual) return;

  // Forzar redibujo si es necesario (cuando cambia el tamaño o se carga nueva máscara)
  if (mascaraNecesitaRedibujo) {
    mascaraNecesitaRedibujo = false; // Resetear bandera
  }

  push();

  // Aplicar clipping al marco A4 con recorte superior para título/subtítulo
  drawingContext.save();
  drawingContext.beginPath();
  // Recorte superior: dejar espacio para título y subtítulo (100px desde arriba)
  drawingContext.rect(marcoX, marcoY, marcoW, marcoH);
  drawingContext.clip();

  // Dibujar la máscara ocupando TODO el lienzo
  // Aplicar modo de mezcla DESPUÉS de preparar el contexto

  // Calcular escala para mantener proporción sin recortar
  let escalaFinal;

  if (estado.orientacion === "vertical") {
    // Formato LIBRO (2480x3508) - ajustar al alto vertical manteniendo proporción
    escalaFinal = marcoH / mascaraAltoOriginal; // Ajustar al alto
    drawingContext.globalCompositeOperation = 'source-over'; // Dibujar por encima
  } else if (estado.orientacion === "horizontal") {
    // Formato LIENZO (3508x2480) - estirar con contexto directo como CUADRADO
    drawingContext.save();
    drawingContext.translate(marcoX, marcoY);
    drawingContext.scale(marcoW / mascaraAnchoOriginal, marcoH / mascaraAltoOriginal); // Escalas diferentes
    drawingContext.drawImage(window.mascaraActual.canvas, 0, 0);
    drawingContext.restore();

    // console.log("📐 LIENZO: Estiramiento directo con escalas diferentes");
    // console.log("🔍 Escala X:", (marcoW / mascaraAnchoOriginal).toFixed(2));
    // console.log("🔍 Escala Y:", (marcoH / mascaraAltoOriginal).toFixed(2));

    // No dibujar más, ya se dibujó con el contexto
    drawingContext.restore();
    pop();
    return; // Salir para no dibujar de nuevo
  } else if (estado.orientacion === "cuadrado") {
    // Formato CUADRADO (2480x2480) - estirar con contexto directo
    drawingContext.save();
    drawingContext.translate(marcoX, marcoY);
    drawingContext.scale(marcoW / mascaraAnchoOriginal, marcoH / mascaraAltoOriginal); // Escalas diferentes
    drawingContext.drawImage(window.mascaraActual.canvas, 0, 0);
    drawingContext.restore();

    // console.log("📐 CUADRADO: Estiramiento directo con escalas diferentes");
    // console.log("🔍 Escala X:", (marcoW / mascaraAnchoOriginal).toFixed(2));
    // console.log("🔍 Escala Y:", (marcoH / mascaraAltoOriginal).toFixed(2));

    // No dibujar más, ya se dibujó con el contexto
    drawingContext.restore();
    pop();
    return; // Salir para no dibujar de nuevo
  }

  if (estado.orientacion === "vertical") {
    // Formato LIBRO (2480x3508) - ajustar al alto vertical
    escalaFinal = marcoH / mascaraAltoOriginal; // Usar alto original guardado
    drawingContext.globalCompositeOperation = 'source-over'; // Dibujar por encima
  } else if (estado.orientacion === "horizontal") {
    // Formato LIENZO (3508x2480) - estirar como CUADRADO para ocupar todo el lienzo
    escalaFinal = max(marcoW / mascaraAnchoOriginal,
      marcoH / mascaraAltoOriginal); // Usar dimensiones originales guardadas
    drawingContext.globalCompositeOperation = 'source-over'; // Dibujar por encima
  } else if (estado.orientacion === "cuadrado") {
    // Formato CUADRADO (2480x2480) - sin márgenes, imagen completa
    escalaFinal = max(marcoW / mascaraAnchoOriginal,
      marcoH / mascaraAltoOriginal); // Usar dimensiones originales guardadas
    drawingContext.globalCompositeOperation = 'source-over'; // Dibujar por encima
  }

  // Forzar redibujo si es necesario
  if (mascaraNecesitaRedibujo) {
    // console.log("🔄 Forzando redibujo de máscara");
    mascaraNecesitaRedibujo = false; // Resetear bandera
  }

  // Posicionar para ocupar TODO el lienzo (sin padding, centrado)
  let posX = marcoX + (marcoW - mascaraAnchoOriginal * escalaFinal) / 2;
  let posY = marcoY + (marcoH - mascaraAltoOriginal * escalaFinal) / 2;

  // Dibujar la máscara ocupando TODO el lienzo
  image(window.mascaraActual, posX, posY,
    mascaraAnchoOriginal * escalaFinal,
    mascaraAltoOriginal * escalaFinal);

  // Restaurar clipping
  drawingContext.restore();
  pop();
}

function dibujarContador() {
  push();

  // Detectar si es pantalla pequeña y estamos en modo 2D
  let esPantallaPequeña = windowWidth < 1920 && !modo3D;

  let franjaH = esPantallaPequeña ? 20 : 26; // Reducido en pantallas pequeñas
  let franjaY = marcoY + marcoH - franjaH - 30;
  noStroke();
  fill(100, 100, 100, 120); // Gris semitransparente
  rect(marcoX, franjaY, marcoW, franjaH);
  fill(estado.fondoA4 === 'blanco' ? 0 : 255); // Texto negro si fondo blanco, blanco si fondo negro
  textAlign(CENTER, CENTER);

  // Tamaño de texto según pantalla y modo
  let contadorSize;
  if (esPantallaPequeña) {
    // Pantallas pequeñas <1920px en modo 2D
    contadorSize = map(marcoW, 300, 800, 10, 14); // Más pequeño
    contadorSize = constrain(contadorSize, 8, 14);
  } else {
    // Pantallas grandes o modo 3D (sin cambios)
    contadorSize = map(marcoW, 300, 800, 12, 16); // Base grande: 12-16px
    contadorSize = constrain(contadorSize, 10, 16);
  }

  textSize(contadorSize);
  text("Nº Interacción Usuarios: " + contadorRealUsuarios, marcoX + marcoW / 2, franjaY + franjaH / 2);
  pop();
}

// ==========================
// FUNCIONES DE COLOR
// ==========================
function generarColorSegunFiltro() {
  switch (estado.modoFiltro) {
    case 'cmyk':
      // CMYK - colores de impresión
      return color(random(255), random(255), random(255), ALPHA_COLOR);

    case 'rgb':
      // RGB - colores digitales brillantes
      return color(random(200, 255), random(200, 255), random(200, 255), ALPHA_COLOR);

    case 'hsb':
      // HSB - colores vivos usando modo HSB
      colorMode(HSB);
      let c = color(random(360), random(80, 100), random(80, 100), ALPHA_COLOR);
      colorMode(RGB);
      return c;

    case 'grises':
      // Grises - tonos medios de gris
      return color(random(100, 155), random(100, 155), random(100, 155), ALPHA_COLOR);

    case 'blancoNegro':
      // Blanco y Negro - solo extremos
      return random() > 0.5 ?
        color(255, 255, 255, ALPHA_COLOR) : // Blanco
        color(0, 0, 0, ALPHA_COLOR);      // Negro

    default:
      return color(random(255), random(255), random(255), ALPHA_COLOR);
  }
}

// ==========================
// FUNCIONES AUXILIARES
// ==========================
function recalcularMarco() {
  let ratio;
  if (estado.orientacion === "vertical") {
    ratio = 210 / 297; // A4 vertical
  } else if (estado.orientacion === "horizontal") {
    ratio = 297 / 210; // A4 horizontal
  } else if (estado.orientacion === "cuadrado") {
    ratio = 1; // Cuadrado/CD (1:1)
  } else {
    ratio = 210 / 297; // Por defecto vertical
  }

  // Responsive: usar dimensiones reales de pantalla para visualización
  if (width / height > ratio) {
    marcoH = height - 80; // Reducir altura vertical
    marcoW = marcoH * ratio;
  } else {
    marcoW = width - 40;
    marcoH = marcoW / ratio;
  }
  marcoX = (width - marcoW) / 2;
  marcoY = (height - marcoH) / 2;
}

function cargarInteracciones() {
  if (bloquearCargaDatos) return;

  bloquearCargaDatos = true;
  console.log("🔄 RESET COMPLETO - Cargando interacciones...");

  // 1. RESET COMPLETO del sistema
  console.log("🗑️ Limpiando sistema anterior...");

  // Resetear variables de estado
  gotas = [];
  idsExistentes.clear();
  sincronizacionInicialDatos = false;

  // Resetear visualización
  mostrarGotas = false; // Ocultar temporalmente durante el reset
  console.log("🌟 Gotas ocultas temporalmente - mostrarGotas:", mostrarGotas);

  // Forzar redibujo del lienzo (limpia gotas anteriores)
  clear();

  console.log("✅ Sistema reseteado - gotas eliminadas:", gotas.length);

  // 2. Activar visualización y cargar desde API
  mostrarGotas = true;
  console.log("✅ Gotas visibles - mostrarGotas =", mostrarGotas);

  // 3. Cargar datos frescos desde la API
  console.log("🌐 Llamando a cargarDatosDesdeAPI()");
  cargarDatosDesdeAPI();
}

function cargarDatos() {
  // Función legacy - ahora se usa cargarInteracciones()
  // console.log("⚠️ cargarDatos() es legacy, usar cargarInteracciones()");
}

function cargarDatosDesdeAPI() {
  console.log("🌐 Cargando datos desde API...");

  fetch(API_URL)
    .then(r => r.json())
    .then(datos => {
      console.log("🌐 Datos recibidos de API:", datos.length, "interacciones");

      // Cargar TODAS las interacciones de la base de datos
      console.log(`🌐 Cargando ${datos.length} interacciones totales`);

      // Limpiar gotas existentes
      gotas = [];

      // Crear gotas para TODAS las interacciones
      datos.forEach((d, i) => {
        let gota;
        if (estado.modo === "modo0") gota = new GotaPinturaModo0();
        else if (estado.modo === "modo1") gota = new GotaPinturaModo1();
        else if (estado.modo === "modo2") gota = new GotaPinturaModo2();
        else if (estado.modo === "modo3") gota = new GotaPinturaModo3();
        else if (estado.modo === "modo4") gota = new GotaPinturaModo4();
        else if (estado.modo === "modo5") gota = new GotaPinturaModo5();
        else if (estado.modo === "modo6") gota = new GotaPinturaModo6();
        else if (estado.modo === "modo7") gota = new GotaPinturaModo7();
        else if (estado.modo === "modo8") gota = new GotaPinturaModo8();
        else if (estado.modo === "modo9") gota = new GotaPinturaModo9();
        else gota = new GotaPinturaModo1(); // Por defecto

        gota.inicializar(); // Inicializar completamente con funciones de p5.js disponibles
        gotas.push(gota);

        // Registrar timestamp para seguimiento
        idsExistentes.add(d.timestamp);
      });

      // Actualizar contador real de usuarios
      contadorRealUsuarios = datos.length;

      // Marcar como sincronizado
      sincronizacionInicialDatos = true;

      console.log(`✅ Se cargaron ${datos.length} interacciones totales`);
      bloquearCargaDatos = false;

      // Activar actualización automática
      configurarActualizacionAutomatica();
    })
    .catch(error => {
      console.error("❌ Error cargando datos desde API:", error);
      console.log("🔄 Reintentando cargar datos...");

      // Desbloquear para permitir reintentos
      bloquearCargaDatos = false;

      // Mostrar mensaje al usuario (opcional)
      // alert("Error al cargar datos. Por favor, intenta nuevamente.");
    });
}

// ==========================
// SISTEMA DE ACTUALIZACIÓN AUTOMÁTICA
// ==========================

function configurarActualizacionAutomatica() {
  console.log("🔄 Configurando actualización automática cada", INTERVALO_ACTUALIZACION / 1000, "segundos");

  // Limpiar intervalo anterior si existe
  if (intervaloActualizacion) {
    clearInterval(intervaloActualizacion);
  }

  // Configurar nuevo intervalo
  intervaloActualizacion = setInterval(() => {
    actualizarDatos();
  }, INTERVALO_ACTUALIZACION);

  console.log("✅ Actualización automática configurada");
}

function actualizarDatos() {
  // Evitar actualizaciones si está bloqueado
  if (bloquearCargaDatos) {
    console.log("🔄 Actualización omitida - sistema bloqueado");
    return;
  }

  console.log("🔄 Verificando nuevos datos en el sheet...");

  fetch(API_URL)
    .then(r => r.json())
    .then(datos => {
      console.log("🔄 Datos recibidos:", datos.length, "interacciones totales");

      // Verificar si hay nuevos datos
      if (datos.length > contadorRealUsuarios) {
        console.log("🆕 NUEVOS DATOS DETECTADOS:", datos.length - contadorRealUsuarios, "nuevas interacciones");

        // Guardar el valor anterior antes de actualizar
        let contadorAnterior = contadorRealUsuarios;

        // Actualizar contador
        contadorRealUsuarios = datos.length;

        // Si estamos en Modo 0, añadir solo las nuevas partículas
        if (estado.modo === "modo0" && gotas.length > 0) {
          console.log("🔄 Añadiendo", contadorRealUsuarios - contadorAnterior, "nuevas partículas al Modo 0");

          // Obtener la gota existente
          let gotaModo0 = gotas[0];

          // Añadir nuevas partículas a la gota existente
          for (let i = contadorAnterior; i < contadorRealUsuarios; i++) {
            gotaModo0.particles.push({
              pos: createVector(gotaModo0.x, gotaModo0.y),
              dir: random(TWO_PI),
              velocidad: random(0.2, 1.5),
              detenida: false, // Control individual de detención
              numero: i + 1 // Número secuencial
            });
          }

          // Actualizar el TOTAL de partículas
          gotaModo0.TOTAL = contadorRealUsuarios;

          console.log("✅ Modo 0 actualizado - Total partículas:", gotaModo0.TOTAL);
        }
        // Si estamos en otro modo y hay gotas, añadir las nuevas
        else if (gotas.length > 0) {
          console.log("🔄 Añadiendo", datos.length - gotas.length, "nuevas gotas al modo", estado.modo);
          añadirNuevasGotas(datos.length - gotas.length);
        }

        // Actualizar contador en la interfaz
        if (estado.mostrarContador) {
          // El contador se actualizará automáticamente en el próximo draw
        }

        console.log("✅ Datos actualizados - Total:", contadorRealUsuarios);
      } else {
        console.log("🔄 Sin cambios - Total:", contadorRealUsuarios);
      }
    })
    .catch(error => {
      console.error("❌ Error en actualización automática:", error);
    });
}

function añadirNuevasGotas(cantidad) {
  for (let i = 0; i < cantidad; i++) {
    let gota;
    if (estado.modo === "modo1") gota = new GotaPinturaModo1();
    else if (estado.modo === "modo2") gota = new GotaPinturaModo2();
    else if (estado.modo === "modo3") gota = new GotaPinturaModo3();
    else if (estado.modo === "modo4") gota = new GotaPinturaModo4();
    else if (estado.modo === "modo5") gota = new GotaPinturaModo5();
    else if (estado.modo === "modo6") gota = new GotaPinturaModo6();
    else if (estado.modo === "modo7") gota = new GotaPinturaModo7();
    else if (estado.modo === "modo8") gota = new GotaPinturaModo8();
    else if (estado.modo === "modo9") gota = new GotaPinturaModo9();
    else gota = new GotaPinturaModo1();

    gota.inicializar();
    gotas.push(gota);
  }

  console.log("✅ Se añadieron", cantidad, "nuevas gotas - Total:", gotas.length);
}

// ==========================
// FUNCIONES DE BOTONES
// ==========================
function reiniciarColorAModoRGB() {
  estado.modoColor = 'rgb';
}

function activarModo1() {
  reiniciarColorAModoRGB();
  estado.modo = "modo1";
  console.log("🌟 Modo 1 activado");

  if (gotas.length > 0) {
    console.log("🌟 Transformando", gotas.length, "gotas existentes a Modo 1");
    // Transformar todas las gotas existentes al nuevo modo
    gotas.forEach((gota, i) => {
      gotas[i] = new GotaPinturaModo1();
      gotas[i].inicializar();
    });
    console.log("🌟 Todas las gotas transformadas a Modo 1");
  } else {
    console.log("🌟 No hay gotas cargadas. Primero pulsa 'Cargar interacciones'");
  }
}

function activarModo2() {
  reiniciarColorAModoRGB();
  estado.modo = "modo2";
  console.log("🌟 Modo 2 activado");

  if (gotas.length > 0) {
    console.log("🌟 Transformando", gotas.length, "gotas existentes a Modo 2");
    // Transformar todas las gotas existentes al nuevo modo
    gotas.forEach((gota, i) => {
      gotas[i] = new GotaPinturaModo2();
      gotas[i].inicializar();
    });
    console.log("🌟 Todas las gotas transformadas a Modo 2");
  } else {
    console.log("🌟 No hay gotas cargadas. Primero pulsa 'Cargar interacciones'");
  }
}

function activarModo3() {
  reiniciarColorAModoRGB();
  estado.modo = "modo3";
  console.log("🌟 Modo 3 activado");

  if (gotas.length > 0) {
    console.log("🌟 Transformando", gotas.length, "gotas existentes a Modo 3");
    // Transformar todas las gotas existentes al nuevo modo
    gotas.forEach((gota, i) => {
      gotas[i] = new GotaPinturaModo3();
      gotas[i].inicializar();
    });
    console.log("🌟 Todas las gotas transformadas a Modo 3");
  } else {
    console.log("🌟 No hay gotas cargadas. Primero pulsa 'Cargar interacciones'");
  }
}

function abrirModalPasswordModo0() {
  if (estado.modo === "modo0") {
    activarModo0();
    return;
  }

  const modal = document.getElementById('modal-password-modo0');
  const input = document.getElementById('input-password-modo0');
  const error = document.getElementById('error-password-modo0');

  if (error) error.textContent = '';
  if (input) input.value = '';
  if (modal) modal.style.display = 'block';
  setTimeout(() => input?.focus(), 50);
}

function cerrarModalPasswordModo0(event) {
  if (event && event.target.id !== 'modal-password-modo0') return;

  const modal = document.getElementById('modal-password-modo0');
  const input = document.getElementById('input-password-modo0');
  const error = document.getElementById('error-password-modo0');

  if (modal) modal.style.display = 'none';
  if (input) input.value = '';
  if (error) error.textContent = '';
}

function enviarPasswordModo0(event) {
  if (event.key === 'Enter') {
    validarPasswordModo0();
  }
}

function validarPasswordModo0() {
  const input = document.getElementById('input-password-modo0');
  const error = document.getElementById('error-password-modo0');
  const password = input ? input.value.trim() : '';

  if (password !== PASSWORD_MODO0) {
    if (error) error.textContent = 'Password incorrecto.';
    if (input) {
      input.value = '';
      input.focus();
    }
    return;
  }

  cerrarModalPasswordModo0();
  activarModo0();
}

function deshabilitarBotonesModo0() {
  const botonesFunciones = [
    'btn-formato',
    'btn-texto',
    'btn-editar-texto',
    'btn-cargar-mascara'
  ];

  botonesFunciones.forEach(id => {
    const boton = document.getElementById(id);
    if (!boton) return;

    boton.disabled = true;
    boton.style.opacity = '0.3';
    boton.style.cursor = 'not-allowed';
  });

  const botonesModos = document.querySelectorAll('#botones-derecha button');
  botonesModos.forEach(boton => {
    boton.disabled = true;
    boton.style.opacity = '0.3';
    boton.style.cursor = 'not-allowed';
  });
}

function activarModo0() {
  reiniciarColorAModoRGB();
  console.log("🌟🌟🌟 BOTÓN MODO 0 PRESIONADO 🌟🌟🌟");
  console.log("🌟 Estado antes de cambiar:", estado.modo, estado.mostrarTexto, estado.mostrarContador);

  if (estado.modo === "modo0") {
    // Si ya está en modo0, restaurar estado original y reiniciar
    console.log("🌟 Modo 0 desactivado - Restaurando estado original");

    // Restaurar título y contador
    estado.mostrarTexto = true;
    estado.mostrarContador = true;
    console.log("🌟 Título y contador restaurados");

    // Reiniciar completamente el sistema como F5
    window.location.reload(); // Recargar página como F5
    return;
  }

  // Activar modo0 especial: configurar fondo negro, quitar título y contador
  console.log("🌟 Modo 0 activado - Configurando fondo negro, quitando título y contador");

  // Cambiar a modo0
  estado.modo = "modo0";

  // Cambiar formato a lienzo (horizontal)
  estado.orientacion = "horizontal";
  recalcularMarco();
  posicionarPanelesBotones(); // Reposicionar paneles al cambiar formato

  // Cambiar fondo a negro
  estado.fondoA4 = 'negro';

  // Ocultar título y contador
  estado.mostrarTexto = false;
  estado.mostrarContador = false;

  // Bloquear controles que no deben usarse durante el Modo 0
  deshabilitarBotonesModo0();

  // Cargar datos del sheet para Modo 0
  let btnCargar = document.getElementById('btn-cargar-datos');

  fetch(API_URL)
    .then(r => r.json())
    .then(datos => {
      contadorRealUsuarios = datos.length;

      // Refrescar lienzo para crear gotas de Modo 0
      refrescarLienzo();

      // Activar actualización automática para Modo 0
      configurarActualizacionAutomatica();

      // Rehabilitar botón de cargar interacciones
      if (btnCargar) {
        btnCargar.disabled = false;
      }
    })
    .catch(error => {
      // En caso de error, usar datos de prueba
      contadorRealUsuarios = 64;
      refrescarLienzo();
      configurarActualizacionAutomatica();

      if (btnCargar) {
        btnCargar.disabled = false;
      }
    });
}

function cargarDatosParaModo0() {
  // Deshabilitar botón de cargar interacciones durante el proceso
  let btnCargar = document.getElementById('btn-cargar-datos');
  if (btnCargar) {
    btnCargar.disabled = true;
  }

  // Mostrar indicador de carga
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      contadorRealUsuarios = data.length;

      // Cambiar a modo0
      estado.modo = "modo0";

      // Refrescar lienzo para crear gotas de Modo 0
      refrescarLienzo();

      // Activar actualización automática para Modo 0
      configurarActualizacionAutomatica();

      // Rehabilitar botón de cargar interacciones
      if (btnCargar) {
        btnCargar.disabled = false;
      }
    })
    .catch(error => {
      // En caso de error, usar datos de prueba
      contadorRealUsuarios = 25; // Número de prueba

      // Cambiar a modo0
      estado.modo = "modo0";

      // Refrescar lienzo para crear gotas de Modo 0
      refrescarLienzo();

      // Rehabilitar botón de cargar interacciones
      if (btnCargar) {
        btnCargar.disabled = false;
      }
    });
}

function activarModo4() {
  reiniciarColorAModoRGB();
  estado.modo = "modo4";

  if (gotas.length > 0) {
    // Transformar todas las gotas existentes al nuevo modo
    gotas.forEach((gota, i) => {
      gotas[i] = new GotaPinturaModo4();
      gotas[i].inicializar();
    });
  } else {
    console.log("🌟 No hay gotas cargadas. Primero pulsa 'Cargar interacciones'");
  }
}

function activarModo5() {
  reiniciarColorAModoRGB();
  estado.modo = "modo5";

  if (gotas.length > 0) {
    // Transformar todas las gotas existentes al nuevo modo
    gotas.forEach((gota, i) => {
      gotas[i] = new GotaPinturaModo5();
      gotas[i].inicializar();
    });
  } else {
    console.log("🌟 No hay gotas cargadas. Primero pulsa 'Cargar interacciones'");
  }
}

function activarModo6() {
  reiniciarColorAModoRGB();
  estado.modo = "modo6";

  if (gotas.length > 0) {
    // Transformar todas las gotas existentes al nuevo modo
    gotas.forEach((gota, i) => {
      gotas[i] = new GotaPinturaModo6();
      gotas[i].inicializar();
    });
  } else {
    console.log("🌟 No hay gotas cargadas. Primero pulsa 'Cargar interacciones'");
  }
}

function activarModo7() {
  reiniciarColorAModoRGB();
  estado.modo = "modo7";

  if (gotas.length > 0) {
    // Transformar todas las gotas existentes al nuevo modo
    gotas.forEach((gota, i) => {
      gotas[i] = new GotaPinturaModo7();
      gotas[i].inicializar();
    });
  } else {
    console.log("🌟 No hay gotas cargadas. Primero pulsa 'Cargar interacciones'");
  }
}

function activarModo8() {
  reiniciarColorAModoRGB();
  estado.modo = "modo8";

  if (gotas.length > 0) {
    // Transformar todas las gotas existentes al nuevo modo
    gotas.forEach((gota, i) => {
      gotas[i] = new GotaPinturaModo8();
      gotas[i].inicializar();
    });
  } else {
    console.log("🌟 No hay gotas cargadas. Primero pulsa 'Cargar interacciones'");
  }
}

function activarModo9() {
  reiniciarColorAModoRGB();
  estado.modo = "modo9";

  if (gotas.length > 0) {
    // Transformar todas las gotas existentes al nuevo modo
    gotas.forEach((gota, i) => {
      gotas[i] = new GotaPinturaModo9();
      gotas[i].inicializar();
    });
  } else {
    console.log("🌟 No hay gotas cargadas. Primero pulsa 'Cargar interacciones'");
  }
}

function refrescarLienzo() {
  console.log("🌟 refrescarLienzo() llamada - estado.modo:", estado.modo);

  gotas = [];
  idsExistentes.clear();

  console.log("🌟 Creando gota para modo:", estado.modo);

  if (estado.modo === "modo0") {
    console.log("🌟 Creando GotaPinturaModo0");
    gotas.push(new GotaPinturaModo0());
  } else if (estado.modo === "modo1") {
    gotas.push(new GotaPinturaModo1());
  } else if (estado.modo === "modo2") {
    gotas.push(new GotaPinturaModo2());
  } else if (estado.modo === "modo3") {
    gotas.push(new GotaPinturaModo3());
  } else if (estado.modo === "modo4") {
    gotas.push(new GotaPinturaModo4());
  } else if (estado.modo === "modo5") {
    gotas.push(new GotaPinturaModo5());
  } else if (estado.modo === "modo6") {
    gotas.push(new GotaPinturaModo6());
  } else if (estado.modo === "modo7") {
    gotas.push(new GotaPinturaModo7());
  } else if (estado.modo === "modo8") {
    gotas.push(new GotaPinturaModo8());
  } else if (estado.modo === "modo9") {
    gotas.push(new GotaPinturaModo9());
  }

  console.log("🌟 Total de gotas creadas:", gotas.length);

  if (gotas.length > 0) {
    console.log("🌟 Primera gota - inicializado:", gotas[0].inicializado, "clase:", gotas[0].constructor.name);
  }

  console.log("🌟 Lienzo refrescado - Gotas regeneradas aleatoriamente en modo:", estado.modo);
}

function alternarFiltroColor() {
  // Ciclar entre los 4 modos: rgb → cmyk → grises → blancoNegro → rgb
  if (estado.modoColor === 'rgb') {
    estado.modoColor = 'cmyk';
  } else if (estado.modoColor === 'cmyk') {
    estado.modoColor = 'grises';
  } else if (estado.modoColor === 'grises') {
    estado.modoColor = 'blancoNegro';
  } else {
    estado.modoColor = 'rgb';
  }

  // console.log("Modo color:", estado.modoColor);

  // Aplicar filtro a las gotas existentes
  aplicarFiltroAGotasExistentes();

  // Actualizar texto del botón
  const boton = document.getElementById('btn-filtro-color');
  const textoBoton = boton.querySelector('.icono-completo-color');

  const textos = {
    'rgb': '🎨 Color: RGB',
    'cmyk': '🎨 Color: CMYK',
    'grises': '🎨 Color: Grises',
    'blancoNegro': '🎨 Color: B/N'
  };

  textoBoton.textContent = textos[estado.modoColor];
}

function aplicarFiltroAGotasExistentes() {
  gotas.forEach(gota => {
    switch (estado.modoColor) {
      case 'rgb':
        // Modo RGB - usando valores CMYK normalizados con menos brillo
        const coloresCMYK = [
          color(0, 150, 180, ALPHA_COLOR),     // Cian suave
          color(180, 40, 150, ALPHA_COLOR),     // Magenta suave  
          color(200, 200, 60, ALPHA_COLOR),    // Amarillo suave
          color(0, 180, 180, ALPHA_COLOR),      // Cian medio
          color(180, 0, 180, ALPHA_COLOR),      // Magenta medio
          color(200, 200, 0, ALPHA_COLOR)       // Amarillo medio
        ];
        gota.color = random(coloresCMYK);
        break;
      case 'grises':
        // Modo Grises - tonos de gris medio
        const gris = random(100, 155);
        gota.color = color(gris, gris, gris, ALPHA_COLOR);
        break;
      case 'blancoNegro':
        // Modo Blanco y Negro - solo extremos puros con alpha máximo
        gota.color = random() > 0.5 ?
          color(255, 255, 255, 255) : // Blanco puro con alpha 255
          color(0, 0, 0, 255);      // Negro puro con alpha 255
        break;
      case 'cmyk':
        // Modo CMYK - usando valores RGB aleatorios digitales
        gota.color = color(random(255), random(255), random(255), ALPHA_COLOR);
        break;
    }
  });
  // console.log(`Filtro ${estado.modoColor} aplicado a ${gotas.length} gotas existentes`);
}
function alternarFondo() {
  if (estado.fondoA4 === "blanco") estado.fondoA4 = "negro";
  else if (estado.fondoA4 === "negro") estado.fondoA4 = "imagen";
  else estado.fondoA4 = "blanco";
  // console.log("Fondo:", estado.fondoA4);
}
function alternarTexto() {
  estado.mostrarTexto = !estado.mostrarTexto;

  // NO controlar el logo HTML - mantenerlo siempre visible
  // El logo HTML debe permanecer visible independientemente del estado del texto

  // console.log("Texto:", estado.mostrarTexto);
}

function alternarContador() {
  estado.mostrarContador = !estado.mostrarContador;
  // console.log("Contador:", estado.mostrarContador);
}

// ==========================
// FUNCIONES DEL MODAL DE TEXTO
// ==========================
function cerrarModalTexto() {
  const modal = document.getElementById('modal-texto');
  if (modal) {
    modal.style.display = 'none';
  }
}

function guardarTexto() {
  const inputTitulo = document.getElementById('input-titulo');
  const inputSubtitulo = document.getElementById('input-subtitulo');

  if (inputTitulo && inputSubtitulo) {
    window.tituloPersonalizado = inputTitulo.value;
    window.subtituloPersonalizado = inputSubtitulo.value;

    // Actualizar las variables globales
    titulo = inputTitulo.value;
    subtítulo = inputSubtitulo.value;

    // Cerrar el modal
    cerrarModalTexto();

    // console.log('Texto guardado:', titulo, subtítulo);
  }
}

function abrirSelectorMascara() {
  // Abrir el selector de archivos de máscara
  document.getElementById('input-mascara').click();
  // console.log("Selector de máscara abierto");
}

// ==========================
// FUNCIÓN DE CARGA DE MÁSCARA CON VALIDACIÓN PARA TODOS LOS FORMATOS
// ==========================
function cargarMascaraArchivo(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  // Verificar que sea una imagen PNG
  if (!archivo.type.match('image/png')) {
    alert('❌ Formato incorrecto\n\nPor favor, selecciona un archivo PNG para la máscara.\n\nLos formatos aceptados son: PNG');
    return;
  }

  // Guardar dimensiones originales de la imagen
  const lector = new FileReader();
  lector.onload = function (e) {
    // Crear imagen temporal para verificar dimensiones
    const imgTemporal = new Image();
    imgTemporal.onload = function () {
      const ancho = imgTemporal.width;
      const alto = imgTemporal.height;

      // Verificar dimensiones recomendadas según el formato actual
      let dimensionesRecomendadas = '';
      let esDimensionCorrecta = false;

      if (estado.orientacion === "vertical") {
        // LIBRO: 2480x3508px (proporción 210:297)
        const proporcionIdeal = 210 / 297;
        const proporcionActual = ancho / alto;
        const diferenciaProporcion = Math.abs(proporcionActual - proporcionIdeal) / proporcionIdeal * 100;

        dimensionesRecomendadas = 'LIBRO (vertical): 2480 × 3508px\nProporción recomendada: 210:297 (A4 vertical)';

        if (diferenciaProporcion < 5) {
          esDimensionCorrecta = true;
        }
      } else if (estado.orientacion === "horizontal") {
        // LIENZO: 3508x2480px (proporción 297:210)
        const proporcionIdeal = 297 / 210;
        const proporcionActual = ancho / alto;
        const diferenciaProporcion = Math.abs(proporcionActual - proporcionIdeal) / proporcionIdeal * 100;

        dimensionesRecomendadas = 'LIENZO (horizontal): 3508 × 2480px\nProporción recomendada: 297:210 (A4 horizontal)';

        if (diferenciaProporcion < 5) {
          esDimensionCorrecta = true;
        }
      } else if (estado.orientacion === "cuadrado") {
        // CUADRADO: 2480x2480px (proporción 1:1)
        const proporcionIdeal = 1;
        const proporcionActual = ancho / alto;
        const diferenciaProporcion = Math.abs(proporcionActual - proporcionIdeal) * 100;

        dimensionesRecomendadas = 'CUADRADO: 2480 × 2480px\nProporción recomendada: 1:1 (cuadrado perfecto)';

        if (diferenciaProporcion < 5) {
          esDimensionCorrecta = true;
        }
      }

      // Si las dimensiones son correctas, cargar directamente
      if (esDimensionCorrecta) {
        cargarMascaraConDimensiones(e.target.result, ancho, alto);
      } else {
        // Dimensiones incorrectas - mostrar advertencia
        const mensajeAdvertencia = `⚠️ Dimensiones no recomendadas\n\n` +
          `Tu imagen: ${ancho} × ${alto}px\n` +
          `Formato actual: ${dimensionesRecomendadas}\n\n` +
          `Aunque la imagen se redimensionará automáticamente, podría:\n` +
          `• Perder proporción o calidad\n` +
          `• No verse como esperas\n` +
          `• Distorsionarse al ajustarse\n\n` +
          `¿Deseas continuar de todos modos?`;

        if (confirm(mensajeAdvertencia)) {
          cargarMascaraConDimensiones(e.target.result, ancho, alto);
        }
      }
    };

    imgTemporal.onerror = function () {
      alert('❌ Error al leer la imagen\n\nNo se pudo procesar el archivo de imagen. Por favor, verifica que el archivo no esté corrupto e inténtalo de nuevo.');
    };

    imgTemporal.src = e.target.result;
  };
  lector.readAsDataURL(archivo);
}

function cargarMascaraConDimensiones(dataUrl, ancho, alto) {
  // Crear imagen p5 desde el data URL
  window.mascaraActual = loadImage(dataUrl,
    img => {
      // Guardar dimensiones originales
      mascaraAnchoOriginal = img.width;
      mascaraAltoOriginal = img.height;

      console.log("Máscara cargada correctamente:", img.width, "x", img.height);
      console.log("Dimensiones originales guardadas para redimensionado automático");

      // Cargar fuente para modo WebGL - usar fuente del sistema
      textFont('monospace'); // Fuente del sistema, disponible inmediatamente

      // Mostrar mensaje de éxito
      alert(`✅ Máscara cargada exitosamente\n\n` +
        `Dimensiones: ${img.width} × ${img.height}px\n` +
        `La máscara se ha aplicado al lienzo y se redimensionará automáticamente según el formato seleccionado.`);
    },
    error => {
      console.error("Error cargando máscara:", error);
      alert("❌ Error al cargar la máscara\n\nOcurrió un error al procesar la imagen. Por favor, inténtalo de nuevo con un archivo diferente.");
    }
  );
}

function editarTextoUsuario() {
  // Abrir el modal de edición de texto
  const modal = document.getElementById('modal-texto');
  const inputTitulo = document.getElementById('input-titulo');
  const inputSubtitulo = document.getElementById('input-subtitulo');

  if (modal && inputTitulo && inputSubtitulo) {
    // Cargar los valores actuales en los inputs
    inputTitulo.value = window.tituloPersonalizado || titulo || '';
    inputSubtitulo.value = window.subtituloPersonalizado || subtitulo || '';

    // Mostrar el modal
    modal.style.display = 'block';

    // console.log("🔤 Modal de edición abierto");
  }
}
function rotarLienzo() {
  // Ciclar entre vertical → horizontal → cuadrado → vertical
  if (estado.orientacion === "vertical") {
    estado.orientacion = "horizontal";
  } else if (estado.orientacion === "horizontal") {
    estado.orientacion = "cuadrado";
  } else {
    estado.orientacion = "vertical";
  }
  recalcularMarco();
  posicionarPanelesBotones(); // Reposicionar paneles al cambiar formato
  // console.log("Orientación:", estado.orientacion);
}
function activarVista3D() {
  // console.log("🧊 Activando vista 3D/Mockup...");

  try {
    // Capturar el canvas actual como textura
    capturarCanvasComoTextura();

    // Cambiar a modo WebGL
    modo3D = true;

    // Eliminar canvas actual y recrear con WebGL
    let container = document.getElementById('a4-container');
    if (container) {
      container.innerHTML = ''; // Limpiar contenedor
    }

    // Crear nuevo canvas WebGL
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent('a4-container');

    // Cargar fuente para modo WebGL - Arial del sistema
    textFont('Arial'); // Fuente del sistema, disponible inmediatamente

    // Forzar redimensionamiento
    resizeCanvas(windowWidth, windowHeight);

    // ESTABLECER ROTACIÓN FRONTAL (libro de frente)
    rotacionX = 0;  // Sin inclinación vertical
    rotacionY = PI / 2;  // 90 grados para mostrar la portada de frente

    // OCULTAR botón 3D y MOSTRAR botón 2D
    let btn3D = document.getElementById('btn-vista-3d');
    let btn2D = document.getElementById('btn-vista-2d');
    if (btn3D) btn3D.style.display = 'none';
    if (btn2D) btn2D.style.display = 'block';

    // CAMBIAR BOTONES A MODO 3D (PDF y PNG)
    let btnPDF = document.getElementById('btn-editar-texto');
    let btnPNG = document.getElementById('btn-color'); // Corregido ID
    // console.log("🔍 Botones encontrados:", btnPDF, btnPNG);

    if (btnPDF) {
      btnPDF.innerHTML = '<span class="icono-completo-editar">🖨️ .PDF</span>';
      btnPDF.setAttribute('onclick', 'exportarA4PDF()');
      btnPDF.disabled = false;
      btnPDF.style.opacity = '1';
      btnPDF.style.cursor = 'pointer';
      btnPDF.style.display = 'block';
      // console.log("✅ Botón PDF configurado");
    }
    if (btnPNG) {
      btnPNG.innerHTML = '<span class="icono-completo-color">💾 .PNG</span>';
      btnPNG.setAttribute('onclick', 'exportarA4()');
      btnPNG.disabled = false;
      btnPNG.style.opacity = '1';
      btnPNG.style.cursor = 'pointer';
      btnPNG.style.display = 'block';
      // console.log("✅ Botón PNG configurado");
    }

    // DESHABILITAR botones de modos (panel derecho) en modo 3D
    let botonesModos = document.querySelectorAll('#botones-derecha button');
    botonesModos.forEach(boton => {
      boton.disabled = true;
      boton.style.opacity = '0.3';
      boton.style.cursor = 'not-allowed';
    });

    // DESHABILITAR botones del panel izquierdo EXCEPTO los permitidos
    let botonesIzquierda = document.querySelectorAll('#botones-izquierda button');
    botonesIzquierda.forEach(boton => {
      let botonId = boton.id;
      // Mantener habilitados: vista 2D, editar texto (PDF), color (PNG)
      if (botonId !== 'btn-vista-2d' && botonId !== 'btn-editar-texto' && botonId !== 'btn-color') {
        boton.disabled = true;
        boton.style.opacity = '0.3';
        boton.style.cursor = 'not-allowed';
      }
    });

    // console.log("✅ Modo 3D/WebGL activado");
    // console.log("📐 Formato actual:", estado.orientacion);
    // console.log("🎨 Canvas WebGL creado:", windowWidth, "x", windowHeight);
    // console.log("📖 Libro posicionado frontalmente");
  } catch (error) {
    console.error("❌ Error al activar modo 3D:", error);
    alert("Error al activar modo 3D. Revisa la consola para más detalles.");
  }
}

function activarVista2D() {
  volverAModo2D();
}

function actualizarBotonVista3D(texto) {
  // Actualizar el texto del botón de vista 3D
  let boton = document.getElementById('btn-vista-3d');
  if (boton) {
    boton.innerHTML = texto;
  }
}

function capturarCanvasComoTextura() {
  // Crear un canvas temporal para capturar la imagen 2D
  let pg = createGraphics(marcoW, marcoH);

  // Dibujar el contenido actual en el graphics temporal
  pg.push();

  // Fondo
  if (estado.fondoA4 === 'blanco') {
    pg.background(255);
  } else {
    pg.background(0);
  }

  // Dibujar gotas si están visibles
  if (estado.mostrarGotas && gotas.length > 0) {
    pg.push();
    // Clipping al área del marco
    pg.beginClip();
    pg.rect(0, 0, marcoW, marcoH);
    pg.endClip();

    // Dibujar cada gota
    gotas.forEach(gota => {
      pg.push();
      pg.translate(-marcoX, -marcoY); // Ajustar coordenadas

      if (gota instanceof GotaPinturaModo0) {
        dibujarGotaModo2D(pg, gota);
      } else if (gota instanceof GotaPinturaModo1) {
        dibujarGotaModo2D(pg, gota);
      } else if (gota instanceof GotaPinturaModo2) {
        dibujarGotaModo2D(pg, gota);
      } else if (gota instanceof GotaPinturaModo3) {
        dibujarGotaModo2D(pg, gota);
      } else if (gota instanceof GotaPinturaModo4) {
        dibujarGotaModo2D(pg, gota);
      } else if (gota instanceof GotaPinturaModo5) {
        dibujarGotaModo2D(pg, gota);
      } else if (gota instanceof GotaPinturaModo6) {
        dibujarGotaModo2D(pg, gota);
      } else if (gota instanceof GotaPinturaModo7) {
        dibujarGotaModo2D(pg, gota);
      } else if (gota instanceof GotaPinturaModo8) {
        dibujarGotaModo2D(pg, gota);
      } else if (gota instanceof GotaPinturaModo9) {
        dibujarGotaModo2D(pg, gota);
      }

      pg.pop();
    });
    pg.pop();
  }

  // AÑADIR MÁSCARA si existe - ANTES del texto (como en modo 2D)
  if (window.mascaraActual) {
    pg.push();

    // Configurar clipping al área del marco SIN RECORTE (máscara ocupa todo)
    pg.drawingContext.save();
    pg.drawingContext.beginPath();
    pg.drawingContext.rect(0, 0, marcoW, marcoH);
    pg.drawingContext.clip();

    let escalaMascara = marcoW / window.mascaraActual.width;
    pg.push();
    pg.translate(0, 0);
    pg.scale(escalaMascara);
    pg.drawingContext.drawImage(window.mascaraActual.canvas, 0, 0);
    pg.pop();

    // Restaurar contexto
    pg.drawingContext.restore();
    pg.pop();
  }

  // Texto si está visible (DESPUÉS de la máscara)
  if (estado.mostrarTexto) {
    // Dibujar franja para título/subtítulo en la textura 3D
    pg.push();
    let franjaH = 64; // Aumentado de 58 a 64px
    let franjaY = 0; // Posicionada en la parte superior del canvas de textura

    pg.noStroke();
    pg.fill(100, 100, 100, 255); // Gris oscuro opaco como el contador
    pg.rectMode(CORNER);
    pg.rect(0, franjaY, marcoW, franjaH); // Usar marcoW como en el backup

    pg.fill(estado.fondoA4 === 'blanco' ? 0 : 255); // Texto negro si fondo blanco, blanco si fondo negro
    pg.textAlign(CENTER, TOP);

    // Mejorar calidad DPI - usar textFont y textRenderingHint para mejor calidad
    pg.textFont('Arial');
    pg.textAlign(CENTER, TOP);

    // Ajustar tamaño de texto según formato y resolución de pantalla (más pequeño pero con mejor calidad)
    let tituloSize, subtituloSize;
    let esPantallaPequeña = windowWidth <= 1366; // Detectar pantalla pequeña

    if (estado.orientacion === "vertical") {
      tituloSize = esPantallaPequeña ? 18 : 24; // Aumentado para mejor calidad DPI
      subtituloSize = esPantallaPequeña ? 10 : 14; // Reducido para más compacto
    } else if (estado.orientacion === "horizontal") {
      tituloSize = esPantallaPequeña ? 20 : 28; // Aumentado para mejor calidad DPI
      subtituloSize = esPantallaPequeña ? 12 : 16; // Reducido para más compacto
    } else {
      tituloSize = esPantallaPequeña ? 19 : 26; // Aumentado para mejor calidad DPI
      subtituloSize = esPantallaPequeña ? 11 : 15; // Reducido para más compacto
    }

    pg.textStyle(BOLD);
    pg.textSize(tituloSize);
    pg.text(window.tituloPersonalizado || titulo, marcoW / 2, franjaY + 20); // Ajustado para franja más grande
    pg.textStyle(NORMAL);
    pg.textSize(subtituloSize);
    pg.text(window.subtituloPersonalizado || subtitulo, marcoW / 2, franjaY + 42); // Ajustado para franja más grande
    pg.pop();
  }

  // AÑADIR CONTADOR si está visible - SIEMPRE ENCIMA de la máscara
  if (estado.mostrarContador) {
    pg.push();
    let franjaH = 16; // Reducido de 20 a 16px
    let franjaY = marcoH - franjaH - 30;

    pg.fill(100, 100, 100, 255); // Gris oscuro opaco 
    pg.noStroke();
    pg.rectMode(CORNER);
    pg.rect(0, franjaY, marcoW, franjaH); // Usar coordenadas relativas como en el backup

    // Mejorar calidad DPI para el contador
    pg.textFont('Arial');
    pg.fill(estado.fondoA4 === 'blanco' ? 0 : 255); // Texto negro si fondo blanco, blanco si fondo negro
    pg.textAlign(CENTER, CENTER);
    pg.textSize(10); // Reducido para más compacto
    let textoContador = "Nº Interacción Usuarios: " + contadorRealUsuarios;
    pg.text(textoContador, marcoW / 2, franjaY + franjaH / 2); // Centrado en la franja
    pg.pop();
  }

  // AÑADIR LOGO-LIENZO (marca de agua) si está visible
  if (logoLienzo && logoLienzo.width > 0) {
    let logoWidth = 60; // Tamaño pequeño como marca de agua
    let logoHeight = (logoLienzo.height / logoLienzo.width) * logoWidth;
    let logoX = 20; // 20px desde el borde izquierdo
    let logoY = marcoH - logoHeight - 80; // 80px desde el borde inferior (completamente fuera de la franja)

    pg.push();
    pg.image(logoLienzo, logoX, logoY, logoWidth, logoHeight); // Sin tint() = 100% opaco para exportación
    pg.pop();
  }

  pg.pop();

  // Guardar como textura
  texturaCanvas = pg;
  // console.log("📸 Canvas capturado como textura:", marcoW + "x" + marcoH);
}

function dibujarGotaModo2D(pg, gota) {
  pg.noStroke();
  pg.fill(gota.color);

  if (gota instanceof GotaPinturaModo0) {
    // Modo 0 - partículas con rastros desde el centro y números al lado
    // Dibujar cada partícula con trazo (para crear el rastro) y número al lado
    for (var i = 0; i < gota.particles.length; i++) {
      var particle = gota.particles[i];

      // Dibujar línea desde el centro hasta la posición actual (rastro)
      pg.stroke(red(gota.color), green(gota.color), blue(gota.color), 50); // Trazo semitransparente
      pg.strokeWeight(1);
      pg.line(gota.x, gota.y, particle.pos.x, particle.pos.y);

      // Dibujar círculo más grande en la posición actual con su color
      pg.fill(gota.color); // Usar el color de la partícula
      pg.noStroke();
      pg.circle(particle.pos.x, particle.pos.y, 12); // Círculos de 12px

      // Dibujar número secuencial (i + 1) en blanco al lado del círculo
      pg.fill(255); // Texto blanco
      pg.noStroke();
      pg.textAlign(CENTER, CENTER);
      pg.textSize(10); // Texto más grande para círculos más grandes

      // Posicionar el número a la derecha del círculo
      let numeroX = particle.pos.x + 15; // 15px a la derecha del centro
      let numeroY = particle.pos.y;
      pg.text(i + 1, numeroX, numeroY);
    }
  } else if (gota instanceof GotaPinturaModo1 && gota.vertices.length > 0) {
    // Modo 1 - usar vertices
    pg.beginShape();
    gota.vertices.forEach(v => pg.vertex(v.x, v.y));
    pg.endShape(CLOSE);
  } else if (gota instanceof GotaPinturaModo2) {
    // Modo 2 - dibujar forma circular con ruido
    pg.beginShape();
    for (let i = 0; i < gota.pasos; i++) {
      let ang = map(i, 0, gota.pasos, 0, TWO_PI);
      let r = gota.radio * map(noise(cos(ang) + gota.offset, sin(ang) + gota.offset), 0, 1, 0.7, 1.3);
      vertex(gota.x + cos(ang) * r, gota.y + sin(ang) * r);
    }
    pg.endShape(CLOSE);
  } else if (gota instanceof GotaPinturaModo3) {
    // Modo 3 - ondas con SimplexNoise que ocupan ancho completo
    pg.fill(gota.color);

    // Trazo contrastado según el fondo para exportación
    if (estado.fondoA4 === 'blanco') {
      pg.stroke(0); // Trazo negro para fondo blanco
    } else {
      pg.stroke(255); // Trazo blanco para fondo negro
    }
    pg.strokeWeight(1); // Trazo más visible

    pg.beginShape();
    for (let i = 0; i <= gota.pasos; i++) {
      let x = gota.x + (gota.anchura * i / gota.pasos);
      // Para exportación, usar tiempo fijo (offset) para congelar la animación
      let noise = simplex.noise2D(x * gota.frecuencia, gota.offset) * gota.amplitud;
      pg.vertex(x, gota.y + noise);
    }
    // Cerrar la forma por abajo
    pg.vertex(gota.x + gota.anchura, gota.y + gota.amplitud * 2);
    pg.vertex(gota.x, gota.y + gota.amplitud * 2);
    pg.endShape(pg.CLOSE);
  } else if (gota instanceof GotaPinturaModo4) {
    // Modo 4 - triángulos equiláteros perfectos con rotación aleatoria
    pg.push();
    pg.translate(gota.x, gota.y);
    pg.rotate(gota.rotacion);
    pg.beginShape();
    for (let i = 0; i < 3; i++) {
      let ang = map(i, 0, 3, 0, TWO_PI);
      vertex(cos(ang) * gota.radio, sin(ang) * gota.radio);
    }
    pg.endShape(CLOSE);
    pg.pop();
  } else if (gota instanceof GotaPinturaModo5) {
    // Modo 5 - círculos perfectos sin ruido
    pg.ellipse(gota.x, gota.y, gota.radio * 2);
  } else if (gota instanceof GotaPinturaModo6) {
    // Modo 6 - cuadrados perfectos con rotación aleatoria
    pg.push();
    pg.translate(gota.x, gota.y);
    pg.rotate(gota.rotacion);
    pg.rectMode(CENTER);
    pg.rect(0, 0, gota.radio * 2, gota.radio * 2);
    pg.pop();
  } else if (gota instanceof GotaPinturaModo7) {
    // Modo 7 - letras del abecedario con rotación aleatoria
    pg.push();
    pg.translate(gota.x, gota.y);
    pg.rotate(gota.rotacion);
    pg.textAlign(CENTER, CENTER);
    pg.textSize(gota.radio);
    pg.textStyle(BOLD);
    pg.text(gota.letra, 0, 0);
    pg.pop();
  } else if (gota instanceof GotaPinturaModo8) {
    // Modo 8 - formas geométricas aleatorias con rotación
    pg.push();
    pg.stroke(0, 150); // Trazo negro con transparencia
    pg.strokeWeight(2);
    pg.fill(gota.color);
    pg.translate(gota.x, gota.y);
    pg.rotate(gota.rotacion);

    // Dibujar según tipo de forma
    if (gota.tipoForma === 0) {
      // Cuadrado
      pg.rectMode(CENTER);
      pg.rect(0, 0, gota.radio * 2, gota.radio * 2);
    } else if (gota.tipoForma === 1) {
      // Triángulo
      pg.beginShape();
      for (let i = 0; i < 3; i++) {
        let ang = map(i, 0, 3, 0, TWO_PI);
        pg.vertex(cos(ang) * gota.radio, sin(ang) * gota.radio);
      }
      pg.endShape(CLOSE);
    } else if (gota.tipoForma === 2) {
      // Círculo
      pg.ellipse(0, 0, gota.radio * 2);
    }
    pg.pop();
  } else if (gota instanceof GotaPinturaModo9) {
    // Modo 9 - estrellas perfectas con rotación aleatoria y puntas variables
    pg.push();
    pg.translate(gota.x, gota.y);
    pg.rotate(gota.rotacion);
    pg.beginShape();
    for (let i = 0; i < gota.numPuntas * 2; i++) {
      let ang = map(i, 0, gota.numPuntas * 2, 0, TWO_PI);
      let radioActual = (i % 2 === 0) ? gota.radio : gota.radio * 0.5;
      vertex(cos(ang) * radioActual, sin(ang) * radioActual);
    }
    pg.endShape(CLOSE);
    pg.pop();
  }
}

function serializarColorSeguro(valor) {
  if (!valor) return valor;

  try {
    return {
      __tipo: 'color',
      niveles: [red(valor), green(valor), blue(valor), alpha(valor)]
    };
  } catch (error) {
    return valor;
  }
}

function serializarValorEstado(valor) {
  if (valor === null || typeof valor !== 'object') return valor;

  if (Array.isArray(valor)) {
    return valor.map(serializarValorEstado);
  }

  if (typeof valor.x === 'number' && typeof valor.y === 'number' && typeof valor.copy === 'function') {
    return {
      __tipo: 'vector',
      x: valor.x,
      y: valor.y,
      z: valor.z || 0
    };
  }

  const salida = {};
  Object.keys(valor).forEach(clave => {
    salida[clave] = clave === 'color'
      ? serializarColorSeguro(valor[clave])
      : serializarValorEstado(valor[clave]);
  });
  return salida;
}

function restaurarValorEstado(valor) {
  if (valor === null || typeof valor !== 'object') return valor;

  if (Array.isArray(valor)) {
    return valor.map(restaurarValorEstado);
  }

  if (valor.__tipo === 'color') {
    return color(valor.niveles[0], valor.niveles[1], valor.niveles[2], valor.niveles[3]);
  }

  if (valor.__tipo === 'vector') {
    return createVector(valor.x, valor.y, valor.z || 0);
  }

  const salida = {};
  Object.keys(valor).forEach(clave => {
    salida[clave] = restaurarValorEstado(valor[clave]);
  });
  return salida;
}

function crearGotaPorClase(nombreClase) {
  switch (nombreClase) {
    case 'GotaPinturaModo0': return new GotaPinturaModo0();
    case 'GotaPinturaModo1': return new GotaPinturaModo1();
    case 'GotaPinturaModo2': return new GotaPinturaModo2();
    case 'GotaPinturaModo3': return new GotaPinturaModo3();
    case 'GotaPinturaModo4': return new GotaPinturaModo4();
    case 'GotaPinturaModo5': return new GotaPinturaModo5();
    case 'GotaPinturaModo6': return new GotaPinturaModo6();
    case 'GotaPinturaModo7': return new GotaPinturaModo7();
    case 'GotaPinturaModo8': return new GotaPinturaModo8();
    case 'GotaPinturaModo9': return new GotaPinturaModo9();
    default: return null;
  }
}

function guardarEstadoParaVolverDe3D() {
  const mascaraDataUrl = window.mascaraActual?.canvas
    ? window.mascaraActual.canvas.toDataURL('image/png')
    : null;

  const estadoGuardado = {
    estado: { ...estado },
    gotas: gotas.map(gota => ({
      clase: gota.constructor.name,
      datos: serializarValorEstado(gota)
    })),
    titulo,
    subtitulo,
    tituloPersonalizado: window.tituloPersonalizado || '',
    subtituloPersonalizado: window.subtituloPersonalizado || '',
    contadorRealUsuarios,
    mascaraDataUrl,
    mascaraAnchoOriginal,
    mascaraAltoOriginal
  };

  sessionStorage.setItem('ecodiv_estado_vista_2d', JSON.stringify(estadoGuardado));
}

function restaurarEstadoTrasVista3D() {
  const estadoGuardadoTexto = sessionStorage.getItem('ecodiv_estado_vista_2d');
  if (!estadoGuardadoTexto) return;

  sessionStorage.removeItem('ecodiv_estado_vista_2d');

  try {
    const estadoGuardado = JSON.parse(estadoGuardadoTexto);

    if (estadoGuardado.estado) {
      Object.assign(estado, estadoGuardado.estado);
    }

    titulo = estadoGuardado.titulo || titulo;
    subtitulo = estadoGuardado.subtitulo || subtitulo;
    window.tituloPersonalizado = estadoGuardado.tituloPersonalizado || '';
    window.subtituloPersonalizado = estadoGuardado.subtituloPersonalizado || '';
    contadorRealUsuarios = estadoGuardado.contadorRealUsuarios || contadorRealUsuarios;
    mascaraAnchoOriginal = estadoGuardado.mascaraAnchoOriginal || 0;
    mascaraAltoOriginal = estadoGuardado.mascaraAltoOriginal || 0;

    gotas = (estadoGuardado.gotas || []).map(gotaGuardada => {
      const gota = crearGotaPorClase(gotaGuardada.clase);
      if (!gota) return null;
      Object.assign(gota, restaurarValorEstado(gotaGuardada.datos));
      return gota;
    }).filter(Boolean);

    if (estadoGuardado.mascaraDataUrl) {
      window.mascaraActual = loadImage(estadoGuardado.mascaraDataUrl);
    }

    modo3D = false;
    primerFrame = true;
  } catch (error) {
    console.error('Error al restaurar la vista 2D:', error);
  }
}

function volverAModo2D() {
  guardarEstadoParaVolverDe3D();
  window.location.reload();
}

/* CÓDIGO MUERTO: Función overlay que podría no estar implementada */
function activarOverlay() {
  // console.log("Overlay en desarrollo");
}

function exportarA4PDF() {
  solicitarTestAntesDeExportar('pdf');
}

function exportarA4() {
  solicitarTestAntesDeExportar('png');
}

function solicitarTestAntesDeExportar(tipo) {
  if (testExportacionEnviado) {
    ejecutarExportacion(tipo);
    return;
  }

  exportacionPendiente = tipo;
  abrirModalTestExportacion();
}

function ejecutarExportacion(tipo) {
  if (tipo === 'pdf') {
    exportarA4PDFReal();
  } else {
    exportarA4Real();
  }
}

function abrirModalTestExportacion() {
  const modal = document.getElementById('modal-test-exportacion');
  const estadoTest = document.getElementById('estado-test-exportacion');
  const botonEnviar = document.getElementById('btn-enviar-test-exportacion');

  if (estadoTest) estadoTest.textContent = '';
  if (botonEnviar) {
    botonEnviar.disabled = false;
    botonEnviar.textContent = 'Enviar test';
  }
  if (modal) modal.style.display = 'block';
}

function cerrarModalTestExportacion() {
  const modal = document.getElementById('modal-test-exportacion');
  if (modal) modal.style.display = 'none';
  exportacionPendiente = null;
}

async function enviarTestExportacion(event) {
  event.preventDefault();

  const form = document.getElementById('form-test-exportacion');
  const contenido = document.getElementById('contenido-test-exportacion');
  const estadoTest = document.getElementById('estado-test-exportacion');
  const botonEnviar = document.getElementById('btn-enviar-test-exportacion');

  if (form && !form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (!contenido || typeof html2canvas === 'undefined') {
    if (estadoTest) estadoTest.textContent = 'No se pudo preparar la captura del test.';
    return;
  }

  try {
    if (botonEnviar) {
      botonEnviar.disabled = true;
      botonEnviar.textContent = 'Enviando...';
    }
    if (estadoTest) estadoTest.textContent = '';

    const estilosOriginales = {
      maxHeight: contenido.style.maxHeight,
      overflowY: contenido.style.overflowY,
      marginTop: contenido.style.marginTop,
      scrollTop: contenido.scrollTop
    };

    contenido.scrollTop = 0;
    contenido.style.maxHeight = 'none';
    contenido.style.overflowY = 'visible';
    contenido.style.marginTop = '0';

    const canvas = await html2canvas(contenido, {
      backgroundColor: '#14141e',
      scale: 2,
      windowWidth: contenido.scrollWidth,
      windowHeight: contenido.scrollHeight
    });

    contenido.style.maxHeight = estilosOriginales.maxHeight;
    contenido.style.overflowY = estilosOriginales.overflowY;
    contenido.style.marginTop = estilosOriginales.marginTop;
    contenido.scrollTop = estilosOriginales.scrollTop;
    const imageBase64 = canvas.toDataURL('image/png');
    const fecha = new Date().toISOString().replace(/[:.]/g, '-');

    await fetch(TEST_EXPORTACION_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({
        filename: `test-ecodiv-${fecha}.png`,
        imageBase64
      })
    });

    testExportacionEnviado = true;
    const tipo = exportacionPendiente || 'png';
    exportacionPendiente = null;
    cerrarModalTestExportacion();
    ejecutarExportacion(tipo);
  } catch (error) {
    console.error('Error al enviar el test:', error);
    if (estadoTest) estadoTest.textContent = 'No se pudo enviar el test. Intentalo de nuevo.';
    if (botonEnviar) {
      botonEnviar.disabled = false;
      botonEnviar.textContent = 'Enviar test';
    }
  }
}

function exportarA4PDFReal() {
  console.log("🔍 DEBUG: exportarA4PDF() llamada");

  try {
    // EN MODO 3D, USAR TEXTURACANVAS COMO EN exportarA4()
    if (modo3D && texturaCanvas) {
      console.log("🔍 DEBUG: Usando texturaCanvas 3D para exportación PDF");

      // Crear instancia de jsPDF
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: estado.orientacion === "vertical" ? "portrait" : "landscape",
        unit: "mm",
        format: "a4"
      });

      // Obtener imagen del texturaCanvas
      let imgData = texturaCanvas.canvas.toDataURL('image/png', 1.0);

      // Calcular dimensiones para A4
      let pageWidth = pdf.internal.pageSize.getWidth();
      let pageHeight = pdf.internal.pageSize.getHeight();

      // Añadir imagen al PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      pdf.save('echo-arte.pdf');

      console.log("✅ PDF exportado correctamente desde texturaCanvas");
      return;
    }

    // SI NO ESTAMOS EN MODO 3D O NO HAY TEXTURA, USAR CANVAS 2D
    console.log("🔍 DEBUG: Usando canvas 2D para exportación PDF");

    // Crear instancia de jsPDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: estado.orientacion === "vertical" ? "portrait" : "landscape",
      unit: "mm",
      format: "a4"
    });

    // CAPTURAR EL CANVAS DE VISTA 2D
    let imgData;
    let canvas = document.querySelector('#a4-container canvas');
    if (!canvas) {
      // Si no hay canvas 2D, intentar con el canvas principal
      canvas = document.querySelector('#defaultCanvas0 canvas');
    }

    if (!canvas) {
      console.error("❌ No se encontró ningún canvas para exportar PDF");
      alert("Error: No se encontró el canvas para exportar PDF");
      return;
    }

    console.log("🔍 DEBUG: Capturando canvas 2D:", canvas.id || canvas.className);
    imgData = canvas.toDataURL('image/png', 1.0);

    // Calcular dimensiones para A4
    let pageWidth = pdf.internal.pageSize.getWidth();
    let pageHeight = pdf.internal.pageSize.getHeight();

    // Añadir imagen al PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
    pdf.save('echo-arte.pdf');

    console.log("✅ PDF exportado correctamente desde canvas 2D");

  } catch (error) {
    console.error("❌ Error al exportar PDF:", error);
    alert("Error al exportar PDF. Por favor, inténtalo de nuevo.");
  }
}

function exportarA4Real() {
  console.log("🔍 DEBUG: exportarA4() llamada");

  // SIEMPRE CREAR CANVAS A4 COMPLETO CON DPI 300 - INCLUSO EN MODO 3D
  const dpi = 300; // Balance calidad-rendimiento
  let wMM = 210, hMM = 297;

  if (estado.orientacion === "horizontal") [wMM, hMM] = [hMM, wMM];

  const pxMM = dpi / 25.4;
  const w = Math.round(wMM * pxMM); // 2480px para A4 vertical a 300 DPI
  const h = Math.round(hMM * pxMM); // 3508px para A4 vertical a 300 DPI

  console.log("🔍 DEBUG: Creando canvas A4:", w + "x" + h + "px a " + dpi + " DPI");

  let pg = createGraphics(w, h);

  if (estado.fondoA4 === "blanco") pg.background(255);
  else if (estado.fondoA4 === "negro") pg.background(0);

  // EN MODO 3D, USAR TEXTURACANVAS ESCALADO AL TAMAÑO A4
  if (modo3D && texturaCanvas) {
    console.log("🔍 DEBUG: Escalando texturaCanvas 3D a tamaño A4 con 300 DPI");

    // Calcular escala para llevar texturaCanvas al tamaño A4
    let scaleFactor = min(w / texturaCanvas.width, h / texturaCanvas.height);
    let scaledWidth = texturaCanvas.width * scaleFactor;
    let scaledHeight = texturaCanvas.height * scaleFactor;

    // Centrar el texturaCanvas escalado en el canvas A4
    let offsetX = (w - scaledWidth) / 2;
    let offsetY = (h - scaledHeight) / 2;

    pg.push();
    pg.translate(offsetX, offsetY);
    pg.scale(scaleFactor);
    pg.image(texturaCanvas, 0, 0);
    pg.pop();

    console.log("🔍 DEBUG: texturaCanvas escalado con factor:", scaleFactor);
  } else {
    // SI NO ESTAMOS EN MODO 3D, DIBUJAR NORMALMENTE
    console.log("🔍 DEBUG: Dibujando contenido normal en modo 2D con 300 DPI");

    // DIBUJAR DIRECTAMENTE en canvas A4 sin escalado
    // 1. DIBUJAR GOTAS (ocupando todo el espacio)
    gotas.forEach(g => {
      if (g instanceof GotaPinturaModo1) dibujarGotaModo1(pg, g);
      if (g instanceof GotaPinturaModo2) dibujarGotaModo2(pg, g);
      if (g instanceof GotaPinturaModo4) dibujarGotaModo4(pg, g);
      if (g instanceof GotaPinturaModo5) dibujarGotaModo5(pg, g);
      if (g instanceof GotaPinturaModo6) dibujarGotaModo6(pg, g);
      if (g instanceof GotaPinturaModo7) dibujarGotaModo7(pg, g);
      if (g instanceof GotaPinturaModo8) dibujarGotaModo8(pg, g);
      if (g instanceof GotaPinturaModo9) dibujarGotaModo9(pg, g);
    });

    // 2. DIBUJAR MÁSCARA
    if (window.mascaraActual) {
      pg.push();
      pg.drawingContext.save();
      pg.drawingContext.beginPath();
      pg.drawingContext.rect(0, 0, w, h);
      pg.drawingContext.clip();

      let escalaMascara = w / window.mascaraActual.width;
      pg.scale(escalaMascara);
      pg.drawingContext.drawImage(window.mascaraActual.canvas, 0, 0);

      pg.drawingContext.restore();
      pg.pop();
    }

    // 3. DIBUJAR TEXTO
    if (estado.mostrarTexto) {
      pg.push();
      let franjaH = 90;
      pg.fill(100, 100, 100, 255);
      pg.noStroke();
      pg.rect(0, 0, w, franjaH);

      pg.fill(estado.fondoA4 === 'blanco' ? 0 : 255);
      pg.textAlign(CENTER, TOP);
      pg.textStyle(BOLD);
      pg.textSize(24);
      pg.text(titulo, w / 2, 25);
      pg.textStyle(NORMAL);
      pg.textSize(16);
      pg.text(subtitulo, w / 2, 60);
      pg.pop();
    }

    // 4. DIBUJAR CONTADOR
    if (estado.mostrarContador) {
      dibujarContadorExportacion(pg, w, h, dpi);
    }

    // 5. DIBUJAR LOGO-LIENZO (marca de agua) - SIEMPRE EN EXPORTACIÓN
    if (logoLienzo && logoLienzo.width > 0) {
      // Escalar logo-lienzo para alta resolución (300 DPI)
      let dpiScale = 300 / 72; // Convertir de 72 DPI a 300 DPI
      let logoWidth = 60 * dpiScale; // 60px a 300 DPI
      let logoHeight = (logoLienzo.height / logoLienzo.width) * logoWidth;
      let logoX = 28 * dpiScale; // 28px a 300 DPI
      let logoY = h - logoHeight - 80 * dpiScale; // 80px desde el borde inferior (completamente fuera de la franja)

      // Aplicar SIN transparencia en exportación (completamente opaco)
      pg.image(logoLienzo, logoX, logoY, logoWidth, logoHeight); // Sin tint() = 100% opaco
    }
  }

  // GUARDAR SIEMPRE A TAMAÑO A4 COMPLETO CON 300 DPI
  saveCanvas(pg, "ECO_A4", "png");
  console.log("✅ PNG exportado a tamaño A4 completo con 300 DPI:", w + "x" + h + "px");
}

function dibujarGotaModo1(pg, g) {
  pg.noStroke();
  pg.fill(g.color);
  pg.beginShape();
  g.vertices.forEach(v => pg.vertex(v.x, v.y));
  pg.endShape(CLOSE);
}

function dibujarGotaModo2(pg, g) {
  pg.noStroke();
  pg.fill(g.color);
  pg.beginShape();
  for (let i = 0; i < g.pasos; i++) {
    let ang = map(i, 0, g.pasos, 0, TWO_PI);
    let r = g.radio * map(noise(cos(ang) + g.offset, sin(ang) + g.offset), 0, 1, 0.7, 1.3);
    pg.vertex(g.x + cos(ang) * r, g.y + sin(ang) * r);
  }
  pg.endShape(CLOSE);
}

function dibujarGotaModo4(pg, g) {
  pg.noStroke();
  pg.fill(g.color);
  // Dibujar triángulo equilátero perfecto con rotación aleatoria
  pg.push();
  pg.translate(g.x, g.y);
  pg.rotate(g.rotacion);
  pg.beginShape();
  for (let i = 0; i < 3; i++) {
    let ang = map(i, 0, 3, 0, TWO_PI);
    pg.vertex(cos(ang) * g.radio, sin(ang) * g.radio);
  }
  pg.endShape(CLOSE);
  pg.pop();
}

function dibujarGotaModo5(pg, g) {
  pg.noStroke();
  pg.fill(g.color);
  // Dibujar círculo perfecto sin ruido
  pg.ellipse(g.x, g.y, g.radio * 2);
}

function dibujarGotaModo6(pg, g) {
  pg.noStroke();
  pg.fill(g.color);
  // Dibujar cuadrado perfecto con rotación aleatoria
  pg.push();
  pg.translate(g.x, g.y);
  pg.rotate(g.rotacion);
  pg.rectMode(CENTER);
  pg.rect(0, 0, g.radio * 2, g.radio * 2);
  pg.pop();
}

function dibujarGotaModo7(pg, g) {
  pg.noStroke();
  pg.fill(g.color);
  // Dibujar letra con rotación aleatoria
  pg.push();
  pg.translate(g.x, g.y);
  pg.rotate(g.rotacion);
  pg.textAlign(CENTER, CENTER);
  pg.textSize(g.radio);
  pg.textStyle(BOLD);
  pg.text(g.letra, 0, 0);
  pg.pop();
}

function dibujarGotaModo8(pg, g) {
  pg.stroke(0, 150); // Trazo negro con transparencia
  pg.strokeWeight(2);
  pg.fill(g.color);
  // Dibujar forma geométrica con rotación aleatoria
  pg.push();
  pg.translate(g.x, g.y);
  pg.rotate(g.rotacion);

  // Dibujar según tipo de forma
  if (g.tipoForma === 0) {
    // Cuadrado
    pg.rectMode(CENTER);
    pg.rect(0, 0, g.radio * 2, g.radio * 2);
  } else if (g.tipoForma === 1) {
    // Triángulo
    pg.beginShape();
    for (let i = 0; i < 3; i++) {
      let ang = map(i, 0, 3, 0, TWO_PI);
      pg.vertex(cos(ang) * g.radio, sin(ang) * g.radio);
    }
    pg.endShape(CLOSE);
  } else if (g.tipoForma === 2) {
    // Círculo
    pg.ellipse(0, 0, g.radio * 2);
  }
  pg.pop();
}

function dibujarGotaModo9(pg, g) {
  pg.noStroke();
  pg.fill(g.color);
  // Dibujar estrella perfecta con rotación aleatoria
  pg.push();
  pg.translate(g.x, g.y);
  pg.rotate(g.rotacion);
  pg.beginShape();
  for (let i = 0; i < g.numPuntas * 2; i++) {
    let ang = map(i, 0, g.numPuntas * 2, 0, TWO_PI);
    let radioActual = (i % 2 === 0) ? g.radio : g.radio * 0.5;
    pg.vertex(cos(ang) * radioActual, sin(ang) * radioActual);
  }
  pg.endShape(CLOSE);
  pg.pop();
}

function windowResized() {
  // Solo redimensionar si no estamos en modo 3D
  if (!modo3D) {
    resizeCanvas(windowWidth, windowHeight);
    recalcularMarco();
    posicionarPanelesBotones(); // Reposicionar paneles al cambiar tamaño
  } else {
    // En modo 3D, redimensionar el canvas WebGL
    resizeCanvas(windowWidth, windowHeight);
  }

  // Recalcular máscara si está cargada para que se ajuste al nuevo tamaño
  if (window.mascaraActual) {
    // console.log("🔄 Ventana redimensionada - recalculando máscara");
    // La máscara se recalculará automáticamente en el próximo frame
  }
}

// ==========================
// POSICIONAMIENTO RESPONSIVE DE PANELES
// ==========================
function posicionarPanelesBotones() {
  const panelIzquierdo = document.getElementById('botones-izquierda');
  const panelDerecho = document.getElementById('botones-derecha');

  if (!panelIzquierdo || !panelDerecho) {
    // console.log("⚠️ Paneles no encontrados");
    return;
  }

  // Calcular distancia del marco (20px del borde del marco)
  const distanciaMarco = 20;

  // Deslizar panel izquierdo desde fuera de pantalla hasta su posición
  const izquierdaX = marcoX - distanciaMarco;
  panelIzquierdo.style.left = izquierdaX + 'px';
  panelIzquierdo.style.right = 'auto';
  panelIzquierdo.style.top = '50%';
  panelIzquierdo.style.transform = 'translateX(-100%) translateY(-50%)';

  // Deslizar panel derecho desde fuera de pantalla hasta su posición
  const derechaX = marcoX + marcoW + distanciaMarco;
  panelDerecho.style.left = derechaX + 'px'; // Usar left como el izquierdo
  panelDerecho.style.right = 'auto'; // Resetear right
  panelDerecho.style.top = '50%';
  panelDerecho.style.transform = 'translateY(-50%)';

  // Posicionar botón Jelly junto al borde derecho del lienzo
  const btnJelly = document.getElementById('btn-jelly');
  if (btnJelly) {
    const offsetJelly = windowWidth >= 1920 ? 88 : -4;
    btnJelly.style.left = (derechaX + 18) + 'px';
    btnJelly.style.right = 'auto';
    btnJelly.style.top = (marcoY + offsetJelly) + 'px';

    const btnTooltips = document.getElementById('btn-tooltips');
    if (btnTooltips) {
      btnTooltips.style.left = (derechaX + 72) + 'px';
      btnTooltips.style.right = 'auto';
      btnTooltips.style.top = (marcoY + offsetJelly) + 'px';
    }

    const btnInfo = document.getElementById('btn-info');
    if (btnInfo) {
      btnInfo.style.left = (derechaX + 126) + 'px';
      btnInfo.style.right = 'auto';
      btnInfo.style.top = (marcoY + offsetJelly) + 'px';
    }
  }

  // console.log(`📍 Paneles deslizándose elegantemente: Izquierda=${izquierdaX}px, Derecha=${derechaX}px`);
}

function alternarTooltips() {
  const btnTooltips = document.getElementById('btn-tooltips');
  const tooltipsActivos = btnTooltips?.dataset.activos !== 'false';
  const elementosConTooltip = document.querySelectorAll('[title], [data-tooltip]');

  elementosConTooltip.forEach(el => {
    if (el === btnTooltips) return;

    if (tooltipsActivos) {
      if (el.title) {
        el.dataset.tooltip = el.title;
        el.removeAttribute('title');
      }
    } else if (el.dataset.tooltip) {
      el.title = el.dataset.tooltip;
    }
  });

  if (btnTooltips) {
    const nuevosActivos = !tooltipsActivos;
    btnTooltips.dataset.activos = String(nuevosActivos);
    btnTooltips.classList.toggle('tooltips-desactivados', !nuevosActivos);
    btnTooltips.title = nuevosActivos ? 'Desactivar tooltips' : 'Activar tooltips';
    btnTooltips.setAttribute('aria-label', btnTooltips.title);
  }
}

function abrirModalInfo() {
  const modal = document.getElementById('modal-info');
  if (modal) {
    modal.style.display = 'block';
  }
}

function cerrarModalInfo(event) {
  if (event && event.target.id !== 'modal-info') return;

  const modal = document.getElementById('modal-info');
  if (modal) {
    modal.style.display = 'none';
  }
}

// FUNCIONES PARA EL MODAL DE OPCIONES DE MÁSCARA
function abrirModalMascaraOpciones() {
  const modal = document.getElementById('modal-mascara-opciones');
  if (modal) {
    modal.style.display = 'block';
  }
}

function cerrarModalMascaraOpciones(event) {
  if (event && event.target.id !== 'modal-mascara-opciones') return;
  cerrarModalMascaraOpcionesDirecto();
}

function cerrarModalMascaraOpcionesDirecto() {
  const modal = document.getElementById('modal-mascara-opciones');
  if (modal) {
    modal.style.display = 'none';
  }
}

function cargarMascaraDesdePC() {
  cerrarModalMascaraOpcionesDirecto();
  document.getElementById('input-mascara').click();
}

function descargarMascaraAlmacenamiento() {
  window.open('https://drive.google.com/drive/folders/1LTEbq0iLZfqxvcAm3Tl8-_tQAmlcFJVm?usp=sharing', '_blank');
}

// Función para detectar scroll del mouse
function mouseWheel(event) {
  mouseWheelDelta = event.delta;
  return false; // Prevenir scroll de la página
}
