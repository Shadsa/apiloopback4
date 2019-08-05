$headers = @{Authorization="Bearer $args"}
Write-Host "$args[0]"
Invoke-WebRequest -Uri "http://localhost:3000/ping" -Header $headers -Method GET -ContentType "application/json"
