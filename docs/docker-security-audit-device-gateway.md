# Docker Security Audit - Ojala.DeviceGateway

## Security Issues Found

1.  **Runs as root**: The container runs as the root user by default, posing a significant security risk.
2.  **No multi-stage build**: The Dockerfile uses a single stage. `npm install` installs all dependencies (including devDependencies), which are included in the final image, increasing its size and attack surface.
3.  **Unpinned Node.js base image**: Uses `node:18-slim` without a specific patch version tag, allowing for potential dependency drift.
4.  **Uses `npm install` instead of `npm ci`**: `npm install` can lead to non-deterministic builds compared to `npm ci`.
5.  **No `.dockerignore` file**: The `COPY src/backend/Ojala.DeviceGateway/ ./` command copies everything from that directory, potentially including unnecessary files if not managed carefully (though less risky than `COPY . .`). A `.dockerignore` file is still recommended for the build context root.
6.  **Secrets directory created as root**: The `/vault/secrets` directory is created by the root user. While not used by the application directly in this Dockerfile, if secrets were mounted or managed later, permissions could be an issue.
7.  **Health check dependency**: Relies on `curl`, which is not guaranteed to be present in the `node:18-slim` base image.

## Recommendations

1.  **Implement multi-stage build**: Separate the build stage (installing all dependencies) from the final runtime stage.
2.  **Use `npm ci --only=production`** in the final stage to install only production dependencies.
3.  **Add and use a non-root user**: Create a dedicated user (`appuser`) and group, set ownership of the application directory, and switch to this user using the `USER` instruction before the `CMD`.
    ```dockerfile
    # In the final stage
    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 appuser
    COPY --chown=appuser:nodejs --from=builder /app /app
    USER appuser
    ```
4.  **Pin base image version precisely**: Change `FROM node:18-slim` to a specific version like `FROM node:18.19.1-slim`.
5.  **Add `.dockerignore` file**: Ensure a `.dockerignore` file exists in the build context root to exclude unnecessary files.
6.  **Install `curl` for health check**: Explicitly install `curl` in the final stage if using `node:slim`, or use a Node.js-based health check.
    ```dockerfile
    # In the final stage, before USER appuser
    RUN apt-get update && apt-get install -y --no-install-recommends curl && \
        rm -rf /var/lib/apt/lists/*
    ```
7.  **Review `/vault/secrets` usage**: Clarify how this directory is used. If secrets are mounted, ensure permissions are handled correctly. If not used, remove the `mkdir` command.
8.  **Add security scanning** during the CI/CD pipeline.

## Positive Security Practices Already Implemented

1.  **`NODE_ENV=production` set**: Ensures Node.js runs in production mode.
2.  **Health check**: Implemented to monitor container health.
