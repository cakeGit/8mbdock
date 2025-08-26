import React from 'react';

const VideoPreview = ({ 
  originalFile, 
  compressedBlob, 
  originalSize, 
  compressedSize,
  isProcessing
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressionRatio = originalSize && compressedSize 
    ? ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
    : 0;

  return (
    <div className="card">
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Video Preview</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: compressedBlob ? '1fr 1fr' : '1fr',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Original Video */}
        <div>
          <h3 style={{ marginBottom: '12px', color: '#555' }}>Original</h3>
          {originalFile && (
            <div>
              <video 
                controls 
                className="video-preview"
                style={{ width: '100%', maxWidth: '400px' }}
              >
                <source src={URL.createObjectURL(originalFile)} type={originalFile.type} />
                Your browser does not support the video tag.
              </video>
              <div className="file-info">
                <span>{originalFile.name}</span>
                <span>{formatFileSize(originalFile.size)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Compressed Video */}
        {compressedBlob && (
          <div>
            <h3 style={{ marginBottom: '12px', color: '#555' }}>Compressed</h3>
            <video 
              controls 
              className="video-preview"
              style={{ width: '100%', maxWidth: '400px' }}
            >
              <source src={URL.createObjectURL(compressedBlob)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="file-info">
              <span>{originalFile?.name.replace(/\.[^/.]+$/, '') + '_compressed.mp4'}</span>
              <span>{formatFileSize(compressedBlob.size)}</span>
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && !compressedBlob && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '2px dashed #ddd'
          }}>
            <div className="loading-spinner" style={{ marginBottom: '16px' }}></div>
            <h3 style={{ color: '#666' }}>Processing Video...</h3>
          </div>
        )}
      </div>

      {/* Compression Statistics */}
      {originalSize && compressedSize && (
        <div style={{ 
          background: '#e8f5e8',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #c8e6c8'
        }}>
          <h4 style={{ marginBottom: '12px', color: '#2d5a2d' }}>Compression Results</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#666' }}>Original Size</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
                {formatFileSize(originalSize)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#666' }}>Compressed Size</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
                {formatFileSize(compressedSize)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#666' }}>Space Saved</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#2d5a2d' }}>
                {compressionRatio}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
