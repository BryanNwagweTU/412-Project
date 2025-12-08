// src/components/MessageList.js
import React, { useState, useEffect } from 'react';
import MessageItem from './MessageItem';
import { fetchMessages } from '../api';
import './MessageList.css';

function MessageList({ course, reloadKey }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function loadMessages() {
      try {
        const data = await fetchMessages(course);
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadMessages();
  }, [course, reloadKey]);

  return (
    <ul>
      {messages.map(msg => (
        <li key={msg.id}>
          <strong>{msg.user_name}:</strong> {msg.text}
        </li>
      ))}
    </ul>
  );
}

export default MessageList;
