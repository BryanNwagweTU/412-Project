// src/components/MessageItem.js
import React from 'react';
import './MessageItem.css';

function MessageItem({ message }) {
  // Split message text into lines and format them with proper whitespace
  const formatMessage = (text) => {
    return text.split('\n').map((line, idx) => (
      <div key={idx} style={{ whiteSpace: 'pre-wrap' }}>
        {line}
      </div>
    ));
  };

  return (
    <div className="message-item">
      <strong>{message.user}</strong>	{formatMessage(message.text)}
      <span className="timestamp">{message.timestamp}</span>
    </div>
  );
}

export default MessageItem;
