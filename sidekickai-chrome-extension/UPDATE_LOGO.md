# Updating the Logo and Icons

## Current Setup

The extension uses:
- **Logo SVG**: `public/assets/logo.svg` (used in the app header)
- **Extension Icons**: `public/icons/icon16.png`, `icon48.png`, `icon128.png` (used by Chrome)

## Option 1: Using Your Own Image File

If you have the actual image file (PNG, JPG, or SVG):

1. **Replace the SVG logo**:
   - Save your image as `public/assets/logo.svg` (if it's SVG)
   - Or convert it to SVG format

2. **Generate extension icons**:
   ```bash
   npm install --save-dev sharp
   npm run generate-icons
   ```
   This will automatically generate the required PNG icons (16x16, 48x48, 128x128) from your SVG logo.

## Option 2: Manual Icon Creation

If you prefer to create icons manually:

1. Use an image editor (Photoshop, GIMP, Figma, etc.)
2. Create PNG files with these exact sizes:
   - `icon16.png` - 16x16 pixels
   - `icon48.png` - 48x48 pixels  
   - `icon128.png` - 128x128 pixels
3. Save them in `public/icons/` directory
4. Ensure they have transparent backgrounds for best results

## Option 3: Online Icon Generator

You can also use online tools like:
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/
- https://favicon.io/

Upload your logo and download the generated icon sizes.

## After Updating

1. Rebuild the extension:
   ```bash
   npm run build
   ```

2. Test the extension:
   - Load it in Chrome (chrome://extensions)
   - Check that the logo appears correctly in the sidebar header
   - Verify the extension icon appears in the Chrome toolbar

## Notes

- The logo should be square or close to square for best results
- For the extension icons, ensure they're recognizable at small sizes (16x16)
- The current logo uses a cyan/blue gradient - adjust colors in the SVG if needed

