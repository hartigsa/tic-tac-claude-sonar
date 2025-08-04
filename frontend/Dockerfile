# Use single-stage build for simplicity
FROM node:22-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy all files
COPY --chown=nodejs:nodejs . .

# Create server.js and debug file structure
RUN echo "=== Initial files ===" && \
    ls -la /app/ && \
    # Copy static-server.js to server.js
    cp /app/static-server.js /app/server.js && \
    chmod +x /app/server.js && \
    echo "=== Server file created ===" && \
    ls -la /app/server.js

# Switch to non-root user
USER nodejs

EXPOSE 5173

# Health check for the static server
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5173',(r)=>{if(r.statusCode!==200)throw new Error()})"

CMD ["node", "server.js"]