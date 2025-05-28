# 1) Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# 2) Build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore backend/Ojala.ApiGateway/Ojala.ApiGateway.csproj
WORKDIR "/src/backend/Ojala.ApiGateway"
RUN dotnet build "Ojala.ApiGateway.csproj" -c Release -o /app/build

# 3) Publish stage
FROM build AS publish
RUN dotnet publish Ojala.ApiGateway.csproj -c Release -o /app/publish

# 4) Final image
FROM base AS final
WORKDIR /app

# Create non-root user
RUN adduser --disabled-password --gecos "" appuser
USER appuser

COPY --from=publish /app/publish .

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

ENTRYPOINT ["dotnet", "Ojala.ApiGateway.dll"]
