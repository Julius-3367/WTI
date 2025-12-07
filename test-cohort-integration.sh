#!/bin/bash

echo "=== Testing Cohort Integration ==="
echo ""

# Login as admin
echo "1. Admin Login..."
ADMIN_LOGIN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@labourmobility.com", "password": "admin123"}')

ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | jq -r '.data.accessToken')
echo "   Token: ${ADMIN_TOKEN:0:20}..."

# Get admin dashboard
echo ""
echo "2. Admin Dashboard - Cohort Stats..."
ADMIN_DASH=$(curl -s http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer $ADMIN_TOKEN")

echo "$ADMIN_DASH" | jq '{
  totalCohorts: .data.stats.totalCohorts,
  activeCohorts: .data.stats.activeCohorts,
  pendingEnrollments: .data.stats.pendingCohortEnrollments,
  recentCohortsCount: (.data.recentCohorts | length),
  pendingApplications: (.data.pendingEnrollments | length)
}'

# Login as candidate  
echo ""
echo "3. Candidate Login..."
CAND_LOGIN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "candidate@labourmobility.com", "password": "candidate123"}')

CAND_TOKEN=$(echo "$CAND_LOGIN" | jq -r '.data.accessToken')

if [ "$CAND_TOKEN" = "null" ]; then
    echo "   No candidate user found. Creating one..."
    # This would need admin to create candidate user
    echo "   Skipping candidate tests"
else
    echo "   Token: ${CAND_TOKEN:0:20}..."
    
    # Get candidate dashboard
    echo ""
    echo "4. Candidate Dashboard - Cohort Data..."
    CAND_DASH=$(curl -s http://localhost:5000/api/candidate/dashboard \
      -H "Authorization: Bearer $CAND_TOKEN")
    
    echo "$CAND_DASH" | jq '{
      stats: .data.stats,
      myCohortsCount: (.data.myCohorts | length),
      availableCohortsCount: (.data.availableCohorts | length)
    }'
    
    # Get available cohorts
    echo ""
    echo "5. Available Cohorts for Candidate..."
    AVAIL=$(curl -s http://localhost:5000/api/candidate/cohorts/available \
      -H "Authorization: Bearer $CAND_TOKEN")
    
    echo "$AVAIL" | jq -r '.data[] | "   - \(.cohortName) (\(.cohortCode)) - \(.course.title)"' | head -5
fi

# Login as trainer
echo ""
echo "6. Trainer Login..."
TRAINER_LOGIN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "trainer@labourmobility.com", "password": "trainer123"}')

TRAINER_TOKEN=$(echo "$TRAINER_LOGIN" | jq -r '.data.accessToken')

if [ "$TRAINER_TOKEN" = "null" ]; then
    echo "   No trainer user found. Trying alternative..."
    TRAINER_LOGIN=$(curl -s -X POST http://localhost:5000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email": "Amon@gmail.com", "password": "trainer123"}')
    
    TRAINER_TOKEN=$(echo "$TRAINER_LOGIN" | jq -r '.data.accessToken')
fi

if [ "$TRAINER_TOKEN" != "null" ] && [ -n "$TRAINER_TOKEN" ]; then
    echo "   Token: ${TRAINER_TOKEN:0:20}..."
    
    # Get trainer dashboard
    echo ""
    echo "7. Trainer Dashboard - Cohort Data..."
    TRAINER_DASH=$(curl -s http://localhost:5000/api/trainer/dashboard \
      -H "Authorization: Bearer $TRAINER_TOKEN")
    
    echo "$TRAINER_DASH" | jq '{
      totalCohorts: .data.stats.totalCohorts,
      activeCohorts: .data.stats.activeCohorts,
      totalStudents: .data.stats.totalCohortStudents,
      cohortsCount: (.data.cohorts | length)
    }'
    
    echo ""
    echo "   Trainer's Cohorts:"
    echo "$TRAINER_DASH" | jq -r '.data.cohorts[]? | "   - \(.cohortName) - \(.status) - Students: \(.studentsCount)"' | head -5
else
    echo "   Could not login as trainer. Skipping trainer tests."
fi

echo ""
echo "=== Test Complete ==="
