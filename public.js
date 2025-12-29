const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec"; // reemplaza con tu URL actual

let rastroActivo = false; // activa la captura del mouse tras click

// botón y texto
const btn = document.getElementById("sendBtn");
const infoText = document.getElementById("infoText");

// --------------------------
// Evento click del botón
// --------------------------
btn.addEventListener("click", () => {
  if (!rastroActivo) {
    rastroActivo = true; // activar rastro del mouse

    // desaparecer botón y texto principal
    [btn, infoText].forEach(el => {
      el.style.transition = "opacity 1s ease";
      el.style.opacity = 0;
      setTimeout(() => el.style.display = "none", 1000);
    });

    // enviar primer valor "click" con timestamp
    enviarDato("click");
  }
});

// --------------------------
// Captura movimiento del mouse
// --------------------------
function mouseMoved() {
  if (!rastroActivo) return;

  // enviar valor "movimiento" con x e y
  enviarDato("movimiento", mouseX, mouseY);
}

// --------------------------
// Función que envía datos al Sheet
// --------------------------
function enviarDato(valor, x = "", y = "") {
  const data = new URLSearchParams();
  data.append("valor", valor);

  // timestamp se genera automáticamente en Apps Script
  if (x !== "") data.append("x", x);
  if (y !== "") data.append("y", y);

  fetch(API_URL, {
    method: "POST",
    body: data
  })
    .then(r => r.text())
    .then(console.log)
    .catch(console.error);
}







