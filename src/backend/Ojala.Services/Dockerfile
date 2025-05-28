FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore backend/Ojala.Services/Ojala.Services.csproj
WORKDIR "/src/backend/Ojala.Services"
RUN dotnet build "Ojala.Services.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Ojala.Services.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Ojala.Services.dll"]
