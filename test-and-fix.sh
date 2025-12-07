#!/bin/bash

# Comprehensive Test and Fix Script for WTI Labour Mobility System
# This script tests all major endpoints and identifies issues

echo "================================================"
echo "WTI Labour Mobility System - Comprehensive Test"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get admin token
echo "🔐 Logging in as admin..."
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@labourmobility.com","password":"admin123"}' | jq -r '.data.accessToken')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo -e "${RED}❌ Login failed${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Login successful${NC}"
echo ""

# Test Admin Dashboard
echo "📊 Testing Admin Dashboard..."
DASHBOARD=$(curl -s http://localhost:5000/api/admin/dashboard -H "Authorization: Bearer $TOKEN")
DASHBOARD_SUCCESS=$(echo $DASHBOARD | jq -r '.success')
if [ "$DASHBOARD_SUCCESS" == "true" ]; then
  echo -e "${GREEN}✅ Dashboard API working${NC}"
  echo "   Users: $(echo $DASHBOARD | jq -r '.data.stats.totalUsers')"
  echo "   Candidates: $(echo $DASHBOARD | jq -r '.data.stats.totalCandidates')"
  echo "   Courses: $(echo $DASHBOARD | jq -r '.data.stats.totalCourses')"
  echo "   Enrollments: $(echo $DASHBOARD | jq -r '.data.stats.totalEnrollments')"
else
  echo -e "${RED}❌ Dashboard API failed${NC}"
fi
echo ""

# Test Courses
echo "📚 Testing Course Management..."
COURSES=$(curl -s "http://localhost:5000/api/admin/courses?limit=5" -H "Authorization: Bearer $TOKEN")
COURSES_COUNT=$(echo $COURSES | jq -r '.data.total')
if [ "$COURSES_COUNT" != "null" ] && [ "$COURSES_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✅ Courses API working - $COURSES_COUNT courses found${NC}"
else
  echo -e "${YELLOW}⚠️  No courses found${NC}"
fi
echo ""

# Test Cohorts
echo "👥 Testing Cohort Management..."
COHORTS=$(curl -s "http://localhost:5000/api/cohorts?limit=5" -H "Authorization: Bearer $TOKEN")
COHORTS_COUNT=$(echo $COHORTS | jq -r '.data.total')
if [ "$COHORTS_COUNT" != "null" ]; then
  echo -e "${GREEN}✅ Cohorts API working - $COHORTS_COUNT cohorts found${NC}"
else
  echo -e "${YELLOW}⚠️  Cohorts API issue${NC}"
fi
echo ""

# Test Candidates
echo "🎓 Testing Candidate Management..."
CANDIDATES=$(curl -s "http://localhost:5000/api/admin/candidates?limit=5" -H "Authorization: Bearer $TOKEN")
CANDIDATES_COUNT=$(echo $CANDIDATES | jq -r '.pagination.total')
if [ "$CANDIDATES_COUNT" != "null" ] && [ "$CANDIDATES_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✅ Candidates API working - $CANDIDATES_COUNT candidates found${NC}"
else
  echo -e "${YELLOW}⚠️  No candidates found${NC}"
fi
echo ""

# Test Users/Trainers
echo "👨‍🏫 Testing Trainer Management..."
TRAINERS=$(curl -s "http://localhost:5000/api/admin/users?role=Trainer&limit=5" -H "Authorization: Bearer $TOKEN")
TRAINERS_COUNT=$(echo $TRAINERS | jq -r '.data.total')
if [ "$TRAINERS_COUNT" != "null" ] && [ "$TRAINERS_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✅ Trainers API working - $TRAINERS_COUNT trainers found${NC}"
else
  echo -e "${YELLOW}⚠️  No trainers found${NC}"
fi
echo ""

# Test Certificates
echo "📜 Testing Certificate Management..."
CERTIFICATES=$(curl -s "http://localhost:5000/api/admin/certificates?limit=5" -H "Authorization: Bearer $TOKEN")
CERT_SUCCESS=$(echo $CERTIFICATES | jq -r '.success')
if [ "$CERT_SUCCESS" == "true" ]; then
  CERT_COUNT=$(echo $CERTIFICATES | jq -r '.data.total // .pagination.total // 0')
  echo -e "${GREEN}✅ Certificates API working - $CERT_COUNT certificates${NC}"
else
  echo -e "${YELLOW}⚠️  Certificates API issue${NC}"
fi
echo ""

# Test Vetting
echo "🔍 Testing Vetting Dashboard..."
VETTING=$(curl -s "http://localhost:5000/api/admin/vetting/dashboard" -H "Authorization: Bearer $TOKEN")
VETTING_SUCCESS=$(echo $VETTING | jq -r '.success')
if [ "$VETTING_SUCCESS" == "true" ]; then
  echo -e "${GREEN}✅ Vetting API working${NC}"
else
  echo -e "${YELLOW}⚠️  Vetting API issue${NC}"
fi
echo ""

# Test Trainer Dashboard
echo "👨‍🏫 Testing Trainer Dashboard..."
TRAINER_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"trainer@labourmobility.com","password":"trainer123"}' | jq -r '.data.accessToken')

if [ -n "$TRAINER_TOKEN" ] && [ "$TRAINER_TOKEN" != "null" ]; then
  TRAINER_DASH=$(curl -s http://localhost:5000/api/trainer/dashboard -H "Authorization: Bearer $TRAINER_TOKEN")
  TRAINER_SUCCESS=$(echo $TRAINER_DASH | jq -r '.success')
  if [ "$TRAINER_SUCCESS" == "true" ]; then
    echo -e "${GREEN}✅ Trainer dashboard working${NC}"
  else
    echo -e "${YELLOW}⚠️  Trainer dashboard issue${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Trainer login failed - check if trainer exists${NC}"
fi
echo ""

# Test Candidate Dashboard
echo "🎓 Testing Candidate Dashboard..."
CANDIDATE_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"candidate@labourmobility.com","password":"candidate123"}' | jq -r '.data.accessToken')

if [ -n "$CANDIDATE_TOKEN" ] && [ "$CANDIDATE_TOKEN" != "null" ]; then
  CANDIDATE_DASH=$(curl -s http://localhost:5000/api/candidate/dashboard -H "Authorization: Bearer $CANDIDATE_TOKEN")
  CANDIDATE_SUCCESS=$(echo $CANDIDATE_DASH | jq -r '.success')
  if [ "$CANDIDATE_SUCCESS" == "true" ]; then
    echo -e "${GREEN}✅ Candidate dashboard working${NC}"
  else
    echo -e "${YELLOW}⚠️  Candidate dashboard issue${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Candidate login failed - check if candidate exists${NC}"
fi
echo ""

echo "================================================"
echo "Test Summary Complete"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Review any ⚠️  warnings above"
echo "2. Check frontend pages match API responses"
echo "3. Test user flows in browser"
echo ""
