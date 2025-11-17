const fs = require('fs');
const path = require('path');

// Copy manifest.json
const manifestSrc = path.resolve(__dirname, '..', 'manifest.json');
const manifestDest = path.resolve(__dirname, '..', 'dist', 'manifest.json');
if (!fs.existsSync(manifestSrc)) { 
  console.error('manifest.json not found'); 
  process.exit(1); 
}
fs.copyFileSync(manifestSrc, manifestDest);
console.log('manifest.json copied to dist/');

// Note: Vite automatically copies public/ directory contents to dist/
// and processes HTML files from root based on vite.config.js
