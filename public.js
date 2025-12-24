const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";

function setup() {
  createCanvas(windowWidth, windowHeight).parent("app");
}

function draw() {
  background(0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// --- Envío de datos ---
const btn = document.getElementById("sendBtn");
btn.addEventListener("click", () => {
  const data = new URLSearchParams();
  data.append("valor", "click");

  fetch(API_URL, {
    method: "POST",
    body: data
  })
    .then(r => r.text())
    .then(console.log)
    .catch(console.error);
});
