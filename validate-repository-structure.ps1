# Repository Structure Validation Script
Write-Host "=== Ojala Healthcare Repository Structure Validation ===" -ForegroundColor Green

# Define the expected repository structure
$expectedStructure = @{
    # Backend services (should be in src/backend)
    "Backend Services" = @(
        "src/backend/Ojala.Api",
        "src/backend/Ojala.ApiGateway",
        "src/backend/Ojala.Identity",
        "src/backend/Ojala.Services",
        "src/backend/Ojala.Data",
        "src/backend/Ojala.HealthScore"
    )

    # Shared libraries (should be in src/shared)
    "Shared Libraries" = @(
        "src/shared/Ojala.Common",
        "src/shared/Ojala.Contracts"
    )

    # Frontend applications (should be in src/frontend)
    "Frontend Applications" = @(
        "src/frontend/ojala.web",
        "src/frontend/employer-dashboard",
        "src/frontend/patient-app",
        "src/frontend/rn-dashboard"
    )
}

# Problematic duplicate locations that should NOT exist
$duplicateLocations = @(
    "Ojala.Data",           # Should only be in src/backend/Ojala.Data
    "Ojala.Api",            # Should only be in src/backend/Ojala.Api
    "Ojala.Services",       # Should only be in src/backend/Ojala.Services
    "backend",              # Should only be in src/backend
    "ojala.web"             # Should only be in src/frontend/ojala.web
)

Write-Host "`n1. Checking for expected project structure..." -ForegroundColor Yellow

$allGood = $true

foreach ($category in $expectedStructure.Keys) {
    Write-Host "`n${category}:" -ForegroundColor Cyan
    foreach ($path in $expectedStructure[$category]) {
        if (Test-Path $path) {
            Write-Host "  ✓ $path" -ForegroundColor Green
        } else {
            Write-Host "  ✗ MISSING: $path" -ForegroundColor Red
            $allGood = $false
        }
    }
}

Write-Host "`n2. Checking for problematic duplicate locations..." -ForegroundColor Yellow

foreach ($duplicate in $duplicateLocations) {
    if (Test-Path $duplicate) {
        Write-Host "  ✗ DUPLICATE FOUND: $duplicate (should be removed)" -ForegroundColor Red
        $allGood = $false
    } else {
        Write-Host "  ✓ No duplicate at: $duplicate" -ForegroundColor Green
    }
}

Write-Host "`n3. Checking project file references..." -ForegroundColor Yellow

# Check Identity project references
$identityProjectPath = "src/backend/Ojala.Identity/Ojala.Identity.csproj"
if (Test-Path $identityProjectPath) {
    $identityContent = Get-Content $identityProjectPath -Raw

    # Check for correct references
    $correctReferences = @(
        "../../shared/Ojala.Common/Ojala.Common.csproj",
        "../../shared/Ojala.Contracts/Ojala.Contracts.csproj",
        "../Ojala.Data/Ojala.Data.csproj"
    )

    $incorrectReferences = @(
        "../../libs/Ojala.Common/Ojala.Common.csproj",
        "../../libs/Ojala.Contracts/Ojala.Contracts.csproj",
        "../../Ojala.Data/Ojala.Data.csproj"
    )

    foreach ($ref in $correctReferences) {
        if ($identityContent -match [regex]::Escape($ref)) {
            Write-Host "  ✓ Correct reference: $ref" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Missing correct reference: $ref" -ForegroundColor Red
            $allGood = $false
        }
    }

    foreach ($ref in $incorrectReferences) {
        if ($identityContent -match [regex]::Escape($ref)) {
            Write-Host "  ✗ Incorrect reference found: $ref" -ForegroundColor Red
            $allGood = $false
        }
    }
} else {
    Write-Host "  ✗ Identity project not found" -ForegroundColor Red
    $allGood = $false
}

Write-Host "`n4. Checking for .NET 8 compatibility..." -ForegroundColor Yellow

$projectFiles = @(
    "src/backend/Ojala.Identity/Ojala.Identity.csproj",
    "src/shared/Ojala.Common/Ojala.Common.csproj",
    "src/shared/Ojala.Contracts/Ojala.Contracts.csproj",
    "src/backend/Ojala.Data/Ojala.Data.csproj"
)

foreach ($projectFile in $projectFiles) {
    if (Test-Path $projectFile) {
        $content = Get-Content $projectFile -Raw
        if ($content -match "<TargetFramework>net8\.0</TargetFramework>") {
            Write-Host "  ✓ $projectFile targets .NET 8" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $projectFile does not target .NET 8" -ForegroundColor Red
            $allGood = $false
        }

        if ($content -match "DisableImplicitNuGetFallbackFolder") {
            Write-Host "  ✓ $projectFile has NuGet fallback folder disabled" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ $projectFile missing NuGet fallback folder setting" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n5. Summary" -ForegroundColor Yellow

if ($allGood) {
    Write-Host "✓ Repository structure is correct!" -ForegroundColor Green
    Write-Host "All projects are in their proper locations and have correct references." -ForegroundColor Green
} else {
    Write-Host "✗ Repository structure has issues that need to be fixed." -ForegroundColor Red
    Write-Host "Please address the problems listed above." -ForegroundColor Red
}

Write-Host "`n=== Validation Complete ===" -ForegroundColor Green
