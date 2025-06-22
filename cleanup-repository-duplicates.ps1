# Repository Cleanup Script - Remove Duplicate Folders and Files
Write-Host "=== Ojala Healthcare Repository Cleanup ===" -ForegroundColor Green
Write-Host "This script will remove duplicate folders that are causing scaffolding issues." -ForegroundColor Yellow

# Define folders/files to remove (duplicates of what exists in src/)
$duplicatesToRemove = @(
    "apps",                 # Duplicate of src/backend projects
    "backend",              # Duplicate of src/backend
    "ojala.web",           # Duplicate of src/frontend/ojala.web
    "libs",                # Old location, now in src/shared
    "Ojala.Data",          # Duplicate of src/backend/Ojala.Data
    "Ojala.Api",           # Duplicate of src/backend/Ojala.Api
    "Ojala.Services",      # Duplicate of src/backend/Ojala.Services
    "integration",         # Old integration folder
    "Ojala.Common",        # If it exists at root
    "Ojala.Contracts"      # If it exists at root
)

# Files to remove (empty or temporary files)
$filesToRemove = @(
    "cd", "git", "error", "create", "docker", "remote", "4"
)

Write-Host "`nStep 1: Removing duplicate folders..." -ForegroundColor Yellow

foreach ($folder in $duplicatesToRemove) {
    if (Test-Path $folder -PathType Container) {
        Write-Host "Removing duplicate folder: $folder" -ForegroundColor Red
        try {
            Remove-Item -Path $folder -Recurse -Force
            Write-Host "✓ Removed: $folder" -ForegroundColor Green
        }
        catch {
            Write-Host "✗ Failed to remove $folder`: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "✓ $folder does not exist (good)" -ForegroundColor Green
    }
}

Write-Host "`nStep 2: Removing temporary/empty files..." -ForegroundColor Yellow

foreach ($file in $filesToRemove) {
    if (Test-Path $file -PathType Leaf) {
        Write-Host "Removing temporary file: $file" -ForegroundColor Red
        try {
            Remove-Item -Path $file -Force
            Write-Host "✓ Removed: $file" -ForegroundColor Green
        }
        catch {
            Write-Host "✗ Failed to remove $file`: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "✓ $file does not exist (good)" -ForegroundColor Green
    }
}

Write-Host "`nStep 3: Verifying proper structure remains..." -ForegroundColor Yellow

# Verify the correct structure still exists
$requiredPaths = @(
    "src/backend/Ojala.Identity",
    "src/backend/Ojala.Api",
    "src/backend/Ojala.Services",
    "src/backend/Ojala.Data",
    "src/backend/Ojala.ApiGateway",
    "src/backend/Ojala.HealthScore",
    "src/shared/Ojala.Common",
    "src/shared/Ojala.Contracts"
)

$allGood = $true
foreach ($path in $requiredPaths) {
    if (Test-Path $path) {
        Write-Host "✓ Required path exists: $path" -ForegroundColor Green
    } else {
        Write-Host "✗ MISSING required path: $path" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host "`nStep 4: Summary" -ForegroundColor Yellow

if ($allGood) {
    Write-Host "✓ Repository cleanup completed successfully!" -ForegroundColor Green
    Write-Host "All duplicate folders removed and proper structure verified." -ForegroundColor Green
    Write-Host "You can now run the validation script to confirm everything is correct." -ForegroundColor Green
} else {
    Write-Host "✗ Repository cleanup completed but some required paths are missing." -ForegroundColor Red
    Write-Host "Please verify the repository structure." -ForegroundColor Red
}

Write-Host "`n=== Cleanup Complete ===" -ForegroundColor Green
