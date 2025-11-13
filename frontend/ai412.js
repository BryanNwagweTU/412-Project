console.log("JS FILE LOADED");

//store session messages in an array so it looks chatboxy
let history = [];

document.getElementById("sendBtn").addEventListener("click", async () => {
  const input = document.getElementById("userInput").value.trim();
  const responseDiv = document.getElementById("response");
  const historyDiv = document.getElementById("history");

  if (!input) return; //ignore empty input..

  responseDiv.innerHTML = "Tutoring...";

  try {
    //add user message to history immediately
    history.push({ role: "user", content: input });
    renderHistory(history, historyDiv);

    //prepare form data
    const formData = new FormData();
    formData.append("message", input);

    //send to backend
    const res = await fetch("/cgi-bin/ai_backend.py", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    const aiResponse = data.response;

    //add AI message to history
    history.push({ role: "ai", content: aiResponse });
    renderHistory(history, historyDiv);

    responseDiv.innerHTML = ""; // clear "Tutoring..."
    document.getElementById("userInput").value = ""; // clear input

  } catch (error) {
    responseDiv.innerHTML = "Error connecting to AI backend.";
  }
});

//helper to display history, updates the chat bubbles everytime a new msg is added.
//keeps chat windows showing full convo
function renderHistory(history, container) {
  container.innerHTML = ""; // reset

  history.forEach((msg) => {
    const bubble = document.createElement("div");
    bubble.className = msg.role === "user" ? "user-msg" : "ai-msg";

    bubble.textContent = `${msg.role.toUpperCase()}: ${msg.content}`;
    container.appendChild(bubble);
  });
}
