#!/bin/bash

# Script to generate basic Tauri icons for macOS
# This creates simple colored squares as placeholder icons

echo "Generating placeholder icons for Tauri..."

# Create icons directory if it doesn't exist
mkdir -p src-tauri/icons

# Create a simple base icon (512x512) using sips
# We'll create a simple gradient background
cat > /tmp/icon_base.svg << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#C084FC;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="80" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="200" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">⏱️</text>
</svg>
EOF

# Check if rsvg-convert is available (for SVG to PNG conversion)
if command -v rsvg-convert &> /dev/null; then
    echo "Using rsvg-convert to generate PNG icons..."
    rsvg-convert -w 512 -h 512 /tmp/icon_base.svg -o /tmp/icon_512.png

    # Generate different sizes
    sips -z 32 32 /tmp/icon_512.png --out src-tauri/icons/32x32.png
    sips -z 128 128 /tmp/icon_512.png --out src-tauri/icons/128x128.png
    sips -z 256 256 /tmp/icon_512.png --out src-tauri/icons/128x128@2x.png
    sips -z 512 512 /tmp/icon_512.png --out src-tauri/icons/icon.png

    # Create .icns for macOS
    mkdir -p /tmp/icon.iconset
    sips -z 16 16 /tmp/icon_512.png --out /tmp/icon.iconset/icon_16x16.png
    sips -z 32 32 /tmp/icon_512.png --out /tmp/icon.iconset/icon_16x16@2x.png
    sips -z 32 32 /tmp/icon_512.png --out /tmp/icon.iconset/icon_32x32.png
    sips -z 64 64 /tmp/icon_512.png --out /tmp/icon.iconset/icon_32x32@2x.png
    sips -z 128 128 /tmp/icon_512.png --out /tmp/icon.iconset/icon_128x128.png
    sips -z 256 256 /tmp/icon_512.png --out /tmp/icon.iconset/icon_128x128@2x.png
    sips -z 256 256 /tmp/icon_512.png --out /tmp/icon.iconset/icon_256x256.png
    sips -z 512 512 /tmp/icon_512.png --out /tmp/icon.iconset/icon_256x256@2x.png
    sips -z 512 512 /tmp/icon_512.png --out /tmp/icon.iconset/icon_512x512.png
    cp /tmp/icon_512.png /tmp/icon.iconset/icon_512x512@2x.png

    iconutil -c icns /tmp/icon.iconset -o src-tauri/icons/icon.icns

    # Create .ico for Windows (using sips to convert to BMP, then manual ICO creation would be needed)
    # For now, create a placeholder
    cp src-tauri/icons/icon.png src-tauri/icons/icon.ico

    echo "✅ Icons generated successfully!"
else
    echo "⚠️  rsvg-convert not found. Installing homebrew librsvg..."
    echo "Please run: brew install librsvg"
    echo "Then run this script again."
    exit 1
fi

# Clean up temp files
rm -f /tmp/icon_base.svg /tmp/icon_512.png
rm -rf /tmp/icon.iconset

echo "Icons created in src-tauri/icons/"
