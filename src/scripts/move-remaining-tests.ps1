# Move remaining test files to centralized __tests__ directory
$sourceRoot = "src"

# Move backend tests
if (Test-Path "$sourceRoot/backend/Ojala.TelemetryProcessor/tests/processor.test.js") {
    New-Item -ItemType Directory -Force -Path "$sourceRoot/__tests__/backend/telemetry-processor"
    Copy-Item "$sourceRoot/backend/Ojala.TelemetryProcessor/tests/processor.test.js" "$sourceRoot/__tests__/backend/telemetry-processor/" -Force
    Remove-Item "$sourceRoot/backend/Ojala.TelemetryProcessor/tests" -Recurse -Force
}

# Move web tests
if (Test-Path "$sourceRoot/ojala.web/__tests__") {
    New-Item -ItemType Directory -Force -Path "$sourceRoot/__tests__/frontend/web"
    Copy-Item "$sourceRoot/ojala.web/__tests__/*" "$sourceRoot/__tests__/frontend/web/" -Force -Recurse
    Remove-Item "$sourceRoot/ojala.web/__tests__" -Recurse -Force
}

# Move employer dashboard tests
if (Test-Path "$sourceRoot/frontend/employer-dashboard/src/components/program/__tests__") {
    New-Item -ItemType Directory -Force -Path "$sourceRoot/__tests__/frontend/employer-dashboard/components/program"
    Copy-Item "$sourceRoot/frontend/employer-dashboard/src/components/program/__tests__/*" "$sourceRoot/__tests__/frontend/employer-dashboard/components/program/" -Force -Recurse
    Remove-Item "$sourceRoot/frontend/employer-dashboard/src/components/program/__tests__" -Recurse -Force
}

# Move RN dashboard sample tests
if (Test-Path "ojala.web/src/pages/RNDashboardSample.test.tsx") {
    New-Item -ItemType Directory -Force -Path "$sourceRoot/__tests__/frontend/web/pages"
    Copy-Item "ojala.web/src/pages/RNDashboardSample.test.tsx" "$sourceRoot/__tests__/frontend/web/pages/" -Force
    Remove-Item "ojala.web/src/pages/RNDashboardSample.test.tsx" -Force
} 