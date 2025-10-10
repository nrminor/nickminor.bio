# GitHub Pages Deployment Setup

This repository is configured with automated CI/CD deployment to GitHub Pages.
Follow these steps to complete the setup.

## Required GitHub Settings

### 1. Enable GitHub Pages

1. Go to your repository settings
2. Navigate to **Pages** (left sidebar)
3. Under **Source**, select **GitHub Actions**
4. Save the settings

### 2. Configure Branch Protection (Recommended)

1. Go to **Settings** → **Branches**
2. Click **Add rule** for branch `main`
3. Enable the following:
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require branches to be up to date before merging**
   - ✅ Select status checks: `ci` (will appear after first workflow run)
   - ✅ **Require pull request reviews before merging** (optional)
   - ✅ **Dismiss stale PR approvals when new commits are pushed** (optional)

### 3. Workflow Permissions

The workflow should have the correct permissions automatically, but verify:

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, ensure:
   - ✅ **Read and write permissions** is selected
   - ✅ **Allow GitHub Actions to create and approve pull requests** is checked

## How It Works

### Workflow Triggers

- **Pull Requests** to `main`: Runs CI checks only (type check, lint, format,
  build)
- **Pushes** to `main`: Runs CI checks + deploys to GitHub Pages

### Branch Strategy

- **`main`**: Protected source code branch
- **GitHub Pages**: Deployed automatically from build artifacts (no separate
  branch needed)

### Deployment Process

1. Code is pushed/merged to `main`
2. CI checks run (Bun install → Type check → Lint → Format check → Build)
3. If CI passes, build artifacts are uploaded
4. Site automatically deploys to
   `https://<username>.github.io/<repository-name>`

## First Deployment

1. **Commit and push** this workflow to your `main` branch
2. **Check Actions tab** to see the workflow run
3. **Enable Pages** in repository settings (see step 1 above)
4. **Visit your site** at `https://<username>.github.io/<repository-name>`

## Troubleshooting

- **Workflow fails on permissions**: Check workflow permissions in Settings →
  Actions
- **Pages not deploying**: Ensure Pages source is set to "GitHub Actions"
- **Branch protection blocking**: Add the `ci` check to required status checks
- **Build errors**: Check the Actions tab for detailed logs

## Pre-commit Hooks

This project uses pre-commit hooks to ensure code quality and check for broken links.

### Setup (one-time)
```bash
# Install pre-commit (macOS)
brew install pre-commit

# OR install via pip
pip install pre-commit

# Install the hooks
pre-commit install
```

### What the hooks do
- **Lychee link checker**: Validates all links in markdown/HTML files
- **Basic checks**: Trailing whitespace, file endings, YAML/JSON syntax

### Manual execution
```bash
# Run hooks on all files
pre-commit run --all-files

# Run just lychee
pre-commit run lychee --all-files
```

### Exclusions
Add URLs to `.lycheeignore` to skip checking specific links (regex supported).

## Local Development

The same commands used in CI can be run locally:

```bash
# Install dependencies
bun install

# Type check
bunx astro check

# Lint and format
bun run lint
bun run check

# Build for production
bun run build

# Preview built site
bun run preview
```
