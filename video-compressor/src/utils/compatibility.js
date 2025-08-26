export const checkCompatibility = () => {
  const compatibility = {
    sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
    webAssembly: typeof WebAssembly !== 'undefined',
    crossOriginIsolated: window.crossOriginIsolated || false,
    webWorkers: typeof Worker !== 'undefined',
  };

  const issues = [];

  if (!compatibility.sharedArrayBuffer) {
    issues.push('SharedArrayBuffer is not available. This usually means the page is not cross-origin isolated.');
  }

  if (!compatibility.webAssembly) {
    issues.push('WebAssembly is not supported in this browser.');
  }

  if (!compatibility.crossOriginIsolated) {
    issues.push('Cross-origin isolation is not enabled. This is required for SharedArrayBuffer.');
  }

  if (!compatibility.webWorkers) {
    issues.push('Web Workers are not supported in this browser.');
  }

  return {
    isCompatible: issues.length === 0,
    issues,
    details: compatibility
  };
};

export const getCompatibilityMessage = () => {
  const result = checkCompatibility();
  
  if (result.isCompatible) {
    return { type: 'success', message: 'Your browser supports all required features!' };
  }

  let message = 'Your browser or environment has some compatibility issues:\n\n';
  result.issues.forEach((issue, index) => {
    message += `${index + 1}. ${issue}\n`;
  });

  message += '\nTo fix these issues:\n';
  message += '• Make sure you\'re using a modern browser (Chrome 88+, Firefox 79+, Safari 15.2+)\n';
  message += '• If developing locally, use HTTPS (try: npx serve -s build --ssl-cert)\n';
  message += '• For production, ensure your server sends the required headers:\n';
  message += '  - Cross-Origin-Embedder-Policy: require-corp\n';
  message += '  - Cross-Origin-Opener-Policy: same-origin\n';

  return { type: 'error', message };
};
