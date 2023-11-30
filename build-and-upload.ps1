param (
    [string]$server
)

Write-Output "Building..."
npx tsc
mv -Force .\dist\types\constants.prod.js .\dist\types\constants.js
copy -Path .\src\data\migrations -Destination .\dist\data\ -Recurse -Force
Write-Output "Packaging..."
tar -cf packaged.tgz .\dist
tar -rf packaged.tgz *.json
Write-Output "Uploading to $server..."
ssh -i "~/.ssh/AWS.pem" ubuntu@"$server" 'mkdir -p SimpleAdminBot; exit;'
scp -i "~/.ssh/AWS.pem" packaged.tgz ubuntu@"$server":SimpleAdminBot\packaged.tgz
Write-Output "Unpacking..."
ssh -i "~/.ssh/AWS.pem" ubuntu@"$server" 'tar -xf SimpleAdminBot/packaged.tgz -C SimpleAdminBot/; exit;'
Write-Output "Upload complete!"