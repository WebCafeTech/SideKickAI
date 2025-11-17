# SidekickAI Chrome Extension (React + Vite)

This repository contains a React-based Chrome extension named SidekickAI that injects a right-side AI chat panel into any page. It supports multiple AI providers (OpenAI, Hugging Face, Gemini, custom endpoint) via the background service worker.

## Project Overview

**SidekickAI** is a Chrome extension that:
- Injects a right-side chat panel into any webpage
- Supports multiple AI providers (OpenAI, Hugging Face, Gemini, custom endpoints)
- Can read content from the left side of the page
- Helps with quiz detection and answering
- Provides a React-based UI for chat interactions

### Project Structure
```
sidekickai-chrome-extension/
├── public/              # Static files (HTML, icons, scripts)
│   ├── background.js    # Service worker for API calls
│   ├── contentScript.js # Injects sidebar into pages
│   ├── sidebar.html     # Main chat UI entry point
│   ├── options.html     # Settings/options page
│   └── icons/           # Extension icons
├── src/                 # React source code
│   ├── main.jsx         # Sidebar React entry
│   ├── options-main.jsx # Options page React entry
│   └── ui/              # React components
├── scripts/             # Build scripts
├── manifest.json        # Extension manifest
├── vite.config.js       # Vite build configuration
└── package.json         # Dependencies and scripts
```

## Prerequisites

- **Node.js** version 16 or higher ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Google Chrome** browser

## Installation & Setup

### 1. Install Dependencies

Navigate to the project directory and install dependencies:

```bash
cd sidekickai-chrome-extension
npm install
```

This will install:
- React 18.2.0
- React DOM 18.2.0
- Vite 5.0.0
- @vitejs/plugin-react

### 2. Build the Extension

Build the extension for production:

```bash
npm run build
```

This command:
- Compiles React components using Vite
- Bundles all assets into the `dist/` folder
- Copies `manifest.json` to `dist/`
- Copies static files (background.js, contentScript.js, icons, etc.)

**Output:** A `dist/` folder containing all extension files ready to load in Chrome.

## Loading the Extension in Chrome

### Step-by-Step Instructions

1. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or go to: Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Toggle the **"Developer mode"** switch in the top-right corner

3. **Load the Extension**
   - Click **"Load unpacked"** button
   - Navigate to and select the `dist/` folder from this project
   - Click **"Select Folder"**

4. **Verify Installation**
   - You should see "SidekickAI — Multi-Model Chat" in your extensions list
   - The extension icon should appear in your Chrome toolbar

## Configuration (Required)

Before using the extension, you must configure API keys:

1. **Open Options Page**
   - Right-click the SidekickAI extension icon → **Options**
   - Or go to `chrome://extensions/` → Find SidekickAI → Click **"Details"** → Click **"Extension options"**

2. **Enter API Keys**
   - Select your preferred AI provider (OpenAI, Hugging Face, Gemini, or Custom)
   - Enter the corresponding API key(s)
   - Save your settings

**Note:** API keys are stored locally in Chrome's storage. For production, consider using a proxy backend to store API keys securely.

## Testing the Extension

### Basic Functionality Test

1. **Open any webpage** (e.g., `https://example.com`)

2. **Activate the Sidebar**
   - Click the SidekickAI extension icon in the Chrome toolbar
   - A right-side chat panel should appear (420px wide)

3. **Test Chat Functionality**
   - Type a message in the chat input
   - Send the message
   - Verify the AI response appears

### Advanced Testing

#### Test Content Reading
- The extension can read text from the left side of the page
- Try asking: "What's on the left side of this page?"

#### Test Quiz Detection
- Navigate to a page with quiz questions (radio buttons or checkboxes)
- The extension should detect quiz elements
- Ask: "Help me with this quiz"

#### Test Multiple Providers
1. Go to Options page
2. Switch between different AI providers
3. Test each provider with a simple query
4. Verify responses are received

### Testing Checklist

- [ ] Extension loads without errors in Chrome
- [ ] Extension icon appears in toolbar
- [ ] Clicking icon toggles sidebar on/off
- [ ] Sidebar appears on the right side (420px wide)
- [ ] Options page opens and saves settings
- [ ] API keys can be configured
- [ ] Chat messages send and receive responses
- [ ] Content reading works (left side of page)
- [ ] Quiz detection works on quiz pages
- [ ] Multiple AI providers can be switched
- [ ] Extension works on different websites

## Development Mode

For development with hot-reload (note: Chrome extensions require rebuild for changes):

```bash
npm run dev
```

However, since this is a Chrome extension, you'll need to:
1. Make changes to source files
2. Run `npm run build` to rebuild
3. Reload the extension in Chrome (`chrome://extensions/` → Click reload icon)

## Build Scripts

- `npm run build` - Build production bundle to `dist/`
- `npm run dev` - Start Vite dev server (for component development)
- `npm run preview` - Preview the built files
- `npm run zip` - Create a zip file of the dist folder (for distribution)

## Troubleshooting

### Extension won't load
- Ensure you selected the `dist/` folder (not the root project folder)
- Check that `dist/manifest.json` exists
- Open Chrome DevTools Console for errors

### API calls failing
- Verify API keys are correctly entered in Options
- Check browser console for error messages
- Ensure you have internet connectivity
- Verify API key permissions/quotas

### Sidebar not appearing
- Check if content script is injected (Chrome DevTools → Console)
- Verify the page allows iframe injection
- Try reloading the page after installing extension

### Build errors
- Ensure Node.js version is 16+
- Delete `node_modules` and `dist` folders, then run `npm install` again
- Check that all dependencies are installed

## Security Notes

⚠️ **Important Security Considerations:**
- API keys are currently stored in Chrome's local storage (client-side)
- This is acceptable for personal use but **not recommended for production**
- For production deployment, implement a proxy backend to:
  - Store API keys server-side
  - Handle API calls from the server
  - Prevent API key exposure in the extension

## Additional Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Vite Documentation](https://vitejs.dev/)
