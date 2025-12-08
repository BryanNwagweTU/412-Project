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
  const [reloadKey, setReloadKey] = useState(0);

  // Apply dark-mode class to body element
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);
  


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
      <MessageList course={selectedCourse} reloadKey={reloadKey} />
      <MessageInput
        course={selectedCourse}
        username={username}
        onNewMessage={() => setReloadKey(prev => prev + 1)}
      />
    </div>
  );
}

export default App;
