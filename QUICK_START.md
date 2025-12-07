# 🚀 Quick Start Guide - WTI Labour Mobility System

## Instant System Verification (30 seconds)

```bash
cd /home/julius/WTI
./comprehensive-api-test.sh
```

✅ **Expected Result:** `ALL TESTS PASSED! System is ready for showcase.`

---

## System Access

### 🌐 URLs
- **Application:** http://localhost:5173
- **API:** http://localhost:5000
- **API Docs:** http://localhost:5000/api-docs

### 🔐 Login Credentials
```
Email: admin@labourmobility.com
Password: admin123
```

---

## Server Management

### Check if servers are running:
```bash
# Backend
ps aux | grep "node server.js" | grep -v grep

# Frontend  
ps aux | grep "vite" | grep -v grep
```

### Start Backend (if needed):
```bash
cd /home/julius/WTI/backend
nohup node server.js > backend.log 2>&1 &
```

### Start Frontend (if needed):
```bash
cd /home/julius/WTI/frontend
npm run dev
```

### Stop Servers:
```bash
# Backend
pkill -f "node.*server.js"

# Frontend
pkill -f "vite"
```

---

## Pre-Showcase Checklist (2 minutes)

1. **Verify Backend:**
   ```bash
   curl http://localhost:5000/health
   ```
   ✅ Should return: `{"success":true,"message":"Labour Mobility API is running"}`

2. **Run Automated Tests:**
   ```bash
   ./comprehensive-api-test.sh
   ```
   ✅ Should show: `15/15 tests passing`

3. **Test Frontend Login:**
   - Open http://localhost:5173
   - Login with admin@labourmobility.com / admin123
   - Dashboard should load with statistics

4. **Verify Key Data:**
   - Users: 28
   - Candidates: 2
   - Courses: 12
   - Cohorts: 6
   - Enrollments: 13
   - Certificates: 8

---

## Quick Demo Flow (5 minutes)

1. **Login** → http://localhost:5173
2. **Dashboard** → Show KPIs (28 users, 2 candidates, 12 courses)
3. **Courses** → View 12 courses, click one for details
4. **Cohorts** → Show 6 cohorts, open "Test Cohort December 2025"
5. **Enrollments** → Show 2 students enrolled in cohort
6. **Certificates** → Display 8 issued certificates
7. **Reports** → Show vetting dashboard and reports

---

## Troubleshooting

### Backend not responding?
```bash
cd /home/julius/WTI/backend
tail -f backend.log  # Check for errors
```

### Frontend not loading?
```bash
cd /home/julius/WTI/frontend
npm run dev  # Check terminal output
```

### Database issues?
```bash
cd /home/julius/WTI/backend
npx prisma studio  # Open database GUI
```

### Test failures?
```bash
# Re-run tests with verbose output
./comprehensive-api-test.sh 2>&1 | tee test-output.log
```

---

## Key Features to Highlight

✅ **Multi-Role System** - Admin, Trainer, Candidate, Recruiter, Broker, Agent  
✅ **Course Management** - 12 courses with full CRUD  
✅ **Cohort System** - Group training with enrollment tracking  
✅ **Certificate Issuance** - Digital certificates with QR codes  
✅ **Automated Testing** - 15/15 API tests passing  
✅ **Professional UI** - Material-UI components, responsive design  
✅ **RESTful API** - Well-documented, consistent responses  
✅ **Database Integrity** - Proper relationships and constraints  

---

## Documentation References

- **API Testing:** `comprehensive-api-test.sh` (15 automated tests)
- **Manual Testing:** `BROWSER_TESTING_CHECKLIST.md` (200+ test cases)
- **System Status:** `SYSTEM_READINESS_REPORT.md` (complete overview)

---

## Emergency Commands

```bash
# Restart everything
cd /home/julius/WTI
pkill -f "node.*server.js"
cd backend && nohup node server.js > backend.log 2>&1 &
cd ../frontend && npm run dev

# Quick health check
curl http://localhost:5000/health && echo " Backend OK"
curl http://localhost:5173 && echo " Frontend OK"

# Run all tests
./comprehensive-api-test.sh
```

---

## Success Indicators

✅ Backend: `curl http://localhost:5000/health` returns success  
✅ Frontend: http://localhost:5173 loads login page  
✅ Login: admin@labourmobility.com works  
✅ Dashboard: Shows 28 users, 2 candidates, 12 courses  
✅ Tests: `./comprehensive-api-test.sh` shows 15/15 passing  

---

**System Status:** ✅ READY FOR SHOWCASE  
**Last Verified:** December 6, 2025  
**Confidence Level:** HIGH 🎯
