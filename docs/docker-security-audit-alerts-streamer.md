# Docker Security Audit - Ojala.AlertsStreamer

## Security Issues Found

1. **No non-root user**: The container runs as root by default, which is a significant security risk. If the application is compromised, an attacker would have root access to the container.

2. **Unpinned Node.js base image**: Uses `node:18-alpine` without a specific patch version tag, allowing for potential dependency drift when rebuilding.

3. **Uses `npm install` instead of `npm ci`**: Using `npm install` can lead to inconsistent installations across builds and environments.

4. **No multi-stage build**: The Dockerfile uses a single stage, which includes development dependencies in the final image.

5. **No proper file ownership**: Files are owned by root, increasing the risk if the application is compromised.

6. **Copies all files without .dockerignore**: The `COPY . .` command copies everything in the build context, potentially including unnecessary files that could increase the attack surface.

## Recommendations

1. **Add non-root user**: Create and use a non-root user to run the application:
   ```dockerfile
   RUN addgroup -g 1001 appgroup && \
       adduser -u 1001 -G appgroup -s /bin/sh -D appuser
   USER appuser
   ```

2. **Pin base image version precisely**: Change `FROM node:18-alpine` to a specific version like `FROM node:18.19.1-alpine`.

3. **Use `npm ci` for deterministic builds**:
   ```dockerfile
   RUN npm ci --only=production
   ```

4. **Implement multi-stage build** to separate build dependencies from runtime:
   ```dockerfile
   FROM node:18.19.1-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   
   FROM node:18.19.1-alpine
   WORKDIR /app
   COPY --from=builder /app/package*.json ./
   RUN npm ci --only=production
   COPY --from=builder /app .
   # Add non-root user here
   ```

5. **Add .dockerignore file** to exclude unnecessary files like `.git`, `node_modules`, logs, etc.

6. **Set proper file permissions and ownership**:
   ```dockerfile
   RUN chown -R appuser:appgroup /app
   ```

7. **Add security scanning** during the CI/CD pipeline.

8. **Set NODE_ENV explicitly**:
   ```dockerfile
   ENV NODE_ENV=production
   ```

## Positive Security Practices Already Implemented

1. **Health check**: Implemented to monitor container health.
2. **Uses Alpine base image**: Alpine is a minimal Linux distribution that reduces the attack surface.
