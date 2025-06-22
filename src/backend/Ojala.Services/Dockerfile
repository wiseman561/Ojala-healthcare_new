FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

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
COPY . .
RUN dotnet restore backend/Ojala.Services/Ojala.Services.csproj $MSBUILD_NO_FALLBACK --configfile ./NuGet.Config
WORKDIR "/src/backend/Ojala.Services"
RUN dotnet build "Ojala.Services.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Ojala.Services.csproj" -c Release -o /app/publish $MSBUILD_NO_FALLBACK --configfile ./NuGet.Config

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Ojala.Services.dll"]
