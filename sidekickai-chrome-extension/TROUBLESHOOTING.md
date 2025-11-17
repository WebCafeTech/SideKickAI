# SidekickAI Extension - Troubleshooting Guide

## Extension Not Loading / Blank Screen

### Quick Fix Steps

1. **Clean Rebuild:**
   ```bash
   # Delete old build
   rm -rf dist node_modules
   
   # Reinstall dependencies
   npm install
   
   # Rebuild
   npm run build
   ```

2. **Reload Extension:**
   - Go to `chrome://extensions/`
   - Find SidekickAI
   - Click **Remove** (trash icon)
   - Click **Load unpacked** again
   - Select the `dist/` folder

3. **Check Console Errors:**
   - Open the sidebar (click extension icon)
   - Right-click inside the sidebar → **Inspect**
   - Check Console tab for errors
   - Look for `[SidekickAI]` messages

### Common Issues

#### Issue: Blank white screen
**Solution:**
- Check if React app is loading (look for `[SidekickAI] React app rendered successfully` in console)
- Verify `dist/sidebar.html` exists and has correct script tags
- Check if assets are loading (Network tab in DevTools)

#### Issue: "Root element not found"
**Solution:**
- Verify `sidebar.html` has `<div id="root"></div>`
- Check if HTML file is being loaded correctly

#### Issue: "chrome.runtime is not available"
**Solution:**
- This means the iframe is not in an extension context
- Verify the sidebar.html is loaded via `chrome.runtime.getURL()`
- Check manifest.json has correct `web_accessible_resources`

#### Issue: Assets not loading (404 errors)
**Solution:**
- Verify `base: './'` is set in `vite.config.js`
- Check that assets are in `dist/assets/` folder
- Ensure manifest.json allows assets in `web_accessible_resources`

### Debug Checklist

- [ ] Extension is enabled in Chrome
- [ ] `dist/` folder contains all files
- [ ] `dist/manifest.json` exists
- [ ] `dist/sidebar.html` exists
- [ ] `dist/assets/` folder has JS and CSS files
- [ ] No errors in background script console
- [ ] No errors in sidebar iframe console
- [ ] Content script is being injected (check webpage console)

### Manual Test

1. **Test sidebar.html directly:**
   - In background script console, run:
     ```javascript
     chrome.runtime.getURL('sidebar.html')
     ```
   - Copy the URL and open it in a new tab
   - If it loads, the HTML is fine
   - If it doesn't, check the build

2. **Test content script:**
   - Open any webpage
   - Press F12 → Console
   - Type: `document.getElementById('sidekickai-iframe')`
   - Should return the iframe element if sidebar is open

3. **Test React app:**
   - Open sidebar
   - Right-click inside sidebar → Inspect
   - Check if `#root` element exists
   - Check if React components are rendered

### Still Not Working?

1. **Check build output:**
   ```bash
   ls -la dist/
   ls -la dist/assets/
   ```

2. **Verify file paths in sidebar.html:**
   - Open `dist/sidebar.html`
   - Check script src paths are relative (start with `./`)
   - Not absolute paths (starting with `/`)

3. **Check Chrome extension errors:**
   - Go to `chrome://extensions/`
   - Find SidekickAI
   - Look for error messages (red text)
   - Click "Errors" if available

4. **Try a fresh install:**
   - Remove extension completely
   - Delete `dist/` folder
   - Run `npm run build`
   - Load extension again

