# Docker Security Audit - Ojala.Services

## Security Issues Found

1.  **Runs as root**: The final image runs as the root user by default, which is a significant security risk.
2.  **Unpinned .NET base image versions**: Uses `mcr.microsoft.com/dotnet/aspnet:6.0-bullseye-slim` and `mcr.microsoft.com/dotnet/sdk:6.0-bullseye-slim` without specific patch version tags. While .NET 6 is LTS (supported until Nov 2024), not pinning allows for potential dependency drift.
3.  **No vulnerability scanning during build**: The build process lacks integrated security scanning.
4.  **Potential for build context bloat**: Assumes no `.dockerignore` file is present or optimized, potentially increasing image size and attack surface.
5.  **No health check**: Unlike other services, this Dockerfile lacks a `HEALTHCHECK` instruction to monitor container health.

## Recommendations

1.  **Add and use a non-root user**: Create a dedicated user (`appuser`) and switch to it before the `ENTRYPOINT`.
    ```dockerfile
    # In the final stage
    RUN adduser --disabled-password --gecos "" appuser
    USER appuser
    ```
2.  **Pin base image versions precisely**: Update `FROM` instructions with specific patch versions (e.g., `sdk:6.0.422-bullseye-slim`, `aspnet:6.0.30-bullseye-slim`).
3.  **Add .dockerignore file**: Ensure an optimized `.dockerignore` file exists in the build context root.
4.  **Implement security scanning**: Integrate vulnerability scanning (e.g., Trivy, Snyk) into the CI/CD pipeline.
5.  **Add a health check**: Implement a `HEALTHCHECK` instruction appropriate for the service (e.g., checking a specific endpoint).
    ```dockerfile
    # Requires curl or similar tool installed
    HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
      CMD curl -f http://localhost/health || exit 1
    # Ensure curl is installed if needed
    RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
    ```
6.  **Consider upgrading to .NET 8**: Plan for migration from .NET 6 (EOL Nov 2024) to .NET 8 LTS.

## Positive Security Practices Already Implemented

1.  **Multi-stage build**: Separates build dependencies from the final runtime image.
2.  **Specific project file copying**: Optimizes Docker layer caching by copying `.csproj` files and restoring dependencies first.
