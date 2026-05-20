#!/usr/bin/env python3
"""
Jira Ticket Augmentation Script
Uses Bob Shell in non-interactive mode to analyze tickets and add technical implementation plans
"""

import subprocess
import json
import sys
import os
from pathlib import Path

# ANSI color codes
GREEN = '\033[0;32m'
BLUE = '\033[0;34m'
YELLOW = '\033[1;33m'
RED = '\033[0;31m'
NC = '\033[0m'  # No Color

def print_colored(message, color):
    """Print colored message"""
    print(f"{color}{message}{NC}")

def check_bob_installed():
    """Check if Bob Shell is installed"""
    try:
        subprocess.run(['bob', '--version'], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def get_codebase_context():
    """Read relevant codebase files for context"""
    base_path = Path(__file__).parent.parent
    
    context_files = {
        'backend_models': 'python_backend/app/models.py',
        'backend_schemas': 'python_backend/app/schemas.py',
        'backend_main': 'python_backend/app/main.py',
        'frontend_registration': 'frontend/src/components/customer/RegistrationModal.tsx',
        'frontend_types': 'frontend/src/types/index.ts',
        'frontend_api': 'frontend/src/api/endpoints.ts',
    }
    
    context = {}
    for key, file_path in context_files.items():
        full_path = base_path / file_path
        if full_path.exists():
            context[key] = f"@{file_path}"
    
    return context

def create_implementation_prompt(ticket_key, ticket_summary, ticket_description):
    """Create a detailed prompt for Bob to generate implementation plan"""
    
    context_files = get_codebase_context()
    file_refs = ' '.join(context_files.values())
    
    prompt = f"""Analyze the following Jira ticket and create a detailed technical implementation plan for a coding agent.

TICKET: {ticket_key}
SUMMARY: {ticket_summary}

DESCRIPTION:
{ticket_description}

CODEBASE FILES TO REFERENCE:
{file_refs}

Create a comprehensive technical implementation plan with the following structure:

## 🎯 Technical Implementation Plan for {ticket_key}

### 📋 Overview
[Brief summary of what needs to be implemented]

### 🔧 Backend Changes

#### 1. Database Model Updates
**File:** `python_backend/app/models.py`
**Current State:** [Describe current User model]
**Required Changes:**
```python
# Add to User model (around line 16-17):
phone = Column(String, nullable=True)  # Optional initially for backward compatibility
```
**Reasoning:** [Explain why this change is needed]

#### 2. Pydantic Schema Updates
**File:** `python_backend/app/schemas.py`
**Changes Required:**
- Update `UserCreate` schema to include phone field
- Update `UserResponse` schema to include phone field
- Add phone number validation pattern

**Code Changes:**
```python
# In UserCreate class (around line 10-12):
phone: Optional[str] = Field(None, pattern=r'^\+?[1-9]\d{{1,14}}$', description="Phone number in E.164 format")

# In UserResponse class (around line 18-19):
phone: Optional[str] = None
```

#### 3. API Endpoint Updates
**File:** `python_backend/app/main.py`
**Endpoint:** `POST /register`
**Changes:**
- Accept phone field in registration request
- Store phone in database
- Return phone in response

**Migration Considerations:**
- Existing users will have NULL phone numbers
- No breaking changes to existing API consumers
- Phone field is optional to maintain backward compatibility

### 💻 Frontend Changes

#### 4. TypeScript Type Definitions
**File:** `frontend/src/types/index.ts`
**Changes:**
```typescript
export interface User {{
  id: number;
  name: string;
  email: string;
  phone?: string;  // Add optional phone field
}}
```

#### 5. Registration Modal Updates
**File:** `frontend/src/components/customer/RegistrationModal.tsx`
**Changes Required:**

1. **Add State Management** (around line 26-28):
```typescript
const [phone, setPhone] = useState('');
```

2. **Add Validation** (around line 36-45):
```typescript
// Add phone validation
const phoneRegex = /^\+?[1-9]\d{{1,14}}$/;
if (phone && !phoneRegex.test(phone)) {{
  setError('Please enter a valid phone number (e.g., +1234567890)');
  return;
}}
```

3. **Add Form Field** (after email field, around line 102):
```typescript
<div className="space-y-2">
  <Label htmlFor="phone">
    Phone Number
    <span className="text-xs text-gray-400 ml-2">(Optional - for booking updates)</span>
  </Label>
  <Input
    id="phone"
    type="tel"
    value={{phone}}
    onChange={{(e) => setPhone(e.target.value)}}
    placeholder="+1234567890"
  />
  <p className="text-xs text-gray-400">
    We'll use this to send you important booking updates
  </p>
</div>
```

4. **Update API Call** (around line 48):
```typescript
await registerUser.mutateAsync({{ name, email, phone }});
```

5. **Reset State** (around line 51):
```typescript
setPhone('');
```

#### 6. API Client Updates
**File:** `frontend/src/api/endpoints.ts`
**Changes:**
```typescript
// Update registerUser function to include phone
export const registerUser = async (data: {{ name: string; email: string; phone?: string }}) => {{
  const response = await apiClient.post('/register', data);
  return response.data;
}};
```

#### 7. React Hook Updates
**File:** `frontend/src/hooks/useUser.ts`
**Changes:**
- Update mutation type to include optional phone field
- Ensure phone is passed through to API call

### 🧪 Testing Requirements

#### Backend Tests
**File:** `python_backend/tests/test_api.py`
- Test user registration with phone number
- Test user registration without phone number (backward compatibility)
- Test phone number validation (invalid formats)
- Test phone number in user response

#### Frontend Tests
- Test registration form with phone number
- Test registration form without phone number
- Test phone number validation
- Test phone number display in user profile

### 📊 Database Migration

**Migration Steps:**
1. Add `phone` column to `users` table (nullable)
2. No data migration needed (existing users will have NULL)
3. Update seed data to include sample phone numbers

**SQL:**
```sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL;
```

### 🚀 Deployment Checklist

- [ ] Update backend models and schemas
- [ ] Run database migration
- [ ] Update API endpoints
- [ ] Deploy backend changes
- [ ] Update frontend types and components
- [ ] Deploy frontend changes
- [ ] Test end-to-end registration flow
- [ ] Update API documentation
- [ ] Notify stakeholders of new feature

### ⚠️ Edge Cases & Considerations

1. **Backward Compatibility:** Phone field is optional to not break existing integrations
2. **International Formats:** Using E.164 format for international phone numbers
3. **Privacy:** Phone numbers should be handled according to privacy policy
4. **Validation:** Client-side and server-side validation for data integrity
5. **Display:** Consider masking phone numbers in UI for privacy

### 📈 Success Metrics
- 90%+ of new registrations include phone numbers
- Zero registration failures due to phone field
- Improved customer reachability for booking updates

### ⏱️ Estimated Effort
- **Backend:** 2-3 hours
- **Frontend:** 2-3 hours  
- **Testing:** 1-2 hours
- **Total:** 5-8 hours

### 🔗 Related Files
- Backend: {file_refs}
- Database: `python_backend/app/database.py`
- Seed Data: `python_backend/app/seed_data.py`

---
*This implementation plan was generated by Bob Shell automation for coding agent consumption.*
*All file paths and line numbers are approximate and should be verified.*

Now format this as a Jira comment and post it to ticket {ticket_key} using the Jira MCP server.
"""
    
    return prompt

def main():
    """Main execution function"""
    print_colored("🤖 Jira Ticket Augmentation Script", BLUE)
    print_colored("=" * 50, BLUE)
    print()
    
    # Check if Bob is installed
    if not check_bob_installed():
        print_colored("❌ Error: Bob Shell is not installed or not in PATH", RED)
        print_colored("Please install Bob Shell first", YELLOW)
        sys.exit(1)
    
    print_colored("✅ Bob Shell detected", GREEN)
    print()
    
    # Change to project directory
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent
    os.chdir(project_dir)
    
    print_colored(f"📁 Working directory: {project_dir}", BLUE)
    print()
    
    # Create the prompt for Bob to fetch tickets and augment them
    main_prompt = """Use the Jira MCP server to:
1. Fetch all tickets in project "AUT" with status "To Do"
2. For the first ticket found (AUT-1), read its summary and description
3. Then analyze the codebase files and create a detailed technical implementation plan
4. Post the implementation plan as a comment on the ticket

The implementation plan should reference these files:
- @python_backend/app/models.py
- @python_backend/app/schemas.py  
- @python_backend/app/main.py
- @frontend/src/components/customer/RegistrationModal.tsx
- @frontend/src/types/index.ts
- @frontend/src/api/endpoints.ts

Create a comprehensive plan with specific file paths, line numbers, code snippets, and step-by-step instructions for a coding agent to implement the feature.
"""
    
    print_colored("🔍 Running Bob Shell to analyze and augment tickets...", YELLOW)
    print()
    
    try:
        # Run Bob in non-interactive mode
        result = subprocess.run(
            ['bob', '--yolo', '-p', main_prompt],
            capture_output=True,
            text=True,
            cwd=project_dir
        )
        
        # Print output
        print(result.stdout)
        
        if result.returncode == 0:
            print()
            print_colored("✅ Successfully augmented Jira tickets!", GREEN)
            print_colored("📝 Check your Jira board for the detailed implementation plan", GREEN)
            print_colored("🔗 https://adityakrishnan28.atlassian.net/jira/software/projects/AUT/boards", BLUE)
        else:
            print()
            print_colored("❌ Error occurred during ticket augmentation", RED)
            if result.stderr:
                print_colored(f"Error details: {result.stderr}", RED)
            sys.exit(1)
            
    except Exception as e:
        print_colored(f"❌ Unexpected error: {str(e)}", RED)
        sys.exit(1)

if __name__ == "__main__":
    main()

# Made with Bob
