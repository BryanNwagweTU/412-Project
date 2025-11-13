// src/components/MessageList.js
import React from 'react';
import MessageItem from './MessageItem';
import './MessageList.css';

function MessageList({ messages }) {
  return (
    <div className="message-list">
      {messages.map(msg => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>
  );
}

export default MessageList;
