# Production Dockerfile for Express.js Backend
FROM node:20-alpine

WORKDIR /app

# Install dependencies first for Docker caching
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Expose backend API port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
