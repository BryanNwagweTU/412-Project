const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

// Route: /api/ask
app.post("/api/ask", (req, res) => {
  const userMessage = req.body.message;

  const py = spawn("python3", ["ai_backend.py", userMessage], {
    cwd: __dirname
  });

  let result = "";
  py.stdout.on("data", (data) => {
    result += data.toString();
  });

  py.stderr.on("data", (data) => {
    console.error("PYTHON ERROR:", data.toString());
  });

  py.on("close", () => {
    res.json({ response: result });
  });
});

app.listen(5000, () => {
  console.log("Node server running at http://localhost:5000");
});
