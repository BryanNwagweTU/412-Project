// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import AITutorModal from './components/AITutor';

const COURSES = [
  'Computer Science 2',
  'Databases and Algorithms',
  'Software Engineering',
  'Operating Systems'
];

const COURSES = [
  'Computer Science 2',
  'Databases and Algorithms',
  'Software Engineering',
  'Operating Systems'
];

const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  // State: authentication and user
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [isNameSet, setIsNameSet] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

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
    'Computer Science 2': [],
    'Databases and Algorithms': [],
    'Software Engineering': [],
    'Operating Systems': []
  });

  // Fetch messages for a specific course from database
  const fetchMessagesForCourse = async (course) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/messages?course=${encodeURIComponent(course)}&limit=100`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const messages = await response.json();
      
      // Transform database messages to match our format
      const transformedMessages = messages.map(msg => ({
        id: msg.id,
        user: msg.username,
        text: msg.message_text,
        timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      
      setMessagesByCourse(prev => ({
        ...prev,
        [course]: transformedMessages
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new message to current course and save to database
  const addMessage = async (text) => {
    if (!selectedCourse || !userId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          message_text: text,
          course_name: selectedCourse
        })
      });

      if (!response.ok) throw new Error('Failed to save message');

      const savedMessage = await response.json();
      
      const newMessage = {
        id: savedMessage.id,
        user: savedMessage.username,
        text: savedMessage.message_text,
        timestamp: new Date(savedMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessagesByCourse(prev => ({
        ...prev,
        [selectedCourse]: [...(prev[selectedCourse] || []), newMessage]
      }));
    } catch (error) {
      console.error('Error adding message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // Handle username submission - create or retrieve user in database
  const handleUsernameSubmit = async () => {
    if (!username.trim()) return;

    try {
      setLoading(true);
      // Try to create a new user
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() })
      });

      if (response.ok) {
        const user = await response.json();
        setUserId(user.id);
        setIsNameSet(true);
      } else if (response.status === 409) {
        // Username already exists, fetch the user
        const usersResponse = await fetch(`${API_BASE_URL}/users`);
        const users = await usersResponse.json();
        const existingUser = users.find(u => u.username === username.trim());
        if (existingUser) {
          setUserId(existingUser.id);
          setIsNameSet(true);
        }
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      console.error('Error with user submission:', error);
      alert('Failed to join. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle course selection and fetch messages
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    fetchMessagesForCourse(course);
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
            disabled={loading}
          />
          <button onClick={handleUsernameSubmit} disabled={loading}>
            {loading ? 'Joining...' : 'Continue'}
          </button>
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
      {loading ? <div style={{ padding: '20px', textAlign: 'center' }}>Loading messages...</div> : <MessageList messages={messagesByCourse[selectedCourse] || []} />}
      <MessageInput addMessage={addMessage} disabled={loading} />
    </div>
  );
}

export default App;
