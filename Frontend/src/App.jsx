import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import History from './pages/History';
import Admin from './pages/Admin';

const ProtectedRoute = ({ children, roleRequired }) => {
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/chat" replace />;
  }

  return children;
};

function App() {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <ChatProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roleRequired="admin">
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
      </Router>
    </ChatProvider>
  );
}

export default App;
