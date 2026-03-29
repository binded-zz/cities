$ModId      = "CitiesSkylines2Mod"
$RepoRoot   = $PSScriptRoot
$GameData   = "$env:APPDATA\..\LocalLow\Colossal Order\Cities Skylines II"
$ModsFolder = "$GameData\Mods\$ModId"
$ContentLoadFile = "$GameData\content_load.json"

Write-Host "=== Building C# Mod ===" -ForegroundColor Cyan
dotnet build "$RepoRoot\cities\cities.csproj" --configuration Release
if ($LASTEXITCODE -ne 0) { Write-Host "C# build failed!" -ForegroundColor Red; exit 1 }

Write-Host "=== Building UI ===" -ForegroundColor Cyan
node "$RepoRoot\node_modules\webpack\bin\webpack.js" --mode production
if ($LASTEXITCODE -ne 0) { Write-Host "UI build failed!" -ForegroundColor Red; exit 1 }

Write-Host "=== Packaging Mod ===" -ForegroundColor Cyan
New-Item -ItemType Directory -Path $ModsFolder -Force | Out-Null
New-Item -ItemType Directory -Path "$ModsFolder\ui" -Force | Out-Null

Copy-Item "$RepoRoot\cities\bin\Release\net6.0\CitiesSkylines2Mod.dll" -Destination $ModsFolder -Force
Copy-Item "$RepoRoot\mod.json" -Destination $ModsFolder -Force
Copy-Item "$RepoRoot\dist\bundle.js" -Destination "$ModsFolder\ui\" -Force

Write-Host "=== Registering Mod in content_load.json ===" -ForegroundColor Cyan
$content = Get-Content $ContentLoadFile -Raw | ConvertFrom-Json
if ($content.enabledMods -notcontains $ModId) {
    $content.enabledMods += $ModId
    $content | ConvertTo-Json -Depth 5 | Set-Content $ContentLoadFile
    Write-Host "Mod '$ModId' added to enabledMods." -ForegroundColor Green
} else {
    Write-Host "Mod '$ModId' already registered." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Done! Mod installed to: ===" -ForegroundColor Green
Write-Host $ModsFolder -ForegroundColor Yellow
Write-Host ""
Write-Host "Contents:" -ForegroundColor Cyan
Get-ChildItem $ModsFolder -Recurse | Select-Object FullName
Write-Host ""
Write-Host "content_load.json enabledMods:" -ForegroundColor Cyan
(Get-Content $ContentLoadFile -Raw | ConvertFrom-Json).enabledMods
