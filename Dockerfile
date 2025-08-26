# Build image for Video Compressor App
FROM node:18-alpine

WORKDIR /video-compressor

# Copy application
COPY /video-compressor ./

# Install dependencies in the current directory
RUN npm install --production

# Set default port (can be overridden in docker-compose)
ENV PORT=3000
EXPOSE 3000

# Set default node environment (can be overridden)
ENV NODE_ENV=production

# Run the server (which serves the built React app)
CMD ["node", "server.js"]
