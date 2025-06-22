# 1) Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# 2) Build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
# Copy solution-wide MSBuild files so restore works in containers
COPY Directory.* ./
COPY NuGet.Config ./
# Disable all fallback folder mechanisms
ENV NUGET_FALLBACK_PACKAGES=""
ENV DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1
ARG MSBUILD_NO_FALLBACK="-p:DisableImplicitNuGetFallbackFolder=true -p:RestoreFallbackFolders= -p:FallbackPackageFolders="
ENV MSBUILD_NO_FALLBACK $MSBUILD_NO_FALLBACK

# -- copy project files for restore ---------------------------------
# Identity
COPY src/backend/Ojala.Identity/Ojala.Identity.csproj ./backend/Ojala.Identity/

# Referenced projects
COPY src/shared/Ojala.Common/Ojala.Common.csproj       ./shared/Ojala.Common/
COPY src/shared/Ojala.Contracts/Ojala.Contracts.csproj ./shared/Ojala.Contracts/
COPY src/backend/Ojala.Data/Ojala.Data.csproj          ./backend/Ojala.Data/

# Restore
RUN dotnet restore ./backend/Ojala.Identity/Ojala.Identity.csproj $MSBUILD_NO_FALLBACK --configfile ./NuGet.Config

# -- copy full source -----------------------------------------------
COPY src/backend/Ojala.Identity ./backend/Ojala.Identity
COPY src/shared/Ojala.Common    ./shared/Ojala.Common
COPY src/shared/Ojala.Contracts ./shared/Ojala.Contracts
COPY src/backend/Ojala.Data     ./backend/Ojala.Data

# Publish
WORKDIR /src/backend/Ojala.Identity
RUN dotnet publish Ojala.Identity.csproj -c Release -o /app/publish --no-restore $MSBUILD_NO_FALLBACK --configfile ./NuGet.Config

# 4) Final image
FROM base AS final
WORKDIR /app

# Create non-root user
RUN adduser --disabled-password --gecos "" appuser

COPY --from=build /app/publish .

# Set correct permissions
RUN chown -R appuser:appuser /app
USER appuser

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

ENTRYPOINT ["dotnet", "Ojala.Identity.dll"]
