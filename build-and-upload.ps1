param (
    [string]$server
)

Write-Output "Building..."
npx tsc
Write-Output "Uploading to $server..."
ssh -i "~/.ssh/AWS.pem" ubuntu@"$server" 'mkdir -p SimpleAdminBot/dist; exit;'
scp -i "~/.ssh/AWS.pem" -r .\dist\* ubuntu@"$server":SimpleAdminBot\dist
scp -i "~/.ssh/AWS.pem" *.json ubuntu@"$server":SimpleAdminBot\
Write-Output "Upload complete!"