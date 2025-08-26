export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateVideoFile = (file, supportedFormats, maxSizeMB) => {
  const errors = [];
  
  // Check file type
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (!supportedFormats.includes(fileExtension)) {
    errors.push(`Unsupported file format. Please use: ${supportedFormats.join(', ')}`);
  }
  
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    errors.push(`File too large. Maximum size: ${maxSizeMB}MB`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const calculateTargetBitrate = (targetSizeMB, durationSeconds) => {
  const targetSizeBytes = targetSizeMB * 1024 * 1024;
  // Account for audio bitrate (~128kbps)
  const targetBitrate = Math.max(
    Math.floor((targetSizeBytes * 8) / durationSeconds / 1000) - 128,
    200 // Minimum bitrate
  );
  return targetBitrate;
};

export const getVideoMetadata = async (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      });
    };
    
    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
    };
    
    video.src = URL.createObjectURL(file);
  });
};

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
