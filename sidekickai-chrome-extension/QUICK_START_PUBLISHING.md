# Quick Start: Publishing SidekickAI

## 🚀 Fast Track to Publishing

### Step 1: Prepare Package (2 minutes)

```bash
# Build and create ZIP file
npm run publish:prepare
```

This will:
1. Build the extension
2. Generate the manifest
3. Create `sidekickai-dist.zip` ready for upload

### Step 2: Create Privacy Policy (5 minutes)

1. Copy `PRIVACY_POLICY_TEMPLATE.md`
2. Fill in your contact email
3. Host it on:
   - GitHub Pages (free)
   - Netlify (free)
   - Vercel (free)
   - Or your own website

### Step 3: Take Screenshots (10 minutes)

Take 3-5 screenshots (1280x800 pixels):
1. Main sidebar with chat
2. Theme selection
3. Settings page
4. Screenshot feature
5. Quiz assistant

### Step 4: Chrome Web Store (15 minutes)

1. **Sign up**: https://chrome.google.com/webstore/devconsole ($5 one-time)
2. **Click**: "New Item"
3. **Upload**: `sidekickai-dist.zip`
4. **Fill in**:
   - Name: `SidekickAI`
   - Description: (see PUBLISHING_GUIDE.md)
   - Privacy Policy URL: (your hosted URL)
   - Screenshots: (upload your screenshots)
5. **Submit**: Click "Submit for Review"

**Review Time**: 1-3 business days

### Step 5: Microsoft Edge Add-ons (10 minutes)

1. **Sign up**: https://partner.microsoft.com/dashboard (FREE)
2. **Click**: "Create new extension"
3. **Upload**: Same `sidekickai-dist.zip`
4. **Fill in**: Same information as Chrome
5. **Submit**: Click "Submit"

**Review Time**: 1-5 business days

## 📋 Checklist

Before submitting:

- [ ] `npm run publish:prepare` completed successfully
- [ ] Privacy policy created and hosted (get URL)
- [ ] At least 1 screenshot taken (1280x800)
- [ ] Version number in manifest.json is correct
- [ ] Extension tested on multiple websites
- [ ] All features work correctly
- [ ] Developer account created:
  - [ ] Chrome Web Store ($5 paid)
  - [ ] Microsoft Edge (free)

## 🎯 Store Listing Quick Copy

### Short Description (132 chars):
```
AI-powered sidebar assistant with multi-model support. Read content, answer quizzes, and chat with AI directly from any webpage.
```

### Category:
- **Productivity** or **Developer Tools**

### Permissions Justification:
```
- storage: Save user preferences and API keys locally
- activeTab: Read content from current webpage
- scripting: Inject sidebar interface
- tabs: Open ChatGPT web interface
- host_permissions: Work on any webpage user visits
```

## 📞 Need Help?

See `PUBLISHING_GUIDE.md` for detailed instructions.

## ⚡ Quick Commands

```bash
# Build extension
npm run build

# Build + Create ZIP
npm run package

# Full publish preparation
npm run publish:prepare
```

Good luck! 🎉

