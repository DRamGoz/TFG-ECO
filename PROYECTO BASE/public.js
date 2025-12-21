const API_URL = "https://script.google.com/macros/s/AKfycbwnHiB9It1VjVa0WMqrehaJCEnBNOyNJaGwxuXJKnBw32aWi0vyF1KY66RTtITA7xqEOA/exec";

let btn;

function setup() {
  createCanvas(400, 200);
  btn = createButton("ENVIAR DATO");
  btn.position(width / 2 - 50, height / 2);
  btn.mousePressed(enviarDato);
}

function draw() {
  background(20);
  fill(255);
  textAlign(CENTER, CENTER);
  text("PUBLIC", width / 2, 40);
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
