// src/components/MessageItem.js
import React from 'react';
import './MessageItem.css';

function MessageItem({ message }) {
  return (
    <div className="message-item">
      <strong>{message.user}</strong>: {message.text}
      <span className="timestamp">{message.timestamp}</span>
    </div>
  );
}

export default MessageItem;
