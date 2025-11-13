#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# ai_backend.py — COSC412 AI Prototype
# (c) Shane Phillips, 2025

import cgi
import cgitb
import json
import os
from openai import OpenAI

#enables error display for CGI debugging
cgitb.enable()

#required CGI header
print("Content-Type: application/json\n")

# load openAI API key from enviroment variable
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    print(json.dumps({"response": "Error: Missing OpenAI API key."}))
    exit()

client = OpenAI(api_key=OPENAI_API_KEY)

#read form field
form = cgi.FieldStorage()
user_message = form.getvalue("message", "")

if not user_message.strip():
    print(json.dumps({"response": "No input received."}))
    exit()

#nake the API call
try:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful and friendly AI tutor for the student collaboration "
                    "platform 'Section Connection.' Your role is to explain concepts clearly, "
                    "guide students step-by-step, and help them understand rather than simply "
                    "giving direct answers."
                    "Rules:"
                    "- Provide helpful explanations at a college level."
                    "- Break down complex topics into simple steps."
                    "- Encourage understanding, not copying."
                    "- If the question seems like graded homework, give guidance without providing full solutions."
                    "- Always be supportive, positive, and educational."
                    "- Keep responses concise unless the student asks for more detail."
                    "Context: Section Connection was created at Towson University in 2025 to help students collaborate across course sections."
                )
            }, #hidden to user, ai behavior
            {"role": "user", "content": user_message}   #user typed prompt/msg
        ]
    )

    answer = response.choices[0].message.content.strip() #API returns JSON like object
    print(json.dumps({"response": answer})) #send response back to frontend

except Exception as e:
    print(json.dumps({"response": f"Error: {e}"}))


#Runs on Apache
#Receives data from your web page
#Sends that data to the OpenAI API
# Gets the AI’s response
# Sends that response back to the browser