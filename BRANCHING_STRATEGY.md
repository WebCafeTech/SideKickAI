# 🌿 Branching Strategy for SidekickAI

This document outlines the branching structure and workflow for developing and publishing the SidekickAI Chrome Extension.

## 📋 Branch Structure

### Main Branches

#### `main` (or `master`)
- **Purpose**: Production-ready code
- **Protection**: Protected branch (requires PR approval)
- **Publishing**: Only tags pushed from this branch trigger automatic publishing
- **Status**: Always stable and deployable

#### `develop` (Optional)
- **Purpose**: Integration branch for features
- **Protection**: Can be protected or open for team collaboration
- **Publishing**: Does NOT trigger publishing
- **Status**: Integration of completed features

### Supporting Branches

#### `feature/*`
- **Purpose**: New features or enhancements
- **Naming**: `feature/feature-name` (e.g., `feature/add-dark-theme`)
- **Source**: Branch from `develop` or `main`
- **Merge**: Merge back to `develop` or `main` via Pull Request
- **Example**: `feature/screenshot-capture`, `feature/new-ai-provider`

#### `fix/*` or `bugfix/*`
- **Purpose**: Bug fixes
- **Naming**: `fix/issue-description` (e.g., `fix/login-error`)
- **Source**: Branch from `main` or `develop`
- **Merge**: Merge back to source branch via Pull Request
- **Example**: `fix/api-timeout`, `fix/ui-layout-issue`

#### `hotfix/*`
- **Purpose**: Critical production fixes
- **Naming**: `hotfix/issue-description` (e.g., `hotfix/security-patch`)
- **Source**: Branch from `main`
- **Merge**: Merge to both `main` and `develop`
- **Example**: `hotfix/critical-bug`, `hotfix/security-vulnerability`

#### `release/*` (Optional)
- **Purpose**: Prepare for a new release
- **Naming**: `release/v1.0.0` (e.g., `release/v1.2.0`)
- **Source**: Branch from `develop`
- **Merge**: Merge to `main` and tag for publishing
- **Example**: `release/v1.1.0`

## 🚀 Publishing Workflow

### Automatic Publishing (Recommended)

Publishing is **automatically triggered** when you push a version tag from the `main` branch:

```bash
# 1. Ensure you're on main branch and it's up to date
git checkout main
git pull origin main

# 2. Update version in manifest.json
# Edit: sidekickai-chrome-extension/manifest.json
# Change: "version": "1.0.1"

# 3. Commit the version change
git add sidekickai-chrome-extension/manifest.json
git commit -m "Bump version to 1.0.1"

# 4. Push to main
git push origin main

# 5. Create and push version tag (THIS TRIGGERS PUBLISHING)
git tag v1.0.1
git push origin v1.0.1
```

**What happens automatically:**
1. ✅ GitHub Actions workflow triggers
2. ✅ Extension is built
3. ✅ Version is updated in manifest
4. ✅ ZIP package is created
5. ✅ Published to Chrome Web Store
6. ✅ Published to Edge Add-ons
7. ✅ GitHub Release is created with download link

### Manual Publishing

You can also trigger publishing manually from GitHub Actions:

1. Go to **Actions** → **Build and Publish Extension**
2. Click **Run workflow**
3. Select branch: `main` or `master`
4. Enter version (e.g., `1.0.1`)
5. Select which stores to publish to
6. Click **Run workflow**

**Note**: Manual dispatch only works from `main` or `master` branch for security.

## 📝 Development Workflow

### Feature Development

```bash
# 1. Start from main/develop
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/my-new-feature

# 3. Develop and commit
git add .
git commit -m "Add new feature"

# 4. Push and create PR
git push origin feature/my-new-feature
# Then create Pull Request on GitHub targeting main
```

### Bug Fixes

```bash
# 1. Create fix branch from main
git checkout main
git pull origin main
git checkout -b fix/description-of-bug

# 2. Fix and commit
git add .
git commit -m "Fix: description of bug"

# 3. Push and create PR
git push origin fix/description-of-bug
# Create Pull Request targeting main
```

### Hotfixes (Critical Production Issues)

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# 2. Fix and commit
git add .
git commit -m "Hotfix: critical issue description"

# 3. Push and create PR
git push origin hotfix/critical-issue
# Create Pull Request targeting main

# 4. After merge, tag and publish
git checkout main
git pull origin main
git tag v1.0.2  # Increment patch version
git push origin v1.0.2
```

## 🔒 Branch Protection Rules

### Recommended GitHub Settings

For the `main` branch, enable:

1. **Require pull request reviews**
   - Require at least 1 approval
   - Dismiss stale reviews when new commits are pushed

2. **Require status checks to pass**
   - Require CI workflow to pass
   - Require branches to be up to date

3. **Require conversation resolution**
   - All comments must be resolved

4. **Restrict who can push**
   - Only maintainers/admins can push directly
   - Everyone else must use Pull Requests

5. **Do not allow force pushes**
   - Prevents accidental history rewrites

6. **Do not allow deletions**
   - Prevents accidental branch deletion

## 📊 Version Management

### Semantic Versioning

Follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features (backward compatible)
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

### Version Tag Format

- **Format**: `v1.0.0`, `v1.0.1`, `v2.0.0`
- **Pattern**: `v*.*.*` (matches workflow trigger)
- **Location**: Tags must be pushed from `main` branch

### Updating Version

1. **Update `manifest.json`**:
   ```json
   {
     "version": "1.0.1"
   }
   ```

2. **Commit the change**:
   ```bash
   git add sidekickai-chrome-extension/manifest.json
   git commit -m "Bump version to 1.0.1"
   git push origin main
   ```

3. **Create and push tag**:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

## 🎯 Workflow Summary

```
┌─────────────┐
│   Feature   │
│   Branch    │
└──────┬──────┘
       │ PR
       ▼
┌─────────────┐      ┌─────────────┐
│   Develop   │─────▶│    Main     │
│   Branch    │      │   Branch    │
└─────────────┘      └──────┬──────┘
                            │ Tag
                            ▼
                    ┌─────────────┐
                    │   Publish   │
                    │  (Automated)│
                    └─────────────┘
```

## ✅ Best Practices

1. **Always work in feature branches** - Never commit directly to `main`
2. **Keep `main` stable** - Only merge tested, reviewed code
3. **Use descriptive branch names** - `feature/add-themes` not `feature/123`
4. **Write clear commit messages** - Follow conventional commits if possible
5. **Test before merging** - Ensure CI passes before merging PRs
6. **Update version before tagging** - Always update `manifest.json` first
7. **Tag from main only** - Only push tags from `main` branch
8. **Review PRs carefully** - Don't skip code review for production code

## 🚨 Emergency Procedures

### If Publishing Fails

1. Check GitHub Actions logs
2. Verify secrets are correct
3. Check API credentials haven't expired
4. Fix issues in a hotfix branch
5. Re-tag and push after fix

### If Wrong Version Published

1. Create hotfix branch
2. Fix version in manifest
3. Tag with correct version
4. Publish again

### If Need to Rollback

1. Revert commits in hotfix branch
2. Tag previous version
3. Publish previous version

## 📚 Additional Resources

- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

