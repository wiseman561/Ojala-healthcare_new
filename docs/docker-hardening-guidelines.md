# Docker Security Hardening Guidelines

This document provides comprehensive guidelines for hardening Docker images across the Ojalá Healthcare Platform. These recommendations are based on security best practices and findings from our Docker security audit.

## General Recommendations

### 1. Base Images

- **Pin specific versions**: Always use specific version tags (e.g., `node:20.13.1-slim` instead of `node:20-slim`) to ensure reproducible builds and prevent dependency drift.
- **Use minimal base images**: Prefer slim or alpine variants when possible to reduce attack surface.
- **Keep base images updated**: Regularly update base images to include security patches.
- **Use supported versions**: Avoid EOL versions (e.g., Node.js 16 is EOL and should be upgraded to Node.js 20 LTS).

### 2. Non-Root Users

- **Create dedicated users**: Always create a non-root user for running applications.
- **Set proper ownership**: Ensure application files are owned by the non-root user.
- **Switch to non-root user**: Use the `USER` instruction before the `CMD` or `ENTRYPOINT`.
- **Example for Node.js applications**:
  ```dockerfile
  RUN addgroup --system --gid 1001 nodejs && \
      adduser --system --uid 1001 --gid 1001 appuser
  USER appuser
  ```
- **Example for .NET applications**:
  ```dockerfile
  RUN adduser --disabled-password --gecos "" appuser
  USER appuser
  ```

### 3. Multi-Stage Builds

- **Separate build and runtime stages**: Use multi-stage builds to separate build dependencies from runtime.
- **Copy only necessary files**: Only copy required artifacts from build stage to runtime stage.
- **Example**:
  ```dockerfile
  FROM node:20.13.1-slim AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  
  FROM node:20.13.1-slim
  WORKDIR /app
  COPY --from=builder /app/package*.json ./
  RUN npm ci --only=production
  COPY --from=builder /app .
  # Add non-root user here
  ```

### 4. Dependency Management

- **Use deterministic installs**: Use `npm ci` instead of `npm install` for Node.js applications.
- **Install only production dependencies**: Use `npm ci --only=production` in the final stage.
- **Pin dependency versions**: Ensure all dependencies have fixed versions in package.json.
- **Regularly update dependencies**: Implement a process to regularly update dependencies with security patches.

### 5. Build Context and .dockerignore

- **Create .dockerignore files**: Add .dockerignore files to exclude unnecessary files from the build context.
- **Minimize build context**: Only include files necessary for the build.
- **Example .dockerignore for Node.js**:
  ```
  node_modules
  npm-debug.log
  .git
  .gitignore
  .env
  .DS_Store
  coverage
  tests
  *.md
  ```

### 6. Health Checks

- **Implement health checks**: Use the `HEALTHCHECK` instruction to monitor container health.
- **Ensure dependencies are installed**: If health checks rely on tools like `curl` or `wget`, ensure they are installed.
- **Example**:
  ```dockerfile
  HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/health || exit 1
  ```

### 7. Security Scanning

- **Scan during build**: Integrate security scanning into the CI/CD pipeline.
- **Scan base images**: Regularly scan base images for vulnerabilities.
- **Scan dependencies**: Scan application dependencies for vulnerabilities.
- **Tools to consider**: Trivy, Snyk, Clair, Docker Scout.

### 8. Environment Variables

- **Set production mode**: Always set `NODE_ENV=production` for Node.js applications.
- **Avoid hardcoding secrets**: Never hardcode secrets in Dockerfiles or images.
- **Use environment variables**: Pass secrets and configuration via environment variables.

### 9. File Permissions

- **Set proper permissions**: Ensure files have appropriate permissions.
- **Minimize privileged operations**: Minimize operations requiring elevated privileges.
- **Example**:
  ```dockerfile
  COPY --chown=appuser:appgroup . .
  ```

### 10. Layer Optimization

- **Minimize layers**: Combine related commands to reduce the number of layers.
- **Clean up in the same layer**: Clean up temporary files in the same RUN instruction.
- **Example**:
  ```dockerfile
  RUN apt-get update && \
      apt-get install -y --no-install-recommends curl && \
      rm -rf /var/lib/apt/lists/*
  ```

## Service-Specific Recommendations

### Node.js Services (ai-engine, nurse-assistant, Ojala.AlertsStreamer, Ojala.DeviceGateway)

1. **Upgrade Node.js versions**: Update to Node.js 20 LTS for all services.
2. **Implement multi-stage builds**: For services not already using them.
3. **Add non-root users**: For services running as root.
4. **Use npm ci**: Replace `npm install` with `npm ci --only=production`.

### .NET Services (Ojala.Api, Ojala.ApiGateway)

1. **Pin specific .NET versions**: Use specific patch versions for .NET base images.
2. **Consider .NET 8 upgrade**: Plan migration from .NET 6 to .NET 8 LTS.
3. **Install health check dependencies**: Ensure `curl` is installed for health checks.

## Implementation Checklist

- [ ] Update all Dockerfiles with pinned base image versions
- [ ] Add non-root users to all containers
- [ ] Implement multi-stage builds where missing
- [ ] Create or update .dockerignore files
- [ ] Add security scanning to CI/CD pipeline
- [ ] Verify health checks work properly
- [ ] Test rebuilt images for functionality
- [ ] Document changes in CHANGELOG.md
