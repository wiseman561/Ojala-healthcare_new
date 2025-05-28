# Move test files to centralized __tests__ directory
$sourceRoot = "src"

# Backend tests
Copy-Item "$sourceRoot/backend/nurse-assistant/tests/alertSeverity.test.js" "$sourceRoot/__tests__/backend/nurse-assistant/" -Force
Copy-Item "$sourceRoot/backend/Ojala.AlertsStreamer/tests/server.test.js" "$sourceRoot/__tests__/backend/alerts-streamer/" -Force
Copy-Item "$sourceRoot/backend/Ojala.DeviceGateway/tests/deviceRoutes.test.js" "$sourceRoot/__tests__/backend/device-gateway/" -Force
Copy-Item "$sourceRoot/backend/ai-engine/tests/chat.test.js" "$sourceRoot/__tests__/backend/ai-engine/" -Force

# Frontend tests
Copy-Item "$sourceRoot/frontend/rn-dashboard/src/tests/EscalatedAlertsPanel.test.js" "$sourceRoot/__tests__/frontend/dashboard/" -Force

# After copying, remove old test files and directories
Remove-Item "$sourceRoot/backend/nurse-assistant/tests" -Recurse -Force
Remove-Item "$sourceRoot/backend/Ojala.AlertsStreamer/tests" -Recurse -Force
Remove-Item "$sourceRoot/backend/Ojala.DeviceGateway/tests" -Recurse -Force
Remove-Item "$sourceRoot/backend/ai-engine/tests" -Recurse -Force
Remove-Item "$sourceRoot/frontend/rn-dashboard/src/tests" -Recurse -Force 