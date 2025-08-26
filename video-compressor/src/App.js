import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VideoCompressor from './components/VideoCompressor';
import AuthComponent from './components/AuthComponent';
import Header from './components/Header';
import Footer from './components/Footer';
import config from './config.json';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!config.REQUIRES_ACCESS_TOKEN);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if authentication is required
    if (!config.REQUIRES_ACCESS_TOKEN) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Check for stored token
    const storedToken = localStorage.getItem('access_token');
    if (storedToken === config.ACCESS_TOKEN) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleAuthentication = (token) => {
    if (token === config.ACCESS_TOKEN) {
      setIsAuthenticated(true);
      localStorage.setItem('access_token', token);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('access_token');
  };

  if (isLoading) {
    return (
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout}
        requiresAuth={config.REQUIRES_ACCESS_TOKEN}
      />
      
      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <VideoCompressor />
              ) : (
                <AuthComponent onAuthenticate={handleAuthentication} />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
