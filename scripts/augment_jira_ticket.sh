#!/bin/bash

# Augment Jira Tickets with Technical Implementation Plans
# Uses Bob Shell in non-interactive mode with Jira MCP integration

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🤖 Jira Ticket Augmentation Script${NC}"
echo -e "${BLUE}====================================${NC}\n"

# Check if Bob is installed
if ! command -v bob &> /dev/null; then
    echo -e "${RED}❌ Error: Bob Shell is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Bob Shell detected${NC}\n"
echo -e "${YELLOW}🔍 Analyzing tickets and generating implementation plans...${NC}\n"

# Call Bob in non-interactive mode with --yolo flag
bob -p "Execute these tasks step by step:

1. Use the Jira MCP server to fetch all tickets in project 'AUT' with status 'To Do'

2. For the first ticket found (should be AUT-1):
   - Read its summary and description
   - Note the ticket key

3. Use the GitHub MCP server to get additional context:
   - Check if there's a forked repository for this project
   - Review recent commits and README for project understanding
   - Note any relevant documentation or architecture decisions

4. Analyze these codebase files to understand the current implementation:
   - @python_backend/app/models.py (User model - currently has id, name, email)
   - @python_backend/app/schemas.py (Pydantic schemas for validation)
   - @python_backend/app/main.py (API endpoints, especially /register)
   - @frontend/src/components/customer/RegistrationModal.tsx (Registration form UI)
   - @frontend/src/types/index.ts (TypeScript type definitions)
   - @frontend/src/api/endpoints.ts (API client functions)

4. Create a detailed technical implementation plan comment with this structure:

## 🎯 Technical Implementation Plan

### Backend Changes:
**File: python_backend/app/models.py**
- Add phone field to User model (line ~17): phone = Column(String, nullable=True)

**File: python_backend/app/schemas.py**
- Update UserCreate schema to include optional phone field with E.164 validation
- Update UserResponse schema to include phone field

**File: python_backend/app/main.py**
- Modify /register endpoint to accept and store phone number

### Frontend Changes:
**File: frontend/src/types/index.ts**
- Add phone?: string to User interface

**File: frontend/src/components/customer/RegistrationModal.tsx**
- Add phone state variable
- Add phone input field after email (with label 'Phone Number (Optional - for booking updates)')
- Add phone validation regex
- Include phone in registration API call

**File: frontend/src/api/endpoints.ts**
- Update registerUser function signature to include phone parameter

### Database Migration:
\`\`\`sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL;
\`\`\`

### Testing:
- Test registration with phone number
- Test registration without phone number
- Test phone validation (invalid formats)

### Estimated Effort: 4-6 hours

### GitHub Repository Context:
[Include any relevant information from the GitHub repository like architecture decisions, coding standards, or related issues]

5. Post this implementation plan as a comment on the ticket using the Jira MCP server

6. Report success with:
   - Ticket URL
   - GitHub repository URL (if found)
   - Summary of changes needed" --yolo

# Check exit code
if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Successfully augmented Jira ticket!${NC}"
    echo -e "${GREEN}📝 Check your Jira board for the implementation plan${NC}"
    echo -e "${BLUE}🔗 https://adityakrishnan28.atlassian.net/jira/software/projects/AUT/boards${NC}\n"
else
    echo -e "\n${RED}❌ Error occurred during ticket augmentation${NC}"
    exit 1
fi

# Made with Bob
