# Cohort Management & Enrollment Workflow Guide

## Overview

The WTI system now has a complete cohort management workflow with candidate applications and admin approval process.

---

## 1. Viewing Cohorts in Admin Dashboard

### ✅ **Dashboard Now Shows:**

**Cohort Statistics:**
- Total Cohorts: 6
- Active Cohorts: 3 (ENROLLMENT_OPEN or IN_TRAINING)
- Pending Enrollments: 2 (waiting for approval)

**Recent Cohorts Section:**
- Latest 5 cohorts created
- Shows course name, trainer, enrollment count
- Quick access to cohort details

**Pending Enrollments Section:**
- Candidates who applied to cohorts
- Status: APPLIED (awaiting approval)
- Shows candidate name, email, cohort, course
- Action buttons: Approve / Reject

### How to Access:
1. Login as admin at http://localhost:5173
2. Dashboard shows all statistics automatically
3. See "Recent Cohorts" and "Pending Enrollments" sections

---

## 2. Candidate Application Process

### How Candidates Apply for a Cohort:

#### Option A: Admin Enrolls Candidate
**Current Implementation ✅**

1. **Admin navigates to Cohorts page**
2. **Clicks on a cohort** (e.g., "Test Cohort December 2025")
3. **Clicks "Enroll Student" button**
4. **Selects candidate** from dropdown
5. **Chooses status:**
   - `APPLIED` - Needs approval (default)
   - `APPROVED` - Pre-approved
   - `ENROLLED` - Directly enrolled
6. **Submits enrollment**

**API Endpoint:**
```
POST /api/cohorts/:id/enroll
Body: {
  "candidateId": 1,
  "status": "APPLIED"  // or APPROVED, ENROLLED
}
```

#### Option B: Candidate Self-Application
**To Be Implemented** (Frontend needs candidate portal)

1. Candidate logs in
2. Views available cohorts (ENROLLMENT_OPEN status)
3. Clicks "Apply" button
4. Application created with status: APPLIED
5. Admin receives notification

---

## 3. Admin Approval/Rejection Workflow

### ✅ **Already Implemented in Backend**

### Approval Process:

#### Step 1: View Pending Applications
- **Dashboard:** Shows count of pending enrollments (currently 2)
- **Pending Enrollments List:** Shows all APPLIED status

#### Step 2: Review Application
Admin sees:
- Candidate name: "alvin kitoto"
- Candidate email: alvin@gmail.com
- Cohort: "Test Cohort December 2025"
- Course: "Home Care"
- Application date
- Current status: APPLIED

#### Step 3: Take Action

**Approve Application:**
```
PUT /api/cohorts/4/enrollments/1
Body: {
  "status": "APPROVED",
  "reviewNotes": "Candidate meets all requirements"
}
```

**Enroll Directly (Approve + Enroll):**
```
PUT /api/cohorts/4/enrollments/1
Body: {
  "status": "ENROLLED",
  "reviewNotes": "Approved and enrolled"
}
```

**Reject Application:**
```
PUT /api/cohorts/4/enrollments/1
Body: {
  "status": "REJECTED",
  "reviewNotes": "Does not meet prerequisites"
}
```

**Add to Waitlist:**
```
PUT /api/cohorts/4/enrollments/1
Body: {
  "status": "WAITLISTED",
  "reviewNotes": "Cohort is full, added to waitlist"
}
```

### What Happens After Approval:

1. **Enrollment Status Changes:**
   - APPLIED → APPROVED → ENROLLED

2. **System Updates:**
   - `approvalDate` set to current datetime
   - `reviewedBy` set to admin user ID
   - Cohort enrollment count updated
   - Candidate notified (if email configured)

3. **Cohort Capacity Check:**
   - System prevents enrollment if cohort is full
   - Auto-waitlist if capacity reached

---

## 4. Enrollment Status Flow

```
APPLIED
   ↓
APPROVED (admin approved)
   ↓
ENROLLED (actively participating)
   ↓
COMPLETED (finished training)

Alternative paths:
APPLIED → REJECTED (not qualified)
APPLIED → WAITLISTED (no space)
ENROLLED → WITHDRAWN (candidate left)
```

---

## 5. Testing the Workflow

### Test Scenario 1: View Dashboard
```bash
# 1. Get admin token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@labourmobility.com","password":"admin123"}' \
  | jq -r '.data.accessToken')

# 2. Get dashboard data
curl -s "http://localhost:5000/api/admin/dashboard" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data.stats'
```

**Expected Result:**
```json
{
  "totalCohorts": 6,
  "activeCohorts": 3,
  "pendingCohortEnrollments": 2
}
```

### Test Scenario 2: View Pending Enrollments
```bash
curl -s "http://localhost:5000/api/admin/dashboard" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data.pendingEnrollments'
```

**Expected Result:** List of candidates with status: APPLIED

### Test Scenario 3: Approve an Enrollment
```bash
# Approve enrollment ID 1 for cohort ID 4
curl -X PUT "http://localhost:5000/api/cohorts/4/enrollments/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "APPROVED",
    "reviewNotes": "Candidate approved for enrollment"
  }'
```

### Test Scenario 4: Enroll Candidate Directly
```bash
curl -X PUT "http://localhost:5000/api/cohorts/4/enrollments/2" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ENROLLED",
    "reviewNotes": "Candidate enrolled directly"
  }'
```

### Test Scenario 5: Reject an Application
```bash
curl -X PUT "http://localhost:5000/api/cohorts/4/enrollments/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "REJECTED",
    "reviewNotes": "Does not meet course prerequisites"
  }'
```

---

## 6. Current System Status

### ✅ **Backend Implementation:**
- Dashboard shows cohort statistics ✅
- Dashboard shows pending enrollments ✅
- Admin can enroll candidates ✅
- Admin can approve/reject applications ✅
- Status transitions working ✅
- Review notes supported ✅
- Approval tracking (who/when) ✅

### 🔲 **Frontend Implementation Needed:**
- Display cohort stats on dashboard UI
- Show "Recent Cohorts" widget
- Show "Pending Enrollments" widget with action buttons
- Add approve/reject buttons
- Add review notes dialog
- Candidate portal for self-application
- Email notifications

---

## 7. Database Schema

### CohortEnrollment Table Fields:
```
- id (primary key)
- cohortId (references Cohort)
- candidateId (references Candidate)
- status (enum: APPLIED, APPROVED, REJECTED, WAITLISTED, ENROLLED, WITHDRAWN, COMPLETED)
- applicationDate (datetime, auto-set)
- approvalDate (datetime, set on approval)
- reviewedBy (admin user ID)
- reviewNotes (text, admin's notes)
- withdrawalReason (text, if withdrawn)
- withdrawalDate (datetime, if withdrawn)
- attendanceCount, attendanceRate (tracking)
- assessmentsPassed, assessmentsFailed (tracking)
- vettingStatus (PENDING, APPROVED, REJECTED)
- certificationIssued (boolean)
- placementReady (boolean)
```

---

## 8. API Endpoints Summary

### Dashboard:
- `GET /api/admin/dashboard` - Get all stats including cohorts and pending enrollments

### Cohort Management:
- `GET /api/cohorts` - List all cohorts
- `GET /api/cohorts/:id` - Get cohort details with enrollments
- `POST /api/cohorts` - Create new cohort
- `PUT /api/cohorts/:id` - Update cohort
- `POST /api/cohorts/:id/publish` - Publish cohort
- `POST /api/cohorts/:id/enrollment/open` - Open enrollment
- `POST /api/cohorts/:id/enrollment/close` - Close enrollment

### Enrollment Management:
- `POST /api/cohorts/:id/enroll` - Enroll candidate (admin action)
- `PUT /api/cohorts/:id/enrollments/:enrollmentId` - Approve/reject/update status
- `GET /api/cohorts/:id/enrollments` - Get cohort enrollments (via cohort details)

---

## 9. Quick Implementation Guide

### To Add Pending Enrollments Widget to Dashboard:

1. **Fetch data** (already available):
```javascript
const { data } = await adminService.getDashboard();
const pendingEnrollments = data.pendingEnrollments;
```

2. **Display in UI**:
```jsx
<Card>
  <CardHeader title="Pending Enrollments" />
  <List>
    {pendingEnrollments.map(enrollment => (
      <ListItem key={enrollment.id}>
        <ListItemText
          primary={enrollment.candidate.fullName}
          secondary={`${enrollment.cohort.cohortName} - ${enrollment.cohort.course.title}`}
        />
        <ListItemSecondaryAction>
          <IconButton onClick={() => handleApprove(enrollment.id)}>
            <CheckIcon />
          </IconButton>
          <IconButton onClick={() => handleReject(enrollment.id)}>
            <CloseIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ))}
  </List>
</Card>
```

3. **Approve/Reject actions**:
```javascript
const handleApprove = async (enrollmentId) => {
  await axios.put(`/api/cohorts/${cohortId}/enrollments/${enrollmentId}`, {
    status: 'APPROVED',
    reviewNotes: 'Approved from dashboard'
  });
  refreshDashboard();
};
```

---

## 10. Benefits of This Workflow

✅ **For Admins:**
- Clear visibility of all cohorts
- See pending applications at a glance
- Quick approve/reject actions
- Track who approved what and when
- Control cohort capacity

✅ **For Candidates:**
- Apply for cohorts easily (when frontend added)
- Know application status
- Clear enrollment progression
- Waitlist option if cohort full

✅ **For System:**
- Proper audit trail
- Capacity management
- Status tracking
- Data integrity
- Professional workflow

---

## 11. Next Steps

### Immediate (Backend ✅):
- Dashboard includes cohort stats ✅
- Pending enrollments listed ✅
- Approval/rejection API working ✅

### Frontend Updates Needed:
1. Add cohort statistics cards to dashboard
2. Add "Recent Cohorts" section
3. Add "Pending Enrollments" section with action buttons
4. Add approval/rejection dialog with notes
5. Build candidate application portal
6. Add notifications for status changes

### Optional Enhancements:
- Email notifications on approval/rejection
- Bulk approval feature
- Auto-enrollment based on criteria
- Waitlist auto-promotion when space available
- Application deadlines enforcement
- Document requirements check before approval

---

**System Status:** ✅ **Backend Complete - Frontend Integration Pending**

The backend workflow is fully functional and ready for frontend integration!
