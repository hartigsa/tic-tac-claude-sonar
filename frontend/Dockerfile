# Build stage - use Alpine for smaller attack surface
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install && npm cache clean --force

# Build the application (this uses esbuild but we don't ship it)
COPY . .
RUN npm run build

# Production stage - Google Distroless for maximum security
FROM gcr.io/distroless/nodejs22-debian12:nonroot

WORKDIR /app

# Copy only built application - NO node_modules, NO esbuild
COPY --from=builder --chown=65532:65532 /app/dist ./dist
COPY --chown=65532:65532 ./static-server.js ./server.js

# Run as nonroot user (UID 65532)
USER 65532

EXPOSE 5173

# No esbuild, no Go binaries, no system packages - maximum security
# Serve static files with pure Node.js (no dependencies)
CMD ["server.js"]