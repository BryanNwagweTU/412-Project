// src/components/MessageInput.js
import React, { useState } from 'react';
import { postMessage } from '../api';
import './MessageInput.css';

function MessageInput({ course, onNewMessage, username }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false); // optional: disable button while sending
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (text.trim() === '') return;

    setLoading(true);
    setError('');
    try {
      // Call API to post message
      const newMsg = await postMessage({
        user_name: username, // username passed from parent
        text,
        course,
      });

      // Inform parent to update message list
      onNewMessage(newMsg);

      // Clear textarea
      setText('');
    } catch (err) {
      console.error(err);
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      setText(text + '\n');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setText(text + '\t');
    }
  };

  return (
    <div className="message-input">
      {error && <div className="error">{error}</div>}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message... (Shift+Enter for newline, Tab for indent)"
        rows="3"
        disabled={loading}
      />
      <button onClick={handleSend} disabled={loading || text.trim() === ''}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}

export default MessageInput;
