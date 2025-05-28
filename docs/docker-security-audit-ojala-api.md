# Docker Security Audit - Ojala.Api

## Security Issues Found

1.  **Unpinned .NET base image versions**: Uses `mcr.microsoft.com/dotnet/aspnet:6.0-bullseye-slim` and `mcr.microsoft.com/dotnet/sdk:6.0-bullseye-slim` without specific patch version tags. While .NET 6 is LTS (supported until Nov 2024), not pinning allows for potential dependency drift and unexpected changes when rebuilding.
2.  **No vulnerability scanning during build**: The build process doesn't include steps to scan the base image or dependencies for known vulnerabilities.
3.  **Potential for build context bloat**: Assumes no `.dockerignore` file is present or optimized, which could lead to unnecessary files being included in the build context, increasing image size and potential attack surface.

## Recommendations

1.  **Pin base image versions precisely**: Update the `FROM` instructions to use specific patch versions for both the SDK and ASP.NET runtime images. For example:
    *   `FROM mcr.microsoft.com/dotnet/sdk:6.0.422-bullseye-slim AS build` (Check for the latest patch version)
    *   `FROM mcr.microsoft.com/dotnet/aspnet:6.0.30-bullseye-slim AS base` (Check for the latest patch version)
2.  **Add .dockerignore file**: Create or ensure an optimized `.dockerignore` file exists in the `Ojala.Api` directory (or the build context root) to exclude unnecessary files and directories (e.g., `.git`, `bin`, `obj`, local user files) from the build context.
3.  **Implement security scanning**: Integrate tools like Trivy or Snyk into the CI/CD pipeline to scan the final image for vulnerabilities after it's built.
4.  **Consider removing curl**: The health check uses `curl`. If `curl` is not needed for the application's runtime functionality, consider using a lighter alternative like `wget` or a built-in health check mechanism if available, or install it only when needed and remove it afterwards in the final stage to minimize the attack surface. However, given its use in the `HEALTHCHECK`, keeping it might be necessary unless an alternative is implemented.

## Positive Security Practices Already Implemented

1.  **Multi-stage build**: Effectively separates build dependencies from the final runtime image, reducing size and attack surface.
2.  **Non-root user**: Creates and switches to `appuser` for running the application, adhering to the principle of least privilege.
3.  **Specific project file copying**: Copies `.csproj` files and restores dependencies before copying the full source code, optimizing Docker layer caching.
4.  **Health check**: Implemented using `HEALTHCHECK` instruction to monitor container health.
