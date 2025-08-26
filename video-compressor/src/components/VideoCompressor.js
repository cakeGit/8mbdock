import React, { useState, useCallback, useEffect } from 'react';
import FileUpload from './FileUpload';
import VideoPreview from './VideoPreview';
import CompressionProgress from './CompressionProgress';
import VideoCompressionServiceV2 from '../services/VideoCompressionServiceV2';
import { getCompatibilityMessage } from '../utils/compatibility';
import config from '../config.json';

const VideoCompressor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [error, setError] = useState('');
  const [compatibilityError, setCompatibilityError] = useState('');
  const [compressionService] = useState(() => new VideoCompressionServiceV2());

  useEffect(() => {
    // Check browser compatibility
    const compatibility = getCompatibilityMessage();
    if (compatibility.type === 'error') {
      setCompatibilityError(compatibility.message);
    }

    return () => {
      // Cleanup when component unmounts
      compressionService.terminate();
    };
  }, [compressionService]);

  const handleFileSelect = useCallback((file) => {
    setSelectedFile(file);
    setCompressedBlob(null);
    setError('');
    setProgress(0);
    setCurrentStage(0);
  }, []);

  const handleCompress = useCallback(async () => {
    if (!selectedFile) return;

    setIsCompressing(true);
    setError('');
    setProgress(0);
    setCurrentStage(0);
    setCompressedBlob(null);

    try {
      const compressed = await compressionService.compressVideo(
        selectedFile,
        setProgress,
        setCurrentStage
      );
      
      setCompressedBlob(compressed);
      
      // Check if compression met the target
      const targetSize = config.MAX_FILE_SIZE_MB * 1024 * 1024;
      if (compressed.size > targetSize) {
        console.warn('Compressed file exceeds target size');
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Compression failed:', err);
    } finally {
      setIsCompressing(false);
    }
  }, [selectedFile, compressionService]);

  const handleCancel = useCallback(() => {
    setIsCompressing(false);
    setProgress(0);
    setCurrentStage(0);
    compressionService.terminate().then(() => {
      // Reinitialize for next use
      setError('Compression cancelled');
    });
  }, [compressionService]);

  const handleDownload = useCallback(() => {
    if (!compressedBlob || !selectedFile) return;

    const originalName = selectedFile.name;
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const hostname = window.location.hostname.replace(/\./g, '_');
    const downloadName = `${nameWithoutExt}-8mb-${hostname}.mp4`;

    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [compressedBlob, selectedFile]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setCompressedBlob(null);
    setIsCompressing(false);
    setProgress(0);
    setCurrentStage(0);
    setError('');
  }, []);

  return (
    <div className="container">
      <div style={{ display: 'grid', gap: '24px' }}>
        
        {/* Compatibility Warning */}
        {compatibilityError && (
          <div className="card">
            <div className="error-message">
              <h3 style={{ marginBottom: '12px' }}>⚠️ Compatibility Issue</h3>
              <pre style={{ 
                whiteSpace: 'pre-line', 
                fontFamily: 'inherit',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {compatibilityError}
              </pre>
              <div style={{ marginTop: '16px' }}>
                <button
                  onClick={() => setCompatibilityError('')}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Continue Anyway
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File Upload Section */}
        {!selectedFile && !compatibilityError && (
          <FileUpload
            onFileSelect={handleFileSelect}
            acceptedFormats={config.SUPPORTED_FORMATS}
            maxSize={config.MAX_UPLOAD_SIZE_MB}
          />
        )}

        {/* Selected File Info & Actions */}
        {selectedFile && !isCompressing && (
          <div className="card">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px' 
            }}>
              <h2 style={{ color: '#333', margin: 0 }}>Ready to Compress</h2>
              <button
                onClick={handleReset}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Choose Different File
              </button>
            </div>

            <div className="file-info" style={{ marginBottom: '20px' }}>
              <span style={{ fontWeight: '600' }}>{selectedFile.name}</span>
              <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCompress}
                className="button"
                disabled={isCompressing}
              >
                🗜️ Compress to {config.MAX_FILE_SIZE_MB}MB
              </button>
            </div>

            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: '#e3f2fd',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#1565c0'
            }}>
              <strong>Note:</strong> The compression process will automatically adjust 
              video quality to achieve the target file size of {config.MAX_FILE_SIZE_MB}MB.
            </div>
          </div>
        )}

        {/* Compression Progress */}
        <CompressionProgress
          progress={progress}
          stage={currentStage}
          isCompressing={isCompressing}
          error={error}
          onCancel={handleCancel}
        />

        {/* Video Preview */}
        {selectedFile && (
          <VideoPreview
            originalFile={selectedFile}
            compressedBlob={compressedBlob}
            originalSize={selectedFile.size}
            compressedSize={compressedBlob?.size}
            isProcessing={isCompressing}
          />
        )}

        {/* Download Section */}
        {compressedBlob && !isCompressing && (
          <div className="card">
            <div className="success-message">
              ✅ Video compressed successfully!
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                onClick={handleDownload}
                className="button"
              >
                📥 Download Compressed Video
              </button>
              
              <button
                onClick={handleReset}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                🎬 Compress Another Video
              </button>
            </div>

            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: '#f8f9fa',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              Final size: {(compressedBlob.size / (1024 * 1024)).toFixed(2)} MB
              {compressedBlob.size <= config.MAX_FILE_SIZE_MB * 1024 * 1024 && (
                <span style={{ color: '#28a745', marginLeft: '8px' }}>✓ Target achieved!</span>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VideoCompressor;
