import React, { useState } from "react";

export default function AITutor() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);

  const sendToAI = async () => {
    if (!input.trim()) return;

    // Add user's message to history
    setHistory((prev) => [...prev, { role: "user", content: input }]);

    try {
      const res = await fetch("http://localhost:3001/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);

    } catch (err) {
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to AI." },
      ]);
    }

    setInput("");
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1>AI Python Tutor</h1>

      <div
        style={{
          background: "#f5f5f5",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          borderRadius: "8px",
          marginBottom: "15px",
        }}
      >
        {history.map((msg, i) => (
          <div key={i} style={{ margin: "8px 0" }}>
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
        style={{ width: "100%", height: "80px" }}
      />

      <button onClick={sendToAI} style={{ marginTop: "10px" }}>
        Ask AI
      </button>
    </div>
  );
}
