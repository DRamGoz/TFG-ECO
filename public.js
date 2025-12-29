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

  fetch(API_URL, {
    method: "POST",
    body: data
  })
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
});











