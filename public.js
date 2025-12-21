const API_URL = "https://script.google.com/macros/s/AKfycbyTMNP6s4KOhgA_qN4bXCpnsHnDcAIKQ-SWU8FoIpdu-PUwO0KsdIk3klratrjgCHfskg/exec";


document.getElementById("botonClick").addEventListener("click", () => {
  const data = {
    timestamp: new Date().toISOString(),
    valor: "click"
  };

  // 1️⃣ Enviar a Google Sheets
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  // 2️⃣ Agregar directamente en ECHO si está abierto
  if (window.opener) {
    window.opener.agregarEvento(data);
  }

  // 3️⃣ También guardar en localStorage para ECHO si se abre después
  const guardados = JSON.parse(localStorage.getItem("eventos") || "[]");
  guardados.push(data);
  localStorage.setItem("eventos", JSON.stringify(guardados));
});
