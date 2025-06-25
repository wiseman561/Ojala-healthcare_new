# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy entire solution
COPY . .

# Remove problematic migration files that cause build errors
RUN rm -f src/backend/Ojala.Data/Migrations/20250621220859_InitialPostgresSchema.cs
RUN rm -f src/backend/Ojala.Data/Migrations/20250621220859_InitialPostgresSchema.Designer.cs
RUN rm -f src/backend/Ojala.Data/Migrations/OjalaDbContextModelSnapshot.cs

# Remove conflicting appsettings files from other services
RUN rm -f src/backend/Ojala.Identity/appsettings*.json
RUN rm -f src/backend/Ojala.Services/appsettings*.json
RUN rm -f src/backend/Ojala.Data/appsettings*.json

# Restore and publish the application
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet restore src/backend/Ojala.Api/Ojala.Api.csproj

RUN dotnet publish src/backend/Ojala.Api/Ojala.Api.csproj \
      -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet","Ojala.Api.dll"]
