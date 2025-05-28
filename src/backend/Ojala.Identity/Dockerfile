# 1) Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# 2) Build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY Ojala.Identity.csproj ./
RUN dotnet restore

# Copy the rest of the code
COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore

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
