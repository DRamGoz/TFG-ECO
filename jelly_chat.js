/**
 * ECODIV Tool - Chatbot Jelly Guía v1.0
 * Lógica del chatbot y Base de Datos local.
 */

// ==========================================================
// 1. BASE DE DATOS DE CONOCIMIENTO (Local)
// ==========================================================
const JELLY_BD = {
  mensajes: {
    saludo: "¡OLI...! 🌊 Soy Jelly, la mascota y guía de ECODIV. Estoy aquí para responder a tus dudas sobre la herramienta. ¿Qué te gustaría saber hoy?",
    noEntendido: "Vaya, no tengo esa respuesta en mi manual. Pero puedes preguntarme sobre exportación, modos de arte o máscaras. ¿Te interesa alguno de estos temas?",
    pensando: "Jelly está pensando..."
  },

  // Opciones iniciales y sugerencias rápidas
  sugerenciasInicio: [
    "🎨 Modos de Arte",
    "⚙️ Funciones",
    "📂 Cargar Máscaras",
    "💾 Guardar / Exportar",
    "🏠 Volver al Tutorial"
  ],

  // Diccionario de conocimiento para el buscador semántico
  conocimiento: [
    {
      id: "modos_1_3",
      claves: ["modo 1", "modo 2", "modo 3", "acrilico", "acuarela", "ondas", "modos 1-3"],
      respuesta: "• **Modo 1 · Acrílico**: Gotas con rastro suave y mezcla difuminada.\n• **Modo 2 · Acuarela**: Gotas translúcidas que simulan pigmento húmedo.\n• **Modo 3 · Ondas**: Trazos ondulados que representan frecuencias fluidas.",
      sugerencias: ["🎨 Modos de Arte", "🔺 Modos 4-6"]
    },
    {
      id: "modos_4_6",
      claves: ["modo 4", "modo 5", "modo 6", "triangulos", "circulos", "cuadrados", "modos 4-6"],
      respuesta: "• **Modo 4 · Triángulos**: Estructuras geométricas angulares y dinámicas.\n• **Modo 5 · Círculos**: Elementos esféricos que pulsan sobre el lienzo.\n• **Modo 6 · Cuadrados**: Composiciones abstractas basadas en cubos y planos.",
      sugerencias: ["🎨 Modos de Arte", "🔠 Modos 7-9"]
    },
    {
      id: "modos_7_9",
      claves: ["modo 7", "modo 8", "modo 9", "letras", "miscelanea", "estrellas", "modos 7-9"],
      respuesta: "• **Modo 7 · Letras**: Tipografía generativa que dibuja formas en el espacio.\n• **Modo 8 · Miscelánea**: Mezcla libre de texturas y partículas fluidas.\n• **Modo 9 · Estrellas**: Estructuras celestes y trazos luminosos.",
      sugerencias: ["🎨 Modos de Arte"]
    },
    {
      id: "mascara_tamano",
      claves: ["tamaño mascara", "dimensiones", "proporcion", "resolucion", "advertencia", "libro", "lienzo"],
      respuesta: "Para evitar distorsiones, usa las siguientes proporciones:\n• **Vertical (Libro)**: Proporción 210:297 (Ej. 2480x3508px).\n• **Horizontal (Lienzo)**: Proporción 297:210 (Ej. 3508x2480px).\n• **Cuadrado**: Proporción 1:1 (Ej. 2480x2480px).",
      sugerencias: ["📂 Cargar Máscaras"]
    },
    {
      id: "funciones_general",
      claves: ["funcion", "funciones", "panel izquierdo", "que hace cada boton", "botones izquierda", "lista de funciones"],
      respuesta: "El panel izquierdo de **FUNCIONES** controla el lienzo:\n• **Formato**: Cambia la orientación (Vertical/Horizontal/Cuadrado).\n• **Título/Subtítulo** y **Editar texto**: Administran textos del lienzo.\n• **Cargar interacciones**: Recupera datos del servidor.\n• **Color** y **Fondo B/N**: Cambian colores y fondos.\n• **Cargar máscara**: Aplica siluetas PNG.\n• **Vista 3D**: Activa la maqueta 3D interactiva.",
      sugerencias: ["⭐ Formato", "🌗 Fondo B / N", "📂 Cargar Máscaras", "💾 Guardar / Exportar"]
    },
    {
      id: "modos_general",
      claves: ["modo", "modos", "pintura", "estilo", "modos de arte", "estilos"],
      respuesta: "ECODIV cuenta con **9 modos de arte generativo** (panel derecho) que reaccionan a los datos de interacciones.",
      sugerencias: ["💧 Modos 1-3", "🔺 Modos 4-6", "🔠 Modos 7-9"]
    },
    {
      id: "mascara_general",
      claves: ["mascara", "mascaras", "silueta", "cargar mascara", "fondo transparente"],
      respuesta: "Las máscaras recortan el arte generativo. ECODIV Tool admite archivos **PNG transparentes** que se adaptan al lienzo. Puedes subirlas desde tu PC o cargarlas del almacenamiento del servidor.",
      sugerencias: ["📏 Tamaños de Máscara", "📂 Cargar Máscaras"]
    },
    {
      id: "guardar_png",
      claves: ["png", "guardar png", "descargar png", "imagen", "guardar", "descargar"],
      respuesta: "Para guardar tu composición como una imagen PNG:\n1. Activa la **'Vista 3D · Mockup'** (panel izquierdo).\n2. El botón **'🎨 Color'** cambiará y se convertirá en **'💾 .PNG'**. Púlsa el botón y tu archivo se descargará automáticamente.",
      sugerencias: ["💾 Guardar / Exportar", "🖨️ Exportar en PDF"]
    },
    {
      id: "guardar_pdf",
      claves: ["pdf", "guardar pdf", "descargar pdf", "imprimir"],
      respuesta: "Para exportar tu obra en formato PDF:\n1. Activa la **'Vista 3D · Mockup'** (panel izquierdo).\n2. El botón **'✏️ Editar texto'** cambiará y se convertirá en **'🖨️ .PDF'**. Púlsa el botón y tu documento A4 se descargará.",
      sugerencias: ["💾 Guardar / Exportar", "🖼️ Guardar en PNG"]
    },
    {
      id: "vista_3d",
      claves: ["3d", "vista 3d", "mockup", "libro 3d", "girar", "rotar"],
      respuesta: "La **'Vista 3D · Mockup'** crea una maqueta interactiva tridimensional de tu diseño (como la portada de un libro). Puedes hacer clic y arrastrar con el ratón para rotarla y verla desde diferentes ángulos.",
      sugerencias: ["💾 Guardar / Exportar", "📱 Volver a 2D"]
    },
    {
      id: "vista_2d",
      claves: ["2d", "vista 2d", "editar", "volver 2d", "modo edicion"],
      respuesta: "Para volver a editar tu diseño tras estar en la vista 3D, pulsa el botón **'📱 Vista 2D · Edicion'** que aparece en el panel izquierdo.",
      sugerencias: ["🎨 Modos de Arte"]
    },
    {
      id: "cargar_datos",
      claves: ["cargar datos", "cargar interacciones", "actualizar", "datos", "sheets", "interacciones"],
      respuesta: "El botón **'🔄 Cargar interacciones'** se conecta a la base de datos de ECODIV para recuperar los clicks de los usuarios. Cada click añade más pintura y energía al lienzo, creando una obra interactiva ¿No te parece geniaaaal?.",
      sugerencias: ["🎨 Modos de Arte"]
    },
    {
      id: "formato",
      claves: ["formato", "rotar", "orientacion", "vertical", "horizontal", "cuadrado", "lienzo"],
      respuesta: "El botón **'⭐ Formato'** cicla la orientación del lienzo entre **Vertical (Libro)**, **Horizontal (Lienzo)** y **Cuadrado**. El marco del arte se ajustará automáticamente.",
      sugerencias: ["💾 Guardar / Exportar"]
    },
    {
      id: "texto",
      claves: ["texto", "titulo", "subtitulo", "cambiar texto", "editar texto"],
      respuesta: "Puedes alternar el texto en el lienzo con el botón **'TT Titulo / Subtitulo'** y personalizar lo que dice usando el botón **'✏️ Editar texto'**.",
      sugerencias: ["💾 Guardar / Exportar"]
    },
    {
      id: "color_filtro",
      claves: ["color", "colores", "cmyk", "rgb", "escala de grises", "filtro"],
      respuesta: "El botón **'🎨 Color'** cicla los filtros cromáticos del lienzo: **RGB** (colores digitales), **CMYK** (tonos de impresión), **Grises** (escala de grises) y **B/N** (blanco y negro puro).",
      sugerencias: ["🎨 Modos de Arte"]
    },
    {
      id: "fondo",
      claves: ["fondo", "negro", "blanco", "fondo b/n", "cambiar fondo"],
      respuesta: "El botón **'🌗 Fondo B / N'** cambia el color de fondo del papel A4 entre blanco, negro o modo transparente/imagen.",
      sugerencias: ["🎨 Modos de Arte"]
    },
    {
      id: "usuarios",
      claves: ["usuarios", "numero de usuarios", "contador"],
      respuesta: "El botón **'👥 Nº Usuarios'** muestra u oculta la franja inferior donde se indica cuántos usuarios han interactuado con la obra.",
      sugerencias: ["🔄 Cargar interacciones"]
    },
    {
      id: "tutorial",
      claves: ["tutorial", "volver tutorial", "intro", "inicio", "jelly", "video"],
      respuesta: "¿Quieres volver a ver la introducción y el videotutorial de ECODIV? Pulsa el botón de sugerencia aquí abajo para ir a la pantalla inicial.",
      sugerencias: ["🏠 Volver al Tutorial"]
    }
  ]
};

// ==========================================================
// 2. MOTOR DEL CHATBOT Y CONTROL DE UI
// ==========================================================
let chatAbierto = false;
let jellyEscribiendo = false;

/**
 * Inicializa el chatbot insertando los elementos en el DOM si no existen.
 */
function inicializarChatJellyDOM() {
  if (document.getElementById('jelly-chat-widget')) return;

  // 1. Crear el contenedor del chat
  const chatWidget = document.createElement('div');
  chatWidget.id = 'jelly-chat-widget';
  chatWidget.className = 'jelly-chat-container';
  chatWidget.style.display = 'none';

  chatWidget.innerHTML = `
    <div class="jelly-chat-header">
      <div class="jelly-chat-header-left">
        <div class="jelly-chat-avatar" id="jelly-chat-avatar-container">
          <img id="jelly-chat-img" src="Jelly_boot.png" alt="Jelly">
        </div>
        <div class="jelly-chat-header-info">
          <h4>Jelly Guía</h4>
          <span id="jelly-status">En línea</span>
        </div>
      </div>
      <button class="jelly-chat-close" onclick="cerrarChatJelly()" aria-label="Cerrar chat">×</button>
    </div>
    <div id="jelly-chat-messages" class="jelly-chat-messages"></div>
    <div id="jelly-chat-suggestions" class="jelly-chat-suggestions"></div>
    <form id="jelly-chat-form" onsubmit="enviarMensajeUsuario(event)">
      <input type="text" id="jelly-chat-input" placeholder="Pregúntame sobre ECODIV..." autocomplete="off">
      <button type="submit" id="jelly-chat-send" aria-label="Enviar mensaje">
        <svg viewBox="0 0 24 24"><path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/></svg>
      </button>
    </form>
  `;

  document.body.appendChild(chatWidget);

  // Registrar el escuchador global de rueda de ratón en la fase de captura para adelantarnos a p5.js
  document.addEventListener('wheel', function (e) {
    const chatWidget = document.getElementById('jelly-chat-widget');
    if (!chatWidget || chatWidget.style.display === 'none') return;

    const msgContainer = document.getElementById('jelly-chat-messages');
    if (msgContainer) {
      const rect = msgContainer.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom) {
        let scrollAmount = e.deltaY;
        if (e.deltaMode === 1) { // Firefox line mode
          scrollAmount *= 20;
        } else if (e.deltaMode === 2) { // Page mode
          scrollAmount *= msgContainer.clientHeight;
        }
        msgContainer.scrollTop += scrollAmount;
        e.preventDefault();
        e.stopPropagation(); // Detener propagación
        return;
      }
    }

    const sugContainer = document.getElementById('jelly-chat-suggestions');
    if (sugContainer) {
      const rect = sugContainer.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom) {
        let scrollAmount = e.deltaY;
        if (e.deltaMode === 1) {
          scrollAmount *= 20;
        } else if (e.deltaMode === 2) {
          scrollAmount *= sugContainer.clientHeight;
        }
        sugContainer.scrollTop += scrollAmount;
        e.preventDefault();
        e.stopPropagation(); // Detener propagación
        return;
      }
    }
  }, { capture: true, passive: false });

  // Activar comportamiento de arrastrar y soltar
  hacerChatArrastrable();

  // Cargar saludo inicial al crear
  resetearChatAJelly();
}

/**
 * Abre o cierra el chat alternando su visibilidad.
 */
function abrirChatJelly() {
  inicializarChatJellyDOM();
  const chat = document.getElementById('jelly-chat-widget');
  if (!chat) return;

  if (chat.style.display === 'none') {
    chat.style.display = 'flex';
    chat.classList.add('chat-slide-in');
    chatAbierto = true;

    // Auto-enfocar input
    setTimeout(() => {
      document.getElementById('jelly-chat-input').focus();
    }, 300);
  } else {
    cerrarChatJelly();
  }
}

function cerrarChatJelly() {
  const chat = document.getElementById('jelly-chat-widget');
  if (!chat) return;
  chat.style.display = 'none';
  chatAbierto = false;
}

/**
 * Restablece los mensajes del chat y muestra el saludo inicial.
 */
function resetearChatAJelly() {
  const contenedor = document.getElementById('jelly-chat-messages');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  responderJelly(JELLY_BD.mensajes.saludo, JELLY_BD.sugerenciasInicio);
}

/**
 * Normaliza un texto eliminando acentos, puntuación y convirtiendo a minúsculas.
 */
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
    .replace(/[¿?¡!.,;:()]/g, "")    // Quitar puntuación
    .trim();
}

/**
 * Maneja el envío del formulario del usuario.
 */
function enviarMensajeUsuario(event) {
  if (event) event.preventDefault();

  const input = document.getElementById('jelly-chat-input');
  if (!input || jellyEscribiendo) return;

  const texto = input.value.trim();
  if (!texto) return;

  // Limpiar input
  input.value = '';

  // Mostrar mensaje del usuario en pantalla
  agregarMensajePantalla('usuario', texto);

  // Mostrar indicador de pensando
  mostrarPensando();

  setTimeout(() => {
    eliminarPensando();
    procesarPregunta(texto);
  }, 800 + Math.random() * 600); // Retraso natural
}

/**
 * Procesa la pregunta del usuario buscando coincidencias en la base de datos.
 */
function procesarPregunta(textoOriginal) {
  const textoLimpio = normalizarTexto(textoOriginal);

  // Buscar coincidencia en la base de datos de conocimiento
  const coincidencia = JELLY_BD.conocimiento.find(item =>
    item.claves.some(clave => textoLimpio.includes(clave))
  );

  if (coincidencia) {
    responderJelly(coincidencia.respuesta, coincidencia.sugerencias);
  } else {
    // Si no entiende, da fallback con las sugerencias generales
    responderJelly(JELLY_BD.mensajes.noEntendido, JELLY_BD.sugerenciasInicio);
  }
}

/**
 * Gestiona la pulsación de un botón de sugerencia.
 */
function seleccionarSugerencia(texto) {
  if (jellyEscribiendo) return;

  // Mostrar la acción en el chat como un mensaje del usuario
  agregarMensajePantalla('usuario', texto);
  mostrarPensando();

  setTimeout(() => {
    eliminarPensando();

    // Si es una acción especial del sistema
    if (texto === "🏠 Volver al Tutorial") {
      responderJelly("Redirigiendo al tutorial de introducción...", []);
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);
      return;
    }

    // Si no, procesarla como búsqueda
    procesarPregunta(texto);
  }, 600);
}

/**
 * Imprime un mensaje de Jelly simulando escritura en tiempo real.
 */
function responderJelly(texto, sugerencias) {
  jellyEscribiendo = true;
  const statusSpan = document.getElementById('jelly-status');
  const avatarContainer = document.getElementById('jelly-chat-avatar-container');

  if (statusSpan) statusSpan.textContent = "Escribiendo...";
  if (avatarContainer) avatarContainer.classList.add('hablando'); // Inicia animación gelatina

  // Crear contenedor del mensaje de Jelly
  const contenedorMensajes = document.getElementById('jelly-chat-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'mensaje jelly';

  // Icono miniatura de Jelly al lado del mensaje
  msgDiv.innerHTML = `
    <div class="msg-avatar">
      <img src="Jelly_boot.png" alt="J">
    </div>
    <div class="msg-texto"></div>
  `;

  contenedorMensajes.appendChild(msgDiv);
  const textoDiv = msgDiv.querySelector('.msg-texto');

  // Simular efecto de máquina de escribir carácter por carácter
  let i = 0;
  let textoRenderizado = "";

  // Reemplazar saltos de línea y Markdown básico a HTML antes de renderizar por partes
  const textoFormateado = formatearMensajeAHTML(texto);

  // Función recursiva para escribir
  function escribirCaracter() {
    if (i < texto.length) {
      // Si detectamos un formato especial de Markdown, lo aplicamos de golpe para no mostrar etiquetas crudas
      if (texto.substr(i, 2) === "**") {
        let finBold = texto.indexOf("**", i + 2);
        if (finBold !== -1) {
          textoRenderizado += `<strong>${texto.substring(i + 2, finBold)}</strong>`;
          i = finBold + 2;
        } else {
          textoRenderizado += texto[i];
          i++;
        }
      } else if (texto[i] === "\n") {
        textoRenderizado += "<br>";
        i++;
      } else {
        textoRenderizado += texto[i];
        i++;
      }

      textoDiv.innerHTML = textoRenderizado;
      contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
      setTimeout(escribirCaracter, 12 + Math.random() * 10);
    } else {
      // Fin del mensaje
      jellyEscribiendo = false;
      if (statusSpan) statusSpan.textContent = "En línea";
      if (avatarContainer) avatarContainer.classList.remove('hablando'); // Detiene animación

      // Mostrar los botones de sugerencias
      cargarSugerenciasUI(sugerencias);
    }
  }

  escribirCaracter();
}

/**
 * Formatea negritas y saltos de línea sencillos a HTML.
 */
function formatearMensajeAHTML(texto) {
  let html = texto;
  // Negritas **texto**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Saltos de línea
  html = html.replace(/\n/g, '<br>');
  return html;
}

/**
 * Añade un mensaje estático al contenedor de chat.
 */
function agregarMensajePantalla(remitente, texto) {
  const contenedor = document.getElementById('jelly-chat-messages');
  if (!contenedor) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `mensaje ${remitente}`;
  msgDiv.innerHTML = `
    <div class="msg-texto">${formatearMensajeAHTML(texto)}</div>
  `;

  contenedor.appendChild(msgDiv);
  contenedor.scrollTop = contenedor.scrollHeight;

  // Limpiar sugerencias antiguas cada vez que escribe el usuario
  cargarSugerenciasUI([]);
}

/**
 * Muestra burbujas de carga cuando Jelly está "pensando".
 */
function mostrarPensando() {
  const contenedor = document.getElementById('jelly-chat-messages');
  if (!contenedor) return;

  const pensandoDiv = document.createElement('div');
  pensandoDiv.id = 'jelly-pensando';
  pensandoDiv.className = 'mensaje jelly pensando';
  pensandoDiv.innerHTML = `
    <div class="msg-avatar">
      <img src="Jelly_boot.png" alt="J">
    </div>
    <div class="msg-texto">
      <span class="punto">.</span><span class="punto">.</span><span class="punto">.</span>
    </div>
  `;

  contenedor.appendChild(pensandoDiv);
  contenedor.scrollTop = contenedor.scrollHeight;
}

function eliminarPensando() {
  const el = document.getElementById('jelly-pensando');
  if (el) el.remove();
}

/**
 * Carga los botones de sugerencias en la barra inferior del chat.
 */
function cargarSugerenciasUI(sugerencias) {
  const divSugerencias = document.getElementById('jelly-chat-suggestions');
  if (!divSugerencias) return;

  divSugerencias.innerHTML = '';

  if (!sugerencias || sugerencias.length === 0) {
    divSugerencias.style.display = 'none';
    return;
  }

  divSugerencias.style.display = 'flex';
  sugerencias.forEach(sug => {
    const btn = document.createElement('button');
    btn.className = 'btn-sugerencia';
    btn.textContent = sug;
    btn.onclick = () => seleccionarSugerencia(sug);
    divSugerencias.appendChild(btn);
  });
}

/**
 * Hace que la ventana del chat sea arrastrable usando su cabecera.
 */
function hacerChatArrastrable() {
  const chat = document.getElementById('jelly-chat-widget');
  if (!chat) return;

  const cabecera = chat.querySelector('.jelly-chat-header');
  if (!cabecera) return;

  let startX = 0, startY = 0;
  let startLeft = 0, startTop = 0;

  cabecera.style.cursor = 'move';

  cabecera.addEventListener('mousedown', arrastrarMouseDown);
  cabecera.addEventListener('touchstart', arrastrarTouchStart, { passive: false });

  function arrastrarMouseDown(e) {
    // Evitar arrastre si hace clic en cerrar
    if (e.target.classList.contains('jelly-chat-close')) return;
    // Evitar arrastre en inputs, botones o iconos svg
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'SVG' || e.target.tagName === 'path') return;

    e.preventDefault();

    startX = e.clientX;
    startY = e.clientY;

    const rect = chat.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;

    document.addEventListener('mousemove', elementoArrastre);
    document.addEventListener('mouseup', cerrarArrastreElemento);
  }

  function elementoArrastre(e) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    chat.style.top = (startTop + dy) + "px";
    chat.style.left = (startLeft + dx) + "px";
    chat.style.bottom = 'auto';
    chat.style.right = 'auto';
  }

  function cerrarArrastreElemento() {
    document.removeEventListener('mousemove', elementoArrastre);
    document.removeEventListener('mouseup', cerrarArrastreElemento);
  }

  // Soporte táctil para dispositivos móviles/tablets
  function arrastrarTouchStart(e) {
    if (e.target.classList.contains('jelly-chat-close')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

    const rect = chat.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;

    document.addEventListener('touchmove', elementoArrastreTouch, { passive: false });
    document.addEventListener('touchend', cerrarArrastreTouch);
  }

  function elementoArrastreTouch(e) {
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;

    chat.style.top = (startTop + dy) + "px";
    chat.style.left = (startLeft + dx) + "px";
    chat.style.bottom = 'auto';
    chat.style.right = 'auto';
  }

  function cerrarArrastreTouch() {
    document.removeEventListener('touchmove', elementoArrastreTouch);
    document.removeEventListener('touchend', cerrarArrastreTouch);
  }
}
