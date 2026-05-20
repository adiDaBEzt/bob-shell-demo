# Automated Jira Ticket Augmentation Scripts

This directory contains automation scripts that use Bob Shell in non-interactive mode to augment Jira tickets with detailed technical implementation plans for coding agents.

## Overview

These scripts automatically:
1. Fetch new tickets from your Jira project (AutomatedJira/AUT)
2. Analyze the codebase context
3. Generate detailed technical implementation plans
4. Post the plans as comments on the tickets

## Scripts

### 1. `augment_tickets.py` (Recommended)
Python script that provides structured interaction with Bob Shell and MCP servers.

**Usage:**
```bash
cd bob-shell-demo
./scripts/augment_tickets.py
```

**Features:**
- Colored terminal output
- Error handling
- Automatic codebase context gathering
- Structured prompts for Bob Shell

### 2. `augment-jira-tickets.sh`
Bash script alternative for Unix-like systems.

**Usage:**
```bash
cd bob-shell-demo
./scripts/augment-jira-tickets.sh
```

## Prerequisites

1. **Bob Shell Installed**
   - Bob Shell must be installed and available in your PATH
   - Verify with: `bob --version`

2. **MCP Servers Configured**
   - Jira MCP server must be configured in `.bob/mcp.json`
   - GitHub MCP server (optional, for future enhancements)

3. **License Accepted**
   - Accept Bob Shell license: `bob --accept-license -p "test"`

4. **Jira Authentication**
   - Ensure Jira MCP server is authenticated
   - Check `.bob/mcp.json` for correct credentials

## How It Works

### Step 1: Ticket Discovery
The script uses the Jira MCP server to query for tickets:
- Project: `AUT` (AutomatedJira)
- Status: `To Do`
- Fetches ticket summary and description

### Step 2: Codebase Analysis
Bob Shell analyzes relevant files:
- **Backend:**
  - `python_backend/app/models.py` - Database models
  - `python_backend/app/schemas.py` - API schemas
  - `python_backend/app/main.py` - API endpoints
  
- **Frontend:**
  - `frontend/src/components/customer/RegistrationModal.tsx` - UI components
  - `frontend/src/types/index.ts` - TypeScript types
  - `frontend/src/api/endpoints.ts` - API client

### Step 3: Implementation Plan Generation
Bob generates a comprehensive plan including:
- **Backend Changes:** Models, schemas, endpoints
- **Frontend Changes:** Components, types, API calls
- **Testing Requirements:** Unit and integration tests
- **Database Migration:** SQL scripts and considerations
- **Deployment Checklist:** Step-by-step deployment guide
- **Edge Cases:** Potential issues and solutions
- **Effort Estimation:** Time estimates for each task

### Step 4: Comment Posting
The implementation plan is posted as a Jira comment on the ticket using the Jira MCP server.

## Implementation Plan Format

The generated plan includes:

```markdown
## 🎯 Technical Implementation Plan for [TICKET-KEY]

### 📋 Overview
[Brief summary]

### 🔧 Backend Changes
#### 1. Database Model Updates
- File paths
- Current state
- Required changes
- Code snippets

#### 2. Pydantic Schema Updates
- Schema changes
- Validation rules

#### 3. API Endpoint Updates
- Endpoints to modify
- Request/response changes

### 💻 Frontend Changes
#### 4. TypeScript Type Definitions
- Interface updates

#### 5. Registration Modal Updates
- UI changes
- Form fields
- Validation logic

#### 6. API Client Updates
- API call modifications

### 🧪 Testing Requirements
- Backend tests
- Frontend tests
- Integration tests

### 📊 Database Migration
- Migration steps
- SQL scripts

### 🚀 Deployment Checklist
- Step-by-step deployment guide

### ⚠️ Edge Cases & Considerations
- Potential issues
- Solutions

### 📈 Success Metrics
- KPIs to track

### ⏱️ Estimated Effort
- Time breakdown
```

## Example Usage

### Scenario: New Feature Request
1. PM creates a ticket in Jira: "Add phone number to signup"
2. Run the augmentation script:
   ```bash
   ./scripts/augment_tickets.py
   ```
3. Script analyzes the ticket and codebase
4. Detailed implementation plan is posted as a comment
5. Coding agent can now implement the feature following the plan

## Customization

### Modify the Prompt
Edit the prompt in `augment_tickets.py` to customize:
- Implementation plan structure
- Level of detail
- Code snippet format
- Additional sections

### Change Target Project
Update the `JIRA_PROJECT_KEY` variable:
```python
# In augment_tickets.py
main_prompt = """Use the Jira MCP server to:
1. Fetch all tickets in project "YOUR_PROJECT_KEY" with status "To Do"
...
```

### Add More Context Files
Add additional files to analyze:
```python
context_files = {
    'backend_models': 'python_backend/app/models.py',
    'your_new_file': 'path/to/your/file.py',
    # Add more files here
}
```

## Troubleshooting

### Bob Shell Not Found
```bash
# Check if Bob is installed
which bob

# If not found, install Bob Shell
# Follow installation instructions from Bob Shell documentation
```

### MCP Server Connection Issues
```bash
# Check MCP configuration
cat .bob/mcp.json

# Verify Jira credentials are correct
# Ensure API token has proper permissions
```

### No Tickets Found
- Verify the project key is correct (`AUT`)
- Check that tickets exist with status "To Do"
- Ensure Jira MCP server has access to the project

### Permission Denied
```bash
# Make scripts executable
chmod +x scripts/augment_tickets.py
chmod +x scripts/augment-jira-tickets.sh
```

## Integration with CI/CD

### GitHub Actions Example
```yaml
name: Augment Jira Tickets

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  augment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Bob Shell
        run: |
          # Install Bob Shell
          # Configure MCP servers
      - name: Run Augmentation
        run: ./scripts/augment_tickets.py
```

## Future Enhancements

- [ ] Support for multiple Jira projects
- [ ] Automatic ticket assignment to coding agents
- [ ] Integration with GitHub Issues
- [ ] Slack notifications when plans are generated
- [ ] Support for different ticket types (Bug, Epic, etc.)
- [ ] Custom templates for different project types
- [ ] Automatic PR creation with implementation skeleton

## Contributing

To improve these scripts:
1. Test with different ticket types
2. Add error handling for edge cases
3. Enhance the implementation plan template
4. Add support for more MCP servers

## License

MIT License - Part of the Galaxium Travels demo project

---

**Built with Bob Shell automation** 🤖