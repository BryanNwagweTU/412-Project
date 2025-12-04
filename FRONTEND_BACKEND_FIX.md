# Frontend-Backend Communication Fix - Summary

## Problem Identified
Your React frontend was not communicating with the Python AI backend due to several issues:

1. **Port Conflict**: Port 5000 was already in use by Apple's AirTunes (Bonjour) service
2. **API Key Not Set**: The OPENAI_API_KEY environment variable wasn't being passed to the Node process
3. **Fragile Python Spawning**: Command-line argument passing had quoting/escaping issues
4. **Error Response Handling**: stderr debug output was being returned as error responses

## Solutions Implemented

### 1. Changed Backend Port (5000 → 3001)
- Updated `backend/server.js` to listen on port 3001
- Updated `app/client/src/components/AITutor.js` to fetch from port 3001

### 2. Robust Python Path Detection
- `backend/server.js` now:
  - Tries `PYTHON` or `PYTHON3` environment variables first
  - Falls back to `which python3` command
  - Has fallback paths for common installations
  - Exits gracefully if Python can't be found

### 3. Safe Message Passing via stdin
- Instead of passing the user message as a command-line argument (which breaks with quotes/newlines), the server now:
  - Sends JSON over stdin to the Python process
  - Python script reads from stdin with proper JSON parsing
  - Avoids all shell escaping issues

### 4. Automatic .env Loading
- Created `backend/.env` with your OpenAI API key
- Updated `backend/server.js` to automatically load .env file
- No need to manually export the key before starting the server

### 5. Enhanced Logging & Error Handling
- Added detailed logging to trace request flow
- stderr logs don't interfere with stdout response
- Only non-zero exit codes with stderr are treated as errors
- Clear error messages if something fails

## Files Changed

1. **backend/server.js**
   - Added .env file loading
   - Python path detection with fallbacks
   - stdin-based message passing
   - Proper stdout/stderr handling
   - Added `/api/health` endpoint for testing

2. **backend/ai_backend.py**
   - Reads message from stdin JSON or command-line args
   - Loads OPENAI_API_KEY from environment
   - Debug logging to stderr (doesn't interfere with response)
   - Proper stdout flushing

3. **app/client/src/components/AITutor.js**
   - Updated fetch URL from `localhost:5000` to `localhost:3001`

4. **backend/.env** (NEW)
   - Contains your OPENAI_API_KEY

5. **backend/.env.example** (NEW)
   - Template for .env configuration

6. **backend/.gitignore** (NEW)
   - Prevents .env from being committed to git

## How to Run

### Terminal 1: Start the Backend
```bash
cd /Users/shane/Downloads/412-Project-main/backend
/usr/local/bin/node server.js
# Should print: "[STARTUP] Node server running at http://localhost:3001"
```

### Terminal 2: Start the Frontend
```bash
cd /Users/shane/Downloads/412-Project-main/app/client
npm start
# Open http://localhost:3000 and test the AI Tutor component
```

## Testing

### Quick health check:
```bash
curl http://localhost:3001/api/health
# Returns: {"status":"ok","timestamp":"..."}
```

### Test the AI endpoint:
```bash
curl -X POST http://localhost:3001/api/ask \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, can you help with Python?"}'
```

## Important Security Note

⚠️ **Your OpenAI API key is currently in .env file which may be in git history!**

You should:
1. Regenerate your OpenAI API key (the one in the files should be considered compromised)
2. Add `.env` to `.gitignore` (already done)
3. Keep `.env.example` in your repo as a template

## What's Now Working

✅ Frontend can communicate with backend
✅ Backend spawns Python process reliably
✅ Python script gets user messages correctly
✅ OpenAI API responses are properly captured
✅ Error handling and logging work correctly
✅ Environment variables auto-load from .env file

## Troubleshooting

If you still see issues:

1. **"Port 3001 is already in use"**
   ```bash
   lsof -i :3001  # Find what's using the port
   kill -9 <PID>  # Kill the process
   ```

2. **"OPENAI_API_KEY not set"**
   - Check that `.env` file exists in backend directory
   - Verify it contains a valid API key
   - Restart the server

3. **"No response from AI"**
   - Check the server logs for error messages
   - Verify the Python script can be executed: `/opt/anaconda3/bin/python3 --version`
   - Check that openai Python package is installed: `python3 -m pip list | grep openai`

