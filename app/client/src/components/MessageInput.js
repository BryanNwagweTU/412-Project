// src/components/MessageInput.js
import React, { useState } from 'react';
import './MessageInput.css';

function MessageInput({ addMessage }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() !== '') {
      addMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter (only if Shift is not pressed)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Add newline on Shift+Enter
    else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      setText(text + '\n');
    }
    // Add tab on Tab key
    else if (e.key === 'Tab') {
      e.preventDefault();
      setText(text + '\t');
    }
  };

  return (
    <div className="message-input">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message... (Shift+Enter for newline, Tab for indent)"
        rows="3"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default MessageInput;
