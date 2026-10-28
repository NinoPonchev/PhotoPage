# Creates web copies only; never changes photographs in images/.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$destination = Join-Path $root 'images/web'
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
$parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]85)
foreach ($file in Get-ChildItem -LiteralPath (Join-Path $root 'images') -File | Where-Object Extension -match '^\.jpe?g$') {
    $original = [System.Drawing.Image]::FromFile($file.FullName)
    try {
        foreach ($width in @(600, 1200, 1920)) {
            $height = [int][Math]::Round($original.Height * $width / $original.Width)
            $copy = [System.Drawing.Bitmap]::new($width, $height)
            $graphics = [System.Drawing.Graphics]::FromImage($copy)
            try {
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.DrawImage($original, 0, 0, $width, $height)
                $copy.Save((Join-Path $destination "$($file.BaseName)-$width.jpg"), $encoder, $parameters)
            } finally { $graphics.Dispose(); $copy.Dispose() }
        }
    } finally { $original.Dispose() }
}
$parameters.Dispose()
Write-Output 'Web copies generated. Originals preserved.'
