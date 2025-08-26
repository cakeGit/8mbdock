# Build image for Video Compressor App
FROM node:18-alpine

WORKDIR /video-compressor

# Copy package metadata and install dependencies
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy application source code
COPY src ./src
COPY public ./public

# Build the React application
RUN npm run build

# Remove devDependencies to reduce image size
RUN npm prune --production

# Copy server files
COPY server.js ./server.js
COPY setup-server.js ./setup-server.js

# Set default port (can be overridden in docker-compose)
ENV PORT=3000
EXPOSE 3000

# Set default node environment (can be overridden)
ENV NODE_ENV=production

# Run the server (which serves the built React app)
CMD ["node", "server.js"]
