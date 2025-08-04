# Use single-stage build for simplicity
FROM node:22-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy all files with secure permissions from the start
COPY --chown=nodejs:nodejs --chmod=444 . .

# Create server.js with secure permissions and debug
RUN echo "=== Initial files ===" && \
    ls -la /app/ && \
    # Copy static-server.js to server.js with proper permissions
    cp /app/static-server.js /app/server.js && \
    chmod 555 /app/server.js && \
    # Set executable permissions for directories
    find /app -type d -exec chmod 555 {} \; 2>/dev/null || true && \
    echo "=== Server file created with secure permissions ===" && \
    ls -la /app/server.js

# Switch to non-root user
USER nodejs

EXPOSE 5173

# Health check for the static server
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5173',(r)=>{if(r.statusCode!==200)throw new Error()})"

CMD ["node", "server.js"]