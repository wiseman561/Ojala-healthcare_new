FROM node:18-slim AS build
WORKDIR /app

# Create non-root user
RUN groupadd --system appgroup && \
    useradd --system --gid appgroup --shell /bin/bash appuser

# Copy package files and install dependencies
COPY --chown=appuser:appgroup package*.json ./
RUN npm ci

# Copy source code
COPY --chown=appuser:appgroup . .

# Build the application
RUN npm run build

# Runtime stage
FROM node:18-slim AS runtime
WORKDIR /app

# Create non-root user
RUN groupadd --system appgroup && \
    useradd --system --gid appgroup --shell /bin/bash appuser

# Copy built application
COPY --chown=appuser:appgroup --from=build /app/dist ./dist
COPY --chown=appuser:appgroup --from=build /app/node_modules ./node_modules
COPY --chown=appuser:appgroup --from=build /app/package*.json ./

USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/healthz || exit 1

EXPOSE 80
CMD ["npm", "start"]
