# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
# Copy solution-wide MSBuild files so restore works in containers
COPY Directory.* ./
COPY NuGet.Config ./
# give MSBuild an empty fallback folder so it stops complaining
RUN mkdir -p "/Program Files (x86)/Microsoft Visual Studio/Shared/NuGetPackages"
# Disable all fallback folder mechanisms
ENV NUGET_FALLBACK_PACKAGES=""
ENV DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1
ARG MSBUILD_NO_FALLBACK="-p:DisableImplicitNuGetFallbackFolder=true -p:RestoreFallbackFolders= -p:FallbackPackageFolders="
ENV MSBUILD_NO_FALLBACK $MSBUILD_NO_FALLBACK

# Copy project files for restore
COPY src/backend/Ojala.ApiGateway/Ojala.ApiGateway.csproj ./backend/Ojala.ApiGateway/
COPY src/backend/Ojala.Data/Ojala.Data.csproj ./backend/Ojala.Data/
COPY src/shared/Ojala.Common/Ojala.Common.csproj ./shared/Ojala.Common/
COPY src/shared/Ojala.Contracts/Ojala.Contracts.csproj ./shared/Ojala.Contracts/

# Restore dependencies
RUN dotnet restore ./backend/Ojala.ApiGateway/Ojala.ApiGateway.csproj $MSBUILD_NO_FALLBACK --configfile ./NuGet.Config

# Copy full source code
COPY src/backend/Ojala.ApiGateway ./backend/Ojala.ApiGateway
COPY src/backend/Ojala.Data ./backend/Ojala.Data
COPY src/shared/Ojala.Common ./shared/Ojala.Common
COPY src/shared/Ojala.Contracts ./shared/Ojala.Contracts

# Build and publish
WORKDIR /src/backend/Ojala.ApiGateway
RUN dotnet publish -c Release -o /app/publish --no-restore $MSBUILD_NO_FALLBACK --configfile ./NuGet.Config

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Create a non-root user
RUN adduser --disabled-password --gecos "" appuser

COPY --from=build /app/publish .

# Set ownership and switch to non-root user
RUN chown -R appuser:appuser /app
USER appuser

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

ENTRYPOINT ["dotnet", "Ojala.ApiGateway.dll"]
