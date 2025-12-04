#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# ai_backend.py — Section Connection AI Tutor
# (c) Shane Phillips, 2025

import sys
import os
import json
from openai import OpenAI

# Write startup info to stderr for Node.js to log (don't interfere with stdout response)
print("[ai_backend.py] Starting...", file=sys.stderr)

# Load API key from environment variable. It's unsafe to hardcode API keys in
# source control; set OPENAI_API_KEY in the environment before running.
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    print("[ai_backend.py] Error: OPENAI_API_KEY environment variable is not set.", file=sys.stderr)
    print("Error: OPENAI_API_KEY environment variable is not set.")
    sys.exit(1)

print("[ai_backend.py] API key loaded successfully", file=sys.stderr)
client = OpenAI(api_key=OPENAI_API_KEY)

# Read user message from command-line arguments or stdin JSON
user_message = None
if len(sys.argv) >= 2:
    user_message = " ".join(sys.argv[1:]).strip()
    print(f"[ai_backend.py] Got message from argv: {len(user_message)} chars", file=sys.stderr)
else:
    # Attempt to read JSON from stdin (our Node server sends a JSON payload)
    print("[ai_backend.py] No argv, trying stdin...", file=sys.stderr)
    try:
        stdin_text = sys.stdin.read()
        print(f"[ai_backend.py] Read {len(stdin_text)} bytes from stdin", file=sys.stderr)
        if stdin_text:
            try:
                payload = json.loads(stdin_text)
                if isinstance(payload, dict) and "message" in payload:
                    user_message = str(payload.get("message", "")).strip()
                    print(f"[ai_backend.py] Parsed JSON, got message: {len(user_message)} chars", file=sys.stderr)
            except Exception as e:
                print(f"[ai_backend.py] JSON parse failed: {e}, using raw stdin", file=sys.stderr)
                # fallback: use raw stdin as message
                user_message = stdin_text.strip()
    except Exception as e:
        print(f"[ai_backend.py] Failed to read stdin: {e}", file=sys.stderr)
        user_message = None

if not user_message:
    print("[ai_backend.py] No input received.", file=sys.stderr)
    print("No input received.")
    sys.exit(0)

print(f"[ai_backend.py] Proceeding with message: {user_message[:50]}...", file=sys.stderr)

# Make the API call
try:
    print("[ai_backend.py] Making OpenAI API call...", file=sys.stderr)
    sys.stderr.flush()
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful and friendly AI tutor for the student collaboration "
                    "platform 'Section Connection.' Your role is to explain concepts clearly, "
                    "guide students step-by-step, and help them understand rather than simply "
                    "giving direct answers.\n\n"
                    "Rules:\n"
                    "- Provide helpful explanations at a college level.\n"
                    "- Break down complex topics into simple steps.\n"
                    "- Encourage understanding, not copying.\n"
                    "- If the question seems like graded homework, give guidance without providing full solutions.\n"
                    "- Always be supportive, positive, and educational.\n"
                    "- Keep responses concise unless the student asks for more detail.\n\n"
                    "Context: Section Connection was created at Towson University in 2025 "
                    "to help students collaborate across course sections."
                )
            },
            {"role": "user", "content": user_message}
        ]
    )

    answer = response.choices[0].message.content.strip()
    print(f"[ai_backend.py] Got response from OpenAI ({len(answer)} chars), returning to stdout", file=sys.stderr)
    sys.stderr.flush()
    
    # Write answer to stdout (this is what Node.js captures)
    print(answer)
    sys.stdout.flush()

except Exception as e:
    print(f"[ai_backend.py] OpenAI API error: {e}", file=sys.stderr)
    sys.stderr.flush()
    print(f"Error: {e}")
    sys.stdout.flush()
    sys.exit(1)
