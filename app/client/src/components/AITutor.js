import React, { useState } from "react";

export default function AITutor() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);

  // Function to parse **bold** text and ### titles
  const parseMessage = (text) => {
    // Split by lines to handle titles
    const lines = text.split("\n");
    return (
      <>
        {lines.map((line, lineIdx) => {
          // Check if line is a title (starts with ###)
          if (line.startsWith("###")) {
            const titleText = line.replace(/^###\s*/, "").trim();
            return (
              <div
                key={lineIdx}
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#4a5fc1",
                  textDecoration: "underline",
                  marginTop: lineIdx > 0 ? "12px" : "0",
                  marginBottom: "8px",
                }}
              >
                {titleText}
              </div>
            );
          }

          // Parse **bold** within regular text
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
            <div key={lineIdx} style={{ margin: "4px 0" }}>
              {parts.map((part, i) => {
                if (part.match(/\*\*.*?\*\*/)) {
                  const boldText = part.replace(/\*\*/g, "");
                  return (
                    <span key={i} style={{ color: "#7289da", fontWeight: "600" }}>
                      {boldText}
                    </span>
                  );
                }
                return <span key={i}>{part}</span>;
              })}
            </div>
          );
        })}
      </>
    );
  };

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
      <h1>Section Connection AI</h1>

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
          <div 
            key={i} 
            style={{ 
              margin: "8px 0",
              padding: "8px 12px",
              borderRadius: "4px",
              backgroundColor: msg.role === "user" ? "#e8e8e8" : "transparent"
            }}
          >
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.role === "assistant" ? parseMessage(msg.content) : msg.content}
          </div>
        ))}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendToAI();
          }
        }}
        placeholder="Ask something..."
        style={{ width: "100%", height: "80px" }}
      />

      <div style={{ display: "flex", gap: "10px", marginTop: "10px", alignItems: "center" }}>
        <button 
          onClick={sendToAI} 
          style={{ 
            flex: 1,
            padding: "12px 18px",
            fontSize: "15px",
            fontWeight: "600",
            background: "#7289da",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(114, 137, 218, 0.2)"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#8298e8";
            e.target.style.boxShadow = "0 4px 12px rgba(114, 137, 218, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#7289da";
            e.target.style.boxShadow = "0 2px 8px rgba(114, 137, 218, 0.2)";
          }}
        >
          Ask AI
        </button>
        <button
          style={{
            padding: "12px 14px",
            fontSize: "18px",
            background: "#f0f0f0",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#e8e8e8";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#f0f0f0";
          }}
          title="Upload file"
        >
          📎
        </button>
      </div>
    </div>
  );
}
