// src/App.js
import React, { useState } from 'react';
import './App.css';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';

function App() {
  // State: current messages
  const [messages, setMessages] = useState([
    { id: 1, user: 'Alice', text: 'Hello!', timestamp: '10:00 AM' },
    { id: 2, user: 'Bob', text: 'Hi!', timestamp: '10:01 AM' }
  ]);

  // Function to add a new message
  const addMessage = (user, text) => {
    const newMessage = {
      id: messages.length + 1,
      user,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]); // update state
  };

  return (
    <div className="App">
      <h1>Class Chat</h1>
      <MessageList messages={messages} />
      <MessageInput addMessage={addMessage} />
    </div>
  );
}

export default App;
