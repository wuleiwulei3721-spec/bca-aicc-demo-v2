$securePassword = Read-Host -Prompt 'Local MySQL password' -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)

try {
  $env:AICC_MYSQL_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
  node "$PSScriptRoot\inspect-mysql-schema.mjs"
  exit $LASTEXITCODE
}
finally {
  $env:AICC_MYSQL_PASSWORD = $null
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
}
