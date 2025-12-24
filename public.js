const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

let btnRadius = 50;       // radio del botón
let btnX, btnY;           // posición centrada
let pulse = 0;            // animación respiración
let hover = false;        // estado hover
let pressed = false;      // estado click
let pulseSpeed = 0.05;    // velocidad respiración

function setup() {
  createCanvas(windowWidth, windowHeight);
  btnX = width / 2;
  btnY = height / 2;
}

function draw() {
  background(0);

  // animación respiración
  pulse = sin(frameCount * pulseSpeed) * 5;

  // detectar hover
  let d = dist(mouseX, mouseY, btnX, btnY);
  hover = d < btnRadius;

  // color según estado
  let baseColor = pressed ? color(0, 200, 255) : hover ? color(0, 255, 150) : color(0, 150, 255);

  // dibujar halo difuso si hover
  if (hover) {
    noStroke();
    fill(baseColor.levels[0], baseColor.levels[1], baseColor.levels[2], 80);
    ellipse(btnX, btnY, (btnRadius + 20 + pulse*2) * 2);
  }

  // dibujar botón principal
  noStroke();
  fill(baseColor);
  ellipse(btnX, btnY, (btnRadius + pulse) * 2);

  // opcional: símbolo en el botón
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("ENVIAR", btnX, btnY - 8);
  text("DATO", btnX, btnY + 8);
}

function mousePressed() {
  let d = dist(mouseX, mouseY, btnX, btnY);
  if (d < btnRadius) {
    pressed = true;
    enviarDato();
  }
}

function mouseReleased() {
  pressed = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  btnX = width / 2;
  btnY = height / 2;
}

function enviarDato() {
  const data = new URLSearchParams();
  data.append("valor", "click");

  fetch(API_URL, {
    method: "POST",
    body: data
  })
    .then(r => r.text())
    .then(console.log)
    .catch(console.error);
}



