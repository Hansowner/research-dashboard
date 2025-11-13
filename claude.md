# Claude Code Reference - Research Dashboard

This file contains important project context for Claude Code to understand the deployment workflow and project structure.

## 🚀 Deployment Workflow

### Automated CI/CD Setup

This project uses **GitHub Actions** + **Vercel** for fully automated deployments.

#### Branch Strategy

- **`main`** - Development/preview branch
  - Push to `main` → Automatic preview deployment to Vercel
  - Used for testing changes before production

- **`production`** - Live production branch
  - Push to `production` → Automatic production deployment to Vercel
  - This is the live site users see

#### How to Deploy to Production

When the user says **"push to production"**, follow this workflow:

```bash
# 1. Ensure all changes are committed on main
git add .
git commit -m "Your commit message"
git push origin main

# 2. Switch to production branch
git checkout production

# 3. Merge main into production
git merge main

# 4. Push to production (triggers automatic deployment)
git push origin production

# 5. Switch back to main
git checkout main
```

**That's it!** GitHub Actions automatically:
1. Checks out the code
2. Installs dependencies with pnpm
3. Builds the project with Vercel CLI
4. Deploys to production

#### Deployment URLs

- **Production**: https://research-dashboard-dv2lqgyo8-johanlauritsen-4112s-projects.vercel.app
- **GitHub Repo**: https://github.com/Hansowner/research-dashboard
- **Vercel Dashboard**: https://vercel.com/johanlauritsen-4112s-projects/research-dashboard

#### Monitor Deployments

- **GitHub Actions**: https://github.com/Hansowner/research-dashboard/actions
- **Vercel Logs**: Available in Vercel dashboard

### GitHub Secrets (Already Configured)

The following secrets are already set up in the repository:

- `VERCEL_TOKEN` - Vercel API token for CLI authentication
- `VERCEL_ORG_ID` - Organization/team ID (`team_gsTVbxbX9Xq6N4vZ31Bbal5v`)
- `VERCEL_PROJECT_ID` - Project ID (`prj_rQUV9fUrsy7LYvtQY192gg3SAzBw`)

### Workflow Files

- `.github/workflows/preview.yml` - Deploys on push to `main`
- `.github/workflows/production.yml` - Deploys on push to `production`

Both workflows:
1. Use Node.js 20 (from `.nvmrc`)
2. Install dependencies with pnpm
3. Build with Vercel CLI
4. Deploy pre-built artifacts to Vercel

---

## 📦 Project Structure

### Key Technologies

- **React 19.2.0** - UI framework
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.2** - Build tool
- **Tailwind CSS 3.4.18** - Styling
- **shadcn/ui** - Component library
- **@react-pdf/renderer 4.3.1** - PDF export
- **Fuse.js 7.1.0** - Search
- **pnpm** - Package manager

### Important Files

- `src/data/research-data.json` - Main data file (user edits this)
- `src/components/ResearchDashboard.tsx` - Main dashboard component
- `src/components/pdf/PDFDocument.tsx` - PDF export (critical: one theme per page to avoid coordinate overflow)
- `vercel.json` - SPA routing configuration
- `.nvmrc` - Node.js version (20)

### Build Commands

```bash
# Development
pnpm dev          # Start dev server on localhost:5173

# Production
pnpm build        # Build for production (outputs to dist/)
pnpm preview      # Preview production build locally

# Type checking
pnpm type-check   # Run TypeScript compiler
```

---

## 🔧 Common Tasks

### Making Changes and Deploying

```bash
# 1. Make your changes
# 2. Test locally
pnpm dev

# 3. Commit and push to main (triggers preview deployment)
git add .
git commit -m "Description of changes"
git push origin main

# 4. When ready for production, say "push to production"
# Claude will execute the production deployment workflow
```

### PDF Export Notes

**Critical:** PDF export uses one theme per page to prevent coordinate overflow errors. Do not modify this architecture without careful testing with large datasets (8+ themes).

Text truncation limits (to stay within PDF coordinate bounds):
- Statements: 300 chars max
- Pains/Gains: 3 items max, 100 chars each
- Verbatim quotes: 150 chars max

### Data Validation

The project includes JSON validation (`src/utils/jsonValidator.ts`) that checks:
- Required fields at all levels
- Valid entity types: `jtbd`, `fact`, `pain`, `gain`
- Valid theme colors: `blue`, `green`, `amber`, `purple`, `rose`, `cyan`
- ID uniqueness
- Count consistency (clusterCount, entityCount)

---

## 🐛 Known Issues & Solutions

### Issue: Import functionality broken
**Cause:** TypeScript compilation errors prevent app from building
**Solution:** Always run `pnpm build` after making changes to catch errors early

### Issue: PDF export fails with coordinate overflow
**Cause:** Too many themes rendered on single page
**Solution:** Already fixed - one theme per page. Don't revert this architecture.

### Issue: Search not working
**Cause:** Fuse.js configuration or data structure mismatch
**Solution:** Check `src/utils/search.ts` for Fuse.js config

---

## 📝 Git Workflow Summary

**For Claude Code:** When user says any of these phrases, execute the production deployment workflow:
- "push to production"
- "deploy to production"
- "release to production"
- "go live"
- "publish changes"

**Workflow:**
1. Checkout production branch
2. Merge main
3. Push to production branch
4. Checkout main
5. Confirm deployment triggered

---

## 🔐 Security Notes

- `.gitignore` excludes sensitive files:
  - `research-insights-dashboard.json` (user data)
  - `test-output/` (test artifacts)
  - `Pasted*.png` (screenshots)
  - `.vercel/` (Vercel config)

- Never commit tokens or secrets to the repository
- All secrets are stored in GitHub repository secrets

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **React Docs**: https://react.dev
- **Vite Docs**: https://vite.dev
