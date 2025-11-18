/**
 * Script to generate extension icons from SVG logo
 * This script requires sharp to be installed: npm install --save-dev sharp
 * 
 * Usage: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Error: sharp is not installed. Please run: npm install --save-dev sharp');
  process.exit(1);
}

const svgPath = path.join(__dirname, '../public/assets/logo.svg');
const iconsDir = path.join(__dirname, '../public/icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes needed for Chrome extension
const sizes = [16, 48, 128];

async function generateIcons() {
  try {
    const svgBuffer = fs.readFileSync(svgPath);
    
    console.log('Generating extension icons from logo.svg...');
    
    for (const size of sizes) {
      const outputPath = path.join(iconsDir, `icon${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated icon${size}.png (${size}x${size})`);
    }
    
    console.log('\n✅ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

