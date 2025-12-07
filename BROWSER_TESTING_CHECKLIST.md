# Browser Testing Checklist
## WTI Labour Mobility System - Professional Quality Assurance

**Testing URL:** http://localhost:5173

## Test Credentials

### Admin User
- **Email:** admin@labourmobility.com
- **Password:** admin123
- **Access:** Full system access

### Trainer User
- **Email:** Amon@gmail.com
- **Password:** (Check database or create new password)
- **Access:** Cohorts, Sessions, Attendance, Assessments

### Candidate User  
- **Email:** candidate@labourmobility.com
- **Password:** (Check database or create new password)
- **Access:** Profile, Enrollments, Certificates

---

## 1. Authentication Tests

### Login Page
- [ ] Open http://localhost:5173
- [ ] Verify login form displays correctly
- [ ] Test invalid email format - should show error
- [ ] Test wrong password - should show "Invalid credentials"
- [ ] Test successful admin login
- [ ] Verify redirect to admin dashboard
- [ ] Verify user name/role displayed in header
- [ ] Test logout functionality
- [ ] Verify redirect back to login after logout

### Role-Based Access
- [ ] Login as admin - verify admin menu items visible
- [ ] Login as trainer - verify only trainer menu items visible
- [ ] Login as candidate - verify only candidate menu items visible
- [ ] Test protected routes (try accessing /admin/users as trainer)

---

## 2. Admin Dashboard Tests

### Dashboard Overview
- [ ] Login as admin
- [ ] Verify dashboard loads without errors
- [ ] Check KPI cards display correct numbers:
  - Total Users: 28
  - Total Candidates: 2
  - Total Courses: 12
  - Total Enrollments: 13+
- [ ] Verify recent activities list shows latest actions
- [ ] Check all charts/graphs render properly

---

## 3. Course Management Tests

### Course List Page (/admin/courses)
- [ ] Navigate to Courses page
- [ ] Verify 12 courses are displayed
- [ ] Test search functionality (search for "Customer Service")
- [ ] Test filter by category
- [ ] Test filter by status (ACTIVE/DRAFT/ARCHIVED)
- [ ] Verify pagination works (if applicable)
- [ ] Test "New Course" button opens create form

### Create Course
- [ ] Click "New Course" button
- [ ] Fill in all required fields:
  - Title: "Test Course Browser"
  - Code: "TCB-001"
  - Category: Select category
  - Duration: 30 days
  - Start Date: Future date
  - End Date: Future date
  - Capacity: 25
- [ ] Click Create
- [ ] Verify success message appears
- [ ] Verify redirect to course list
- [ ] Verify new course appears in list

### Edit Course
- [ ] Click edit icon on any course
- [ ] Modify title
- [ ] Click Save
- [ ] Verify success message
- [ ] Verify changes reflected in list

### View Course Details
- [ ] Click view/details icon on any course
- [ ] Verify all course information displayed
- [ ] Verify assigned trainers shown
- [ ] Verify related cohorts shown (if any)

---

## 4. Cohort Management Tests

### Cohort List Page (/admin/cohorts)
- [ ] Navigate to Cohorts page
- [ ] Verify existing cohorts displayed (at least 6)
- [ ] Test search functionality
- [ ] Test filter by status
- [ ] Test filter by course
- [ ] Verify cohort status badges display correctly

### Create Cohort ✅ (Already tested - working)
- [ ] Click "Create Cohort" button
- [ ] Verify form loads
- [ ] Verify Course dropdown populated (12 courses)
- [ ] Verify Lead Trainer dropdown populated (7 trainers)
- [ ] Fill in form:
  - Cohort Code: "COH-BROWSER-001"
  - Cohort Name: "Browser Test Cohort"
  - Select Course: "Home Care"
  - Select Lead Trainer: "Amon kinuthia"
  - Start Date: 2025-12-20
  - End Date: 2026-01-20
  - Enrollment Deadline: 2025-12-18
  - Max Capacity: 30
- [ ] Click Create
- [ ] Verify success message
- [ ] Verify redirect to cohorts list
- [ ] Verify new cohort appears

### Cohort Details & Enrollment
- [ ] Click on "Test Cohort December 2025" (cohort ID 4)
- [ ] Verify cohort details displayed:
  - Cohort info (name, code, dates)
  - Course info
  - Lead trainer info
  - Status badge
- [ ] Verify "Enrollments" section shows 2 candidates:
  - alvin kitoto
  - Updated TestName
- [ ] Verify enrollment status for each
- [ ] Test "Enroll Student" button
- [ ] Verify candidate dropdown works
- [ ] (Optional) Enroll new candidate if dropdown has options

### Cohort Status Transitions
- [ ] Select a cohort in DRAFT status
- [ ] Click "Publish" button
- [ ] Verify status changes to PUBLISHED
- [ ] Click "Open Enrollment" button
- [ ] Verify status changes to ENROLLMENT_OPEN
- [ ] (Later) Test "Start Cohort" to IN_PROGRESS

---

## 5. Candidate Management Tests

### Candidate List (/admin/candidates)
- [ ] Navigate to Candidates page
- [ ] Verify 2 candidates displayed
- [ ] Test search by name/email
- [ ] Test filter by status
- [ ] Test filter by vetting status
- [ ] Verify enrollment count shown for each candidate

### Candidate Details
- [ ] Click on "alvin kitoto"
- [ ] Verify candidate information displayed:
  - Personal details
  - Contact info
  - Education
  - Work experience
  - Documents
- [ ] Verify enrollments list (9 enrollments)
- [ ] Verify certificates list (if any)
- [ ] Check vetting status

### Candidate Profile Update
- [ ] Click edit profile button
- [ ] Update phone number or county
- [ ] Click Save
- [ ] Verify success message
- [ ] Verify changes saved

---

## 6. User Management Tests

### User List (/admin/users)
- [ ] Navigate to Users page
- [ ] Verify 28 users displayed
- [ ] Test search by name/email
- [ ] Test filter by role (Admin, Trainer, Candidate, etc.)
- [ ] Test filter by status (Active/Inactive)
- [ ] Verify role badges display correctly

### Create User
- [ ] Click "New User" button
- [ ] Fill in all fields:
  - Email: test.user@example.com
  - First Name: Test
  - Last Name: User
  - Role: Select role
  - Password: Test@123
- [ ] Click Create
- [ ] Verify success message
- [ ] Verify new user appears in list

---

## 7. Certificate Management Tests

### Certificate List (/admin/certificates)
- [ ] Navigate to Certificates page
- [ ] Verify certificates displayed (8 exist)
- [ ] Test filter by status
- [ ] Test filter by course
- [ ] Test filter by candidate
- [ ] Test search by certificate number

### Certificate Details
- [ ] Click on any certificate
- [ ] Verify certificate information:
  - Certificate number
  - Candidate name
  - Course name
  - Issue date
  - Status
  - QR code (if generated)
  - Digital signature (if present)

### Generate Certificate (If workflow exists)
- [ ] Select completed enrollment
- [ ] Click "Generate Certificate"
- [ ] Verify certificate created
- [ ] Verify success message

---

## 8. Session Management Tests

### Create Session (Already tested via API ✅)
- [ ] Go to cohort details (cohort 4)
- [ ] Find "Sessions" tab/section
- [ ] Click "Create Session"
- [ ] Fill in session details:
  - Session Number: 2
  - Title: "Patient Communication Skills"
  - Date: 2025-12-17
  - Start Time: 09:00
  - End Time: 11:00
  - Location: "Room B"
  - Facilitator: Select Amon
- [ ] Click Create
- [ ] Verify session appears in list
- [ ] Verify session 31 (created via API) also appears

### Session Details
- [ ] Click on session 31
- [ ] Verify session information displayed
- [ ] Verify attendance can be marked (if feature exists)

---

## 9. Trainer Dashboard Tests

### Login as Trainer
- [ ] Logout from admin
- [ ] Login as trainer (Amon@gmail.com)
- [ ] Verify trainer dashboard loads

### My Cohorts
- [ ] Verify only assigned cohorts visible
- [ ] Should see "Test Cohort December 2025" (cohort 4)
- [ ] Click on cohort
- [ ] Verify can see enrolled students
- [ ] Verify can see sessions

### Create Session as Trainer
- [ ] Create new session for assigned cohort
- [ ] Verify success

### Mark Attendance (If available)
- [ ] Go to session
- [ ] Click "Mark Attendance"
- [ ] Mark students present/absent
- [ ] Save attendance
- [ ] Verify attendance saved

---

## 10. Candidate Dashboard Tests

### Login as Candidate
- [ ] Logout
- [ ] Login as candidate
- [ ] Verify candidate dashboard loads

### My Profile
- [ ] View profile information
- [ ] Edit profile
- [ ] Upload document (if available)
- [ ] Save changes

### My Enrollments
- [ ] Verify enrolled courses/cohorts visible
- [ ] Click on enrollment
- [ ] Verify enrollment details:
  - Course info
  - Cohort info
  - Attendance record
  - Assessments
  - Progress

### My Certificates
- [ ] Navigate to certificates
- [ ] Verify earned certificates displayed
- [ ] Click on certificate
- [ ] Verify can view/download certificate

---

## 11. End-to-End Integration Test

### Complete Workflow
1. **Admin - Create New Cohort**
   - [ ] Login as admin
   - [ ] Create cohort "E2E Test Cohort"
   - [ ] Publish cohort
   - [ ] Open enrollment

2. **Admin - Enroll Candidates**
   - [ ] Enroll candidate "alvin kitoto"
   - [ ] Enroll candidate "Updated TestName"
   - [ ] Verify enrollments show in cohort

3. **Trainer - Create Session**
   - [ ] Login as trainer
   - [ ] Go to new cohort
   - [ ] Create training session
   - [ ] Verify session created

4. **Trainer - Mark Attendance**
   - [ ] Mark attendance for session
   - [ ] Mark both candidates present
   - [ ] Save attendance
   - [ ] Verify attendance rate updated

5. **Trainer - Create Assessment**
   - [ ] Create assessment for cohort
   - [ ] Grade candidates
   - [ ] Submit grades

6. **Admin - Generate Certificates**
   - [ ] Login as admin
   - [ ] View completed assessments
   - [ ] Generate certificates for passed candidates
   - [ ] Verify certificates created

7. **Candidate - View Certificate**
   - [ ] Login as candidate
   - [ ] Navigate to certificates
   - [ ] Verify new certificate appears
   - [ ] Download/view certificate

---

## 12. UI/UX Quality Checks

### General UI
- [ ] All pages load without console errors
- [ ] Loading spinners show during data fetch
- [ ] Error messages display clearly and are user-friendly
- [ ] Success messages appear after actions
- [ ] Forms validate input before submission
- [ ] Required field indicators visible
- [ ] Buttons have proper hover states
- [ ] Icons render correctly

### Responsive Design
- [ ] Test on full screen (desktop view)
- [ ] Test on medium screen (tablet view - resize browser)
- [ ] Test on small screen (mobile view - resize browser)
- [ ] Verify tables scroll on small screens
- [ ] Verify navigation menu adapts to screen size

### Navigation
- [ ] All menu items clickable
- [ ] Active page highlighted in menu
- [ ] Breadcrumbs work (if present)
- [ ] Back buttons work
- [ ] Page titles match current page

### Data Display
- [ ] Tables paginate properly
- [ ] Search works across all searchable lists
- [ ] Filters apply correctly
- [ ] Sort functionality works (if present)
- [ ] Empty states show helpful messages
- [ ] Date/time formatted correctly
- [ ] Status badges color-coded appropriately

### Forms
- [ ] All form fields editable
- [ ] Dropdowns populate with data
- [ ] Date pickers work
- [ ] File uploads work (if applicable)
- [ ] Cancel buttons clear form/navigate back
- [ ] Submit buttons disabled during submission
- [ ] Validation errors clear after fixing input

---

## 13. Performance & Error Handling

### Error Scenarios
- [ ] Test network error (disconnect internet briefly)
- [ ] Verify error message shows
- [ ] Test invalid form input
- [ ] Verify validation errors
- [ ] Test unauthorized access
- [ ] Verify redirect to login
- [ ] Test session timeout
- [ ] Verify re-login prompt

### Performance
- [ ] Pages load within 2 seconds
- [ ] No excessive API calls (check Network tab)
- [ ] Images load properly
- [ ] No memory leaks (leave app open for 10 minutes)

---

## 14. Final Professional Standards Check

### Professional Quality
- [ ] No broken UI elements
- [ ] No console errors in browser
- [ ] No "TODO" or "Debug" text visible to users
- [ ] All placeholder text replaced with real content
- [ ] Consistent styling across all pages
- [ ] Professional color scheme and typography
- [ ] Clear call-to-action buttons
- [ ] Helpful tooltips/hints where needed
- [ ] Proper loading states everywhere
- [ ] Graceful error handling everywhere

### Data Integrity
- [ ] All relationships work (courses → cohorts → enrollments)
- [ ] Deletion cascades properly (if applicable)
- [ ] Foreign keys enforce integrity
- [ ] No orphaned records
- [ ] Counts/statistics match reality

---

## Issues Found

Track any issues discovered during testing:

| # | Page/Feature | Issue Description | Severity | Status |
|---|-------------|------------------|----------|--------|
| 1 | | | High/Med/Low | Open/Fixed |
| 2 | | | | |

---

## Testing Summary

**Tested By:** _____________
**Date:** _____________
**Total Tests:** _____________
**Passed:** _____________
**Failed:** _____________
**Critical Issues:** _____________

**Ready for Showcase:** ☐ Yes ☐ No

**Notes:**
