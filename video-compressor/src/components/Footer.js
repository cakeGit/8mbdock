import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [isDebugVisible, setIsDebugVisible] = useState(false);

  useEffect(() => {
    const getDebugInfo = () => {
      return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
        webAssembly: typeof WebAssembly !== 'undefined',
        crossOriginIsolated: window.crossOriginIsolated || false,
        webWorkers: typeof Worker !== 'undefined',
        location: window.location.href,
        timestamp: new Date().toISOString(),
      };
    };

    setDebugInfo(getDebugInfo());
  }, []);

  const testFFmpegProxy = async () => {
    try {
      const response = await fetch('/ffmpeg-proxy/ffmpeg-core.js', { method: 'HEAD' });
      console.log('FFmpeg proxy test:', response.status, response.statusText);
      alert(`FFmpeg proxy test: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error('FFmpeg proxy test failed:', error);
      alert(`FFmpeg proxy test failed: ${error.message}`);
    }
  };

  return (
    <>
      <footer style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        marginTop: '48px',
        padding: '24px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div className="container">
          <div className="footer-grid" style={{
            color: 'white',
            fontSize: '14px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ lineHeight: '1.5' }}>
              FFMpeg locally based 8mb compressor for sharing videos
            </div>
            <div className="footer-right" style={{ 
              textAlign: 'right',
              lineHeight: '1.5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '16px'
            }}>
              <div>
                Made with ❤️ by{' '}
                <a 
                  href="https://github.com/cakegit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: 'white',
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(255, 255, 255, 0.6)'
                  }}
                >
                  cakeGit
                </a>
                {' '}and copilot
              </div>
              <button
                onClick={() => setIsDebugVisible(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  whiteSpace: 'nowrap'
                }}
              >
                Show debug information
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Debug Modal */}
      {isDebugVisible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            border: '2px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            maxWidth: '500px',
            maxHeight: '70vh',
            overflow: 'auto',
            fontSize: '12px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            margin: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>🔧 Debug Information</h3>
              <button
                onClick={() => setIsDebugVisible(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <button
                onClick={testFFmpegProxy}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  marginBottom: '8px',
                  width: '100%'
                }}
              >
                Test FFmpeg Proxy
              </button>
            </div>

            <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
              {Object.entries(debugInfo).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '6px' }}>
                  <strong>{key}:</strong> <span style={{ 
                    color: typeof value === 'boolean' ? (value ? 'green' : 'red') : 'inherit',
                    fontWeight: typeof value === 'boolean' ? 'bold' : 'normal'
                  }}>
                    {typeof value === 'boolean' ? (value ? '✓' : '✗') : String(value)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '12px', fontSize: '10px', color: '#666', lineHeight: '1.4' }}>
              <strong>FFmpeg Requirements Status:</strong><br/>
              • SharedArrayBuffer: {typeof SharedArrayBuffer !== 'undefined' ? '✅ Available' : '❌ Not Available'}<br/>
              • Cross-Origin Isolated: {window.crossOriginIsolated ? '✅ Enabled' : '❌ Disabled'}<br/>
              • WebAssembly: {typeof WebAssembly !== 'undefined' ? '✅ Available' : '❌ Not Available'}<br/>
              • HTTPS/localhost: {window.location.protocol === 'https:' || window.location.hostname === 'localhost' ? '✅ OK' : '❌ Required'}<br/>
              <br/>
              <strong>Current Protocol:</strong> {window.location.protocol}<br/>
              <strong>Current Host:</strong> {window.location.hostname}:{window.location.port}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
