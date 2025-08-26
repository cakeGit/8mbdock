import React from 'react';

const CompressionProgress = ({ 
  progress, 
  stage, 
  isCompressing, 
  error,
  onCancel
}) => {
  const stages = [
    'Preparing...',
    'Loading video...',
    'Analyzing video properties...',
    'Compressing video...',
    'Finalizing...',
    'Complete!'
  ];

  if (!isCompressing && !error) {
    return null;
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: '20px', color: '#333' }}>
        {error ? 'Compression Failed' : 'Compressing Video'}
      </h2>
      
      {error ? (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      ) : (
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '16px',
            gap: '12px'
          }}>
            <div className="loading-spinner"></div>
            <span style={{ fontSize: '16px', color: '#555' }}>
              {stages[stage] || 'Processing...'}
            </span>
          </div>

          <div className="progress-bar">
            <div 
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px'
          }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              {progress.toFixed(1)}% complete
            </span>
            
            {onCancel && (
              <button
                onClick={onCancel}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            )}
          </div>

          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#666'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Target size:</strong> 8MB
            </div>
            <div>
              <strong>Note:</strong> Compression time depends on video length and quality.
              This process may take several minutes for large files.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompressionProgress;
