const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec"; // sustituye con tu URL actual

const btn = document.getElementById("sendBtn");

btn.addEventListener("click", () => {
  // enviar coordenadas x e y actuales del mouse al hacer click
  enviarDato("click", mouseX, mouseY);
});

function enviarDato(valor, x = "", y = "") {
  const data = new URLSearchParams();
  data.append("valor", valor);
  data.append("x", x);
  data.append("y", y);

  fetch(API_URL, {
    method: "POST",
    body: data
  })
    .then(r => r.text())
    .then(console.log)
    .catch(console.error);
}









