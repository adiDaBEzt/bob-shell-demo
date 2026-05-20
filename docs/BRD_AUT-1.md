# Business Requirements Document - AUT-1

## Phone Number Collection During Registration

**Jira Ticket:** AUT-1  
**Date:** May 20, 2026  
**Author:** Aditya Krishnan  
**Priority:** Medium

---

## Executive Summary

Add phone number field to customer registration to enable multi-channel communication for time-sensitive booking updates, reducing missed communications and improving customer service.

**Expected Impact:**
- 90%+ phone number collection rate
- 30% reduction in "customer unreachable" support tickets
- Foundation for future SMS notifications

---

## Business Objectives

1. **Improve Communication**: Enable phone contact for urgent flight updates
2. **Reduce Support Overhead**: Decrease missed communication incidents
3. **Enhance Customer Experience**: Provide multiple contact channels
4. **Regulatory Preparedness**: Build infrastructure for compliance requirements

---

## Current Problem

- Registration only collects name and email
- Email-only communication has ~40% open rate
- 15% of support tickets relate to missed communications
- No backup method for urgent notifications

---

## Proposed Solution

Add optional phone number field to registration form with validation and secure storage.

---

## Scope

### In Scope
- Add phone number field to registration form
- Client and server-side validation (10-15 digits)
- Store phone numbers in database
- Display in customer profile and agent view
- Update API endpoints

### Out of Scope (Future)
- SMS notification system
- Phone verification via OTP
- International format handling
- Phone number editing post-registration

---

## Functional Requirements

### REQ-001: Registration Form
- Add phone number input field (optional)
- Label: "Phone Number" with helper text "For booking updates and notifications"
- Position between email and password fields
- Accepts 10-15 digits with optional formatting

### REQ-002: Validation
- **Client-side**: Validate format on blur and submission
- **Server-side**: Validate and strip formatting before storage
- **Format**: (123) 456-7890, 123-456-7890, or 1234567890
- **Error message**: "Please enter a valid phone number (10-15 digits)"

### REQ-003: Database
- Add `phone_number` column (VARCHAR(20), nullable)
- Create migration script with rollback plan
- Store digits only (strip formatting)

### REQ-004: API Update
- Update `/register` endpoint to accept optional `phone_number`
- Maintain backward compatibility
- Return phone number in response

### REQ-005: Display
- Show formatted phone in customer profile: (123) 456-7890
- Show full number in agent booking view
- Display "Not provided" if missing

---

## Non-Functional Requirements

- **Performance**: Registration time increase <100ms
- **Security**: HTTPS transmission, secure storage, audit logging
- **Usability**: Accessible, mobile-responsive, clear error messages
- **Compliance**: GDPR/CCPA compliant, privacy policy update required
- **Testing**: >80% code coverage

---

## Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Phone collection rate | 90%+ | 30 days |
| Registration completion | No decrease | 30 days |
| Support tickets reduction | 30% | 90 days |
| Customer satisfaction | 15% improvement | 90 days |

---

## User Story

**As a** customer booking interplanetary travel  
**I want to** provide my phone number during registration  
**So that** Galaxium Travels can reach me quickly for important flight updates

**Acceptance Criteria:**
- Phone field present in registration form
- Format validation works correctly
- Phone number saved and displayed in profile
- Registration works with or without phone number

---

## Business Rules

1. Phone number field is optional
2. Only digits (0-9) stored in database
3. Formatting characters stripped before storage
4. Length: 10-15 digits
5. Duplicate phone numbers allowed
6. Phone numbers are PII - privacy rules apply

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Low adoption (<50%) | High | Clear value proposition, prominent placement |
| Registration abandonment | High | Make optional, A/B test, monitor metrics |
| Privacy compliance | Critical | Legal review, update privacy policy |
| Invalid data stored | Medium | Robust validation, data cleanup job |

---

## Implementation Plan

**Timeline:** 6-8 weeks

1. **Week 1-2**: Database migration, backend API updates
2. **Week 3**: Frontend form implementation
3. **Week 4**: Integration testing, security review
4. **Week 5**: UAT with stakeholders
5. **Week 6**: Production deployment with monitoring

**Rollback Plan:**
- Feature flag to disable field
- Database migration reversal script
- API backward compatibility maintained

---

## Testing Requirements

- **Unit Tests**: Validation logic, API endpoints, database operations
- **Integration Tests**: Complete registration flow with/without phone
- **UAT**: Form usability, mobile responsiveness, accessibility
- **Performance**: API response time, load testing
- **Security**: SQL injection, XSS, data encryption

---

## Acceptance Criteria

✅ Phone field added to registration form  
✅ Validation works (client and server)  
✅ Phone numbers stored securely  
✅ Displays in customer profile and agent view  
✅ Registration works with/without phone  
✅ Tests pass (>80% coverage)  
✅ Performance requirements met  
✅ Security review approved  
✅ Privacy policy updated  
✅ UAT completed  
✅ Documentation complete  
✅ Rollback plan tested  

---

## Technical References

- **Jira**: AUT-1
- **Frontend**: `/frontend/src/components/customer/RegistrationModal.tsx`
- **Backend**: `/python_backend/app/main.py`
- **Models**: `/python_backend/app/models.py`
- **Database**: SQLite (`galaxium_travels.db`)

---

## Approval

| Role | Name | Date |
|------|------|------|
| Product Owner | TBD | |
| Business Analyst | Aditya Krishnan | May 20, 2026 |
| Tech Lead | TBD | |
| QA Lead | TBD | |

**Status:** Draft - Pending Approval