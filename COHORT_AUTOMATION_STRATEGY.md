# Cohort-Enrollment Relationship & Automation Strategy

## 📊 Current System Architecture

### Data Models:

1. **Enrollment** (Main Record)
   - Overall course enrollment for a candidate
   - Tracks: enrollmentDate, enrollmentStatus, paymentStatus
   - One-to-Many with CohortEnrollment

2. **Cohort** (Training Batch)
   - Group of students taking course together
   - Has: startDate, endDate, maxCapacity, leadTrainer
   - Tracks progress metrics

3. **CohortEnrollment** (Bridge/Junction)
   - Links candidate to specific cohort
   - Tracks: applicationDate, status, attendance, assessments
   - Progress tracking specific to this cohort

## 🔄 Current Workflow (What We Have)

```
1. Candidate browses courses → Applies to cohort
   └─> Creates CohortEnrollment (status: APPLIED)

2. Admin reviews application → Approves
   └─> Updates CohortEnrollment (status: ENROLLED)
   └─> Auto-creates Enrollment record (✅ Already implemented)

3. Training begins
   └─> Sessions, Attendance, Assessments tracked
   
4. Completion
   └─> Certificate issued
```

## 🚀 Recommended Automation Enhancements

### 1. **Auto-Cohort Assignment**
When candidate applies for course without selecting cohort:
- Find next available cohort (not full, enrollment open)
- Auto-assign to that cohort
- Notify candidate of cohort details

### 2. **Capacity Management**
- Auto-close enrollment when cohort reaches maxCapacity
- Auto-create new cohort when current one fills up
- Waitlist management

### 3. **Status Synchronization**
- CohortEnrollment.status ←→ Enrollment.enrollmentStatus
- Auto-update both when one changes
- Maintain consistency

### 4. **Progress Tracking**
- Auto-update attendance rates
- Auto-calculate assessment scores
- Auto-update vetting status
- Auto-mark placementReady when criteria met

### 5. **Cohort Lifecycle Automation**
- Auto-change status: DRAFT → PUBLISHED → ENROLLMENT_OPEN
- Auto-close enrollment at enrollmentDeadline
- Auto-start training on startDate
- Auto-complete on endDate

### 6. **Certificate Generation**
- Auto-issue certificate when:
  * CohortEnrollment.status = COMPLETED
  * attendanceRate ≥ 80%
  * All assessments passed
  * Vetting cleared

### 7. **Payment Integration**
- Link PaymentStatus to cohort access
- Auto-restrict access if payment overdue
- Send reminders

### 8. **Notifications**
- Auto-notify on status changes
- Cohort start reminders
- Assessment deadlines
- Certificate ready

## 🎯 Implementation Priority

### Phase 1: Core Automation (Implement Now)
✅ Auto-create Enrollment when cohort approved
✅ Link CohortEnrollment to Enrollment
⚠️ **MISSING**: Auto-update cohort currentEnrollment count
⚠️ **MISSING**: Auto-check capacity before enrollment
⚠️ **MISSING**: Status synchronization

### Phase 2: Progress Tracking
- Auto-calculate attendance rates
- Auto-update assessment progress
- Auto-determine completion

### Phase 3: Advanced Features
- Waitlist management
- Auto-cohort creation
- Payment integration
- Certificate automation

## 💡 What Should Be Automated Next?

### Immediate Actions:

1. **Cohort Capacity Tracking**
   - Increment `currentEnrollment` when student enrolls
   - Prevent enrollment if full
   - Auto-close enrollment at capacity

2. **Status Synchronization**
   - When CohortEnrollment → ENROLLED: Update Enrollment → ENROLLED
   - When CohortEnrollment → COMPLETED: Update Enrollment → COMPLETED
   - When CohortEnrollment → WITHDRAWN: Update Enrollment → WITHDRAWN

3. **Cohort Status Management**
   - Auto-open enrollment 30 days before startDate
   - Auto-close at enrollmentDeadline
   - Auto-start training on startDate

4. **Progress Automation**
   - Auto-update attendanceRate from sessions
   - Auto-mark placementReady when criteria met
   - Auto-issue certificate when completed

### Code Locations to Update:

1. `backend/src/controllers/cohortController.js`
   - Add capacity check
   - Update currentEnrollment counter
   - Sync statuses

2. `backend/src/controllers/adminController.js`
   - Enhance enrollment approval
   - Add batch operations

3. Create new: `backend/src/services/cohortAutomationService.js`
   - Centralize all automation logic
   - Scheduled jobs for status updates

4. Create new: `backend/src/jobs/cohortStatusJob.js`
   - Cron job to update cohort statuses
   - Daily check for deadlines
   - Auto-close/start cohorts

## 🔧 Suggested Implementation

Would you like me to implement:
1. ✅ Cohort capacity management (prevent over-enrollment)
2. ✅ Status synchronization (keep Enrollment & CohortEnrollment in sync)
3. ✅ Auto-update cohort metrics (currentEnrollment, attendance rates)
4. ✅ Certificate automation (auto-issue when complete)
5. ✅ Cohort lifecycle automation (auto-open/close/start)

This will make the system fully automated!
