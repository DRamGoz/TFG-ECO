const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec"; // sustituye con tu URL actual


const API_URL = "TU_URL_DEL_DEPLOYMENT";

let lastSent = 0;
const throttleTime = 200; // ms

document.addEventListener("mousemove", (event) => {
  const now = Date.now();
  if (now - lastSent > throttleTime) {
    lastSent = now;
    enviarMouse(event.clientX, event.clientY);
  }
});

function enviarMouse(x, y) {
  const data = new URLSearchParams();
  data.append("x", "move");
  data.append("y", "move");

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data.toString()
  })
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
}
















