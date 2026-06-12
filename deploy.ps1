<#
.SYNOPSIS
Deploys the ShopWave static website to an AWS S3 bucket.

.DESCRIPTION
This script automates the process of creating an S3 bucket (if it doesn't exist),
configuring it for static website hosting, updating the bucket policy to allow public read access,
and syncing the local HTML, CSS, and JS files to the bucket.

.PARAMETER BucketName
The name of the S3 bucket to create or use. Note: S3 bucket names must be globally unique.
Default is a generated name based on 'shopwave-website-' and a random number.

.EXAMPLE
.\deploy.ps1 -BucketName my-unique-shopwave-bucket-123
#>

param (
    [string]$BucketName = "shopwave-website-$(Get-Random -Minimum 10000 -Maximum 99999)"
)

$ErrorActionPreference = "Stop"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  ShopWave AWS S3 Deployment Script" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check if AWS CLI is installed
Write-Host "[1/5] Checking AWS CLI installation..." -ForegroundColor Yellow
if (!(Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Host "Error: AWS CLI is not installed or not in your PATH." -ForegroundColor Red
    Write-Host "Please download and install it from: https://aws.amazon.com/cli/" -ForegroundColor Red
    exit 1
}
Write-Host "AWS CLI is installed." -ForegroundColor Green

# 2. Check AWS Credentials
Write-Host "[2/5] Checking AWS credentials..." -ForegroundColor Yellow
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "AWS credentials verified." -ForegroundColor Green
} catch {
    Write-Host "Error: AWS credentials not configured or invalid." -ForegroundColor Red
    Write-Host "Please run 'aws configure' to set up your credentials." -ForegroundColor Red
    exit 1
}

# 3. Create S3 Bucket (or use existing)
Write-Host "[3/5] Setting up S3 bucket '$BucketName'..." -ForegroundColor Yellow
$bucketExists = $false
try {
    $ErrorActionPreference = "Continue"
    $check = aws s3 ls "s3://$BucketName" 2>&1
    if ($LASTEXITCODE -eq 0) {
        $bucketExists = $true
    }
} catch {
    # Ignore
}
$ErrorActionPreference = "Stop"

if ($bucketExists) {
    Write-Host "Bucket already exists. Proceeding..." -ForegroundColor Green
} else {
    try {
        aws s3 mb "s3://$BucketName" | Out-Null
        Write-Host "Bucket created successfully." -ForegroundColor Green
        Start-Sleep -Seconds 2 # Wait for bucket to be fully available
    } catch {
        Write-Host "Error creating bucket. Ensure the bucket name is globally unique." -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        exit 1
    }
}

# 4. Configure Static Website Hosting & Public Access
Write-Host "[4/5] Configuring bucket for public static website hosting..." -ForegroundColor Yellow
try {
    # Remove public access block
    aws s3api delete-public-access-block --bucket $BucketName | Out-Null

    # Configure static website hosting
    aws s3 website "s3://$BucketName" --index-document index.html | Out-Null

    # Apply bucket policy for public read access
    $policy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BucketName/*"
        }
    ]
}
"@
    $tempPolicyFile = [System.IO.Path]::GetTempFileName()
    [System.IO.File]::WriteAllText($tempPolicyFile, $policy)
    aws s3api put-bucket-policy --bucket $BucketName --policy "file://$tempPolicyFile" | Out-Null
    Remove-Item $tempPolicyFile

    Write-Host "Bucket configured for website hosting." -ForegroundColor Green
} catch {
    Write-Host "Error configuring bucket policy or website hosting." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# 5. Sync files to S3
Write-Host "[5/5] Uploading files to S3..." -ForegroundColor Yellow
try {
    # Sync HTML, CSS, JS and images folders. Exclude git, scripts, etc.
    aws s3 sync . "s3://$BucketName" --exclude ".git/*" --exclude "deploy.ps1" --exclude "Jenkinsfile" --exclude "Dockerfile" --exclude "task.md" --exclude "implementation_plan.md" --exclude "*.tmp" | Out-Null
    Write-Host "Files uploaded successfully." -ForegroundColor Green
} catch {
    Write-Host "Error uploading files." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Done!
$region = (aws configure get region)
if (-not $region) { $region = "us-east-1" }
$websiteUrl = "http://$BucketName.s3-website-$region.amazonaws.com"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete! " -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Your website is now live at:" -ForegroundColor White
Write-Host $websiteUrl -ForegroundColor Magenta
Write-Host ""
Write-Host "Note: It might take a minute for the DNS to propagate." -ForegroundColor Yellow
