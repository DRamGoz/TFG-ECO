const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec"; // sustituye con tu URL actual

const btn = document.getElementById("sendBtn");

btn.addEventListener("click", (event) => {
  // Captura las coordenadas del click
  const x = event.clientX;
  const y = event.clientY;

  const data = new URLSearchParams();
  data.append("valor", "click");
  data.append("x", 123);
  data.append("y", 456);

 function enviarDato(valor, x = 0, y = 0) {
  const data = new URLSearchParams();
  data.append("valor", valor);
  data.append("x", x);
  data.append("y", y);

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: data.toString() // clave: convertir a string
  })
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
}













