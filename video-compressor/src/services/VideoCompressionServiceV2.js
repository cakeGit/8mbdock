import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import config from '../config.json';

class VideoCompressionServiceV2 {
  constructor() {
    this.ffmpeg = null;
    this.isLoaded = false;
    this.progressCallback = null;
    this.stageCallback = null;
  }

  async initialize() {
    if (this.isLoaded) return;

    try {
      console.log('Initializing FFmpeg V2...');
      this.ffmpeg = new FFmpeg();
      
      // Set up logging for debugging
      this.ffmpeg.on('log', ({ message }) => {
        console.log('FFmpeg log:', message);
        if (message.includes('time=')) {
          this.parseProgressFromLog(message);
        }
      });

      // Set up progress logging
      this.ffmpeg.on('progress', ({ progress }) => {
        console.log('FFmpeg progress:', progress);
        if (this.progressCallback && progress !== undefined) {
          this.progressCallback(Math.min(progress * 100, 100));
        }
      });

      console.log('Loading FFmpeg core V2...');
      
      // Try multiple CDN sources for better reliability
      const cdnSources = [
        '/ffmpeg-proxy', // Local proxy
        'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd', // Original CDN
        'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd' // Alternative CDN
      ];

      let loadSuccess = false;
      let lastError = null;

      for (const baseURL of cdnSources) {
        try {
          console.log(`Trying to load FFmpeg from: ${baseURL}`);
          
          await this.ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
          });

          console.log(`FFmpeg loaded successfully from: ${baseURL}`);
          loadSuccess = true;
          break;
        } catch (error) {
          console.warn(`Failed to load from ${baseURL}:`, error);
          lastError = error;
          continue;
        }
      }

      if (!loadSuccess) {
        throw lastError || new Error('Failed to load FFmpeg from all sources');
      }

      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to initialize FFmpeg:', error);
      
      // Check if it's a cross-origin isolation error
      if (error.message.includes('SharedArrayBuffer') || error.message.includes('crossOriginIsolated')) {
        throw new Error('Cross-origin isolation required. Please ensure the app is served with proper headers.');
      }
      
      throw new Error(`Failed to initialize video processing engine: ${error.message}`);
    }
  }

  parseProgressFromLog(message) {
    const timeMatch = message.match(/time=(\d{2}):(\d{2}):(\d{2}.\d{2})/);
    if (timeMatch && this.videoDuration) {
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const seconds = parseFloat(timeMatch[3]);
      
      const currentTime = hours * 3600 + minutes * 60 + seconds;
      const progress = Math.min((currentTime / this.videoDuration) * 100, 100);
      
      if (this.progressCallback) {
        this.progressCallback(progress);
      }
    }
  }

  setCallbacks(progressCallback, stageCallback) {
    this.progressCallback = progressCallback;
    this.stageCallback = stageCallback;
  }

  async compressVideo(file, onProgress, onStageChange) {
    if (!this.isLoaded) {
      onStageChange(0); // Preparing
      onProgress(0);
      await this.initialize();
    }

    this.setCallbacks(onProgress, onStageChange);
    
    try {
      console.log('Starting compression for file:', file.name);
      onStageChange(1); // Loading video
      onProgress(5);

      const inputFileName = 'input.' + file.name.split('.').pop().toLowerCase();
      const outputFileName = 'output.mp4';
      
      console.log('Writing input file to FFmpeg filesystem...');
      await this.ffmpeg.writeFile(inputFileName, await fetchFile(file));
      onProgress(15);

      onStageChange(2); // Analyzing
      console.log('Analyzing video properties...');
      
      const fileSizeMB = file.size / (1024 * 1024);
      this.videoDuration = Math.max(fileSizeMB * 0.5, 5);
      
      onProgress(25);

      onStageChange(3); // Compressing
      console.log('Starting video compression...');
      
      const targetSizeMB = config.MAX_FILE_SIZE_MB;
      const targetSizeBytes = targetSizeMB * 1024 * 1024;
      const estimatedDuration = this.videoDuration;
      
      // Calculate target bitrate more conservatively
      const targetBitrate = Math.max(
        Math.floor((targetSizeBytes * 8) / estimatedDuration / 1000) - 128,
        400 // Higher minimum bitrate
      );

      console.log(`Target bitrate: ${targetBitrate}kbps for ${targetSizeMB}MB target`);

      // Use faster preset for reliability
      const compressionArgs = [
        '-i', inputFileName,
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-crf', '30',
        '-maxrate', `${targetBitrate}k`,
        '-bufsize', `${targetBitrate * 1.5}k`,
        '-c:a', 'aac',
        '-b:a', '96k',
        '-movflags', '+faststart',
        '-f', 'mp4',
        '-y',
        outputFileName
      ];

      console.log('Running FFmpeg with args:', compressionArgs.join(' '));
      await this.ffmpeg.exec(compressionArgs);
      
      onProgress(85);

      onStageChange(4); // Finalizing
      console.log('Reading compressed file...');
      
      const compressedData = await this.ffmpeg.readFile(outputFileName);
      const compressedBlob = new Blob([compressedData.buffer], { type: 'video/mp4' });
      
      console.log(`Compression complete! Original: ${fileSizeMB.toFixed(2)}MB, Compressed: ${(compressedBlob.size / (1024 * 1024)).toFixed(2)}MB`);
      
      // Clean up files
      try {
        await this.ffmpeg.deleteFile(inputFileName);
        await this.ffmpeg.deleteFile(outputFileName);
      } catch (cleanupError) {
        console.warn('Cleanup warning:', cleanupError);
      }

      onProgress(100);
      onStageChange(5); // Complete

      return compressedBlob;

    } catch (error) {
      console.error('Compression error:', error);
      throw new Error(`Compression failed: ${error.message}`);
    }
  }

  async terminate() {
    if (this.ffmpeg && this.isLoaded) {
      try {
        await this.ffmpeg.terminate();
      } catch (error) {
        console.warn('FFmpeg termination warning:', error);
      }
      this.isLoaded = false;
    }
  }
}

export default VideoCompressionServiceV2;
