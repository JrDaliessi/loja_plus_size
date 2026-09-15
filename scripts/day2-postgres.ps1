param(
  [Parameter(Mandatory = $true, Position = 0)]
  [ValidateSet('Start', 'Stop', 'Status')]
  [string]$Action
)

$ErrorActionPreference = 'Stop'

$day2RepositoryRoot = Split-Path -Parent $PSScriptRoot
$day2PostgresBin = 'C:\Program Files\PostgreSQL\17\bin'
$day2PostgresData = Join-Path $day2RepositoryRoot '.tmp\postgres-day2'
$day2PostgresLog = Join-Path $day2PostgresData 'postgres.log'
$day2PostgresPort = 55432
$day2DatabaseName = 'plus_store_day2_test'
$day2PrismaSpikeDatabaseName = 'plus_store_day2_prisma7_spike'

$day2InitDb = Join-Path $day2PostgresBin 'initdb.exe'
$day2PgCtl = Join-Path $day2PostgresBin 'pg_ctl.exe'
$day2Psql = Join-Path $day2PostgresBin 'psql.exe'
$day2CreateDb = Join-Path $day2PostgresBin 'createdb.exe'

foreach ($day2Executable in @($day2InitDb, $day2PgCtl, $day2Psql, $day2CreateDb)) {
  if (-not (Test-Path -LiteralPath $day2Executable)) {
    throw "PostgreSQL 17 executable not found: $day2Executable"
  }
}

function Test-Day2PostgresRunning {
  if (-not (Test-Path -LiteralPath (Join-Path $day2PostgresData 'PG_VERSION'))) {
    return $false
  }

  & $day2PgCtl -D $day2PostgresData status *> $null
  return $LASTEXITCODE -eq 0
}

function Start-Day2Postgres {
  if (-not (Test-Path -LiteralPath (Join-Path $day2PostgresData 'PG_VERSION'))) {
    New-Item -ItemType Directory -Path $day2PostgresData -Force | Out-Null
    & $day2InitDb -D $day2PostgresData --username=postgres --auth=trust --encoding=UTF8 --no-locale
    if ($LASTEXITCODE -ne 0) {
      throw "initdb failed with exit code $LASTEXITCODE"
    }
  }

  if (-not (Test-Day2PostgresRunning)) {
    & $day2PgCtl -D $day2PostgresData -l $day2PostgresLog -o "-p $day2PostgresPort -h 127.0.0.1" -w start
    if ($LASTEXITCODE -ne 0) {
      throw "pg_ctl start failed with exit code $LASTEXITCODE"
    }
  }

  foreach ($day2RequiredDatabase in @($day2DatabaseName, $day2PrismaSpikeDatabaseName)) {
    $day2DatabaseExists = & $day2Psql -h 127.0.0.1 -p $day2PostgresPort -U postgres -d postgres -t -A -c "select 1 from pg_database where datname = '$day2RequiredDatabase';"
    if ($day2DatabaseExists -ne '1') {
      & $day2CreateDb -h 127.0.0.1 -p $day2PostgresPort -U postgres $day2RequiredDatabase
      if ($LASTEXITCODE -ne 0) {
        throw "createdb failed for $day2RequiredDatabase with exit code $LASTEXITCODE"
      }
    }
  }

  Write-Output "PostgreSQL test target ready: postgresql://postgres@127.0.0.1:$day2PostgresPort/$day2DatabaseName"
  Write-Output "Prisma 7 spike target ready: postgresql://postgres@127.0.0.1:$day2PostgresPort/$day2PrismaSpikeDatabaseName"
}

function Stop-Day2Postgres {
  if (Test-Day2PostgresRunning) {
    & $day2PgCtl -D $day2PostgresData -m fast -w stop
    if ($LASTEXITCODE -ne 0) {
      throw "pg_ctl stop failed with exit code $LASTEXITCODE"
    }
  }

  Write-Output 'PostgreSQL test target stopped.'
}

switch ($Action) {
  'Start' { Start-Day2Postgres }
  'Stop' { Stop-Day2Postgres }
  'Status' {
    if (Test-Day2PostgresRunning) {
      Write-Output "PostgreSQL test target is running on 127.0.0.1:$day2PostgresPort."
    } else {
      Write-Output 'PostgreSQL test target is stopped.'
    }
  }
}
