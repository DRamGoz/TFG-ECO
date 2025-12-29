const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec"; // sustituye con tu URL actual

const btn = document.getElementById("sendBtn");

btn.addEventListener("click", (event) => {
  // event.clientX y event.clientY dan la posición del click en la ventana
  const x = event.clientX;
  const y = event.clientY;

  const data = new URLSearchParams();
  data.append("valor", "click");
  data.append("x", x);
  data.append("y", y);

  fetch(API_URL, {
    method: "POST",
    body: data
  })
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
});









