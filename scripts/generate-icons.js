// Script to generate PWA icon files
const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="76" fill="url(#grad)"/>
  <text x="256" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="200" font-weight="bold" text-anchor="middle" fill="white">₹</text>
  <text x="256" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">TRACKER</text>
</svg>
`;

const svgIcon192 = `
<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="192" height="192" rx="29" fill="url(#grad)"/>
  <text x="96" y="90" font-family="system-ui, -apple-system, sans-serif" font-size="75" font-weight="bold" text-anchor="middle" fill="white">₹</text>
  <text x="96" y="143" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="white">TRACKER</text>
</svg>
`;

// Save the SVG files to public directory
const publicDir = path.join(__dirname, '..', 'public');

fs.writeFileSync(path.join(publicDir, 'icon-512.svg'), svgIcon);
fs.writeFileSync(path.join(publicDir, 'icon-192.svg'), svgIcon192);

// For now, we'll use SVG files. In production, you'd convert these to PNG
// You can use the .svg files directly or convert them to PNG using a tool like sharp or canvas

console.log('Icon files generated successfully!');
console.log('Note: For better compatibility, consider converting SVG to PNG files.');
