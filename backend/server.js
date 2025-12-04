const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Load .env file if it exists
try {
  const envPath = path.join(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const match = line.match(/^\s*([^\s=]+)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1];
        const value = match[2].trim().replace(/^["']|["']$/g, "");
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  // .env file not found or couldn't be read, that's ok
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Determine python executable with sensible fallbacks. Prefer environment variable
// but fall back to `which python3` or common locations. This avoids hardcoding
// a single absolute path that might not exist on other machines.
const { execSync } = require("child_process");

let PYTHON = process.env.PYTHON || process.env.PYTHON3 || "";
if (!PYTHON) {
  try {
    PYTHON = execSync("which python3").toString().trim();
  } catch (e) {
    // fallback list
    const fallbacks = ["/usr/bin/python3", "/usr/local/bin/python3", "/opt/anaconda3/bin/python3"];
    for (const p of fallbacks) {
      try {
        execSync(`${p} --version`);
        PYTHON = p;
        break;
      } catch (err) {
        // continue
      }
    }
  }
}

if (!PYTHON) {
  console.error("No python3 executable found. Set the PYTHON environment variable to point to python3.");
  process.exit(1);
}

const PYTHON_PATH = path.join(__dirname, "ai_backend.py");

console.log(`[STARTUP] Python executable: ${PYTHON}`);
console.log(`[STARTUP] Python script path: ${PYTHON_PATH}`);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/ask", (req, res) => {
  console.log("[POST /api/ask] Received request:", JSON.stringify(req.body));

  const userMessage = req.body.message;

  if (!userMessage) {
    console.log("[POST /api/ask] Error: No message in request body");
    return res.json({ response: "Error: No message received." });
  }

  console.log(`[POST /api/ask] Spawning Python with message length ${userMessage.length}...`);

  // Spawn python and send the message via stdin as JSON. This avoids shell
  // quoting issues when messages contain spaces, quotes, or special chars.
  const py = spawn(PYTHON, [PYTHON_PATH], { stdio: ["pipe", "pipe", "pipe"] });

  let output = "";
  let errorOutput = "";
  let pythonStarted = false;

  py.on("spawn", () => {
    pythonStarted = true;
    console.log(`[POST /api/ask] Python process spawned (PID ${py.pid})`);
  });

  py.stdout.on("data", (data) => {
    const chunk = data.toString();
    console.log(`[POST /api/ask] Python stdout: ${chunk}`);
    output += chunk;
  });

  py.stderr.on("data", (data) => {
    const chunk = data.toString();
    errorOutput += chunk;
    console.error(`[POST /api/ask] Python stderr: ${chunk}`);
  });

  // Write a small JSON payload to python stdin and close it.
  try {
    const payload = JSON.stringify({ message: userMessage });
    console.log(`[POST /api/ask] Writing to Python stdin: ${payload.substring(0, 100)}...`);
    py.stdin.write(payload);
    py.stdin.end();
  } catch (err) {
    console.error("[POST /api/ask] Failed to write to python stdin:", err);
  }

  // Set a timeout in case Python hangs
  const timeout = setTimeout(() => {
    console.error("[POST /api/ask] Timeout: Python process did not respond within 30s, killing...");
    py.kill();
    if (!res.headersSent) {
      res.json({ response: "Error: Python process timeout." });
    }
  }, 30000);

  py.on("close", (code) => {
    clearTimeout(timeout);
    console.log(`[POST /api/ask] Python process exited with code ${code}`);
    console.log(`[POST /api/ask] Output length: ${output.length}, Error length: ${errorOutput.length}`);

    if (!pythonStarted) {
      console.error("[POST /api/ask] Error: Python process failed to spawn");
      return res.json({ response: "Error: Failed to spawn Python process." });
    }

    // Only treat it as an error if the exit code was non-zero AND there's stderr output
    // (stderr is used for debug logging, so we don't return it as the response)
    if (code !== 0 && errorOutput) {
      console.log("[POST /api/ask] Returning error response (non-zero exit code)");
      return res.json({ response: errorOutput });
    }

    // Return stdout as the main response (this is the AI answer)
    const trimmedOutput = output.trim();
    if (!trimmedOutput) {
      console.error("[POST /api/ask] Error: No output from Python script");
      // Include stderr in error case to help debug
      const debugInfo = errorOutput ? `\n\nDebug info:\n${errorOutput}` : "";
      return res.json({ response: `Error: No response from AI${debugInfo}` });
    }

    console.log(`[POST /api/ask] Returning success response (${trimmedOutput.length} chars)`);
    return res.json({ response: trimmedOutput });
  });

  py.on("error", (err) => {
    clearTimeout(timeout);
    console.error("[POST /api/ask] Python spawn error:", err);
    if (!res.headersSent) {
      res.json({ response: `Error: ${err.message}` });
    }
  });
});

app.listen(3001, () => {
  console.log("[STARTUP] Node server running at http://localhost:3001");
  console.log("[STARTUP] Test health endpoint: curl http://localhost:3001/api/health");
});
