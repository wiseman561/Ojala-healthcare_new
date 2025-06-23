# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet restore src/backend/Ojala.Identity/Ojala.Identity.csproj
RUN dotnet publish src/backend/Ojala.Identity/Ojala.Identity.csproj \
      -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet","Ojala.Identity.dll"]
