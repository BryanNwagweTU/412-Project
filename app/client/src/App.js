// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';

const COURSES = [
  'Computer Science 2',
  'Databases and Algorithms',
  'Software Engineering',
  'Operating Systems'
];

function App() {
  // State: authentication and user
  const [username, setUsername] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark-mode class to body element
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // State: messages organized by course
  const [messagesByCourse, setMessagesByCourse] = useState({
    'Computer Science 2': [
      { id: 1, user: 'Alice', text: 'Anyone understand pointers?', timestamp: '10:00 AM' },
      { id: 2, user: 'Bob', text: 'Yeah, they can be tricky!', timestamp: '10:01 AM' }
    ],
    'Databases and Algorithms': [
      { id: 1, user: 'Charlie', text: 'Dynamic programming is confusing', timestamp: '2:30 PM' },
      { id: 2, user: 'Diana', text: 'Break it down step by step', timestamp: '2:31 PM' }
    ],
    'Software Engineering': [],
    'Operating Systems': []
  });

  // Function to add a new message to current course
  const addMessage = (text) => {
    if (!selectedCourse) return;

    const newMessage = {
      id: (messagesByCourse[selectedCourse]?.length || 0) + 1,
      user: username,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessagesByCourse(prev => ({
      ...prev,
      [selectedCourse]: [...(prev[selectedCourse] || []), newMessage]
    }));
  };

  // Handle username submission
  const handleUsernameSubmit = () => {
    if (username.trim()) {
      setIsNameSet(true);
    }
  };

  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  // Handle going back to course selection
  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  // Screen 1: Name prompt
  if (!isNameSet) {
    return (
      <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <h1>Welcome to Section Connection</h1>
        <div className="name-input-container">
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUsernameSubmit()}
          />
          <button onClick={handleUsernameSubmit}>Continue</button>
        </div>
      </div>
    );
  }

  // Screen 2: Course selection
  if (!selectedCourse) {
    return (
      <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <h1>Welcome, {username}!<br></br>Towson University</h1>
        <h2>Select a course</h2>
        <div className="course-selection">
          {COURSES.map((course) => (
            <button
              key={course}
              className="course-button"
              onClick={() => handleCourseSelect(course)}
            >
              {course}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Screen 3: Chatroom
  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      <div className="chatroom-header">
        <h1>{selectedCourse}</h1>
        <p>Logged in as: <strong>{username}</strong></p>
        <button className="back-button" onClick={handleBackToCourses}>← Back to Courses</button>
      </div>
      <MessageList messages={messagesByCourse[selectedCourse] || []} />
      <MessageInput addMessage={addMessage} />
    </div>
  );
}

export default App;
