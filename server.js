// ===== BOT CHAT REAL CON HUGGING FACE (MEJORADO) =====
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");

async function enviar() {
  const mensaje = chatInput.value.trim();
  if (!mensaje) return;

  // Mostrar mensaje del usuario
  const userDiv = document.createElement("div");
  userDiv.classList.add("user-msg");
  userDiv.textContent = mensaje;
  chatMessages.appendChild(userDiv);

  chatInput.value = "";
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Mostrar mensaje de "Escribiendo..."
  const botDiv = document.createElement("div");
  botDiv.classList.add("bot-msg");
  botDiv.textContent = "Escribiendo...";
  chatMessages.appendChild(botDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const r = await fetch("https://TU_DOMINIO_BACKEND/chat", { // Cambia TU_DOMINIO_BACKEND
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: mensaje })
    });

    const data = await r.json();

    // Simular typing (animación de escritura)
    let reply = data.reply;
    botDiv.textContent = "";
    let i = 0;
    const typing = setInterval(() => {
      if (i < reply.length) {
        botDiv.textContent += reply[i];
        i++;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      } else {
        clearInterval(typing);
      }
    }, 20); // velocidad de escritura (ms por carácter)
  } catch (error) {
    console.error(error);
    botDiv.textContent = "Error de conexión con el servidor.";
  }
}

// Mostrar/ocultar ventana del chatbot
function toggleChat() {
  const chat = document.getElementById("chatbot");
  chat.style.display = chat.style.display === "block" ? "none" : "block";
}