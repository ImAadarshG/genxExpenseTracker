const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
  // Favicon sizes
  favicon: [16, 32, 48, 64],
  // PWA/Android sizes
  android: [72, 96, 128, 144, 152, 192, 384, 512],
  // iOS sizes
  ios: [57, 60, 72, 76, 114, 120, 144, 152, 180],
  // Apple Touch Icons
  appleTouchIcon: [180],
};

async function generateIcons() {
  const inputFile = path.join(__dirname, '../public/genxet-logo.png');
  const publicDir = path.join(__dirname, '../public');
  const iconsDir = path.join(publicDir, 'icons');

  // Create icons directory if it doesn't exist
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  console.log('🎨 Generating app icons for genxet...');

  try {
    // Generate favicon.ico (multi-resolution)
    console.log('✨ Creating favicon.ico...');
    await sharp(inputFile)
      .resize(32, 32)
      .toFile(path.join(publicDir, 'favicon.ico'));

    // Generate various favicon sizes
    for (const size of sizes.favicon) {
      console.log(`📱 Creating favicon-${size}x${size}.png...`);
      await sharp(inputFile)
        .resize(size, size, {
          kernel: sharp.kernel.lanczos3,
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toFile(path.join(publicDir, `favicon-${size}x${size}.png`));
    }

    // Generate Android/PWA icons
    for (const size of sizes.android) {
      console.log(`🤖 Creating android-chrome-${size}x${size}.png...`);
      await sharp(inputFile)
        .resize(size, size, {
          kernel: sharp.kernel.lanczos3,
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
    }

    // Generate Apple Touch Icon
    console.log('🍎 Creating apple-touch-icon.png...');
    await sharp(inputFile)
      .resize(180, 180, {
        kernel: sharp.kernel.lanczos3,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    // Generate iOS icons
    for (const size of sizes.ios) {
      console.log(`📱 Creating apple-icon-${size}x${size}.png...`);
      await sharp(inputFile)
        .resize(size, size, {
          kernel: sharp.kernel.lanczos3,
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toFile(path.join(iconsDir, `apple-icon-${size}x${size}.png`));
    }

    // Generate maskable icon for PWA (with padding)
    console.log('🎭 Creating maskable icon...');
    const padding = 0.1;
    await sharp(inputFile)
      .resize(512, 512, {
        kernel: sharp.kernel.lanczos3,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .extend({
        top: Math.floor(512 * padding),
        bottom: Math.floor(512 * padding),
        left: Math.floor(512 * padding),
        right: Math.floor(512 * padding),
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .resize(512, 512)
      .toFile(path.join(iconsDir, 'icon-maskable-512x512.png'));

    console.log('✅ All icons generated successfully!');
    console.log('🚀 Your genxet app icons are ready!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
