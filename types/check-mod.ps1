param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectPath
)

function Write-Ok($msg){ Write-Host "[OK]    $msg" -ForegroundColor Green }
function Write-Warn($msg){ Write-Host "[WARN]  $msg" -ForegroundColor Yellow }
function Write-Err($msg){ Write-Host "[ERROR] $msg" -ForegroundColor Red }

if (-not (Test-Path $ProjectPath)) {
    Write-Err "Project file not found: $ProjectPath"
    exit 2
}

$projDir = Split-Path $ProjectPath -Parent
Write-Host "Checking project: $ProjectPath" -ForegroundColor Cyan

# read csproj
[xml]$csproj = Get-Content $ProjectPath -Raw
$ns = @{msb='http://schemas.microsoft.com/developer/msbuild/2003'}

# get common properties
$tf = $csproj.Project.PropertyGroup.TargetFramework
if (-not $tf) { $tf = $csproj.Project.PropertyGroup.TargetFrameworkVersion }
$asm = $csproj.Project.PropertyGroup.AssemblyName
$outType = $csproj.Project.PropertyGroup.OutputType
$lang = $csproj.Project.PropertyGroup.LangVersion

Write-Host "Project properties:" -ForegroundColor Cyan
Write-Host "  TargetFramework: $($tf -join ', ')"
Write-Host "  AssemblyName:    $($asm -join ', ')"
Write-Host "  OutputType:      $($outType -join ', ')"
Write-Host "  LangVersion:     $($lang -join ', ')"

# Look for Compile includes
$compiles = $csproj.Project.ItemGroup.Compile | ForEach-Object { $_.Include } | Where-Object { $_ } | Select-Object -First 8
if ($compiles) {
    Write-Ok "Compile includes (first entries):"
    $compiles | ForEach-Object { Write-Host "    $_" }
} else {
    Write-Warn "No <Compile> includes found in project file (or they use SDK default)."
}

# Check mod.json and thumbnail in project folder
$modJsonPath = Join-Path $projDir 'mod.json'
$thumbPath = Join-Path $projDir '.thumbnail.png'
if (Test-Path $modJsonPath) { Write-Ok "mod.json found: $modJsonPath" } else { Write-Warn "mod.json missing in project folder: $modJsonPath" }
if (Test-Path $thumbPath) { Write-Ok ".thumbnail.png found" } else { Write-Warn ".thumbnail.png missing" }

# Check PublishConfiguration.xml if present in Properties
$publishConf = Join-Path $projDir 'Properties\PublishConfiguration.xml'
if (Test-Path $publishConf) {
    Write-Ok "PublishConfiguration.xml found"
    [xml]$pc = Get-Content $publishConf -Raw
    $modid = $pc.PublishConfiguration.Configuration.ModID
    if ($modid -and $modid.Trim() -ne '') { Write-Ok "ModID present: $modid" } else { Write-Warn "ModID empty in PublishConfiguration.xml" }
} else { Write-Warn "PublishConfiguration.xml not found in Properties\" }

# Check for Refs folder
$refs = Join-Path $projDir '..\Refs'
if (Test-Path $refs) { Write-Ok "Refs folder found: $refs" } else { Write-Warn "Refs folder not found at $refs" }

# Try to build
Write-Host "Running dotnet build (Release)..." -ForegroundColor Cyan
$build = dotnet build `"$ProjectPath`" --configuration Release 2>&1
$build | Out-Host

# Locate output DLL
# Ensure assemblyName is a simple string (some XML nodes may appear as arrays)
$assemblyName = if ($asm) { ($asm -join '') } else { Split-Path $ProjectPath -LeafBase }
$possiblePaths = @(
    Join-Path $projDir "bin\Release\net472\$assemblyName.dll",
    Join-Path $projDir "bin\Release\$assemblyName.dll",
    Join-Path $projDir "bin\Release\net6.0\$assemblyName.dll",
    Join-Path $projDir "bin\Debug\net472\$assemblyName.dll"
)
$found = $possiblePaths | Where-Object { Test-Path $_ }
if ($found) {
    Write-Ok "Built assembly found: $found"
} else {
    Write-Err "Built assembly not found at expected locations. Check build output above for errors."
}

# Suggest fixes
Write-Host "\nQuick suggestions:" -ForegroundColor Cyan
if ($outType -ne 'Library') { Write-Warn "OutputType should be 'Library' for a game mod DLL." } else { Write-Ok "OutputType is Library." }
if ($tf -notlike '*net472*') { Write-Warn "TargetFramework is not net472 — game expects net472 assemblies." } else { Write-Ok "TargetFramework is net472." }
if (-not (Test-Path $modJsonPath)) { Write-Warn "Add mod.json to project folder or configure CopyToOutputDirectory entries." }
if (-not (Test-Path $thumbPath)) { Write-Warn "Add .thumbnail.png to project root or update mod.json/PublishConfiguration to point to an existing thumbnail." }
Write-Host "If you paste the build output above I can diagnose further." -ForegroundColor Cyan

exit 0
