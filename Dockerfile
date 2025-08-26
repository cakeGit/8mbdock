# Build image for Video Compressor App
FROM node:18-alpine

WORKDIR /video-compressor

# Copy package metadata and install dependencies for the API
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

# Install dependencies in the src/api directory
RUN npm install --production

# Copy application
COPY / ./ 

# Set default port (can be overridden in docker-compose)
ENV PORT=3000
EXPOSE 3000

# Set default node environment (can be overridden)
ENV NODE_ENV=production

# Run the server (which serves the built React app)
CMD ["node", "server.js"]
