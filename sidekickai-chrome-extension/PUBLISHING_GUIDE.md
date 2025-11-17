# Publishing Guide: Chrome Web Store & Microsoft Edge Add-ons

This guide will help you publish SidekickAI to both the Chrome Web Store and Microsoft Edge Add-ons store.

## 📋 Prerequisites

### 1. Developer Accounts
- **Chrome Web Store**: 
  - One-time registration fee: **$5 USD** (one-time payment)
  - Sign up at: https://chrome.google.com/webstore/devconsole
  - Use your Google account

- **Microsoft Edge Add-ons**:
  - **FREE** (no registration fee)
  - Sign up at: https://partner.microsoft.com/dashboard/account/v3/enrollment
  - Use your Microsoft account

### 2. Required Assets

Before publishing, ensure you have:

#### Icons (Already have these ✅)
- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels  
- `icon128.png` - 128x128 pixels

#### Additional Assets Needed:

1. **Screenshots** (Required):
   - **Chrome**: At least 1 screenshot (1280x800 or 640x400 recommended)
   - **Edge**: At least 1 screenshot (1280x800 or 640x400 recommended)
   - **Recommended**: 3-5 screenshots showing key features
   - Format: PNG or JPEG

2. **Promotional Images** (Optional but recommended):
   - **Small promotional tile**: 440x280 pixels
   - **Large promotional tile**: 920x680 pixels
   - **Marquee promotional tile**: 1400x560 pixels

3. **Privacy Policy** (Required):
   - Must be hosted on a publicly accessible URL
   - Should explain what data is collected and how it's used
   - Since your extension uses API keys stored locally, mention that

4. **Store Listing Details**:
   - **Name**: SidekickAI — Multi-Model Chat (or shorter: SidekickAI)
   - **Short Description**: 132 characters max
   - **Full Description**: Detailed description of features
   - **Category**: Productivity or Developer Tools
   - **Language**: English (and others if you support them)

## 🚀 Step-by-Step Publishing Process

### Part 1: Chrome Web Store

#### Step 1: Prepare Your Extension Package

1. **Build the extension**:
   ```bash
   npm run build
   ```

2. **Create a ZIP file** of the `dist` folder:
   ```bash
   cd dist
   zip -r ../sidekickai-extension.zip .
   ```
   
   Or use the provided script:
   ```bash
   node scripts/zip-dist.js
   ```

3. **Verify the ZIP contains**:
   - `manifest.json`
   - `background.js`
   - `contentScript.js` (if needed)
   - `sidebar.html`
   - `options.html`
   - `assets/` folder
   - `icons/` folder

#### Step 2: Create Privacy Policy

Create a privacy policy page. Here's a template:

**Privacy Policy Template** (host on GitHub Pages, your website, or a free hosting service):

```markdown
# SidekickAI Privacy Policy

**Last Updated**: [Date]

## Data Collection

SidekickAI is designed with privacy in mind:

- **API Keys**: All API keys (OpenAI, Gemini, Hugging Face) are stored locally on your device using Chrome's local storage. They are never transmitted to our servers.

- **Screenshots**: Screenshots are captured locally and only sent to the AI provider you choose (OpenAI, Gemini, etc.) when you explicitly request analysis. Screenshots are not stored by our extension.

- **Chat Messages**: All chat messages are processed by the AI provider you select. We do not store or log any chat messages.

- **No Analytics**: We do not collect analytics, usage data, or personal information.

## Third-Party Services

SidekickAI integrates with:
- OpenAI API
- Google Gemini API
- Hugging Face API

Your interactions with these services are subject to their respective privacy policies.

## Contact

For privacy concerns, contact: [Your Email]
```

**Free hosting options**:
- GitHub Pages (free)
- Netlify (free)
- Vercel (free)
- Google Sites (free)

#### Step 3: Submit to Chrome Web Store

1. **Go to Chrome Web Store Developer Dashboard**:
   - Visit: https://chrome.google.com/webstore/devconsole
   - Sign in with your Google account
   - Pay the $5 registration fee (one-time)

2. **Click "New Item"**:
   - Upload your ZIP file (`sidekickai-extension.zip`)
   - Wait for validation (may take a few minutes)

3. **Fill in Store Listing**:

   **Required Fields**:
   
   - **Name**: `SidekickAI` or `SidekickAI — Multi-Model Chat`
   
   - **Summary** (132 chars max):
     ```
     AI-powered sidebar assistant with multi-model support. Read content, answer quizzes, and chat with AI directly from any webpage.
     ```
   
   - **Description**:
     ```markdown
     # SidekickAI — Your AI Sidekick for Every Webpage
     
     SidekickAI is a powerful browser extension that brings AI assistance directly to your browsing experience. With a beautiful glassmorphism UI and support for multiple AI models, SidekickAI helps you work smarter, not harder.
     
     ## ✨ Key Features
     
     - **Multi-Model AI Support**: Choose from OpenAI (GPT-4o), Google Gemini, or Hugging Face models
     - **Smart Content Reading**: Automatically read and analyze content from the left side of any webpage
     - **Quiz Assistant**: Detect and answer multiple-choice questions (MCQ) instantly
     - **Screenshot Analysis**: Capture and analyze full-screen screenshots with vision-capable AI models
     - **Beautiful Themes**: 5 stunning themes including Glassmorphism, Liquid Glass, Neon Cyber, Aurora, and Minimal Dark
     - **Resizable Sidebar**: Pin, resize, and customize your AI assistant panel
     - **Markdown Support**: Rich text formatting with links, bold, italic, code blocks, and lists
     - **No API Key Required Option**: Quick access to ChatGPT web interface
     
     ## 🎨 Themes
     
     - **Glassmorphism**: Frosted glass effect with blur and transparency
     - **Liquid Glass**: Smooth, flowing glass with vibrant colors
     - **Neon Cyber**: Cyberpunk-inspired with neon accents
     - **Aurora**: Northern lights inspired with flowing gradients
     - **Minimal Dark**: Clean, minimal dark theme
     
     ## 🔒 Privacy
     
     All API keys are stored locally on your device. We don't collect, store, or transmit any of your data. Your privacy is our priority.
     
     ## 🚀 Getting Started
     
     1. Install the extension
     2. Click the extension icon to open the sidebar
     3. Go to Settings (⚙️) to configure your API keys
     4. Start chatting with AI!
     
     Perfect for students, professionals, and anyone who wants AI assistance while browsing the web.
     ```
   
   - **Category**: Select "Productivity" or "Developer Tools"
   
   - **Language**: English (United States)
   
   - **Privacy Policy URL**: [Your hosted privacy policy URL]
   
   - **Screenshots**: Upload 1-5 screenshots (1280x800 recommended)
     - Screenshot 1: Main sidebar interface
     - Screenshot 2: Theme selection
     - Screenshot 3: Screenshot capture feature
     - Screenshot 4: Options/settings page
     - Screenshot 5: Chat with formatting
   
   - **Promotional Images** (Optional):
     - Small tile: 440x280
     - Large tile: 920x680
     - Marquee: 1400x560

4. **Additional Information**:
   - **Single purpose**: Yes (AI assistant)
   - **Permission justification**: 
     ```
     - storage: To save user preferences and API keys locally
     - activeTab: To read content from the current webpage
     - scripting: To inject the sidebar interface
     - tabs: To open ChatGPT web interface in new tabs
     - host_permissions (<all_urls>): To work on any webpage the user visits
     ```

5. **Pricing & Distribution**:
   - **Pricing**: Free
   - **Visibility**: Public
   - **Regions**: All regions (or select specific ones)

6. **Submit for Review**:
   - Click "Submit for Review"
   - Review typically takes 1-3 business days
   - You'll receive email notifications about status

#### Step 4: After Submission

- **Review Status**: Check dashboard for updates
- **Common Issues**:
  - Missing privacy policy → Add one
  - Permission justification unclear → Update description
  - Screenshots missing → Add at least 1
  - Manifest errors → Fix and resubmit

---

### Part 2: Microsoft Edge Add-ons

#### Step 1: Prepare Extension

**Good News**: Edge uses the same format as Chrome! Your extension should work as-is.

1. **Build the extension** (same as Chrome):
   ```bash
   npm run build
   ```

2. **Create ZIP file** (same as Chrome):
   ```bash
   cd dist
   zip -r ../sidekickai-extension.zip .
   ```

#### Step 2: Submit to Microsoft Edge Add-ons

1. **Go to Partner Center**:
   - Visit: https://partner.microsoft.com/dashboard/microsoftedge/overview
   - Sign in with Microsoft account
   - **No registration fee required!**

2. **Create New Extension**:
   - Click "Create new extension"
   - Select "Microsoft Edge Add-on"

3. **Upload Package**:
   - Upload your ZIP file
   - Wait for validation

4. **Fill in Store Listing**:

   **Required Fields**:
   
   - **Name**: `SidekickAI`
   
   - **Short Description** (200 chars max):
     ```
     AI-powered sidebar assistant with multi-model support. Read content, answer quizzes, and chat with AI directly from any webpage.
     ```
   
   - **Full Description**: (Same as Chrome, but can be longer)
   
   - **Category**: Productivity
   
   - **Privacy Policy URL**: [Same URL as Chrome]
   
   - **Support URL** (Optional): Your GitHub repo or support email
   
   - **Screenshots**: Upload 1-5 screenshots (same as Chrome)
   
   - **Icon**: Upload 128x128 icon

5. **Additional Information**:
   - **Age Rating**: 13+ (or appropriate rating)
   - **Pricing**: Free
   - **Distribution**: Public

6. **Submit for Review**:
   - Click "Submit"
   - Review typically takes 1-5 business days
   - Edge reviews are usually faster than Chrome

---

## 📸 Creating Screenshots

### Recommended Screenshots:

1. **Main Interface**:
   - Show the sidebar open with a chat conversation
   - Highlight the glassmorphism theme

2. **Theme Selection**:
   - Show the options page with theme cards
   - Display multiple themes

3. **Screenshot Feature**:
   - Show screenshot capture in action
   - Display image in chat

4. **Settings Page**:
   - Show API key configuration
   - Display model selection

5. **Quiz Assistant**:
   - Show quiz detection and answering

### Screenshot Tips:

- Use a clean, professional webpage as background
- Highlight key features with annotations (optional)
- Use consistent styling
- Show real use cases
- Recommended size: 1280x800 pixels

---

## 🔄 Updating Your Extension

### Chrome Web Store:
1. Make changes to your code
2. Update version in `manifest.json` (e.g., 1.0.0 → 1.0.1)
3. Build and create new ZIP
4. Go to Developer Dashboard → Your Extension → "Package"
5. Upload new ZIP
6. Submit for review

### Microsoft Edge:
1. Same process as Chrome
2. Go to Partner Center → Your Extension
3. Upload new package
4. Submit for review

---

## 📝 Manifest Checklist

Before publishing, ensure your `manifest.json`:

- ✅ Has correct `manifest_version` (3)
- ✅ Has unique `name`
- ✅ Has clear `description`
- ✅ Has proper `version` (semantic versioning: 1.0.0)
- ✅ Lists all required `permissions`
- ✅ Has `host_permissions` if needed
- ✅ Has proper `action` with icons
- ✅ Has `options_page` if you have settings
- ✅ Has `web_accessible_resources` if needed

---

## 🎯 Best Practices

1. **Version Numbering**:
   - Use semantic versioning: `MAJOR.MINOR.PATCH`
   - Example: 1.0.0 → 1.0.1 (patch) → 1.1.0 (minor) → 2.0.0 (major)

2. **Testing**:
   - Test on multiple websites
   - Test all features before submission
   - Test with different themes
   - Test error handling

3. **Documentation**:
   - Clear README
   - Privacy policy
   - Support contact information

4. **Marketing**:
   - Good screenshots
   - Clear description
   - Highlight unique features
   - Use keywords appropriately

---

## 🆘 Troubleshooting

### Chrome Web Store Rejection Reasons:

1. **Privacy Policy Missing**: Add a privacy policy URL
2. **Permission Justification**: Explain why you need each permission
3. **Single Purpose Violation**: Ensure extension has one clear purpose
4. **Malware/Spam**: Ensure code is clean and legitimate

### Edge Add-ons Rejection Reasons:

1. **Similar to Chrome**: Usually same reasons
2. **Manifest Errors**: Fix any validation errors
3. **Missing Assets**: Ensure all required assets are included

---

## 📞 Support Resources

- **Chrome Web Store Help**: https://support.google.com/chrome_webstore
- **Edge Add-ons Help**: https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/
- **Chrome Extension Docs**: https://developer.chrome.com/docs/extensions/
- **Edge Extension Docs**: https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/

---

## ✅ Pre-Publishing Checklist

- [ ] Extension builds successfully (`npm run build`)
- [ ] ZIP file created and tested
- [ ] Version number updated in manifest.json
- [ ] Privacy policy created and hosted
- [ ] Screenshots created (at least 1, recommended 3-5)
- [ ] Store listing description written
- [ ] Icons are correct sizes and look good
- [ ] Extension tested on multiple websites
- [ ] All features work correctly
- [ ] Error handling tested
- [ ] Developer account created (Chrome: $5, Edge: Free)

---

## 🎉 After Publishing

1. **Monitor Reviews**: Respond to user feedback
2. **Track Analytics**: Use store analytics to see usage
3. **Update Regularly**: Fix bugs and add features
4. **Market Your Extension**: Share on social media, forums, etc.

Good luck with your publication! 🚀

