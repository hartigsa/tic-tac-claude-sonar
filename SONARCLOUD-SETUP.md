# SonarCloud Setup Guide

This guide explains how to configure and use SonarCloud for continuous code quality and security analysis.

## 🚀 Quick Setup (Personal Account)

The project is already configured with SonarCloud GitHub Action. For personal GitHub accounts:

1. **Sign in to SonarCloud** with your GitHub account at https://sonarcloud.io
2. **Add your repository**: Click "Analyze new project" → "From GitHub" → Select `tic-tac-claude`
3. **Get your tokens**: Copy the generated project key and your username (organization key)
4. **Add GitHub secret**: Add `SONAR_TOKEN` in repository settings
5. **Update config**: Edit `sonar-project.properties` with your keys

## 🏢 Organization Setup

If you need organization-level setup, you'll need organization owner permissions.

## 📋 Prerequisites

- GitHub repository with admin access
- SonarCloud account (free for public repositories)
- GitHub Actions enabled

## ⚙️ Configuration Steps

### 1. SonarCloud Account Setup

1. Go to https://sonarcloud.io
2. Sign in with GitHub
3. **For personal repositories**: SonarCloud automatically creates a personal organization using your GitHub username
4. **For organization repositories**: You need organization owner permissions (skip if you don't have these)

### 2. Get Required Tokens

**SONAR_TOKEN:**
1. In SonarCloud, go to **My Account** > **Security**
2. Generate a new token with a descriptive name
3. Copy the token (you won't see it again)

**Organization Key (Personal Account):**
1. After signing in, your organization key is usually your GitHub username
2. Check the URL: `sonarcloud.io/organizations/YOUR-USERNAME`
3. The part after `/organizations/` is your organization key

**Organization Key (Organization Account):**
1. In SonarCloud, go to your organization
2. Copy the organization key from the URL or organization page

### 3. Configure GitHub Secrets

In your GitHub repository:
1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Add these repository secrets:

```
SONAR_TOKEN=your_sonar_token_here
```

Note: `GITHUB_TOKEN` is automatically available in GitHub Actions.

### 4. Create SonarCloud Project

**Important**: You must create the project in SonarCloud before running the workflow.

1. **In SonarCloud dashboard**:
   - Click "Analyze new project" or "+" 
   - Choose "From GitHub"
   - Select your `tic-tac-claude` repository
   - SonarCloud will auto-generate the project key

2. **Project details** (auto-generated):
   - Project Key: `your-github-username_tic-tac-claude`
   - Organization Key: Your GitHub username (for personal accounts)

### 5. Update Configuration

Edit `sonar-project.properties` and update:

```properties
sonar.organization=your-org-key-here
sonar.projectKey=your-github-username_tic-tac-claude
```

**Example**:
```properties
sonar.organization=mycompany
sonar.projectKey=john-doe_tic-tac-claude
```

## 📁 Current Configuration

### Workflow File: `.github/workflows/sonarcloud.yml`

The workflow includes:
- **SonarCloud Analysis** - Code quality and security scanning
- **Security Audit** - NPM vulnerability scanning
- **Quality Gate Check** - Automated quality validation

### Project Configuration: `sonar-project.properties`

Key configurations:
- **Source paths**: `game`, `css`, `tests`, `frontend`, `backend`
- **Test paths**: All test directories
- **Coverage**: LCOV reports from multiple locations
- **Exclusions**: `node_modules`, build artifacts, minified files
- **Security rules**: Enhanced vulnerability detection

## 🎯 Quality Gates

The project is configured with:
- **Coverage threshold**: Monitored via SonarCloud
- **Duplicated lines**: < 3%
- **Maintainability rating**: A
- **Reliability rating**: A
- **Security rating**: A
- **Security hotspots**: All must be reviewed

## 📊 Analysis Scope

### Included Files:
- **JavaScript**: Game logic, frontend, backend code
- **CSS**: Styling and theme files
- **HTML**: Structure files
- **Tests**: Unit tests and security tests

### Excluded Files:
- `node_modules/` directories
- Build and distribution files
- Coverage reports
- Minified JavaScript files
- Vendor libraries

## 🔧 Customization

### Adding New Source Directories

Edit `sonar-project.properties`:
```properties
sonar.sources=game,css,tests,your-new-directory
```

### Excluding Files from Analysis

```properties
sonar.exclusions=**/your-excluded-files/**
```

### Custom Quality Rules

```properties
sonar.issue.ignore.multicriteria=e5
sonar.issue.ignore.multicriteria.e5.ruleKey=javascript:S1234
sonar.issue.ignore.multicriteria.e5.resourceKey=**/specific-files/**
```

## 🚨 Troubleshooting

### Common Issues:

**"Organization not found"**
- Verify organization key in `sonar-project.properties`
- Ensure you have access to the organization

**"Token authentication error"**
- Check `SONAR_TOKEN` secret is correctly set
- Regenerate token if expired

**"No coverage reports found"**
- Ensure test scripts generate LCOV reports
- Check coverage file paths in configuration

**"Quality gate failed"**
- Review SonarCloud dashboard for specific issues
- Fix code smells, bugs, and security hotspots

**"Could not find a default branch for project" / "project does not exist"**
- Project hasn't been created in SonarCloud yet
- Go to SonarCloud dashboard and create the project first
- Make sure project key matches exactly what's in `sonar-project.properties`
- Verify organization key is correct

### Debug Steps:

1. **Check workflow logs** in GitHub Actions
2. **Review SonarCloud dashboard** for detailed results
3. **Verify file paths** in `sonar-project.properties`
4. **Test locally** with SonarScanner CLI

## 📈 Best Practices

### Code Quality:
- Fix **all security hotspots**
- Maintain **high test coverage**
- Reduce **code duplication**
- Follow **JavaScript best practices**

### Security:
- Address **all vulnerabilities**
- Review **security hotspots**
- Use **secure coding patterns**
- Regular **dependency updates**

### Maintenance:
- **Monitor quality trends** over time
- **Set quality gate policies**
- **Regular token rotation**
- **Keep configuration updated**

## 📋 Workflow Triggers

The SonarCloud analysis runs on:
- **Push** to `master`, `main`, or `develop` branches
- **Pull requests** to `master` or `main` branches
- **Manual trigger** via GitHub Actions UI

## 🔍 Security Features

The configuration includes:
- **Vulnerability detection**
- **Security hotspot analysis**
- **Dependency vulnerability scanning**
- **Code smell detection**
- **OWASP compliance checks**

## 📚 Additional Resources

- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [GitHub Actions Integration](https://docs.sonarcloud.io/advanced-setup/ci-based-analysis/github-actions-integration/)
- [JavaScript Analysis](https://docs.sonarcloud.io/advanced-setup/languages/javascript/)
- [Quality Gates](https://docs.sonarcloud.io/digging-deeper/quality-gates/)

## 🎯 Next Steps

1. **Complete setup** by adding secrets
2. **Trigger first analysis** by pushing code
3. **Review results** in SonarCloud dashboard
4. **Fix any issues** identified
5. **Set up notifications** for quality gate failures
