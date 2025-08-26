# Video Compressor - 8MB Target

A React-based video compression application that automatically compresses uploaded videos to a target file size of 8MB using FFmpeg.wasm.

## Features

- 🎥 **Drag & Drop Upload**: Easy video file upload with drag and drop support
- 🗜️ **Smart Compression**: Automatic quality adjustment to meet 8MB target size
- 📊 **Real-time Progress**: Live compression progress with detailed stages
- 🔄 **Side-by-Side Preview**: Compare original and compressed videos
- 📥 **Instant Download**: Download compressed videos immediately
- 🔐 **Access Control**: Optional token-based authentication
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎬 **Multiple Formats**: Support for MP4, AVI, MOV, MKV, WebM, FLV, WMV

## Supported Video Formats

- MP4 (recommended)
- AVI
- MOV
- MKV
- WebM
- FLV
- WMV

## Configuration

The application uses a flexible configuration system with both JSON config files and environment variables.

### Config File: `src/config.json`

```json
{
  "ACCESS_TOKEN": "your-access-token-here",
  "REQUIRES_ACCESS_TOKEN": false,
  "MAX_FILE_SIZE_MB": 8,
  "SUPPORTED_FORMATS": ["mp4", "avi", "mov", "mkv", "webm", "flv", "wmv"],
  "COMPRESSION_QUALITY": {
    "HIGH": 28,
    "MEDIUM": 32,
    "LOW": 36
  },
  "APP_NAME": "Video Compressor",
  "MAX_UPLOAD_SIZE_MB": 500
}
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
REACT_APP_ACCESS_TOKEN=your-secure-production-token-here
REACT_APP_REQUIRES_AUTH=false
REACT_APP_MAX_FILE_SIZE_MB=8
REACT_APP_MAX_UPLOAD_SIZE_MB=200
```

## Installation & Setup

1. **Clone or download the project**
   ```bash
   cd video-compressor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the application**
   - Copy `.env.example` to `.env.local`
   - Update `src/config.json` with your preferred settings
   - Set `REQUIRES_ACCESS_TOKEN: true` and provide an `ACCESS_TOKEN` if you want to restrict access

4. **Start the development server**
   
   **Option A: Standard development (may have SharedArrayBuffer issues)**
   ```bash
   npm start
   ```
   
   **Option B: Development with proper headers (recommended)**
   ```bash
   npm run start:dev
   ```
   This builds the project and serves it with the correct cross-origin isolation headers.

5. **Open your browser**
   - **Standard mode**: Navigate to `http://localhost:3000`
   - **Headers mode**: Navigate to `http://localhost:3001`
   - If authentication is enabled, use the configured access token

## Cross-Origin Isolation & SharedArrayBuffer

FFmpeg.wasm requires SharedArrayBuffer, which needs specific HTTP headers:

- `Cross-Origin-Embedder-Policy: require-corp`
- `Cross-Origin-Opener-Policy: same-origin`

### Development Solutions:

1. **Use `npm run start:dev`** - Serves with proper headers
2. **Use the setupProxy.js** - Automatically configured for `npm start`
3. **Use HTTPS** - Some browsers require HTTPS for SharedArrayBuffer

### Production Setup:

The app includes a `_headers` file and server configuration that automatically sets these headers.

## How It Works

1. **Upload**: Drag and drop or select a video file (max 500MB by default)
2. **Compress**: Click "Compress to 8MB" - the app automatically:
   - Analyzes the video properties
   - Calculates optimal compression settings
   - Uses FFmpeg.wasm to process the video client-side
   - Adjusts quality to meet the 8MB target
3. **Preview**: View both original and compressed videos side-by-side
4. **Download**: Download the compressed video file

## Technical Details

- **Client-side Processing**: All compression happens in the browser using FFmpeg.wasm
- **No Server Required**: Completely client-side application
- **Progressive Web App**: Can be installed and used offline (after initial load)
- **Memory Efficient**: Streams video data to avoid memory issues
- **Smart Compression**: Uses CRF (Constant Rate Factor) with bitrate limits

## Access Control

When `REQUIRES_ACCESS_TOKEN` is set to `true`:

- Users must enter a valid access token to use the application
- Tokens are stored in localStorage for convenience
- Includes logout functionality
- Perfect for private or internal use

## Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized files ready for deployment.

## Deployment

The built application can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Use the `build` folder
- **AWS S3**: Upload the `build` folder contents

## Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Limited support (some format restrictions)
- **Edge**: Full support

## Performance Notes

- Large video files (>100MB) may take several minutes to process
- Processing happens entirely in the browser
- Memory usage scales with video file size
- For very large files, consider splitting into smaller segments

## Troubleshooting

### Common Issues

1. **"Failed to initialize video processing engine"**
   - Ensure you're using HTTPS (required for SharedArrayBuffer)
   - Check browser compatibility

2. **Compression takes too long**
   - Large files require more processing time
   - Consider using smaller input files
   - Check available system memory

3. **Compressed file is larger than expected**
   - Very short videos may not compress well
   - Some video codecs are already highly compressed
   - Try with different input formats

### Browser Requirements

- SharedArrayBuffer support (requires HTTPS in production)
- Modern JavaScript features (ES2018+)
- WebAssembly support
- File API support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure your browser supports all required features
4. Try with different video files to isolate the issue
