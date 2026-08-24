# Run as Administrator: resets local MySQL root to Jointlly2026_secure,
# creates jointlly DB + jointlly_user, imports jointlly_dump.sql.
#
# Right-click PowerShell -> Run as administrator, then:
#   cd "C:\path\to\jointlly\jointlly_backend"
#   .\scripts\reset_and_import_as_admin.ps1

$ErrorActionPreference = "Stop"
$MysqlBin = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
$BackendRoot = Split-Path $PSScriptRoot -Parent
$InitFile = Join-Path $PSScriptRoot "mysql_init_reset.sql"
$DumpFile = Join-Path $BackendRoot "jointlly_dump.sql"

if (-not (Test-Path $MysqlBin)) {
    Write-Error "MySQL 8.0 not found at $MysqlBin"
}
if (-not (Test-Path $DumpFile)) {
    Write-Error "Dump not found: $DumpFile"
}

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator
)
if (-not $isAdmin) {
    Write-Error "Run this script in an elevated (Administrator) PowerShell window."
}

Write-Host "Stopping MySQL80..."
Stop-Service MySQL80 -Force -ErrorAction Stop
Start-Sleep -Seconds 3

Write-Host "Applying init file (reset root + create jointlly_user)..."
$mysqld = Join-Path $MysqlBin "mysqld.exe"
$p = Start-Process -FilePath $mysqld -ArgumentList @("--init-file=$InitFile", "--console") -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 12
if (-not $p.HasExited) {
    Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
}
Start-Sleep -Seconds 2

Write-Host "Starting MySQL80 service..."
Start-Service MySQL80
Start-Sleep -Seconds 6

$mysql = Join-Path $MysqlBin "mysql.exe"
Write-Host "Testing jointlly_user connection..."
& $mysql -u jointlly_user "-pJointlly2026_secure" -h 127.0.0.1 -e "SELECT 1 AS ok;"
if ($LASTEXITCODE -ne 0) {
    Write-Error "jointlly_user still cannot connect after init. Check MySQL error log."
}

Write-Host "Importing dump into jointlly..."
Get-Content $DumpFile -Raw -Encoding UTF8 | & $mysql -u jointlly_user "-pJointlly2026_secure" -h 127.0.0.1 --default-character-set=utf8mb4 jointlly
if ($LASTEXITCODE -ne 0) {
    Write-Error "Dump import failed."
}

Write-Host "Verification:"
& $mysql -u jointlly_user "-pJointlly2026_secure" -h 127.0.0.1 jointlly -e @"
SELECT COUNT(*) AS tables_count FROM information_schema.tables WHERE table_schema='jointlly';
SELECT COUNT(*) AS users_count FROM users;
SELECT email, role FROM users WHERE role='ADMIN' LIMIT 5;
"@

Write-Host ""
Write-Host "Done. Credentials:"
Write-Host "  root / Jointlly2026_secure"
Write-Host "  jointlly_user / Jointlly2026_secure"
Write-Host "  DATABASE_URL=mysql+aiomysql://jointlly_user:Jointlly2026_secure@127.0.0.1:3306/jointlly"
