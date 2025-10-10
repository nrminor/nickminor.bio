# nickminor.bio Development Commands
# Astro-based personal website and blog

# Default recipe shows available commands
[group('help')]
default:
    @just --list --unsorted

# Show all available recipes with descriptions
[group('help')]
help:
    @just --list

# ===== CRITICAL: Validation (MUST PASS) =====

# 🚨 MANDATORY before ANY commit - Run full validation
[group('validation')]
validate:
    bun run check
    bunx astro check
    bun run build

alias v := validate

# Quick validation status check
[group('validation')]
status:
    @echo "Checking validation status..."
    @bunx astro check 2>&1 | grep -E "(error|warning)" || echo "✓ No TypeScript or Astro issues"
    @bun run check 2>&1 | grep -E "(error|warning)" || echo "✓ No formatting/linting issues" 
    @echo ""
    @echo "Run 'just validate' for full check including build"

alias s := status

# ===== Build Commands =====

# Build site for production
[group('build')]
build:
    bun run build

alias b := build

# Start development server
[group('build')]
dev:
    bun run dev

alias d := dev

# Preview production build
[group('build')]
preview:
    bun run preview

alias p := preview

# Clean build artifacts
[group('build')]
clean:
    rm -rf dist .astro

alias c := clean

# ===== Code Quality =====

# Run linting and formatting
[group('lint')]
lint:
    bun run lint

alias l := lint

# Format all code
[group('lint')]
fmt:
    bun run format

alias f := fmt

# Check formatting without changes
[group('lint')]
fmt-check:
    bun run check

alias fc := fmt-check

# Check links with lychee
[group('lint')]
links:
    @echo "Checking links..."
    @if command -v lychee >/dev/null 2>&1; then \
        lychee --cache --no-progress .; \
    else \
        echo "⚠️  lychee not installed. Run: cargo install lychee"; \
    fi

alias lnk := links

# ===== Development Tools =====

# Check for TODOs and FIXMEs
[group('dev')]
todos:
    @echo "TODO items:"
    @grep -r "TODO" src/ --include="*.astro" --include="*.ts" || echo "No TODOs found"
    @echo ""
    @echo "FIXME items:"
    @grep -r "FIXME" src/ --include="*.astro" --include="*.ts" || echo "No FIXMEs found"

alias todo := todos

# Count lines of code
[group('dev')]
loc:
    @echo "Lines of code by directory:"
    @echo "=========================="
    @echo "Pages:"
    @find src/pages -name "*.astro" | xargs wc -l | sort -rn
    @echo ""
    @echo "Components:"
    @find src/components -name "*.astro" | xargs wc -l | sort -rn
    @echo ""
    @echo "Layouts:"
    @find src/layouts -name "*.astro" | xargs wc -l | sort -rn
    @echo ""
    @echo "Utils:"
    @wc -l src/utils/*.ts | sort -rn

# Check for console.log statements
[group('dev')]
check-console:
    @echo "Checking for console.log statements..."
    @grep -r "console.log" src/ --include="*.astro" --include="*.ts" || echo "✓ No console.log found"

alias cc := check-console

# Check for outdated dependencies
[group('dev')]
outdated:
    bunx npm-check-updates

alias o := outdated

# Update dependencies (interactive)
[group('dev')]
update:
    bunx npm-check-updates -i

alias u := update

# ===== Git Workflows =====

# Pre-commit validation (git hook helper)
[group('git')]
pre-commit: fmt-check lint validate
    @echo "✓ Pre-commit checks passed!"

alias pc := pre-commit

# Prepare for PR
[group('git')]
pr-ready: validate links
    @echo "✓ Ready for PR!"
    @echo "Remember to:"
    @echo "  - Test the site locally with 'just dev'"
    @echo "  - Check all links work with 'just links'"
    @echo "  - Ensure commit message is descriptive"

alias pr := pr-ready

# ===== Anti-Entropy Checks =====

# Check for overly complex components
[group('entropy')]
complexity:
    @echo "Checking component complexity..."
    @echo "Components over 100 lines:"
    @find src/components src/layouts -name "*.astro" -exec wc -l {} \; | \
        awk '$$1 > 100 {print $$2 ": " $$1 " lines"}' || echo "✓ All components under 100 lines"

alias cx := complexity

# Find unused files
[group('entropy')]
unused:
    @echo "Checking for potentially unused components..."
    @find src/components -name "*.astro" | while read file; do \
        name=$$(basename $$file .astro); \
        count=$$(grep -r "$$name" src/pages src/layouts --include="*.astro" | wc -l); \
        if [ $$count -eq 0 ]; then echo "$$file might be unused"; fi; \
    done || echo "✓ No obviously unused components"

alias un := unused

# ===== Site-Specific Commands =====

# Create a new blog post
[group('content')]
new-post title:
    #!/usr/bin/env bash
    slug=$(echo "{{ title }}" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    date=$(date '+%b %d %Y')
    cat > "src/content/blog/${slug}.md" << EOF
    ---
    title: '{{ title }}'
    description: 'A brief description of this post'
    pubDate: '${date}'
    tags: []
    draft: true
    ---

    Your content here...
    EOF
    echo "✓ Created src/content/blog/${slug}.md"

alias np := new-post

# Create a new project
[group('content')]
new-project title:
    #!/usr/bin/env bash
    slug=$(echo "{{ title }}" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    date=$(date '+%b %d %Y')
    cat > "src/content/project/${slug}.md" << EOF
    ---
    title: '{{ title }}'
    description: 'A brief description of this project'
    pubDate: '${date}'
    stack: []
    draft: true
    ---

    Your project description here...
    EOF
    echo "✓ Created src/content/project/${slug}.md"

alias nproj := new-project

# Serve site and open browser
[group('content')]
serve:
    @echo "🚀 Starting development server..."
    bun run dev &
    @sleep 3
    @echo "📱 Opening browser..."
    open http://localhost:4321

# ===== Quick Commands (Most Used) =====

# Quick validate (most common command)
[group('quick')]
q: validate

# Quick format and lint
[group('quick')]
ql: fmt lint

# Quick check without build
[group('quick')]
qc: fmt-check lint status

# ===== Shortcuts & Aliases =====

alias val := validate
alias valid := validate
alias fix := fmt
