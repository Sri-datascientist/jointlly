# Import jointlly_dump.sql into local MySQL database `jointlly`.
# Usage (from jointlly_backend):
#   .\scripts\import_jointlly_dump.ps1 -RootPassword "your-mysql-root-password"
#
# Or if jointlly_user already exists:
#   .\scripts\import_jointlly_dump.ps1 -SkipUserSetup

param(
    [string]$RootPassword = "",
    [switch]$SkipUserSetup
)

$ErrorActionPreference = "Stop"
$BackendRoot = Split-Path $PSScriptRoot -Parent
$DumpFile = Join-Path $BackendRoot "jointlly_dump.sql"
$SetupSql = Join-Path $PSScriptRoot "setup_jointlly_db.sql"
$Mysql = "mysql"

if (-not (Test-Path $DumpFile)) {
    Write-Error "Dump not found: $DumpFile"
}

if (-not $SkipUserSetup) {
    if (-not $RootPassword) {
        Write-Error "Provide -RootPassword (MySQL root) or use -SkipUserSetup if jointlly_user already exists."
    }
    Write-Host "Creating database and jointlly_user..."
    Get-Content $SetupSql -Raw -Encoding UTF8 | & $Mysql -u root "-p$RootPassword" --default-character-set=utf8mb4
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host "Importing jointlly_dump.sql (this may take a minute)..."
Get-Content $DumpFile -Raw -Encoding UTF8 | & $Mysql -u jointlly_user "-pJointlly2026_secure" --default-character-set=utf8mb4 jointlly
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Verifying..."
& $Mysql -u jointlly_user "-pJointlly2026_secure" jointlly -e "SELECT COUNT(*) AS table_count FROM information_schema.tables WHERE table_schema='jointlly'; SELECT COUNT(*) AS user_rows FROM users;"
Write-Host "Done."
