// src/components/MessageInput.js
import React, { useState } from 'react';
import './MessageInput.css';

function MessageInput({ addMessage }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() !== '') {
      addMessage('You', text); // 'You' as placeholder username
      setText(''); // clear input
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend(); // send on Enter
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default MessageInput;
