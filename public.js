const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec"; // sustituye con tu URL actual

const btn = document.getElementById("sendBtn");

btn.addEventListener("click", (event) => {
  const x = event.clientX; // coordenada X del click
  const y = event.clientY; // coordenada Y del click
  enviarDato("click", x, y);
});


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














