# SidekickAI Extension - Debugging Guide

## Quick Fix Steps

1. **Rebuild the extension:**
   ```bash
   npm run build
   ```

2. **Reload extension in Chrome:**
   - Go to `chrome://extensions/`
   - Find "SidekickAI — Multi-Model Chat"
   - Click the **reload icon** (🔄)

3. **Test on a regular webpage:**
   - Open `https://example.com` or any regular website
   - Click the SidekickAI extension icon
   - Check browser console (F12) for `[SidekickAI]` messages

## Debugging Steps

### Step 1: Check Background Script

1. Go to `chrome://extensions/`
2. Find SidekickAI extension
3. Click **"service worker"** link (or "Inspect views: service worker")
4. This opens the background script console
5. Click the extension icon on a webpage
6. Look for messages starting with `[SidekickAI]`

**What to look for:**
- `[SidekickAI] Extension icon clicked on tab: X`
- `[SidekickAI] Injecting content script...`
- `[SidekickAI] Content script injected`
- `[SidekickAI] Content script ready for tab: X`
- `[SidekickAI] Sidebar toggled successfully`

**If you see errors:**
- Note the error message
- Check if it's a permission issue
- Verify the tab URL is not `chrome://` or `chrome-extension://`

### Step 2: Check Content Script

1. Open any regular webpage (e.g., `https://example.com`)
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Click the SidekickAI extension icon
5. Look for messages starting with `[SidekickAI]`

**What to look for:**
- `[SidekickAI] Content script loaded`
- `[SidekickAI] Received message: toggleSidebar`
- `[SidekickAI] Toggling sidebar...`
- `[SidekickAI] Injecting sidebar...`
- `[SidekickAI] Sidebar URL: chrome-extension://.../sidebar.html`
- `[SidekickAI] Iframe loaded successfully`

**If you see errors:**
- Check if content script is being injected
- Verify the sidebar URL is correct
- Check for CSP (Content Security Policy) errors

### Step 3: Check if Iframe is Created

In the webpage console (F12), type:
```javascript
document.getElementById('sidekickai-iframe')
```

**Expected result:**
- Should return the iframe element
- If `null`, the iframe wasn't created

**If iframe exists but not visible:**
```javascript
const iframe = document.getElementById('sidekickai-iframe');
console.log('Display:', window.getComputedStyle(iframe).display);
console.log('Visibility:', window.getComputedStyle(iframe).visibility);
console.log('Z-index:', window.getComputedStyle(iframe).zIndex);
```

### Step 4: Check Sidebar HTML

1. In background script console, get the sidebar URL:
   ```javascript
   chrome.runtime.getURL('sidebar.html')
   ```
2. Copy the URL and open it in a new tab
3. If it loads, the HTML file is fine
4. If it doesn't, check the build output

### Step 5: Check React App Loading

1. Open the sidebar.html URL in a new tab
2. Open DevTools (F12) on that tab
3. Check Console for React errors
4. Check if `#root` element exists:
   ```javascript
   document.getElementById('root')
   ```

## Common Issues & Solutions

### Issue: "Cannot access iframe content (CSP)"
**Solution:** This is normal for cross-origin iframes. The iframe should still work.

### Issue: "Content script did not become ready in time"
**Solution:** 
- Refresh the webpage
- Try clicking the extension icon again
- Check if there are JavaScript errors on the page

### Issue: Sidebar appears but is blank
**Solution:**
- Check React app console (open sidebar.html directly)
- Verify assets are loading (check Network tab)
- Check if API keys are set in Options

### Issue: Extension icon doesn't respond
**Solution:**
- Check background script console for errors
- Verify extension is enabled in `chrome://extensions/`
- Try reloading the extension

### Issue: Works on some pages but not others
**Solution:**
- Some pages have strict CSP that blocks iframes
- Some pages block content script injection
- Try on different websites

## Manual Test

To manually test if the content script works:

1. Open any webpage
2. Press F12 → Console
3. Paste this code:
   ```javascript
   const iframe = document.createElement('iframe');
   iframe.src = chrome.runtime.getURL('sidebar.html');
   iframe.style.cssText = 'position:fixed;right:0;top:0;width:420px;height:100vh;border:0;z-index:999999;';
   document.body.appendChild(iframe);
   ```
4. If sidebar appears, the issue is with message passing
5. If sidebar doesn't appear, the issue is with the HTML/React app

## Still Not Working?

1. **Check all console logs** (background + content script)
2. **Verify build output** - ensure `dist/` folder has all files
3. **Try a fresh install:**
   - Remove extension from Chrome
   - Delete `dist/` folder
   - Run `npm run build`
   - Load extension again
4. **Check Chrome version** - Ensure you're using a recent version
5. **Disable other extensions** - They might interfere

## Expected Console Output

When clicking the extension icon, you should see:

**Background Script:**
```
[SidekickAI] Extension icon clicked on tab: 123 https://example.com
[SidekickAI] Injecting content script...
[SidekickAI] Content script injected, waiting for ready signal...
[SidekickAI] Content script ready for tab: 123
[SidekickAI] Sidebar toggled successfully
```

**Content Script (on webpage):**
```
[SidekickAI] Content script loaded
[SidekickAI] Received message: toggleSidebar string
[SidekickAI] Toggling sidebar...
[SidekickAI] Injecting sidebar...
[SidekickAI] Sidebar URL: chrome-extension://abc123/sidebar.html
[SidekickAI] Sidebar injected successfully, iframe element: <iframe>
[SidekickAI] Iframe loaded successfully
```

If you don't see these messages, note which step is missing and check the corresponding section above.

