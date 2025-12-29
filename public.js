const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec"; // sustituye con tu URL actual



// Registro continuo de la posición del mouse
document.addEventListener("mousemove", (event) => {
  const x = event.clientX;
  const y = event.clientY;

  // Enviar a la hoja solo si quieres limitar la frecuencia
  enviarMouse(x, y);
});

// Función de envío de mouse
function enviarMouse(x, y) {
  const data = new URLSearchParams();
  data.append("x", x);
  data.append("y", y);

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data.toString()
  })
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
}

// Botón para enviar "valor" al hacer click (timestamp + valor)
const btn = document.getElementById("sendBtn");
btn.addEventListener("click", () => {
  const data = new URLSearchParams();
  data.append("valor", "click");

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data.toString()
  })
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
});
















