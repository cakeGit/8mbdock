import React, { useState, useCallback } from 'react';

const FileUpload = ({ onFileSelect, acceptedFormats, maxSize }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');

  const validateFile = useCallback((file) => {
    setError('');
    
    // Check file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      setError(`Unsupported file format. Please use: ${acceptedFormats.join(', ')}`);
      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File too large. Maximum size: ${maxSize}MB`);
      return false;
    }

    return true;
  }, [acceptedFormats, maxSize]);

  const handleFileSelect = useCallback((file) => {
    if (validateFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect, validateFile]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Upload Video</h2>
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: `3px dashed ${isDragOver ? '#667eea' : '#ccc'}`,
          borderRadius: '12px',
          padding: '40px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: isDragOver ? 'rgba(102, 126, 234, 0.1)' : 'transparent'
        }}
      >
        <input
          type="file"
          accept={acceptedFormats.map(format => `.${format}`).join(',')}
          onChange={handleInputChange}
          style={{ display: 'none' }}
          id="file-input"
        />
        
        <label htmlFor="file-input" style={{ cursor: 'pointer', display: 'block' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📹</div>
          <h3 style={{ marginBottom: '12px', color: '#555' }}>
            {isDragOver ? 'Drop your video here' : 'Drag & drop your video here'}
          </h3>
          <p style={{ color: '#888', marginBottom: '16px' }}>
            or click to browse files
          </p>
          <div className="button" style={{ display: 'inline-block' }}>
            Choose File
          </div>
        </label>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '16px',
        background: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <strong>Supported formats:</strong> {acceptedFormats.join(', ')}
        </div>
        <div>
          <strong>Maximum file size:</strong> {maxSize}MB
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default FileUpload;
