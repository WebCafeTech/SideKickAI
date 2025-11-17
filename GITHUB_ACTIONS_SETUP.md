# GitHub Actions Setup Guide

This guide will help you set up automated publishing for SidekickAI to both Chrome Web Store and Microsoft Edge Add-ons.

## 🎯 Quick Start

1. **Set up API credentials** (see below)
2. **Add secrets to GitHub** (see below)
3. **Create a version tag** to trigger publishing:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

## 🔑 Step 1: Chrome Web Store API Setup

### A. Create Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Click "Create Project" or select existing
3. Name it: "SidekickAI Publishing"
4. Click "Create"

### B. Enable Chrome Web Store API

1. In Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Chrome Web Store API"
3. Click "Enable"

### C. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Desktop app"
4. Name: "SidekickAI Publisher"
5. Click "Create"
6. **Save the Client ID and Client Secret** (you'll need these)

### D. Get Refresh Token

**Option 1: Using chrome-webstore-upload-cli**

```bash
npm install -g chrome-webstore-upload-cli
chrome-webstore-upload-cli
# Follow the prompts to authenticate
# This will give you a refresh token
```

**Option 2: Using chrome-webstore-token**

1. Go to: https://github.com/DrewML/chrome-webstore-token
2. Follow the instructions to get your refresh token

**Option 3: Manual method**

1. Download the OAuth credentials JSON
2. Use a tool like: https://github.com/fregante/chrome-webstore-upload-cli
3. Authenticate and get refresh token

### E. Get Extension ID

1. **First, publish manually once** to Chrome Web Store:
   - Upload your extension ZIP
   - Complete the store listing
   - Publish it
2. After publishing, the extension ID will be in the URL:
   - `chrome.google.com/webstore/detail/[EXTENSION_ID]/...`
3. **Copy this Extension ID**

## 🔑 Step 2: Microsoft Edge Add-ons API Setup

### A. Create Azure AD App Registration

1. Go to: https://portal.azure.com/
2. Navigate to "Azure Active Directory"
3. Go to "App registrations"
4. Click "New registration"
5. Name: "SidekickAI Publisher"
6. Supported account types: "Single tenant"
7. Click "Register"
8. **Save the Application (client) ID** (this is your Client ID)
9. **Save the Directory (tenant) ID** (this is your Tenant ID)

### B. Create Client Secret

1. In your app registration, go to "Certificates & secrets"
2. Click "New client secret"
3. Description: "GitHub Actions"
4. Expires: Choose appropriate duration (or "Never" for testing)
5. Click "Add"
6. **Copy the secret value immediately** (you can't see it again!)

### C. Get Product ID

1. **First, publish manually once** to Edge Add-ons:
   - Upload your extension ZIP
   - Complete the store listing
   - Publish it
2. After publishing, go to Partner Center → Your Extension
3. The Product ID is shown in the overview page
4. **Copy this Product ID**

## 🔐 Step 3: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add each secret:

### Chrome Web Store Secrets:
- **Name**: `CHROME_CLIENT_ID`
  - **Value**: Your OAuth Client ID from Google Cloud

- **Name**: `CHROME_CLIENT_SECRET`
  - **Value**: Your OAuth Client Secret from Google Cloud

- **Name**: `CHROME_REFRESH_TOKEN`
  - **Value**: Your refresh token from step 1.D

- **Name**: `CHROME_EXTENSION_ID`
  - **Value**: Your extension ID from step 1.E (after first publish)

### Edge Add-ons Secrets:
- **Name**: `EDGE_CLIENT_ID`
  - **Value**: Your Application (client) ID from Azure

- **Name**: `EDGE_CLIENT_SECRET`
  - **Value**: Your client secret value from Azure

- **Name**: `EDGE_PRODUCT_ID`
  - **Value**: Your product ID from Partner Center (after first publish)

- **Name**: `EDGE_TENANT_ID`
  - **Value**: Your Directory (tenant) ID from Azure

## 🚀 Step 4: Test the Workflow

### Option A: Automatic (Recommended)

1. **Update version in `manifest.json`**:
   ```json
   {
     "version": "1.0.0"
   }
   ```

2. **Commit and push**:
   ```bash
   git add sidekickai-chrome-extension/manifest.json
   git commit -m "Bump version to 1.0.0"
   git push
   ```

3. **Create and push a version tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. **Workflow will automatically run**:
   - Go to "Actions" tab in GitHub
   - Watch the workflow execute
   - Check for any errors

### Option B: Manual Trigger

1. Go to "Actions" tab in GitHub
2. Select "Build and Publish Extension"
3. Click "Run workflow"
4. Enter version (e.g., `1.0.0`)
5. Select which stores to publish to
6. Click "Run workflow"

## 📋 Workflow Features

The workflow will:

1. ✅ **Build** the extension
2. ✅ **Update version** in manifest (from tag)
3. ✅ **Create ZIP** package
4. ✅ **Publish to Chrome Web Store**
5. ✅ **Publish to Edge Add-ons**
6. ✅ **Create GitHub Release** with download links

## 🔧 Troubleshooting

### "Invalid credentials" Error

- Double-check all secrets are correct
- For Chrome: Make sure refresh token is valid (they can expire)
- For Edge: Make sure client secret hasn't expired

### "Extension not found" Error

- Make sure you've published manually at least once
- Verify the Extension ID / Product ID is correct
- Check that the extension exists in the respective store

### "Permission denied" Error

- For Chrome: Ensure Chrome Web Store API is enabled
- For Edge: Ensure Azure AD app has proper permissions
- Check that your account has publishing rights

### Workflow Not Triggering

- Make sure you're pushing a tag with format `v*.*.*` (e.g., `v1.0.0`)
- Or use manual trigger from Actions tab
- Check workflow file is in `.github/workflows/` directory

## 📝 Version Management

### Semantic Versioning

Use semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (1.0.0 → 2.0.0)
- **MINOR**: New features (1.0.0 → 1.1.0)
- **PATCH**: Bug fixes (1.0.0 → 1.0.1)

### Updating Version

1. Update `manifest.json`:
   ```json
   {
     "version": "1.0.1"
   }
   ```

2. Create tag:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

3. Workflow will automatically publish!

## 🎉 Success!

Once set up, publishing is as simple as:

```bash
# Update version in manifest.json
# Then:
git tag v1.0.1
git push origin v1.0.1
```

The workflow will handle everything else automatically! 🚀

## 📚 Additional Resources

- [Chrome Web Store API Docs](https://developer.chrome.com/docs/webstore/using_webstore_api/)
- [Edge Add-ons API Docs](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/api/using-addons-api)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)

