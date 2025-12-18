const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");

async function enviar() {
  const mensaje = chatInput.value.trim();
  if (!mensaje) return;

  const userDiv = document.createElement("div");
  userDiv.className = "user-msg";
  userDiv.textContent = mensaje;
  chatMessages.appendChild(userDiv);

  chatInput.value = "";
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const botDiv = document.createElement("div");
  botDiv.className = "bot-msg";
  botDiv.textContent = "Escribiendo...";
  chatMessages.appendChild(botDiv);

  try {
    const r = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: mensaje })
    });

    const data = await r.json();
    botDiv.textContent = data.reply;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (error) {
    botDiv.textContent = "Error de conexión.";
  }
}
