# Build stage - use full Node.js image for building native modules
FROM node:22-alpine AS builder

# Install build dependencies for native modules (bcrypt, etc)
RUN apk add --no-cache python3 make g++ libc6-compat

WORKDIR /app
COPY package*.json ./

# Install all dependencies including native modules
RUN npm install --production && npm cache clean --force

# Copy application source
COPY . .

# Production stage - use slim Node.js image compatible with native modules
FROM node:22-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Install runtime dependencies only
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy built application with correct ownership
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/server.js ./
COPY --from=builder --chown=nodejs:nodejs /app/routes ./routes
COPY --from=builder --chown=nodejs:nodejs /app/middleware ./middleware
COPY --from=builder --chown=nodejs:nodejs /app/db ./db

# Switch to non-root user
USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health',(r)=>{if(r.statusCode!==200)throw new Error()})"

CMD ["node", "server.js"]