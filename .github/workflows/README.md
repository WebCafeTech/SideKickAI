# GitHub Actions Workflow Setup

This directory contains GitHub Actions workflows for automatically building and publishing SidekickAI to Chrome Web Store and Microsoft Edge Add-ons.

## 📋 Prerequisites

Before using these workflows, you need to set up API credentials for both stores.

## 🔑 Setting Up Secrets

### Chrome Web Store Secrets

1. **Get Chrome Web Store API Credentials**:
   - Go to: https://console.cloud.google.com/
   - Create a new project or select existing
   - Enable "Chrome Web Store API"
   - Create OAuth 2.0 credentials
   - Download credentials JSON

2. **Get Refresh Token**:
   - Use a tool like: https://github.com/fregante/chrome-webstore-upload-cli
   - Or use: https://github.com/DrewML/chrome-webstore-token
   - This will give you a refresh token

3. **Get Extension ID**:
   - After first manual upload to Chrome Web Store
   - Find it in the extension URL: `chrome.google.com/webstore/detail/[EXTENSION_ID]`

4. **Add GitHub Secrets**:
   - Go to: `Settings` → `Secrets and variables` → `Actions`
   - Add these secrets:
     - `CHROME_CLIENT_ID`: Your OAuth client ID
     - `CHROME_CLIENT_SECRET`: Your OAuth client secret
     - `CHROME_REFRESH_TOKEN`: Your refresh token
     - `CHROME_EXTENSION_ID`: Your extension ID (after first publish)

### Microsoft Edge Add-ons Secrets

1. **Get Edge Add-ons API Credentials**:
   - Go to: https://partner.microsoft.com/dashboard
   - Navigate to your extension
   - Go to "API Access" section
   - Create Azure AD app registration
   - Get Client ID and Client Secret

2. **Get Product ID**:
   - After first manual upload to Edge Add-ons
   - Find it in Partner Center → Your Extension → Overview

3. **Get Tenant ID**:
   - Usually your Microsoft account tenant ID
   - Can be found in Azure Portal → Azure Active Directory → Properties

4. **Add GitHub Secrets**:
   - Add these secrets:
     - `EDGE_CLIENT_ID`: Your Azure AD client ID
     - `EDGE_CLIENT_SECRET`: Your Azure AD client secret
     - `EDGE_PRODUCT_ID`: Your extension product ID
     - `EDGE_TENANT_ID`: Your Azure tenant ID

## 🚀 Usage

### Automatic Publishing (Recommended)

1. **Update version in `manifest.json`**:
   ```json
   {
     "version": "1.0.1"
   }
   ```

2. **Create and push a version tag**:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

3. **Workflow will automatically**:
   - Build the extension
   - Update manifest version
   - Create ZIP package
   - Publish to Chrome Web Store
   - Publish to Edge Add-ons
   - Create GitHub release

### Manual Publishing

1. Go to: `Actions` → `Build and Publish Extension`
2. Click "Run workflow"
3. Enter version (e.g., `1.0.1`)
4. Select which stores to publish to
5. Click "Run workflow"

## 📝 Workflow Steps

1. **Build**: Compiles the extension and creates ZIP
2. **Publish Chrome**: Uploads to Chrome Web Store
3. **Publish Edge**: Uploads to Microsoft Edge Add-ons
4. **Create Release**: Creates GitHub release with download links

## 🔧 Troubleshooting

### Chrome Web Store Errors

- **Invalid credentials**: Check your secrets are correct
- **Extension not found**: Make sure extension ID is correct (publish manually first)
- **Permission denied**: Ensure API has proper permissions

### Edge Add-ons Errors

- **Authentication failed**: Check tenant ID and credentials
- **Product not found**: Publish manually first to get product ID
- **Invalid package**: Ensure ZIP is valid

## 📚 Resources

- [Chrome Web Store API](https://developer.chrome.com/docs/webstore/using_webstore_api/)
- [Edge Add-ons API](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/api/using-addons-api)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

