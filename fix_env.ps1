try {
    [Environment]::SetEnvironmentVariable("CURL_CA_BUNDLE", $null, "User")
    Write-Host "Removed from User scope."
} catch {
    Write-Host "Error removing from User scope: $_"
}

try {
    [Environment]::SetEnvironmentVariable("CURL_CA_BUNDLE", $null, "Machine")
    Write-Host "Removed from Machine scope."
} catch {
    Write-Host "Error removing from Machine scope (requires Admin): $_"
}
