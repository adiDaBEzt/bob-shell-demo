# Automated SDLC with Bob Shell

This repository demonstrates an automated Software Development Life Cycle (SDLC) workflow using Bob Shell with MCP (Model Context Protocol) integrations for Jira and GitHub.

## 🎯 Overview

The automation script bridges Product Management and Engineering by:
1. **Fetching** new Jira tickets from your project
2. **Analyzing** the codebase context using local files and GitHub repository
3. **Generating** detailed technical implementation plans
4. **Posting** the plans back to Jira as comments for coding agents

## 🏗️ Architecture

```
┌─────────────────┐
│  Jira Ticket    │
│  (Business Req) │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Bob Shell (Non-Interactive)    │
│  ┌──────────────────────────┐  │
│  │  Jira MCP Server         │  │
│  │  - Fetch tickets         │  │
│  │  - Post comments         │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  GitHub MCP Server       │  │
│  │  - Repository context    │  │
│  │  - Architecture docs     │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  File System Tools       │  │
│  │  - Read codebase         │  │
│  │  - Analyze structure     │  │
│  └──────────────────────────┘  │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Technical Implementation Plan  │
│  - Backend changes              │
│  - Frontend changes             │
│  - Database migrations          │
│  - Testing requirements         │
│  - Deployment steps             │
└─────────────────────────────────┘
```

## 📋 Prerequisites

### 1. Bob Shell Installation
```bash
# Install Bob Shell (follow official documentation)
# Verify installation
bob --version
```

### 2. MCP Server Configuration

#### Jira MCP Server
```bash
# Add Jira MCP server
bob mcp add jira

# You'll need:
# - Jira URL: https://your-domain.atlassian.net
# - Email: your-email@example.com
# - API Token: Generate at https://id.atlassian.com/manage-profile/security/api-tokens
```

#### GitHub MCP Server (Optional but Recommended)
```bash
# Add GitHub MCP server
bob mcp add github

# You'll need:
# - GitHub Personal Access Token
# - Repository access permissions
```

### 3. Verify Configuration
```bash
# List configured MCP servers
bob mcp list

# Should show:
# - jira (configured)
# - github (configured)
```

## 🚀 Usage

### Quick Start

```bash
# Navigate to project directory
cd /Users/adityakrishnan/Documents/Automated-SDLC

# Run the augmentation script
./scripts/augment_jira_ticket.sh
```

### What Happens

1. **Ticket Discovery**: Script fetches all "To Do" tickets from Jira project "AUT"
2. **Context Gathering**: 
   - Reads local codebase files
   - Checks GitHub repository for additional context
   - Analyzes current implementation
3. **Plan Generation**: Creates detailed technical plan including:
   - Specific file paths and line numbers
   - Code snippets for changes
   - Database migration scripts
   - Testing requirements
   - Effort estimates
4. **Comment Posting**: Posts the plan as a Jira comment
5. **Confirmation**: Displays success message with ticket URL

### Example Output

```
🤖 Jira Ticket Augmentation Script
====================================

✅ Bob Shell detected

🔍 Analyzing tickets and generating implementation plans...

[Bob Shell executes the workflow...]

✅ Successfully augmented Jira ticket!
📝 Check your Jira board for the implementation plan
🔗 https://adityakrishnan28.atlassian.net/jira/software/projects/AUT/boards
```

## 📝 Implementation Plan Format

The generated plan includes:

### Backend Changes
- **File paths**: Exact locations in codebase
- **Line numbers**: Where to make changes
- **Code snippets**: What to add/modify
- **Validation rules**: Data validation requirements

### Frontend Changes
- **Component updates**: UI modifications
- **Type definitions**: TypeScript interfaces
- **API client changes**: HTTP request updates
- **Validation logic**: Client-side validation

### Database Changes
- **Migration scripts**: SQL statements
- **Schema updates**: Table modifications
- **Data considerations**: Backward compatibility

### Testing Requirements
- **Unit tests**: What to test
- **Integration tests**: End-to-end scenarios
- **Edge cases**: Potential issues

### Deployment
- **Step-by-step guide**: Deployment checklist
- **Rollback plan**: How to revert if needed
- **Monitoring**: What to watch after deployment

## 🔧 Customization

### Change Target Project

Edit `scripts/augment_jira_ticket.sh`:

```bash
# Change 'AUT' to your project key
bob -p "Execute these tasks step by step:
1. Use the Jira MCP server to fetch all tickets in project 'YOUR_PROJECT_KEY' with status 'To Do'
...
```

### Modify Implementation Plan Template

Edit the plan structure in the script to match your team's needs:

```bash
## 🎯 Technical Implementation Plan

### Your Custom Sections Here
...
```

### Add More Context Files

Include additional files for analysis:

```bash
4. Analyze these codebase files to understand the current implementation:
   - @python_backend/app/models.py
   - @your/additional/file.py
   - @another/context/file.ts
```

## 🔄 Integration with CI/CD

### GitHub Actions Example

```yaml
name: Augment Jira Tickets

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:  # Manual trigger

jobs:
  augment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Bob Shell
        run: |
          # Install Bob Shell
          curl -fsSL https://bob-install-url | bash
          
      - name: Configure MCP Servers
        env:
          JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          # Configure Jira MCP
          bob mcp add jira --token $JIRA_API_TOKEN
          # Configure GitHub MCP
          bob mcp add github --token $GITHUB_TOKEN
          
      - name: Run Augmentation
        run: ./scripts/augment_jira_ticket.sh
```

### Jenkins Pipeline Example

```groovy
pipeline {
    agent any
    
    triggers {
        cron('H */6 * * *')  // Every 6 hours
    }
    
    stages {
        stage('Setup') {
            steps {
                sh 'bob mcp list'
            }
        }
        
        stage('Augment Tickets') {
            steps {
                sh './scripts/augment_jira_ticket.sh'
            }
        }
    }
}
```

## 🎯 Use Cases

### 1. New Feature Requests
- PM creates ticket: "Add phone number to signup"
- Script generates implementation plan
- Developer follows plan to implement

### 2. Bug Fixes
- QA creates bug ticket with reproduction steps
- Script analyzes affected code
- Generates fix strategy with test cases

### 3. Technical Debt
- Tech lead creates refactoring ticket
- Script identifies impacted files
- Provides migration path and testing strategy

### 4. API Changes
- Product creates API enhancement ticket
- Script maps frontend/backend changes
- Includes versioning and backward compatibility notes

## 📊 Benefits

### For Product Managers
- ✅ Tickets automatically enriched with technical details
- ✅ Better estimation accuracy
- ✅ Reduced back-and-forth with engineering

### For Developers
- ✅ Clear implementation roadmap
- ✅ Specific file paths and line numbers
- ✅ Code snippets to guide implementation
- ✅ Testing requirements defined upfront

### For Teams
- ✅ Consistent documentation
- ✅ Knowledge sharing
- ✅ Faster onboarding
- ✅ Reduced context switching

## 🐛 Troubleshooting

### MCP Server Not Configured
```bash
# Error: No MCP servers configured
# Solution:
bob mcp add jira
bob mcp add github
```

### Authentication Failed
```bash
# Error: Jira authentication failed
# Solution: Regenerate API token and reconfigure
bob mcp remove jira
bob mcp add jira
```

### No Tickets Found
- Verify project key is correct (AUT)
- Check ticket status filter ("To Do")
- Ensure Jira MCP has project access

### Script Permission Denied
```bash
chmod +x scripts/augment_jira_ticket.sh
```

## 📚 Project Structure

```
Automated-SDLC/
├── .bob/
│   ├── mcp.json              # MCP server configuration
│   └── custom_modes.yaml     # Bob custom modes
├── scripts/
│   ├── augment_jira_ticket.sh    # Main automation script
│   └── README.md                  # Scripts documentation
├── python_backend/           # Backend application
│   ├── app/
│   │   ├── models.py        # Database models
│   │   ├── schemas.py       # API schemas
│   │   └── main.py          # API endpoints
│   └── tests/               # Backend tests
├── frontend/                 # Frontend application
│   └── src/
│       ├── components/      # React components
│       ├── types/           # TypeScript types
│       └── api/             # API client
├── AGENTS.md                # Agent-specific guidelines
├── AUTOMATION_README.md     # This file
└── start.sh                 # Application startup script
```

## 🔮 Future Enhancements

- [ ] Support for multiple Jira projects
- [ ] Automatic PR creation with implementation skeleton
- [ ] Integration with Slack for notifications
- [ ] Support for different ticket types (Bug, Epic, Task)
- [ ] Custom templates per project type
- [ ] Automatic effort estimation using ML
- [ ] Code complexity analysis
- [ ] Dependency impact analysis

## 📄 License

MIT License - Part of the Automated SDLC demonstration project

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Enhanced implementation plan templates
- Additional MCP server integrations
- Better error handling
- More comprehensive testing strategies

---

**Powered by Bob Shell** 🤖 | **MCP Integration** 🔌 | **Automated SDLC** ⚡