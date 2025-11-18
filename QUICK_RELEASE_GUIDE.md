# 🚀 Quick Release Guide

## Publishing a New Version (3 Simple Steps)

### Step 1: Update Version in package.json
Edit `sidekickai-chrome-extension/package.json`:
```json
{
  "version": "1.0.1"  // Update this
}
```

**Note:** The version is automatically read from `package.json` - no manual input needed! The workflow will also sync this version to `manifest.json` automatically.

### Step 2: Commit and Push
```bash
git checkout main
git pull origin main
git add sidekickai-chrome-extension/package.json
git commit -m "Bump version to 1.0.1"
git push origin main
```

### Step 3: Create Tag (This Triggers Publishing!)
```bash
git tag v1.0.1
git push origin v1.0.1
```

**That's it!** 🎉 The workflow will automatically:
- ✅ Read version from `package.json` (or use tag version if different)
- ✅ Sync version to both `package.json` and `manifest.json`
- ✅ Build the extension
- ✅ Publish to Chrome Web Store
- ✅ Publish to Edge Add-ons  
- ✅ Create GitHub Release

## 📋 Version Numbering

Use [Semantic Versioning](https://semver.org/):

- **Patch** (1.0.0 → 1.0.1): Bug fixes
- **Minor** (1.0.0 → 1.1.0): New features
- **Major** (1.0.0 → 2.0.0): Breaking changes

## ⚠️ Important Rules

1. **Always tag from `main` branch** - Never tag from feature branches
2. **Update package.json first** - Version is automatically read from `package.json`
3. **Tag format**: `v1.0.1` (must start with `v`)
4. **Version sync**: The workflow automatically syncs version between `package.json` and `manifest.json`
5. **Wait for workflow** - Check Actions tab to ensure publishing succeeded

## 🔍 Check Publishing Status

1. Go to **Actions** tab in GitHub
2. Find the workflow run for your tag
3. Check all jobs completed successfully:
   - ✅ Build Extension
   - ✅ Publish to Chrome Web Store
   - ✅ Publish to Microsoft Edge Add-ons
   - ✅ Create GitHub Release

## 🆘 Troubleshooting

### Workflow didn't trigger?
- Make sure tag starts with `v` (e.g., `v1.0.1`)
- Verify tag was pushed: `git push origin v1.0.1`
- Check you're on `main` branch when creating tag

### Publishing failed?
- Check Actions logs for error details
- Verify all secrets are set correctly
- Ensure API credentials haven't expired

### Need to publish manually?
1. **Update version in `package.json`** first
2. **Commit and push** the version change
3. Go to **Actions** → **Build and Publish Extension**
4. Click **Run workflow**
5. Select `main` branch
6. Choose which stores to publish to (Chrome/Edge)
7. Click **Run workflow**
8. The version will be automatically read from `package.json` - no manual input needed!

## 📚 More Details

See [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) for complete workflow details.

