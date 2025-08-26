import React from 'react';
import config from '../config.json';

const Header = ({ isAuthenticated, onLogout, requiresAuth }) => {
  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      padding: '16px 0',
      marginBottom: '24px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            marginBottom: '4px'
          }}>
            8mb Compressor
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '16px',
            fontWeight: '400',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            margin: 0
          }}>
            {window.location.hostname}
          </p>
        </div>
        
        <div style={{
          color: 'white',
          fontSize: '14px',
          textAlign: 'right'
        }}>
          <div>Target Size: {config.MAX_FILE_SIZE_MB}MB</div>
          {requiresAuth && isAuthenticated && (
            <button
              onClick={onLogout}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                marginTop: '8px',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
