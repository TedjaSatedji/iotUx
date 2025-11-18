# Quick Start Script for IoT UX App

Write-Host "🚀 Starting IoT Motor Anti-Theft Mobile App..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

Write-Host "✨ Starting Expo development server..." -ForegroundColor Green
Write-Host ""
Write-Host "📱 After the QR code appears:" -ForegroundColor Cyan
Write-Host "   - Press 'a' for Android emulator" -ForegroundColor White
Write-Host "   - Press 'i' for iOS simulator" -ForegroundColor White
Write-Host "   - Scan QR with Expo Go app for physical device" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Backend: https://iot.fyuko.app" -ForegroundColor Magenta
Write-Host ""

npm start
