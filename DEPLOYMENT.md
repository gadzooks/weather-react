# Deployment Guide

This document describes the CI/CD pipeline and deployment process for the weather-react application.

## Overview

The application uses a three-environment deployment pipeline:

- **Dev**: Automatic deployment from `dev` branch after CI passes
- **QA**: Automatic deployment from `qa` branch after CI passes
- **Production**: Manual deployment from `master` branch with approval gate

All deployments are managed through GitHub Actions and deploy to Render.com static sites.

## Environment Variables

The following environment variables must be set in the Render.com dashboard for each service:

### Required Variables

- `VITE_WEATHER_API`: API endpoint URL
- `VITE_WEATHER_JWT_TOKEN`: JWT token for API authentication
- `VITE_DATA_SOURCE`: Data source type (`mock` or `real`)

### Per-Environment Values

**Dev Environment:**
- `VITE_DATA_SOURCE=mock`
- `VITE_WEATHER_API=https://weather-expressjs-api.onrender.com`

**QA Environment:**
- `VITE_DATA_SOURCE=real`
- `VITE_WEATHER_API=https://weather-expressjs-api.onrender.com`

**Production:**
- `VITE_DATA_SOURCE=real`
- `VITE_WEATHER_API=https://weather-expressjs-api.onrender.com`

**Important:** Vite bakes environment variables into the build at build time. If you change environment variables in the Render dashboard, you must trigger a new deployment for the changes to take effect.

## Deployment Workflows

### Dev Environment

**URL:** https://weather-react-dev.onrender.com

**Trigger:** Automatic deployment when code is pushed to the `dev` branch

**Process:**
1. Push code to `dev` branch
2. GitHub Actions runs CI workflow (lint, test, build)
3. If CI passes, deploy workflow triggers
4. Render.com deploys via deploy hook
5. Health check confirms deployment

**Manual Deployment:**
Can also trigger manual deploys in Render.com dashboard.

### QA Environment

**URL:** https://weather-react-qa.onrender.com

**Trigger:** Automatic deployment when PR is merged to `qa` branch

**Process:**
1. Create PR from `dev` to `qa`
2. Wait for CI checks to pass
3. Merge PR to `qa` branch
4. GitHub Actions runs CI workflow
5. If CI passes, deploy workflow triggers
6. Render.com deploys via deploy hook
7. Health check confirms deployment

**Branch Protection:**
The `qa` branch requires:
- Pull request before merging
- CI checks must pass (lint, test, build)
- Branch must be up to date

### Production Environment

**URL:** Your custom domain (configured in Render.com)

**Trigger:** Manual workflow from GitHub Actions

**Process:**
1. Navigate to GitHub Actions tab
2. Select "Deploy to Production" workflow
3. Click "Run workflow"
4. Type "deploy" in the confirmation input
5. Click "Run workflow" button
6. **Approval required**: Review and approve the deployment
7. Render.com deploys via deploy hook
8. Health checks confirm deployment

**Branch Protection:**
The `master` branch requires:
- Pull request before merging
- At least 1 approval
- CI checks must pass (lint, test, build)
- Branch must be up to date

## GitHub Actions Workflows

### CI Workflow

**File:** `.github/workflows/ci.yml`

**Triggers:**
- Pull requests to `dev`, `qa`, `master`
- Pushes to `dev`, `qa`, `master`

**Jobs:**
1. **Lint**: ESLint and Prettier checks
2. **Test**: Vitest test suite
3. **Build**: Vite production build

### Deploy Workflow

**File:** `.github/workflows/deploy.yml`

**Triggers:**
- After successful CI workflow completion on `dev` or `qa` branches

**Jobs:**
- `deploy-dev`: Deploys to dev environment
- `deploy-qa`: Deploys to QA environment

### Production Deploy Workflow

**File:** `.github/workflows/deploy-production.yml`

**Triggers:**
- Manual workflow dispatch from master branch only

**Jobs:**
- `deploy-production`: Deploys to production with approval gate

## GitHub Configuration Required

### Repository Secrets

Navigate to GitHub → Settings → Secrets and variables → Actions

Add the following secrets:

- `RENDER_DEPLOY_HOOK_DEV`: Deploy hook URL from Render dev service
- `RENDER_DEPLOY_HOOK_QA`: Deploy hook URL from Render QA service
- `RENDER_DEPLOY_HOOK_PROD`: Deploy hook URL from Render production service

**To get deploy hook URLs:**
1. Go to Render.com dashboard
2. Select the service
3. Go to Settings → Deploy Hook
4. Copy the hook URL
5. Add to GitHub secrets

### GitHub Environments

Navigate to GitHub → Settings → Environments

Create these environments:

**dev:**
- No protection rules
- Environment URL: https://weather-react-dev.onrender.com

**qa:**
- No protection rules (optional: add required reviewers)
- Environment URL: https://weather-react-qa.onrender.com

**production:**
- Required reviewers: Add team members who can approve production deploys
- Deployment branches: master only
- Environment URL: Your custom domain

### Branch Protection Rules

Navigate to GitHub → Settings → Branches → Branch protection rules

**For `qa` branch:**
- ✅ Require pull request before merging
- ✅ Require status checks to pass before merging
  - Required checks: `Lint`, `Test`, `Build`
- ✅ Require branches to be up to date before merging
- ✅ Require linear history (optional)

**For `master` branch:**
- ✅ Require pull request before merging
- ✅ Require approvals: 1 minimum
- ✅ Require status checks to pass before merging
  - Required checks: `Lint`, `Test`, `Build`
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing

## Render.com Configuration

### Blueprint Setup

The `render.yaml` file defines infrastructure as code for all three environments.

**To create a new service from blueprint:**
1. Go to Render.com dashboard
2. Click "New" → "Web Service"
3. Select "Use Blueprint"
4. Choose your repository
5. Select the specific service from render.yaml
6. Set environment variables in dashboard
7. Deploy

**Services defined:**
- `weather-react-dev` (branch: dev)
- `weather-react-qa` (branch: qa)
- `weather-react-prod` (branch: master)

### Build Configuration

All services use the same build configuration:

- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `./build`
- **Environment:** Static Site
- **Auto-Deploy:** Disabled (controlled by GitHub Actions)

## Rollback Procedures

### Dev or QA Rollback

If a dev or QA deployment fails:

1. Check GitHub Actions logs for errors
2. Check Render deployment logs
3. **Option 1:** Fix the issue and push a new commit
4. **Option 2:** Revert the commit and push
5. **Option 3:** In Render dashboard → Manual Deploy → select previous successful commit

### Production Rollback

If a production deployment fails:

**Immediate Rollback:**
1. Go to Render.com dashboard
2. Select production service
3. View deployment history
4. Click "Rollback to [previous deploy]"
5. Verify site is working
6. Investigate issue before next deployment

**Git Rollback:**
1. Identify the last working commit
2. Create a revert commit: `git revert <bad-commit-sha>`
3. Push to master
4. CI will run automatically
5. Manually trigger production deploy workflow

## Troubleshooting

### Build Fails in CI

**Check:**
- GitHub Actions logs for specific error
- Ensure tests pass locally: `npm test`
- Ensure build works locally: `npm run build`
- Ensure linting passes: `npm run lint`
- Ensure formatting is correct: `npm run prettier`

**Common Issues:**
- Missing dependencies: Run `npm install`
- Failing tests: Update snapshots or fix tests
- Lint errors: Run `npm run lint` to auto-fix
- Prettier formatting: Run `npm run prettier:fix`

### Deployment Fails

**Check:**
- Render deployment logs in dashboard
- Verify environment variables are set correctly
- Verify deploy hook URL is correct in GitHub secrets
- Check Render service status

**Common Issues:**
- Missing environment variables
- Build command failure (check Render logs)
- Deploy hook URL expired or incorrect

### Health Check Fails

**Check:**
- Service is actually running in Render
- URL is correct in workflow file
- Service has finished deploying (may need longer sleep time)
- No errors in service logs

### Environment Variable Changes Not Applied

**Issue:** Changed env vars in Render dashboard but site still shows old values

**Solution:**
1. Remember: Vite bakes env vars at build time
2. Trigger a new deployment after changing env vars
3. Verify new build completed successfully
4. Clear browser cache and hard refresh

### Pull Request Can't Merge

**Issue:** PR is blocked from merging

**Check:**
- All required status checks must pass
- Branch must be up to date with target branch
- Required approvals must be present (for master)

**Solution:**
1. Update branch: `git merge origin/qa` (or master)
2. Fix any failing checks
3. Request reviews if needed
4. Retry merge

## Branch Strategy

The recommended workflow:

1. **Feature Development:**
   - Create feature branch from `dev`
   - Develop and test locally
   - Create PR to `dev` branch

2. **Dev Testing:**
   - Merge PR to `dev`
   - Auto-deploys to dev environment
   - Test features in dev environment

3. **QA Testing:**
   - Create PR from `dev` to `qa`
   - CI checks must pass
   - Merge to `qa` branch
   - Auto-deploys to QA environment
   - Perform thorough QA testing

4. **Production Release:**
   - Create PR from `qa` to `master`
   - CI checks must pass
   - Get required approvals
   - Merge to `master`
   - **Manually trigger production deploy workflow**
   - Approve deployment in GitHub
   - Monitor production

## Best Practices

1. **Always test in dev first** before promoting to QA
2. **Never skip QA** - always test in QA before production
3. **Monitor deployments** - check logs during and after deployment
4. **Communicate deploys** - notify team before production deployments
5. **Keep environment variables secret** - never commit to git
6. **Use descriptive commit messages** - helps with rollback decisions
7. **Tag production releases** - create git tags for production deploys
8. **Review before approving** - always review changes before production approval

## Monitoring

**Recommended additions:**

- Set up error tracking (e.g., Sentry)
- Monitor uptime (e.g., UptimeRobot)
- Track Web Vitals
- Set up Slack/email notifications for failed deployments

## Support

For issues with:
- **CI/CD pipeline**: Check GitHub Actions logs
- **Render deployments**: Check Render dashboard logs
- **Application errors**: Check browser console and network tab
- **Environment configuration**: Review this document and Render dashboard

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render.com Documentation](https://render.com/docs)
- [Vite Documentation](https://vitejs.dev/)
