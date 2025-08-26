import React, { useState, useEffect } from 'react';

const TroubleshootingPanel = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [isVisible, setIsVisible] = useState(false);

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

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#dc3545',
          color: 'white',
          border: 'none',
          padding: '12px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '16px',
          zIndex: 1000,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
        title="Debug Information"
      >
        🔧
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      border: '2px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '400px',
      maxHeight: '500px',
      overflow: 'auto',
      fontSize: '12px',
      zIndex: 1000,
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '14px' }}>🔧 Debug Info</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
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
            padding: '6px 12px',
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

      <div style={{ fontSize: '11px', lineHeight: '1.3' }}>
        {Object.entries(debugInfo).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '4px' }}>
            <strong>{key}:</strong> <span style={{ 
              color: typeof value === 'boolean' ? (value ? 'green' : 'red') : 'inherit',
              fontWeight: typeof value === 'boolean' ? 'bold' : 'normal'
            }}>
              {typeof value === 'boolean' ? (value ? '✓' : '✗') : String(value)}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '12px', fontSize: '10px', color: '#666' }}>
        <strong>Required for FFmpeg:</strong><br/>
        • SharedArrayBuffer: ✓<br/>
        • Cross-Origin Isolated: ✓<br/>
        • HTTPS or localhost: ✓<br/>
      </div>
    </div>
  );
};

export default TroubleshootingPanel;
