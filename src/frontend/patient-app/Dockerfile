# Stage 1: Build the React application
FROM node:18-slim as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY src/frontend/patient-app/package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY src/frontend/patient-app/ .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:slim

# Create non-root user
RUN adduser --disabled-password --gecos "" appuser

# Copy the build output to replace the default nginx contents
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config
COPY src/frontend/patient-app/nginx.conf /etc/nginx/conf.d/default.conf

# Set ownership
RUN chown -R appuser:appuser /usr/share/nginx/html && \
    chown -R appuser:appuser /var/cache/nginx && \
    chown -R appuser:appuser /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appuser /var/run/nginx.pid

# Switch to non-root user
USER appuser

# Expose port 80
EXPOSE 80

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
