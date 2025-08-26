import React, { useState } from 'react';

const AuthComponent = ({ onAuthenticate }) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!token.trim()) {
      setError('Please enter an access token');
      return;
    }

    const success = onAuthenticate(token.trim());
    if (!success) {
      setError('Invalid access token. Please try again.');
      setToken('');
    }
  };

  return (
    <div className="container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 'calc(100vh - 200px)' 
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '24px',
          color: '#333',
          fontSize: '24px'
        }}>
          Access Required
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '600',
              color: '#555'
            }}>
              Access Token:
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your access token"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          {error && (
            <div className="error-message" style={{ marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="button"
            style={{ width: '100%' }}
          >
            Authenticate
          </button>
        </form>

        <div style={{ 
          marginTop: '20px', 
          padding: '16px',
          background: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#666'
        }}>
          <strong>Note:</strong> This application requires an access token to use. 
          Please contact the administrator to obtain access.
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
